const assert = require('assert');
const Schema = require('../src'), Types = Schema.types;

const schema1 = Schema.create({
    value: Types.number()
        .max(100)
        .min(-20)
});

describe('Number validator', function() {

    it('Valid type', function() {
        return schema1.validate({ value: 10 })
            .then(doc => {
                assert(doc);
                assert.equal(10, doc.value);
            });
    });

    it('Invalid type', function() {
        return schema1.validate({ value: 'x' })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'INVALID_VALUE');
            });
    });

    it('Number as string', function() {
        return schema1.validate({ value: '-10' })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, -10);
            });
    });

    it('Max value', function() {
        return schema1.validate({ value: 100 })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, 100);
                return schema1.validate({ value: 101 });
            })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'MAX_VALUE');
            });
    });

    it('Min value', function() {
        return schema1.validate({ value: -20 })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, -20);
                return schema1.validate({ value: -21 });
            })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'MIN_VALUE');
            });
    });
});
