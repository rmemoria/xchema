/** 
 * Register type handlers that will be responsible for validating a specific type
*/
const typeHandlers = {};
const propertyBuilders = {};

module.exports.registerHandler = function(handler) {
    const typeName = handler.typeName;

    if (Array.isArray(typeName)) {
        typeName.forEach(tname => registerTypeNameAndHandler(tname, handler));
    } else {
        registerTypeNameAndHandler(typeName, handler);
    }
};

module.exports.getHandler = function(type) {
    return typeHandlers[type];
};

module.exports.propertyBuilders = propertyBuilders;

function registerTypeNameAndHandler(typeName, handler) {
    // register type
    typeHandlers[typeName] = handler;

    // register builder, if available
    if (handler.PropertyBuilder) {
        propertyBuilders[typeName] = (...args) => new handler.PropertyBuilder(typeName, ...args);
    }
}
