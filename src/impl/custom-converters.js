var utils = require('../commons/utils');

module.exports = {
    process: processPropertyConverters,
};

/**
 * Process all converters in the property schema
 * @param {PropertyContext} propContext object containing all information about the property being validated
 * @returns the new value, or the original value, in case there is no converter
 */
function processPropertyConverters(propContext) {
    const schema = propContext.schema;

    // execute the single converter, if available
    return processConverter(schema.converter, propContext.value, propContext)
        .then(newValue => {
            // check converters are available
            if (schema.converters) {
                return execConverters(schema.converters, 0, newValue, propContext);
            } else {
                return newValue;
            }
        });
}

function execConverters(convs, index, value, propContext) {
    const converter = convs[index];
    return processConverter(converter, value, propContext)
        .then(res => {
            if (index >= convs.length - 1) {
                return res;
            }
            return execConverters(convs, index + 1, res, propContext);
        });
}

/**
 * Process a single converter, if available, and return a promise with the new value
 * @param {} converter 
 * @param {*} value 
 * @param {*} propContext 
 */
function processConverter(converter, value, propContext) {
    if (!converter) {
        return Promise.resolve(value);
    }

    if (utils.isString(converter)) {
        const session = propContext.session;
        converter = session.getConverter(converter);
        if (!converter) {
            throw new Error('Converter \'' + converter + '\' not found');
        }
    }

    if (!utils.isFunction(converter)) {
        throw new Error('Converter must be declared as a function');
    }

    const res = converter(value, propContext);

    return Promise.resolve(res);
}
