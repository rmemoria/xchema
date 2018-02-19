var assert = require('assert');
var validator = require('../src');

describe('Custom validators', () => {

    it('Validators called', () => {
        let schemaSingleCalled = false;
        let schemaMultiCalled = false;
        let propSingleCalled = false;
        let propMultiCalled = false;

        const sc = {
            properties: {
                name: {
                    type: 'string',
                    validator: () => {
                        propSingleCalled = true;
                        return null;
                    },
                    validators: [
                        () => {
                            propMultiCalled = true;
                            return null;
                        }
                    ]
                }
            },
            validator: () => {
                schemaSingleCalled = true;
                return null;
            },
            validators: [
                () => {
                    schemaMultiCalled = true;
                    return null;
                }
            ]
        };

        return validator.validate({ name: 'Ricardo' }, sc)
            .then(() => {
                assert(schemaSingleCalled);
                assert(propSingleCalled);
                assert(schemaMultiCalled);
                assert(propMultiCalled);
            });
    });


    it('Failed validation', () => {
        const sc = {
            properties: {
                name: {
                    type: 'string',
                    validator: {
                        isValid: doc => doc.name !== 'vancouver',
                        code: 'INVALID_NAME'
                    }
                }
            }
        };

        // first check a valid value
        return validator.validate({ name: 'rio de janeiro' }, sc)
            .then(() => {
                // now check an invalid value
                return validator.validate({ name: 'vancouver' }, sc);
            })
            .then(() => {
                assert.fail('Validation should have failed');
            })
            .catch(errs => {
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'name');
                assert.equal(err.code, 'INVALID_NAME');
            });
    });

    it('Schema level validation', () => {
        // TO BE DONE
    });
});
