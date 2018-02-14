var assert = require('assert');
var validator = require('../src');

const authSchema = {
    properties: {
        username: {
            type: 'string',
            required: true,
            max: 10,
            min: 3
        }
    }
};

describe('String Validator', function() {

    it('Property with invalid type', function(done) {
        const data = {
            username: 12
        };

        validator.validate(data, authSchema)
            .catch(errors => {
                assert.equal(errors.length, 1);
                const err = errors[0];
                assert.equal(err.property, 'username');
                assert.equal(err.code, 'INVALID_TYPE');
                done();
            });
    });

    it('Trim spaces', function() {
        const schema = {
            properties: {
                name: {
                    type: 'string',
                    trim: true
                }
            }
        };

        validator.validate({ name: ' Rio '}, schema)
            .then(doc => {
                assert(doc);
                assert(doc.name);
                assert.equal(doc.name, 'Rio');
            });
    });

    it('Max size', function() {
        validator.validate({ username: 'ThisIsALongStringObject' }, authSchema)
            .catch(errors => {
                assert(errors);
                assert.equal(1, errors.length);
                const err = errors[0];
                assert.equal(err.property, 'username');
                assert.equal(err.code, 'MAX_SIZE');
            });
    });

    it('Min size', function() {
        validator.validate({ username: 'ab' }, authSchema)
            .catch(errors => {
                assert(errors);
                assert.equal(1, errors.length);
                const err = errors[0];
                assert.equal(err.property, 'username');
                assert.equal(err.code, 'MIN_SIZE');
            });
    });
}); 