var utils = require('../commons/utils');
const typeHandlers = require('./type-handlers');
const propertyResolver = require('./property-resolver');
var errorGen = require('./error-generator');


class PropertyValidator {

    constructor(doc, value, property, schema, docSchema) {
        this.doc = doc;
        this.value = value;
        this.property = property;
        this.schema = schema;
        this.docSchema = docSchema;
    }

    /**
     * Validate the property
     */
    validate() {
        if (!checkNotNull(this.value, this.schema)) {
            return Promise.reject(errorGen.createValueRequiredMsg(this.property));
        }
    
        this.value = getDefaultValue(this);

        const handler = typeHandlers.getHandler(this.schema.type);
    
        return handler.validate(this);    
    }
}

/**
 * Return the default value, or the own value of the property
 * @param {PropertyValidator} propValidator 
 */
function getDefaultValue(propValidator) {
    if (!utils.isEmpty(this.value)) {
        return this.value;
    }

    if (propValidator.schema.defaultValue) {
        return propertyResolver(propValidator.doc, propValidator.schema.defaultValue);
    }

    return propValidator.value;
}

/**
 * Return false if there is no value and it must be provided
 * @param {*} value 
 * @param {*} propSchema 
 */
function checkNotNull(value, propSchema) {
    if (propSchema.required && utils.isEmpty(value)) {
        return false;
    } else {
        return true;
    }
}


module.exports = PropertyValidator;