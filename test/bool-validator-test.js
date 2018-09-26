var assert = require('assert');
const Schema = require('../src');
const Types = Schema.types;

const schema1 = Schema.create({
    value: Types.bool()
});

describe('Boolean validator', function() {

    it('Valid type', function() {
        return schema1.validate({ value: false })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, false);

                return schema1.validate({ value: true });
            })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, true);
            });
    });

    it('Invalid type', function() {
        schema1.validate({ value: 'x' })
            .catch(errors => {
                assert(errors);
                assert.equal(errors.length, 1);
            });
    });

    it('Boolean as other type', function() {
        const trueValues = ['true', 'True', 'TRUE', '1', 1];
        const falseValues = ['false', 'False', 'FALSE', '0', 0];

        let promises = trueValues.map(it => schema1.validate({ value: it })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, true);
            }));

        promises = promises.concat(falseValues.map(it => schema1.validate({ value: it })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, false);
            })));

        return Promise.all(promises);
    });
});
