var utils = require('../../commons/utils');
var errorGen = require('../error-generator');


module.exports.validate = (propValidator) => {
    var val = propValidator.value;
    if (utils.isEmpty(val)) {
        return Promise.resolve(null);
    }

    if (!utils.isString(val)) {
        return Promise.reject(errorGen.createInvalidTypeMsg(propValidator.property));
    }

    const schema = propValidator.schema;

    if (schema.trim || propValidator.docSchema.autoTrim) {
        val = val.trim();
    }

    if (schema.max && val.length > schema.max) {
        return Promise.reject(errorGen.createMaxSizeMsg(propValidator.property));
    }

    if (schema.min && val.length < schema.min) {
        return Promise.reject(errorGen.createMinSizeMsg(propValidator.property));
    }

    return Promise.resolve(val);
};
