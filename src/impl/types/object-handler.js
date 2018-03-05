const utils = require('../../commons/utils');
const errorGen = require('../error-generator');
const validator = require('../schema-validator');


module.exports.validate = (propContext) => {
    const value = propContext.value;

    if (utils.isEmpty(value)) {
        return Promise.resolve(null);
    }

    if (!utils.isObject(value)) {
        return Promise.reject(errorGen.createInvalidTypeMsg(propContext.property));
    }

    const prefix = propContext.property ? propContext.property + '.' : '';

    return validator(propContext.value, propContext.schema, prefix);
};
