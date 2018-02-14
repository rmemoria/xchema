var utils = require('../../commons/utils');
var errorGen = require('../error-generator');


module.exports.validate = (propValidator) => {
    var val = propValidator.value;

    // check if number is in the correct type
    if (!utils.isNumber(val)) {
        // check if number is in string format
        if (utils.isString(val) && !isNaN(val)) {
            val = Number(val);
        } else {
            return Promise.reject(errorGen.createInvalidTypeMsg(propValidator.property));
        }
    }

    // check limits
    const schema = propValidator.schema;

    if (schema.max && val > schema.max) {
        return Promise.reject(errorGen.createMaxValueMsg(propValidator.property));
    }

    if (schema.min && val < schema.min) {
        return Promise.reject(errorGen.createMinValueMsg(propValidator.property));
    }
    
    return Promise.resolve(val);
};
