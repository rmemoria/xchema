const assert = require('assert');
const Schema = require('../src');
const Types = Schema.types;

describe('Custom converters', () => {

    it('Simple converter', () => {

        const schema = Schema.create({
            name: Types.string().convertAfter(s => 'Hello ' + s)
        });

        return schema.validate({ name: 'world' }, schema)
            .then(doc => {
                assert(doc);
                assert(doc.name);
                assert.equal(doc.name, 'Hello world');
            });
    });

    it('Multiple converters', () => {
        const schema = Schema.create({
            name: {
                type: 'string',
                convertersAfter: [
                    s => '[' + s + ']',
                    s => 'Hello ' + s,
                    s => s + ', I am from Mars' 
                ]
            }
        });

        return schema.validate({ name: 'Gabriel' }, schema)
            .then(doc => {
                assert(doc);
                assert.equal(doc.name, 'Hello [Gabriel], I am from Mars');
            });
    });

    it('Skip converter on validation error', () => {
        let convCalled = false;
    
        const schema = Schema.create({
            name: {
                type: 'string',
                converter: s => {
                    convCalled = true;
                    return '[' + s + ']';
                },
                // validator always fail
                validator: () => 'Erro'
            }
        });

        schema.validate({ name: 'Test' }, schema)
            .catch(errs => {
                assert(errs);
                assert(errs.length, 1);
                assert(!convCalled);
            });
    });

    it('Global converter', async () => {
        Schema.registerConverter('multi_10', v => v < 10 ? v : v * 10);

        const schema = Schema.create({
            value: Types.number().convertAfter('multi_10')
        });

        let doc = await schema.validate({ value: 5 });
        assert(doc.value);
        assert.equal(doc.value, 5);

        doc = await schema.validate({ value: 10 });
        assert(doc.value);
        assert.equal(doc.value, 100);
    });

    it('Invalid value in global converter', () => {
        Schema.registerConverter('raiseInvalid', 
            (v, context) => v < 10 ? v : Promise.reject(context.error.invalidValue));
        
        const schema = Schema.create({
            value: Types.number().convertAfter('raiseInvalid')
        });

        // test invalid value
        return schema.validate({ value: 10 })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.code, 'INVALID_VALUE');

                return schema.validate({ value: 5 });
            })
            .then(doc => {
                assert(doc);
                assert(doc.value);
                assert.equal(doc.value, 5);
            });
    });

    it('Convert before validation', () => {
        const session = Schema.cloneSession();
        session.registerConverter('strToNum', val => Number(val));

        const sc = session.create({
            age: Types.number().convertBefore('strToNum')
        });

        return sc.validate({ age: '10' })
            .then(doc => {
                assert(doc.age);
                assert.equal(doc.age, 10);
            });
    });

    it('Convert before and after', () => {
        const session = Schema.cloneSession();

        session.registerConverter('StrToNum', val => Number(val))
            .registerConverter('AddStr', val => '[' + val + ']');

        const sc = session.create({
            val: Types.number()
                .convertBefore('StrToNum')
                .convertAfter('AddStr')
        });

        return sc.validate({ val: '123' })
            .then(doc => {
                assert(doc);
                assert.equal(doc.val, '[123]');
            });
    });

    // test a converter that transform an id to an object entity
    // with validation of invalid ids
    it('Convert from ID to entity', async () => {
        const entities = {
            '1': { id: 1, name: 'Amazon' },
            '2': { id: 2, name: 'Nile' },
            '3': { id: 3, name: 'Colorado' }
        };

        const session = Schema.cloneSession();

        // converter from ID to an entity
        session.registerConverter('idToEntity', (val, context) => {
            const id = val.toString();
            const ent = entities[id];
            if (!ent) {
                return Promise.reject(context.error.as('Invalid entity', 'INVALID_ENTITY'));
            }

            return ent;
        });

        const sc = session.create({
            entity: Types.number().convertAfter('idToEntity')
        });

        try {
            let doc = await sc.validate({ entity: '1' });
            assert(doc);
            assert(doc.entity);
            assert.equal(doc.entity.id, 1);
            assert.equal(doc.entity.name, 'Amazon');
    
            doc = await sc.validate({ entity: 2 });
            assert(doc);
            assert(doc.entity);
            assert.equal(doc.entity.id, 2);
            assert.equal(doc.entity.name, 'Nile');
    
            await sc.validate({ entity: 5 });
        } catch (errs) {
            assert(errs);
            assert.equal(errs.constructor.name, 'ValidationErrors');
            assert.equal(errs.errors.length, 1);
            const err = errs.errors[0];
            assert(err);
            assert.equal(err.property, 'entity');
            assert.equal(err.code, 'INVALID_ENTITY');
        }
    });
});
