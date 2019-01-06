var assert = require('assert');
var Schema = require('../src');
const Types = Schema.types;

const authSchema = Schema.create({
    username: {
        type: 'string',
        required: true,
        max: 10,
        min: 3
    }
});

describe('String Validator', function() {

    it('Property with invalid type', function() {
        const data = {
            username: 12
        };

        return authSchema.validate(data, authSchema)
            .catch(errors => {
                assert.equal(errors.length, 1);
                const err = errors[0];
                assert.equal(err.property, 'username');
                assert.equal(err.code, 'INVALID_VALUE');
            });
    });

    it('Trim spaces', function() {
        const schema = Schema.create({
            name: {
                type: 'string',
                trim: true
            }
        });

        return schema.validate({ name: ' Rio '})
            .then(doc => {
                assert(doc);
                assert(doc.name);
                assert.equal(doc.name, 'Rio');
            });
    });

    it('Max size', function() {
        return authSchema.validate({ username: 'ThisIsALongStringObject' })
            .catch(errors => {
                assert(errors);
                assert.equal(1, errors.length);
                const err = errors[0];
                assert.equal(err.property, 'username');
                assert.equal(err.code, 'MAX_SIZE');
            });
    });

    it('Min size', function() {
        return authSchema.validate({ username: 'ab' }, authSchema)
            .catch(errors => {
                assert(errors);
                assert.equal(1, errors.length);
                const err = errors[0];
                assert.equal(err.property, 'username');
                assert.equal(err.code, 'MIN_SIZE');
            });
    });

    it('Upper case', () => {
        const sc = Schema.create({
            login: Types.string().notNull().toUpperCase()
        });

        return sc.validate({ login: 'Ricardo' })
            .then(doc => {
                assert(doc);
                assert(doc.login);
                assert.equal(doc.login, 'RICARDO');
            });
    });

    it('Lower case', () => {
        const sc = Schema.create({
            login: Types.string().notNull().toLowerCase()
        });

        return sc.validate({ login: 'Ricardo' })
            .then(doc => {
                assert(doc);
                assert(doc.login);
                assert.equal(doc.login, 'ricardo');
            });
    });

    it.only('Match', () => {
        const sc = Schema.create({
            login: Types.string().notNull().match(/^[a-zA-Z0-9-_]*$/, 'Login not valid')
        });

        return sc.validate({ login: 'Valid-Login' })
            .then(() => {
                return sc.validate({ login: 'Valid_LOGIN' });
            })
            .then(() => {
                // this one will fail
                return sc.validate({ login: 'Invalid_login()' })
                    .catch(errs => {
                        assert(errs);
                        assert.equal(errs.length, 1);
                        const err = errs[0];
                        assert.equal(err.property, 'login');
                        assert.equal(err.message, 'Login not valid');
                        assert.equal(err.code, 'INVALID_VALUE');
                    });
            });
    });
}); 