var utils = require('../commons/utils');
//const typeHandlers = require('./type-handlers');
const propertyResolver = require('./property-resolver');
const errorGen = require('./error-generator');
const customValidators = require('./custom-validators');
const customConverters = require('./custom-converters');


module.exports = class PropertyContext {

    constructor(doc, value, property, schema, docSchema, propertyNotDeclared, session) {
        this.doc = doc;
        this.value = value;
        this.property = property;
        this.schema = schema;
        this.docSchema = docSchema;
        this.propertyNotDeclared = !!propertyNotDeclared;
        this.session = session;
    }

    /**
     * Validate the property
     */
    validate() {
        if (!checkNotNull(this)) {
            return Promise.reject(errorGen.createNotNullMsg(this.property));
        }

        this.value = getDefaultValue(this);

        // if there is no value and the property was not declared, so there is nothing to validate
        if (utils.isEmpty(this.value) && this.propertyNotDeclared) {
            return Promise.resolve(PropertyContext.NotAValue);
        }

        const handler = this.session.getHandler(this.schema.type);

        if (!handler) {
            throw new Error('Handler not found for type \'' + this.schema.type + '\'');
        }
    
        return Promise.resolve(handler.validate(this))
            .then(newval => {
                this.value = newval;
                // call custom validators
                const err = customValidators.processCustomValidators(this);
                if (err) {
                    return Promise.reject(err);
                }
                this.value = newval;
                // call converters
                return customConverters.process(this);
            });
    }

    /**
     * Helper functions to create specific error messages
     */
    get error() {
        const prop = this.property;

        return class ErrorWrapper {
            static as(msg, code) { 
                return errorGen.createErrorMsg(prop, msg, code);
            }
            
            static asCode(code) { 
                return errorGen.createErrorMsg(prop, null, code);
            }

            static get notNull() {
                return errorGen.createNotNullMsg(prop);
            }

            static get invalidValue() {
                return errorGen.createInvalidValue(prop);
            }

            static get invalidType() {
                return errorGen.createInvalidTypeMsg(prop);
            }

            static get maxSize() {
                return errorGen.createMaxSizeMsg(prop);
            }

            static get minSize() {
                return errorGen.createMinSizeMsg(prop);
            }

            static get maxValue() {
                return errorGen.createMaxValueMsg(prop);
            }

            static get minValue() {
                return errorGen.createMinValueMsg(prop);
            }
        };
    }
};

/**
 * Return the default value, or the own value of the property
 * @param {PropertyContext} propContext 
 */
function getDefaultValue(propContext) {
    if (!utils.isEmpty(this.value)) {
        return this.value;
    }

    if (propContext.schema.defaultValue) {
        return propertyResolver(propContext.schema.defaultValue, propContext);
    }

    return propContext.value;
}

/**
 * Return false if there is no value and it must be provided
 * @param {*} value 
 * @param {*} propSchema 
 */
function checkNotNull(propContext) {
    const res = propertyResolver(propContext.schema.notNull, propContext) === true &&
        utils.isEmpty(propContext.value);
    return !res;
}

module.exports.NotAValue = {};
