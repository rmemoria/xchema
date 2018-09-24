const SchemaSession = require('./core/schema-session');

/**
 * Define a global session in order to make it easier
 * to start with schema validation
 */
const globalSession = new SchemaSession();

module.exports = globalSession;
