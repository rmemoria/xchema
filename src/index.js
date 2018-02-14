const validator = require('./impl/validator');

exports.validate = (obj, schema) => validator(obj, schema);

/**
 * Initialize default handlers
 */
const typeHandlers = require('./impl/type-handlers');

typeHandlers.registerHandler('string', require('./impl/types/string-handler'));
typeHandlers.registerHandler('number', require('./impl/types/number-handler'));