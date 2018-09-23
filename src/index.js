const SchemaSession = require('./core/schema-session');
//const typeHandlers = require('./impl/type-handlers');

const globalSession = new SchemaSession();

module.exports = globalSession;
