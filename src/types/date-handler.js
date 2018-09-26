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
        if (utils.isString(val) || utils.is) {
            const newVal = convertValue(val);
            if (newVal === null) {
                return Promise.reject(propContext.error.invalidType);
            }

            val = newVal;
        }

    }

    return val;
};


module.exports.PropertyBuilder = class extends PropertyBuilder {

    min(val) {
        this.schema.min = val;
        return this;
    }

    max(val) {
        this.schema.max = val;
        return this;
    }
};

function convertValue(val) {
    const trueValues = ['true', '1', 1];
    const falseValues = ['false', '0', 0];

    if (utils.isString(val)) {
        val = val.toLowerCase();
    }

    if (trueValues.includes(val)) {
        return true;
    }

    if (falseValues.includes(val)) {
        return false;
    }

    return null;
}