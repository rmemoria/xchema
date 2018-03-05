var utils = require('../../commons/utils');

module.exports.validate = (propContext) => {
    var val = propContext.value;

    if (utils.isEmpty(val)) {
        return null;
    }

    // check if number is in the correct type
    if (!utils.isNumber(val)) {
        // check if number is in string format
        if (utils.isString(val) && !isNaN(val)) {
            val = Number(val);
        } else {
            return Promise.reject(propContext.error.invalidType);
        }
    }

    // check limits
    const schema = propContext.schema;

    if (schema.max && val > schema.max) {
        return Promise.reject(propContext.error.maxValue);
    }

    if (schema.min && val < schema.min) {
        return Promise.reject(propContext.error.minValue);
    }
    
    return val;
};
