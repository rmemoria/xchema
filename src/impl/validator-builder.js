const Utils = require('../commons/utils');

module.exports = class ValidatorBuilder {
    constructor(delegated) {
        this.delegated = delegated;
    }

    bind(func, allowString = true) {
        if (Utils.isString(func) && allowString) {
            this.validator = func;
        } else {
            if (!Utils.isFunction(func)) {
                throw new Error('Expected function to validate property');
            }
    
            this.validator = {
                validIf: func,
                message: null,
                code: null
            };
        }

        if (this.delegated) {
            this.delegated.withErrorMessage = msg => this.withErrorMessage(msg);
            this.delegated.withErrorCode = code => this.withErrorCode(code);
        }

        return this.validator;
    }

    withErrorMessage(msg) {
        this.validator.message = msg;
        return this.delegated ? this.delegated : this;
    }

    withErrorCode(code) {
        this.validator.code = code;
        return this.delegated ? this.delegated : this;
    }
};
