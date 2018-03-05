var utils = require('../../commons/utils');
var errorGen = require('../error-generator');


module.exports.validate = (propContext) => {
    var val = propContext.value;

    // check if number is in the correct type
    if (!utils.isBoolean(val)) {
        const newVal = convertValue(val);
        if (newVal === null) {
            return Promise.reject(errorGen.createInvalidTypeMsg(propContext.property));
        }

        val = newVal;
    }

    return Promise.resolve(val);
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