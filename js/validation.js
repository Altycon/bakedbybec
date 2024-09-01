// Define validation rules
const VALIDATION_RULES = {
    NAME: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        errorMessage: 'Name must be between 1 and 50 characters long.'
    },
    EMAIL: {
        type: 'string',
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // Basic email format
        errorMessage: 'Invalid email address.'
    },
    STRING: {
        type: 'string',
        minLength: 1,
    }
};

// Core validation function
function validateInput(value, validationType) {
    const rule = VALIDATION_RULES[validationType];
    if (!rule) {
        throw new Error(`No validation rule found for ${validationType}.`);
    }
    if (typeof value !== rule.type) {
        throw new Error(rule.errorMessage || `Invalid type: expected ${rule.type}.`);
    }
    if (rule.regex && !rule.regex.test(value)) {
        throw new Error(rule.errorMessage || `Invalid format for ${validationType}.`);
    }
    if (rule.minLength !== undefined && value.length < rule.minLength) {
        throw new Error(rule.errorMessage || `${validationType} is too short.`);
    }

    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        throw new Error(rule.errorMessage || `${validationType} is too long.`);
    }
    return true;
};

export function validate(validations){
    validations.forEach( validation =>{
        validateInput(validation);
    })
};

