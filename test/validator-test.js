var assert = require('assert');
var validator = require('../src');

const authSchema = {
    properties: {
        username: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    }
};

describe('Validator', function() {

    it('Valid authentication data', function() {
        const data = {
            username: 'ricardo',
            password: 'mypasswd'
        };

        return validator.validate(data, authSchema);
    });

    it('Required field for authentication', function(done) {
        const data = {
            username: 'ricardo'
        };

        validator.validate(data, authSchema)
            .catch(errs => {
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'password');
                assert.equal(err.code, 'VALUE_REQUIRED');
                done();
            });
    });

    it('Default value', function(done) {

        const schema = {
            properties: {
                name: { type: 'string', defaultValue: 'test' }
            }
        };

        const data = {};

        validator.validate(data, schema)
            .then(data => {
                assert.equal(data.name, 'test');
                done();
            });
    });

    it('Error in mutiple properties', function(done) {
        validator.validate({}, authSchema)
            .catch(errors => {
                assert.equal(2, errors.length);
                const errUsername = errors.find(it => it.property === 'username');
                assert(errUsername);
                assert.equal(errUsername.code, 'VALUE_REQUIRED');
                const errPwd = errors.find(it => it.property === 'password');
                assert(errPwd);
                assert.equal(errPwd.code, 'VALUE_REQUIRED');
                done();
            });
    });

}); 