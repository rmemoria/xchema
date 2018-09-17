const Utils = require('../commons/utils');
const ValidatorBuilder = require('../impl/validator-builder');

module.exports = class PropertyBuilder {

    constructor(type) {
        this.schema = {
            type: type
        };
    }

    notNull(val) {
        this.schema.notNull = val;
        if (val !== undefined && typeof val !== 'boolean' && typeof val !== 'function') {
            throw new Error('Invalid value for notNull function');
        }

        if (val === undefined) {
            this.schema.notNull = true;
        } else {
            this.schema.notNull = val;
        }
        return this;
    }

    label(val) {
        this.type.label = val;
        return this;
    }

    validIf(func) {
        this.schema.validators = this.schema.validators || [];

        const builder = new ValidatorBuilder(this);
        const validator = builder.bind(func);
        this.schema.validators.push(validator);
        return this;
    }

    defaultValue(val) {
        if (Utils.isEmpty(val)) {
            throw new Error('Invalid default value. Expected a value');
        }

        this.schema.defaultValue = val;

        return this;
    }

    convertTo(func) {
        if (!Utils.isFunction(func)) {
            throw new Error('Invalid value for converter. Expected function');
        }

        this.schema.converter = func;
        return this;
    }
};
