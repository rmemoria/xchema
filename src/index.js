const validator = require('./impl/schema-validator');
const customValidator = require('./impl/custom-validators');

exports.validate = (obj, schema) => validator(obj, schema);

exports.validators = {
    register: (name, handler) => customValidator.registerValidator(name, handler),
    unregister: name => customValidator.unregisterValidator(name),
    get: name => customValidator.findValidator(name)
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
