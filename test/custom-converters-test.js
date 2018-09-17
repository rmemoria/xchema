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
});
