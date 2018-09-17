const utils = require('../commons/utils');
const PropertyBuilder = require('../core/property-builder');

module.exports.typeName = 'string';

module.exports.validate = (propContext) => {
    var val = propContext.value;
    if (utils.isEmpty(val)) {
        return null;
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

    return val;
};

module.exports.PropertyBuilder = class StringBuilder extends PropertyBuilder {
    max(val) {
        if (!utils.isNumber(val)) {
            throw new Error('Invalid max property value: ' + val);
        }

        this.schema.max = val;
        return this;
    }

    min(val) {
        if (!utils.isNumber(val)) {
            throw new Error('Invalid min property value: ' + val);
        }

        this.schema.min = val;
        return this;
    }

    trim(val) {
        if (val === true || val === undefined) {
            this.schema.trim = true;
        } else {
            if (val !== false) {
                throw new Error('Invalid trim property value: ' + val);
            }
            this.schema.trim = false;
        }
        return this;
    }
};
