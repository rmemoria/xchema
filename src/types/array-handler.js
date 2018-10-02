var utils = require('../commons/utils');
const PropertyContext = require('../impl/property-context');
const PropertyBuilder = require('../core/property-builder');

module.exports.typeName = 'array';

module.exports.validate = (propContext) => {
    let vals = propContext.value;

    if (!utils.isArray(vals)) {
        return Promise.reject(propContext.error.invalidValue);
    }

    const itemSchema = resolveItemSchema(propContext.schema.itemSchema);

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

module.exports.PropertyBuilder = class ArrayBuilder extends PropertyBuilder {
    /**
     * Set the schema of the items in the array
     * @param {PropertyBuilder} itemSchema set the item schema
     */
    of(itemSchema) {
        if (!itemSchema) {
            throw new Error('Schema of item array not defined');
        }
        this.schema.itemSchema = itemSchema;

        return this;
    }
};

/**
 * Check if val is instanceof PropertyBuilder, if so returns its schema
 * or return the own value (considering it is an object containing the schema)
 * @param {PropertyBuilder} val 
 */
function resolveItemSchema(val) {
    if (!val) {
        throw new Error('No schema found for array items: \'itemSchema\' not found');
    }

    if (val instanceof PropertyBuilder) {
        return val.schema;
    }
    return val;
}

function validateItem(propContext, value, property, schema) {
    const pv = new PropertyContext(propContext.doc,
        value, property, schema, propContext.schema, null, propContext.session);

    return pv.validate();
}