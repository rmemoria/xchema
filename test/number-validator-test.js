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
        schema1.validate({ value: 'x' })
            .catch(errors => {
                assert(errors);
                assert.equal(errors.length, 1);
                const err = errors[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'INVALID_VALUE');
            });
    });

    it('Number as string', function() {
        schema1.validate({ value: '-10' })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, -10);
            });
    });

    it('Max value', function(done) {
        schema1.validate({ value: 100 })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, 100);
                return schema1.validate({ value: 101 });
            })
            .catch(errors => {
                assert(errors);
                assert.equal(errors.length, 1);
                const err = errors[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'MAX_VALUE');
                done();
            });
    });

    it('Min value', function(done) {
        schema1.validate({ value: -20 })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, -20);
                return schema1.validate({ value: -21 });
            })
            .catch(errors => {
                assert(errors);
                assert.equal(errors.length, 1);
                const err = errors[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'MIN_VALUE');
                done();
            });
    });
});
