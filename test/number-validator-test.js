var assert = require('assert');
var validator = require('../src');

const schema1 = {
    properties: {
        value: {
            type: 'number',
            max: 100,
            min: -20
        }
    }
};

describe('Number validator', function() {

    it('Valid type', function() {
        return validator.validate({ value: 10 }, schema1)
            .then(doc => {
                assert(doc);
                assert.equal(10, doc.value);
            });
    });

    it('Invalid type', function() {
        validator.validate({ value: 'x' }, schema1)
            .catch(errors => {
                assert(errors);
                assert.equal(errors.length, 1);
            });
    });

    it('Number as string', function() {
        validator.validate({ value: '-10' }, schema1)
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, -10);
            });
    });

    it('Max value', function(done) {
        validator.validate({ value: 100 }, schema1)
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, 100);
                return validator.validate({ value: 101 }, schema1);
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
        validator.validate({ value: -20 }, schema1)
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, -20);
                return validator.validate({ value: -21 }, schema1);
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
