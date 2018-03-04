const utils = require('../../commons/utils');
const errorGen = require('../error-generator');
const validator = require('../schema-validator');


module.exports.validate = (propValidator) => {
    const value = propValidator.value;

    if (utils.isEmpty(value)) {
        return Promise.resolve(null);
    }

    if (!utils.isObject(value)) {
        return Promise.reject(errorGen.createInvalidTypeMsg(propValidator.property));
    }

    const prefix = propValidator.property ? propValidator.property + '.' : '';

    return validator(propValidator.value, propValidator.schema, prefix);
};
