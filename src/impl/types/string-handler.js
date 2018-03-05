const utils = require('../../commons/utils');

module.exports.validate = (propContext) => {
    var val = propContext.value;
    if (utils.isEmpty(val)) {
        return Promise.resolve(null);
    }

    if (!utils.isString(val)) {
        return Promise.reject(propContext.error.invalidType);
    }

    const schema = propContext.schema;

    if (schema.trim || propContext.docSchema.autoTrim) {
        val = val.trim();
    }

    if (schema.max && val.length > schema.max) {
        return Promise.reject(propContext.error.maxSize);
    }

    if (schema.min && val.length < schema.min) {
        return Promise.reject(propContext.error.minSize);
    }

    return Promise.resolve(val);
};
