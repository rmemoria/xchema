var assert = require('assert');
var validator = require('../src');

const schema1 = {
    properties: {
        value: {
            type: 'bool'
        }
    }
};

describe('Boolean validator', function() {

    it('Valid type', function() {
        return validator.validate({ value: false }, schema1)
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, false);

                return validator.validate({ value: true }, schema1);
            })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, true);
            });
    });

    it('Invalid type', function() {
        validator.validate({ value: 'x' }, schema1)
            .catch(errors => {
                assert(errors);
                assert.equal(errors.length, 1);
            });
    });

    it('Boolean as other type', function() {
        const trueValues = ['true', 'True', 'TRUE', '1', 1];
        const falseValues = ['false', 'False', 'FALSE', '0', 0];

        let promises = trueValues.map(it => validator.validate({ value: it }, schema1)
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, true);
            }));

        promises = promises.concat(falseValues.map(it => validator.validate({ value: it }, schema1)
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, false);
            })));

        return Promise.all(promises);
    });
});
