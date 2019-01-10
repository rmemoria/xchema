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

    it('Required field for authentication', function() {
        return authSchema.validate({ username: 'ricardo' })
            .catch(errs => {
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.property, 'password');
                assert.equal(err.code, 'NOT_NULL');
            });
    });

    it('Default value', function() {
        const schema = Schema.create({
            name: Types.string().defaultValue('test')
        });

        const data = {};

        return schema.validate(data)
            .then(data => {
                assert.equal(data.name, 'test');
            });
    });

    it('Error in mutiple properties', function() {
        return authSchema.validate({})
            .catch(errs => {
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 2);
                const errors = errs.errors;
                const errUsername = errors.find(it => it.property === 'username');
                assert(errUsername);
                assert.equal(errUsername.code, 'NOT_NULL');
                const errPwd = errors.find(it => it.property === 'password');
                assert(errPwd);
                assert.equal(errPwd.code, 'NOT_NULL');
            });
    });

}); 