var utils = require('../commons/utils');
const typeHandlers = require('./type-handlers');
const propertyResolver = require('./property-resolver');
var errorGen = require('./error-generator');
var customValidators = require('./custom-validators');


class PropertyValidator {

    constructor(doc, value, property, schema, docSchema, propertyNotDeclared) {
        this.doc = doc;
        this.value = value;
        this.property = property;
        this.schema = schema;
        this.docSchema = docSchema;
        this.propertyNotDeclared = !!propertyNotDeclared;
    }

    /**
     * Validate the property
     */
    validate() {
        if (!checkNotNull(this)) {
            return Promise.reject(errorGen.createValueRequiredMsg(this.property));
        }

        this.value = getDefaultValue(this);

        // if there is no value and the property was not declared, so there is nothing to validate
        if (utils.isEmpty(this.value) && this.propertyNotDeclared) {
            return Promise.resolve(PropertyValidator.NotAValue);
        }

        const handler = typeHandlers.getHandler(this.schema.type);

        if (!handler) {
            throw new Error('Handler not found for type \'' + this.schema.type + '\'');
        }
    
        return handler.validate(this)
            .then(newval => {
                this.value = newval;
                // call custom validators
                const err = customValidators.processCustomValidators(this);
                if (err) {
                    return Promise.reject(err);
                }
                return newval;
            });
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
        return propertyResolver(propValidator.schema.defaultValue, propValidator);
    }

    return propValidator.value;
}

/**
 * Return false if there is no value and it must be provided
 * @param {*} value 
 * @param {*} propSchema 
 */
function checkNotNull(propValidator) {
    const res = propertyResolver(propValidator.schema.required, propValidator) === true &&
        utils.isEmpty(propValidator.value);
    return !res;
}

PropertyValidator.NotAValue = {};

module.exports = PropertyValidator;