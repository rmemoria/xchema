const customValidator = require('../impl/custom-validators');
const customConverter = require('../impl/custom-converters');
const ObjectSchema = require('./object-schema');
const typeHandlers = require('../impl/type-handlers');

/**
 * Schema session defining basic configurations for schemas
 */
module.exports = class SchemaSession {

    constructor() {
        this.validators = {
            register: customValidator.registerValidator,
            unregister: customValidator.unregisterValidator,
            get: customValidator.findValidator
        };

        this.converters = {
            register: customConverter.register,
            unregister: customConverter.unregister,
            get: customConverter.get
        };

        this.types = typeHandlers.propertyBuilders;
    }

    /**
     * 
     * @param {object} schema the schema to be created
     */
    create(schema) {
        return new ObjectSchema(schema);
    }

};
