const ObjectSchema = require('./object-schema');
const ValidatorBuilder = require('../impl/validator-builder');

/**
 * Schema session defining basic configurations for schemas
 */
module.exports = class SchemaSession {

    constructor() {
        // list of registered validators
        this.validators = {};

        // List of registered global converters
        this.converters = {};

        // this.types = typeHandlers.propertyBuilders;
        this.types = [];
        this.typeHandlers = {};

        registerDefaultHandlers(this);
    }

    cloneSession() {
        const newSession = new SchemaSession();
        newSession.validators = Object.assign({}, this.validators);
        newSession.converters = Object.assign({}, this.converters);
        newSession.types = this.types.slice();
        newSession.typeHandlers = Object.assign({}, this.typeHandlers);
        return newSession;
    }

    /**
     * 
     * @param {object} schema the schema to be created
     */
    create(schema) {
        return new ObjectSchema(this, schema);
    }

    registerHandler(handler) {
        const typeName = handler.typeName;
    
        if (Array.isArray(typeName)) {
            typeName.forEach(tname => registerTypeNameAndHandler(this, tname, handler));
        } else {
            registerTypeNameAndHandler(this, typeName, handler);
        }
    }

    getHandler(type) {
        return this.typeHandlers[type];
    }

    registerConverter(name, handler) {
        this.converters[name] = handler;
    }

    getConverter(name) {
        return this.converters[name];
    }

    /**
     * Return the list of converters registered in the session
     */
    getConverters() {
        return Object.keys(this.converters);
    }

    /**
     * Register a new custom validator to be used throughout the implementation
     * @param {string} name 
     * @param {function} handler a function that returns true if the validation was successfull
     */
    registerValidator(name, handler) {
        const builder = new ValidatorBuilder();
        const validator = builder.bind(handler);
        this.validators[name] = validator;
        return builder;
    }

    getValidator(name) {
        return this.validators[name];
    }

    /**
     * Return the list of validators registered in the session
     */
    getValidators() {
        return Object.keys(this.validators);
    }
};


function registerTypeNameAndHandler(session, typeName, handler) {
    // register type
    session.typeHandlers[typeName] = handler;

    // register builder, if available
    if (handler.PropertyBuilder) {
        session.types[typeName] = (...args) => new handler.PropertyBuilder(typeName, ...args);
    }
}

function registerDefaultHandlers(session) {
    session.registerHandler(require('../types/string-handler'));
    session.registerHandler(require('../types/number-handler'));
    session.registerHandler(require('../types/bool-handler'));
    session.registerHandler(require('../types/array-handler'));
    session.registerHandler(require('../types/object-handler'));
}