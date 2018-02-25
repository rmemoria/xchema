var utils = require('../../commons/utils');
var errorGen = require('../error-generator');
const PropertyValidator = require('../property-validator');

module.exports.validate = (propValidator) => {
    let vals = propValidator.value;

    if (!utils.isArray(vals)) {
        return Promise.reject(errorGen.createInvalidTypeMsg(propValidator.property));
    }

    const itemSchema = propValidator.schema.itemSchema;
    if (!itemSchema) {
        throw new Error('No schema found for array items: \'itemSchema\' not found');
    }

    const prevProp = propValidator.property ? propValidator.property : '';

    const errors = [];
    const newLst = [];

    const proms = vals.map((it, index) => {
        const propPrefix = prevProp + '[' + index + ']';
        const item = vals[index];

        // call validator for each item in the array
        return validateItem(propValidator, item, propPrefix, itemSchema)
            .then(newItem => {
                newLst.push(newItem);
            })
            .catch(err => {
                if (Array.isArray(err)) {
                    err.forEach(it => errors.push(it));
                } else {
                    errors.push(err);
                }
            });
    });

    // wait for all of them to finish validation
    return Promise.all(proms)
        .then(() => {
            if (errors.length > 0) {
                return Promise.reject(errors);
            } else {
                return newLst;
            }
        });
};

function validateItem(propValidator, value, property, schema) {
    const pv = new PropertyValidator(propValidator.doc,
        value, property, schema, propValidator.schema);

    return pv.validate();
}