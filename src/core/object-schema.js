const validator = require('../impl/schema-validator');
const ValidatorBuilder = require('../impl/validator-builder');


module.exports = class ObjectSchema {

    constructor (session, properties) {
        this.session = session;

        if (!properties) {
            throw new Error('Schema properties must be provided');
        }
        this.schema = {
            properties: properties
        };
    }

    /**
     * Validate an object againt its schema
     * @param {any} obj object to be validated
     */
    validate(obj) {
        return validator(obj, this.schema, this.session);
    }

    /**
     * Add a validation function to the schema to be called
     * during object validation.
     * @param {*} func the function to validate the object
     */
    validIf(func) {
        this.schema.validators = this.schema.validators || [];

        const builder = new ValidatorBuilder(this);
        const validator = builder.bind(func);
        this.schema.validators.push(validator);
        return this;
    }
};
