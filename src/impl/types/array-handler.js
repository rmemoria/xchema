var utils = require('../../commons/utils');
const PropertyContext = require('../property-context');

module.exports.validate = (propContext) => {
    let vals = propContext.value;

    if (!utils.isArray(vals)) {
        return Promise.reject(propContext.error.invalidType);
    }

    const itemSchema = propContext.schema.itemSchema;
    if (!itemSchema) {
        throw new Error('No schema found for array items: \'itemSchema\' not found');
    }

    const prevProp = propContext.property ? propContext.property : '';

    const errors = [];
    const newLst = [];

    const proms = vals.map((it, index) => {
        const propPrefix = prevProp + '[' + index + ']';
        const item = vals[index];

        // call validator for each item in the array
        return validateItem(propContext, item, propPrefix, itemSchema)
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

function validateItem(propContext, value, property, schema) {
    const pv = new PropertyContext(propContext.doc,
        value, property, schema, propContext.schema);

    return pv.validate();
}