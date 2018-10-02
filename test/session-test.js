const Schema = require('../src');
const assert = require('assert');
const Types = Schema.types;

describe('Schema session test', () => {

    // create a session and a schema from this session
    it('Create session', () => {
        // create a session
        const session = Schema.cloneSession();
        assert(session);

        // create a schema in the session
        const schema = session.create({
            value: Types.string().notNull()
        });

        // validate the schema
        schema.validate({ value: 'banana' })
            .then(doc => {
                assert(doc);
                assert.equal(doc.value, 'banana');
            });
    });

    // check if new session is isolated from global default session
    it('Session isolation', () => {
        const session = Schema.cloneSession();

        const validators = session.getValidators();
        assert.notEqual(validators, Schema.getValidators());
        assert.equal(validators.length, Schema.getValidators().length);

        const converters = session.getConverters();
        assert.notEqual(converters, Schema.getConverters());
        assert.equal(converters.length, Schema.getConverters().length);

        // include a new validator and check the size again
        session.registerValidator('test', val => val < 10);
        assert.equal(validators.length + 1, session.getValidators().length);
        assert.equal(converters.length, Schema.getConverters().length);

        // include a new converter and check the size again
        session.registerConverter('test', val => val + 1);
        assert.equal(session.getConverters().length, converters.length + 1);
        assert.equal(converters.length, Schema.getConverters().length);

        // make sure the validator and converter doesn't exist in the default session
        const schema = Schema.create({
            value: Types.string().convertAfter('test')
        });

        schema.validate({ value: 'banana' })
            .catch(err => {
                assert(err);
                assert(err instanceof Error);
            });
    });
});
