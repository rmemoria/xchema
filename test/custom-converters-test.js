var assert = require('assert');
var validator = require('../src');

describe('Custom converters', () => {

    it('Simple converter', () => {

        const schema = {
            properties: {
                name: {
                    type: 'string',
                    converter: s => 'Hello ' + s
                }
            }
        };

        return validator.validate({ name: 'world' }, schema)
            .then(doc => {
                assert(doc);
                assert(doc.name);
                assert.equal(doc.name, 'Hello world');
            });
    });

    it('Multiple converters', () => {
        const schema = {
            properties: {
                name: {
                    type: 'string',
                    converter: s => '[' + s + ']',
                    converters: [
                        s => 'Hello ' + s,
                        s => s + ', I am from Mars' 
                    ]
                }
            }
        };

        return validator.validate({ name: 'Gabriel' }, schema)
            .then(doc => {
                assert(doc);
                assert.equal(doc.name, 'Hello [Gabriel], I am from Mars');
            });
    });

    it('Skip converter on validation error', () => {
        let convCalled = false;
    
        const schema = {
            properties: {
                name: {
                    type: 'string',
                    converter: s => {
                        convCalled = true;
                        return '[' + s + ']';
                    },
                    // validator always fail
                    validator: () => 'Erro'
                }
            }
        };

        validator.validate({ name: 'Test' }, schema)
            .catch(errs => {
                assert(errs);
                assert(errs.length, 1);
                assert(!convCalled);
            });
    });
});
