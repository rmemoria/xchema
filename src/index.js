const SchemaSession = require('./core/schema-session');
const typeHandlers = require('./impl/type-handlers');

const globalSession = new SchemaSession();

module.exports = globalSession;

typeHandlers.registerHandler(require('./types/string-handler'));
typeHandlers.registerHandler(require('./types/number-handler'));
typeHandlers.registerHandler(require('./types/bool-handler'));
typeHandlers.registerHandler(require('./types/array-handler'));
typeHandlers.registerHandler(require('./types/object-handler'));
