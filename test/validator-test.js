var assert = require('assert');
var Schema = require('../src');
var Types = Schema.types;

const authSchema = Schema.create({
    username: Types.string().notNull(),
    password: Types.string().notNull()
});

describe('Validator', function() {

    it('Valid authentication data', function() {
        return authSchema.validate({
            username: 'ricardo',
            password: 'mypassword'
        });
    });

    it('Required field for authentication', function(done) {
        authSchema.validate({ username: 'ricardo' })
            .catch(errs => {
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'password');
                assert.equal(err.code, 'NOT_NULL');
                done();
            });
    });

    it('Default value', function(done) {
        const schema = Schema.create({
            name: Types.string().defaultValue('test')
        });

        const data = {};

        schema.validate(data)
            .then(data => {
                assert.equal(data.name, 'test');
                done();
            });
    });

    it('Error in mutiple properties', function(done) {
        authSchema.validate({})
            .catch(errors => {
                assert.equal(2, errors.length);
                const errUsername = errors.find(it => it.property === 'username');
                assert(errUsername);
                assert.equal(errUsername.code, 'NOT_NULL');
                const errPwd = errors.find(it => it.property === 'password');
                assert(errPwd);
                assert.equal(errPwd.code, 'NOT_NULL');
                done();
            });
    });

}); 