/** 
 * Register type handlers that will be responsible for validating a specific type
*/
const typeHandlers = {};

module.exports.registerHandler = function(type, handler) {
    typeHandlers[type] = handler;
};

module.exports.getHandler = function(type) {
    return typeHandlers[type];
};
