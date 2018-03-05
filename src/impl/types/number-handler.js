var utils = require('../../commons/utils');
var errorGen = require('../error-generator');


module.exports.validate = (propContext) => {
    var val = propContext.value;

    // check if number is in the correct type
    if (!utils.isNumber(val)) {
        // check if number is in string format
        if (utils.isString(val) && !isNaN(val)) {
            val = Number(val);
        } else {
            return Promise.reject(errorGen.createInvalidTypeMsg(propContext.property));
        }
    }

    // check limits
    const schema = propContext.schema;

    if (schema.max && val > schema.max) {
        return Promise.reject(errorGen.createMaxValueMsg(propContext.property));
    }

    if (schema.min && val < schema.min) {
        return Promise.reject(errorGen.createMinValueMsg(propContext.property));
    }
    
    return Promise.resolve(val);
};
