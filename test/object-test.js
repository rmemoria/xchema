const assert = require('assert');
const validator = require('../src');

const schema = {
    properties: {
        name: {
            type: 'object',
            properties: {
                firstName: {
                    type: 'string',
                    required: true
                },
                middleName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string',
                    required: true
                }
            }
        }
    }
};

describe('Object validator', () => {

    it('Valid object', () => {
        return validator.validate({
            name: {
                firstName: 'FIRST',
                middleName: 'MIDDLE',
                lastName: 'LAST'
            }
        }, schema)
            .then(doc => {
                assert(doc);
                assert(doc.name);
                assert.equal(Object.keys(doc.name).length, 3);
                assert.equal(doc.name.firstName, 'FIRST');
                assert.equal(doc.name.middleName, 'MIDDLE');
                assert.equal(doc.name.lastName, 'LAST');
            });
    });

    it('Required fields missing', () => {
        return validator.validate({
            name: {
                firstName: 'FIRST', middleName: 'MIDDLE'
            }
        }, schema)
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'name.lastName');
                assert.equal(err.code, 'VALUE_REQUIRED');
            });
    });

    it('Nested object', () => {
        const schema = {
            properties: {
                prop1: {
                    type: 'object',
                    properties: {
                        prop2: {
                            type: 'object',
                            required: true,
                            properties: {
                                prop3: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        };

        return validator.validate({ prop1: { prop2: { prop3: 123 }}}, schema)
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'prop1.prop2.prop3');
                assert.equal(err.code, 'INVALID_TYPE');

                return validator.validate({ prop1: { }}, schema);
            })
            .then(() => {
                assert.fail('Should not be called');
            })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'prop1.prop2');
                assert.equal(err.code, 'VALUE_REQUIRED');
            });
    });

    it('Invalid type', () => {
        const schema = {
            properties: {
                address: {
                    type: 'object',
                    properties: {
                        'street': {
                            type: 'string',
                            required: true
                        }
                    }
                }
            }
        };

        return validator.validate({ address: 0 }, schema)
            .catch(errs => {
                assert(errs);
                assert(errs.length, 1);
                const err = errs[0];
                assert(err.property, 'address');
                assert(err.code, 'INVALID_TYPE');

                return validator.validate({ address: { }}, schema);
            })
            .catch(errs => {
                assert(errs);
                assert(errs.length, 1);
                const err = errs[0];
                assert(err.property, 'address.street');
                assert(err.code, 'VALUE_REQUIRED');
            });
    });
});