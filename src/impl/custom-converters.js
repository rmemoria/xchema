var utils = require('../commons/utils');

// list of registered converters
const converters = {};

module.exports = {
    process: processPropertyConverters,
    register: registerConverter,
    unregister: unregisterConverter,
    get: getConverter
};

/**
 * Process all converters in the property schema
 * @param {PropertyValidator} propValidator object containing all information about the property being validated
 * @returns the new value, or the original value, in case there is no converter
 */
function processPropertyConverters(propValidator) {
    const schema = propValidator.schema;

    // execute the single converter, if available
    return processConverter(schema.converter, propValidator.value, propValidator)
        .then(newValue => {
            // check converters are available
            if (schema.converters) {
                return execConverters(schema.converters, 0, newValue, propValidator);
            } else {
                return newValue;
            }
        });
}

function execConverters(convs, index, value, propValidator) {
    const converter = convs[index];
    return processConverter(converter, value, propValidator)
        .then(res => {
            if (index >= convs.length - 1) {
                return res;
            }
            return execConverters(convs, index + 1, res, propValidator);
        });
}

function processConverter(converter, value, propValidator) {
    if (!converter) {
        return Promise.resolve(value);
    }

    if (utils.isString(converter)) {
        converter = converters[converter];
        if (!converter) {
            throw new Error('Converter \'' + converter + '\' not found');
        }
    }

    if (!utils.isFunction(converter)) {
        throw new Error('Converter must be declared as a function');
    }

    const res = converter(value, propValidator.doc,
        propValidator.schema, propValidator.docSchema);

    return Promise.resolve(res);
}

/**
 * Register a new converter to be used in schemas
 * @param {string} name 
 * @param {object} handler 
 */
function registerConverter(name, handler) {
    converters[name] = handler;
}

/**
 * Unregister a previously registered schema
 * @param {string} name 
 */
function unregisterConverter(name) {
    delete converters[name];
}

/**
 * Return the converter handler of a given schema
 * @param {string} name 
 */
function getConverter(name) {
    return converters[name];
}