
/**
 * Store the list of validation errors, for easy recognizion from other errors
 */
module.exports = class ValidationErrors {
    constructor(errors) {
        this.errors = errors;
    }
};
