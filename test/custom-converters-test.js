const assert = require('assert');
const Schema = require('../src');
const Types = Schema.types;

describe('Custom converters', () => {

    it('Simple converter', () => {

        const schema = Schema.create({
            name: Types.string().convertTo(s => 'Hello ' + s)
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
                converter: s => '[' + s + ']',
                converters: [
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

    it('Global converter', () => {
        Schema.registerConverter('multi_10', v => v < 10 ? v : v * 10);

        const schema = Schema.create({
            value: Types.number().convertTo('multi_10')
        });

        schema.validate({ value: 5 })
            .then(doc => {
                assert(doc.value);
                assert.equal(doc.value, 5);

                return schema.validate({ value: 10 });
            })
            .then(doc => {
                assert(doc.value);
                assert.equal(doc.value, 100);
            });
    });

    it('Invalid value in converter', () => {
        Schema.registerConverter('raiseInvalid', 
            (v, context) => v < 10 ? v : Promise.reject(context.error.invalidValue));
        
        const schema = Schema.create({
            value: Types.number().convertTo('raiseInvalid')
        });

        // test invalid value
        schema.validate({ value: 10 })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.code, 'INVALID_VALUE');

                return schema.validate({ value: 5 });
            })
            .then(doc => {
                assert(doc);
                assert(doc.value);
                assert.equal(doc.value, 5);
            });
    });
});
