const utils = require('../commons/utils');

/**
 * Resolver for properties that support a function to obtain its value
 * @param {Object} obj 
 * @param {Any} value 
 * @param {string} prop 
 * @param {Object} propSchema 
 */
module.exports = function(obj, propertyValue) {
    if (utils.isFunction(propertyValue)) {
        return propertyValue(obj);
    } else {
        return propertyValue;
    }
};
