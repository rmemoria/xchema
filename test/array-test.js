const assert = require('assert');
const validator = require('../src');

describe('Array validator', () => {

    it('Array of objects', () => {
        const schema = {
            properties: {
                values: {
                    type: 'array',
                    itemSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        };

        const vals = {
            values: [
                { name: 'Banana' },
                { name: 'Apple' },
                { name: 'Peach' }
            ]
        };

        return validator.validate(vals, schema)
            .then(doc => {
                assert(doc);
                assert(doc.values);
                assert.equal(doc.values.length, 3);
            });
    });

    it('Array of strings', () => {
        const schema = {
            properties: {
                values: {
                    type: 'array',
                    itemSchema: {
                        type: 'string'
                    }
                }
            }
        };

        const doc = {
            values: [
                'Banana',
                'Apple',
                'Peach'
            ]
        };

        return validator.validate(doc, schema)
            .then(res => {
                assert(res);
                assert(res.values);
                assert.equal(res.values.length, 3);
                assert(res.values.indexOf('Banana') >= 0);
                assert(res.values.indexOf('Apple') >= 0);
                assert(res.values.indexOf('Peach') >= 0);
            });
    });

    it('Invalid element', () => {
        const schema = {
            properties: {
                values: {
                    type: 'array',
                    itemSchema: {
                        type: 'number'
                    }
                }
            }
        };

        const vals = {
            values: [10, 20, 'abc', 40]
        };

        return validator.validate(vals, schema)
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'values[2]');
                assert.equal(err.code, 'INVALID_TYPE');
            });
    });

    it('Object as array element', () => {
        const schema = {
            properties: {
                values: {
                    type: 'array',
                    itemSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                required: true
                            }
                        }
                    }
                }
            }
        };

        const doc = {
            values: [
                { name: 'banana' },
                { nane: 'orange' }
            ]
        };

        return validator.validate(doc, schema)
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'values[1].name');
                assert.equal(err.code, 'VALUE_REQUIRED');
            });
    });
});
