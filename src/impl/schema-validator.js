var utils = require('../commons/utils');
var PropertyContext = require('./property-context');
var customValidators = require('./custom-validators');


/**
 * Default function to validate an object against an object schema
 * @param {*} obj
 * @param {*} schema 
 */
module.exports = (obj, schema, propertyPrefix) => {
    if (!schema) {
        throw new Error('No schema informed');
    }
    return validateObject(obj, schema, propertyPrefix ? propertyPrefix : ''); 
};

function validateObject(obj, schema, propertyPrefix) {
    const errors = [];
    const newObject = {};

    const promises = [];

    for (const prop in schema.properties) {
        const propSchema = schema.properties[prop];

        const value = obj[prop];

        const propDeclared = obj.hasOwnProperty(prop);

        const prom = validateProperty(obj, value, propertyPrefix + prop, propSchema, schema, !propDeclared)
            .then(newValue => {
                // check if it is a value that must be implemented
                if (newValue !== PropertyContext.NotAValue) {
                    utils.setValue(newObject, prop, newValue);
                }
            })
            .catch(err => {
                // check if it is an unexpected error
                if (err instanceof Error) {
                    return Promise.reject(err);
                }
            
                if (Array.isArray(err)) {
                    err.forEach(it => errors.push(it));
                } else {
                    errors.push(err);
                }
            });

        promises.push(prom);
    }

    // wait for all properties to be validated
    return Promise.all(promises)
        .then(() => {
            // if properties were validated, call custom validator in the schema
            if (errors.length === 0) {
                const pv = new PropertyContext(obj, obj, null, schema, schema);
                const err = customValidators.processCustomValidators(pv);
                if (err) {
                    errors.push(err);
                }
            }
        })
        .then(() => {
            // there was any error during validation ?
            if (errors.length === 0) {
                return newObject;
            } else {
                return Promise.reject(errors);
            }
        });
}

/**
 * Validate a property
 * @param {Object} obj the object being validated
 * @param {*} prop the property to be validated
 * @param {*} propSchema the schema of the property being validated
 */
function validateProperty(obj, value, prop, propSchema, schema, propNotDeclared) {
    const pr = new PropertyContext(obj, value, prop, propSchema, schema, propNotDeclared);

    return pr.validate();
}
