var utils = require('../commons/utils');

module.exports = {
    processAfter: cntxt => processPropertyConverters(cntxt, false),
    processBefore: cntxt => processPropertyConverters(cntxt, true)
};

/**
 * Process all converters in the property schema
 * @param {PropertyContext} propContext object containing all information about the property being validated
 * @returns the new value, or the original value, in case there is no converter
 */
function processPropertyConverters(propContext, isBefore) {
    const schema = propContext.schema;

    const converters = isBefore ? schema.convertersBefore : schema.convertersAfter;

    if (converters) {
        return execConverters(converters, 0, propContext.value, propContext);
    } else {
        return propContext.value;
    }
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
        const conv = session.getConverter(converter);
        if (!conv) {
            throw new Error('Converter \'' + converter + '\' not found');
        }
        converter = conv;
    }

    if (!utils.isFunction(converter)) {
        throw new Error('Converter must be declared as a function');
    }

    const res = converter(value, propContext);

    return Promise.resolve(res);
}
