const validator = require('../impl/schema-validator');
const ValidatorBuilder = require('../impl/validator-builder');
const ValidationErrors = require('./validation-errors');


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
        if (obj === null || obj === undefined) {
            return Promise.reject(new ValidationErrors([{ code: 'NULL' }]));
        }
        return validator(obj, this.schema, this.session)
            .catch(errors => {
                if (Array.isArray(errors)) {
                    return Promise.reject(new ValidationErrors(errors));
                } else {
                    return Promise.reject(errors);
                }
            });
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
