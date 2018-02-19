var utils = require('../commons/utils');
var PropertyValidator = require('./property-validator');
var customValidators = require('./custom-validators');


/**
 * Default function to validate an object against an object schema
 * @param {*} obj
 * @param {*} schema 
 */
module.exports = (obj, schema) => {
    return validateObject(obj, schema);
};

function validateObject(obj, schema) {
    const errors = [];
    const newObject = {};

    const promises = [];

    for (const prop in schema.properties) {
        const propSchema = schema.properties[prop];

        const value = obj[prop];

        const prom = validateProperty(obj, value, prop, propSchema, schema)
            .then(newValue => {
                utils.setValue(newObject, prop, newValue);
            })
            .catch(err => errors.push(err));

        promises.push(prom);
    }

    // wait for all properties to be validated
    return Promise.all(promises)
        .then(() => {
            // if properties were validated, call custom validator in the schema
            if (errors.length === 0) {
                const pv = new PropertyValidator(obj, obj, null, schema, schema);
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
function validateProperty(obj, value, prop, propSchema, schema) {
    const pr = new PropertyValidator(obj, value, prop, propSchema, schema);

    return pr.validate();
}
