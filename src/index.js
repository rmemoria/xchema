const validator = require('./impl/schema-validator');
const customValidator = require('./impl/custom-validators');
const customConverter = require('./impl/custom-converters');

/**
 * Main function to validate/convert an object
 * @param {object} obj 
 * @param {object} schema
 * @returns Promise object with the new object validated and converter, or a list of errors
 * in case it is rejected
 */
exports.validate = (obj, schema) => validator(obj, schema);

/**
 * Custom validator API functions
 */
exports.validators = {
    register: customValidator.registerValidator,
    unregister: customValidator.unregisterValidator,
    get: customValidator.findValidator
};

/**
 * Custom converters API functions
 */
exports.converters = {
    register: customConverter.register,
    unregister: customConverter.unregister,
    get: customConverter.get
};

/**
 * Initialize default handlers
 */
const typeHandlers = require('./impl/type-handlers');

typeHandlers.registerHandler('string', require('./impl/types/string-handler'));
typeHandlers.registerHandler('number', require('./impl/types/number-handler'));
typeHandlers.registerHandler('bool', require('./impl/types/bool-handler'));
typeHandlers.registerHandler('array', require('./impl/types/array-handler'));
typeHandlers.registerHandler('object', require('./impl/types/object-handler'));
