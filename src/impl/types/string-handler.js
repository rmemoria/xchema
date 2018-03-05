var utils = require('../../commons/utils');
var errorGen = require('../error-generator');


module.exports.validate = (propContext) => {
    var val = propContext.value;
    if (utils.isEmpty(val)) {
        return Promise.resolve(null);
    }

    if (!utils.isString(val)) {
        return Promise.reject(errorGen.createInvalidTypeMsg(propContext.property));
    }

    const schema = propContext.schema;

    if (schema.trim || propContext.docSchema.autoTrim) {
        val = val.trim();
    }

    if (schema.max && val.length > schema.max) {
        return Promise.reject(errorGen.createMaxSizeMsg(propContext.property));
    }

    if (schema.min && val.length < schema.min) {
        return Promise.reject(errorGen.createMinSizeMsg(propContext.property));
    }

    return Promise.resolve(val);
};
