const utils = require('../commons/utils');
const validator = require('../impl/schema-validator');
const PropertyBuilder = require('../core/property-builder');

module.exports.typeName = 'object';

module.exports.validate = (propContext) => {
    const value = propContext.value;

    if (utils.isEmpty(value)) {
        return Promise.resolve(null);
    }

    if (!utils.isObject(value)) {
        return Promise.reject(propContext.error.invalidValue);
    }

    const prefix = propContext.property ? propContext.property + '.' : '';

    return validator(propContext.value, propContext.schema, propContext.session, prefix);
};

module.exports.PropertyBuilder = class ObjectBuilder extends PropertyBuilder {

    constructor(typeName, objectSchema) {
        super(typeName);
        this.schema.properties = objectSchema;
    }
};
