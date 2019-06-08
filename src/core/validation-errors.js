
/**
 * Store the list of validation errors, for easy recognizion from other errors
 */
module.exports = class ValidationErrors {
    constructor(errors) {
        this.errors = errors || [];
    }

    /**
     * Add a new message to the list of error messages
     * @param {string} property 
     * @param {string} message 
     * @param {string} code 
     */
    addError(property, message, code) {
        this.errors.push({
            property: property,
            message: message,
            code: code
        });
    }
};
