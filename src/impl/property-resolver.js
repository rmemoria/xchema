const utils = require('../commons/utils');

/**
 * Resolver for properties that support a function to obtain its value. If the property value is
 * a function, it is called with the value and document object as argument, otherwise it
 * return the property value as given
 * @param {Object} obj 
 * @param {Any} value 
 * @param {string} propertyValue the property value to be evaluated as a function or a value
 */
module.exports = function(propertyValue, propValidator) {
    if (utils.isFunction(propertyValue)) {
        return propertyValue(propValidator.value, 
            propValidator.doc, 
            propValidator.schema, 
            propValidator.docSchema);
    } else {
        return propertyValue;
    }
};
