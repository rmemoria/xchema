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
                        isValid: name => name !== 'vancouver',
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

    it('Custom validator in schema', () => {
        const errmsg = 'Name cannot be vancouver';
        const sc = {
            properties: {
                name: {
                    type: 'string'
                }
            },
            validator: {
                isValid: (val, doc) => doc.name != 'vancouver',
                message: errmsg,
                code: 'INVALID_NAME'
            }
        };

        return validator.validate({ name: 'vancouver' }, sc)
            .catch(errs => {
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, null);
                assert.equal(err.message, errmsg);
                assert.equal(err.code, 'INVALID_NAME');
            });
    });

    it('Skip custom validator in case of invalid property', () => {
        const sc = {
            properties: {
                name: {
                    type: 'string',
                    required: true,
                    validator: name => name != 'vancouver'
                }
            }
        };

        return validator.validate({ name: null }, sc)
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'name');
                assert.equal(err.code, 'VALUE_REQUIRED');
            });
    });

    it('Simple function validator', () => {
        const errmsg = 'Cannot be Vancouver';
        const sc = {
            properties: {
                name: {
                    type: 'string',
                    validator: (v, doc) => doc.name.toLowerCase() != 'vancouver' ?
                        null : errmsg
                }
            }
        };

        return validator.validate({ name: 'Rio' }, sc)
            .then(() => {
                return validator.validate({ name: 'Vancouver' }, sc);
            })
            .catch(errs => {
                assert(errs);
                const err = errs[0];
                assert.equal(err.property, 'name');
                assert.equal(err.message, errmsg);
                assert.equal(err.code, null);
            });
    });

    it('Register/use/unregister validator', () => {
        const errMsg = 'Value must be less than 10';

        validator.validators.register('smallNumber', 
            value => value > 10 ? errMsg : null);
        
        const schema = {
            properties: {
                value: {
                    type: 'number',
                    validator: 'smallNumber'
                }
            }
        };

        return validator.validate({ value: 20 }, schema)
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'value');
                assert.equal(err.message, errMsg);

                // check if get returns the validator
                assert(validator.validators.get('smallNumber'));

                // unregister and test if it was removed
                validator.validators.unregister('smallNumber');
                assert(!validator.validators.get('smallNumber'));

                // test validation of the schema without the validator
                // it must generate an unexpected error
                return validator.validate({ value: 20 }, schema);
            })
            .catch(err => {
                assert(err instanceof Error);
            });
    });

    it('Register complex validator', () => {
        validator.validators.register('smallNumber', {
            isValid: value => value <= 10,
            code: 'NOT_SMALL_NUMBER'
        });

        const schema = {
            properties: {
                value: {
                    type: 'number',
                    validator: 'smallNumber'
                }
            }
        };

        return validator.validate({ value: 20 }, schema)
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'value');
                assert(!err.message);
                assert.equal(err.code, 'NOT_SMALL_NUMBER');

                // just check if error will not be registered in valid values
                return validator.validate({ value: 10 }, schema);
            })
            .then(res => {
                assert(res);
                assert.equal(res.value, 10);
            });
    });
});
