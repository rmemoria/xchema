var utils = require('../commons/utils');
const PropertyBuilder = require('../core/property-builder');

module.exports.typeName = ['date', 'date-time', 'time'];

module.exports.validate = (propContext) => {
    var val = propContext.value;

    if (utils.isEmpty(val)) {
        return null;
    }

    if (!utils.isDate(val)) {
        // check if number is in the correct type
        if (utils.isString(val) || utils.isNumber(val)) {
            const newVal = new Date(val);
            if (isNaN(newVal)) {
                return Promise.reject(propContext.error.invalidValue);
            }

            val = newVal;
        }
    }

    return val;
};


module.exports.PropertyBuilder = class extends PropertyBuilder {

};
