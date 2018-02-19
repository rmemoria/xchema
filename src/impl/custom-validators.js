const utils = require('../commons/utils');
const errorGen = require('./error-generator');

/**
 * Custom validators are functions defined by the user inside a schema in property or 
 * object level with the objective of validate it.
 */
module.exports = {
    processCustomValidators: processCustomValidators
};

function processCustomValidators(propValidator) {
    const schema = propValidator.schema;

    // there is a single validator ?
    if (schema.validator) {
        const err = processValidator(propValidator, schema.validator);
        if (err) {
            return err;
        }
    }

    // there is an array of custom validators ?
    if (schema.validators) {
        // iterate by all validators until an invalid is found
        for (const i in schema.validators) {
            const err = processValidator(propValidator, schema.validators[i]);
            if (err) {
                return err;
            }
        }
    }
    return null;
}

function processValidator(propValidator, validator) {
    // validator is a simple function ?
    if (utils.isFunction(validator)) {
        return handleFunctionValidator(propValidator, validator);
    }

    return handleValidator(propValidator, validator);
}

function handleFunctionValidator(propValidator, validator) {
    const ret = validator(propValidator.doc);
    if (utils.isEmpty(ret)) {
        return null;
    }

    if (utils.isString(ret)) {
        return errorGen.createErrorMsg(propValidator.property, ret, null);
    }

    throw new Error('Invalid return type of validator: ' + ret);
}

function handleValidator(propValidator, validator) {
    const func = validator.isValid;
    if (!func || !utils.isFunction(func)) {
        throw new Error('isValid function not found for schema + ' + propValidator.schema);
    }

    // call validator and return true? So it is valid
    if (func(propValidator.doc)) {
        return null;
    }

    return errorGen.createErrorMsg(propValidator.property, validator.message, validator.code);
}