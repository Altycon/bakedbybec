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

function validate(validations){
    validations.forEach( validation =>{
        validateInput(validation);
    })
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIPCODE_REGEX = /[0-9]{5}(-[0-9]{4})?/;
const PHONE_NUMBER_REGEX = /[0-9]{3}[\-]?[0-9]{3}[\-]?[0-9]{4}/;

export function checkInputValidity(value='', options={}){
    if(!options) return [null,value];
    if(options.isString){
        if(options.isString === true){
            if(typeof value !== 'string'){
                return [new Error('invalid type - not string'),null];
            }
        }
    }
    if(options.isString && options.isNumber){
        if(options.isString === true && isNaN(value)){
            return [new Error(`"${value} is not a number (this might be wrong)`),null];
        }
    }
    if(options.type){
        switch(options.type){
            case 'email':
                if(!EMAIL_REGEX.test(value)){
                    return [new Error(`invalid email - "${value}"`),null]
                }
                break;
            case 'phone-number':
                if(!PHONE_NUMBER_REGEX.test(value)){
                    return [new Error(`invalid phone number format - "${value}"`),null]
                }
                break;
            case 'zipcode':
                if(!ZIPCODE_REGEX.test(value)){
                    return [new Error(`invalid zipcode - "${value}"`),null]
                }
                break;
        }
    }
    if(options.minLength){
        if(value.length < options.minLength){
            return [new Error('invalid length - too few characters'),null]
        }
    }
    if(options.maxLength){
        if(value.length > options.maxLength){
            return [new Error('invalid length - too many characters'),null]
        }
    }
    return [null, value];
};

