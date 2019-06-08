const SchemaSession = require('./core/schema-session');
const PropertyBuilder = require('./core/property-builder');
const ValidationErrors = require('./core/validation-errors');
const ObjectSchema = require('./core/object-schema');

/**
 * Define a global session in order to make it easier
 * to start with schema validation
 */
const globalSession = new SchemaSession();

globalSession.PropertyBuilder = PropertyBuilder;
globalSession.ValidationErrors = ValidationErrors;
globalSession.ObjectSchema = ObjectSchema;

module.exports = globalSession;
