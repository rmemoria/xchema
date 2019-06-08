const utils = require('../commons/utils');
const PropertyBuilder = require('../core/property-builder');
const errorGen = require('../impl/error-generator');

// expression for e-mail validation
/* eslint max-len: 0 */
const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports.typeName = 'string';

module.exports.validate = (propContext) => {
    var val = propContext.value;
    if (utils.isEmpty(val)) {
        return null;
    }

    if (!utils.isString(val)) {
        return Promise.reject(propContext.error.invalidValue);
    }

    const schema = propContext.schema;

    if (schema.trim) {
        val = val.trim();
    }

    if (schema.max && val.length > schema.max) {
        return Promise.reject(propContext.error.maxSize);
    }

    if (schema.min && val.length < schema.min) {
        return Promise.reject(propContext.error.minSize);
    }

    if (schema.toLowerCase) {
        val = val.toLowerCase();
    }

    if (schema.toUpperCase) {
        val = val.toUpperCase();
    }

    if (schema.match) {
        const patt = new RegExp(schema.match);
        if (!patt.test(val)) {
            const msg = schema.matchMessage ? schema.matchMessage : 'Invalid value';
            return Promise.reject(propContext.error.as(msg, errorGen.codes.invalidValue));
        }
    }

    // test e-mail address
    if (schema.email) {
        if (!emailPattern.test(val)) {
            const msg = schema.matchMessage ? schema.matchMessage : 'Invalid e-mail address';
            return Promise.reject(propContext.error.as(msg, errorGen.codes.invalidValue));
        }
    }

    return val;
};

module.exports.PropertyBuilder = class StringBuilder extends PropertyBuilder {
    max(val) {
        if (!utils.isNumber(val)) {
            throw new Error('Invalid max property value: ' + val);
        }

        this.schema.max = val;
        return this;
    }

    min(val) {
        if (!utils.isNumber(val)) {
            throw new Error('Invalid min property value: ' + val);
        }

        this.schema.min = val;
        return this;
    }

    trim(val) {
        if (val === true || val === undefined) {
            this.schema.trim = true;
        } else {
            if (val !== false) {
                throw new Error('Invalid trim property value: ' + val);
            }
            this.schema.trim = false;
        }
        return this;
    }

    toUpperCase(val = true) {
        this.schema.toUpperCase = val;
        return this;
    }

    toLowerCase(val = true) {
        this.schema.toLowerCase = val;
        return this;
    }

    match(pattern, msg) {
        this.schema.match = pattern;
        // a custom message was set ?
        if (msg) {
            this.schema.matchMessage = msg;
        }
        return this;
    }

    /**
     * Indicate that string must contain an e-mail address
     */
    isEmail() {
        this.schema.email = true;
        return this;
    }
};
