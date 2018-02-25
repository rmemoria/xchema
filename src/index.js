const validator = require('./impl/schema-validator');

exports.validate = (obj, schema) => validator(obj, schema);

/**
 * Initialize default handlers
 */
const typeHandlers = require('./impl/type-handlers');

typeHandlers.registerHandler('string', require('./impl/types/string-handler'));
typeHandlers.registerHandler('number', require('./impl/types/number-handler'));
typeHandlers.registerHandler('bool', require('./impl/types/bool-handler'));
typeHandlers.registerHandler('array', require('./impl/types/array-handler'));
typeHandlers.registerHandler('object', require('./impl/types/object-handler'));
