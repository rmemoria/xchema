const assert = require('assert');
const Schema = require('../src'),
    Types = Schema.types;

const schema = Schema.create({
    name: Types.object({
        firstName: Types.string().notNull(),
        middleName: Types.string(),
        lastName: Types.string().notNull()
    })
});

describe('Object validator', () => {

    it('Valid object', () => {
        return schema.validate({
            name: {
                firstName: 'FIRST',
                middleName: 'MIDDLE',
                lastName: 'LAST'
            }
        })
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
        return schema.validate({
            name: {
                firstName: 'FIRST', middleName: 'MIDDLE'
            }
        })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'name.lastName');
                assert.equal(err.code, 'NOT_NULL');
            });
    });

    it('Nested object', () => {
        const schema = Schema.create({
            prop1: Types.object({
                prop2: Types.object({
                    prop3: Types.string()
                }).notNull()
            })
        });

        return schema.validate({ prop1: { prop2: { prop3: 123 }}})
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'prop1.prop2.prop3');
                assert.equal(err.code, 'INVALID_VALUE');

                return schema.validate({ prop1: { }});
            })
            .then(() => {
                assert.fail('Should not be called');
            })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'prop1.prop2');
                assert.equal(err.code, 'NOT_NULL');
            });
    });

    it('Invalid type', () => {
        const schema = Schema.create({
            address: Types.object({
                street: Types.string().notNull()
            })
        });

        return schema.validate({ address: 0 })
            .catch(errs => {
                assert(errs);
                assert(errs.length, 1);
                const err = errs[0];
                assert(err.property, 'address');
                assert(err.code, 'INVALID_VALUE');

                return schema.validate({ address: { }});
            })
            .catch(errs => {
                assert(errs);
                assert(errs.length, 1);
                const err = errs[0];
                assert(err.property, 'address.street');
                assert(err.code, 'NOT_NULL');
            });
    });
});
