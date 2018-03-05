const utils = require('../../commons/utils');
const validator = require('../schema-validator');


module.exports.validate = (propContext) => {
    const value = propContext.value;

    if (utils.isEmpty(value)) {
        return Promise.resolve(null);
    }

    if (!utils.isObject(value)) {
        return Promise.reject(propContext.error.invalidType);
    }

    const prefix = propContext.property ? propContext.property + '.' : '';

    return validator(propContext.value, propContext.schema, prefix);
};
