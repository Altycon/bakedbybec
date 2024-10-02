import { sanitizeInput } from "./sanitation.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIPCODE_REGEX = /[0-9]{5}(-[0-9]{4})?/;
const PHONE_NUMBER_REGEX = /[0-9]{3}[\-]?[0-9]{3}[\-]?[0-9]{4}/;
const DECIMAL_REGEX = /^-?\d*\.?\d+$/;

function validationErrorArray(tagName,name,value,validationType,errorMessage){
    return [new Error(`${tagName}: ${name} | invalid ${validationType} - "${value}" ${errorMessage || 'invalid'}`),null];
};
export function ValidateHTMLForm(form){
    const fields = Array.from(form.elements).filter( element => (element.name && element.value));
    if(fields.length <= 0) return [new Error('no fields in form to validate'),null];

    const data = new FormData(form);

    for(let i = 0; i < fields.length; i++){
        const field = fields[i];
        const tagName = field.tagName;
        const name = field.name;
        const type = field.type;
        const value = field.value.trim();
        
        if(typeof value !== 'string'){
            return validationErrorArray(tagName,name,value,'type','not a string');
        }
        const sanitized = sanitizeInput(value);
        if(tagName === 'INPUT'){
            if(type === 'text'){
                if(sanitized.length < 1){
                    return validationErrorArray(tagName,name,value,'length','less than 1 chacters');
                }
                if(sanitized.length > 100){
                    return validationErrorArray(tagName,name,value,'length','more than 100 characters');
                }
            }
            if(type === 'email'){
                if(!EMAIL_REGEX.test(sanitized)){
                    return validationErrorArray(tagName,name,value,'format','not standard email format');
                }
                if(sanitized.length < 5){
                    return validationErrorArray(tagName,name,value,'length','less than 5 characters');
                }
                if(sanitized.length > 254){
                    return validationErrorArray(tagName,name,value,'length','more than 254 characters');
                }
            }
            if(type === 'number'){
                if(isNaN(sanitized)){
                    return validationErrorArray(tagName,name,value,'number','not a number');
                }
            }
            if(type === 'tel'){
                if(!PHONE_NUMBER_REGEX.test(sanitized)){
                    return validationErrorArray(tagName,name,value,'format','not standard formats');
                }
                if(sanitized.length < 10){
                    return validationErrorArray(tagName,name,value,'length','less than 10 characters');
                }
                if(sanitized.length > 12){
                    return validationErrorArray(tagName,name,value,'length','more than 12 characters');
                }
            }
            
        }
        if(tagName === 'SELECT'){
            if(sanitized.length < 1){
                return validationErrorArray(tagName,name,value,'length','less than 1 characters');
            }
            if(sanitized.length > 100){
                return validationErrorArray(tagName,name,value,'length','more than 100 characters');
            }

        }
        if(tagName === 'TEXTAREA'){
            if(sanitized.length < 10){
                return validationErrorArray(tagName,name,value,'length','less than 10 characters');
            }
            if(sanitized.length > 1000){
                return validationErrorArray(tagName,name,value,'length','more than 1000 characters');
            }
        }
        if(name === 'zipcode'){
            if(!ZIPCODE_REGEX.test(sanitized)){
                return validationErrorArray(tagName,name,value,'format','not standard zipcode format');
            }
        }
        if(name === 'state'){
            if(sanitized.length < 2){
                return validationErrorArray(tagName,name,value,'length','less than 1 character');
            }
        }
        if(name.includes('total') || name.includes('price')){
            if(!DECIMAL_REGEX.test(sanitized)){
                return validationErrorArray(tagName,name,value,'format','not decimal number format');
            }
        }
        if(sanitized !== value) data.set(name,sanitized)
    }
    return [null,data];
};

export function validateHTMLFormAddress(form,fieldNames){
    const formData = new FormData(form);
    const data = new FormData();

    for(let i = 0; i < fieldNames.length; i++){
        const fieldName = fieldNames[i];
        const value = formData.get(fieldName).trim();
        if(typeof value !== 'string'){
            return validationErrorArray('INPUT',fieldName,value,'type','not a string');
        }

        if(fieldName.includes('street')){
            if(value.length < 1){
                return validationErrorArray('INPUT',fieldName,value,'length','less than 1 chacters');
            }
            if(value.length > 100){
                return validationErrorArray('INPUT',fieldName,value,'length','more than 100 characters');
            }
        }
        if(fieldName.includes('city')){
            if(value.length < 1){
                return validationErrorArray('INPUT',fieldName,value,'length','less than 1 chacters');
            }
            if(value.length > 100){
                return validationErrorArray('INPUT',fieldName,value,'length','more than 100 characters');
            }
        }
        if(fieldName.includes('state')){
            if(value.length < 2){
                return validationErrorArray('SELECT',fieldName,value,'length','less than 2 characters');
            }
            if(value.length > 100){
                return validationErrorArray('SELECT',fieldName,value,'length','more than 100 characters');
            }
        }
        if(fieldName.includes('zipcode')){
            if(!ZIPCODE_REGEX.test(value)){
                return validationErrorArray('INPUT',fieldName,value,'format','not standard zipcode format');
            }
            if(value.length < 5){
                return validationErrorArray('INPUT',fieldName,value,'length','less than 1 chacters');
            }
        }
        data.set(fieldName,value);
    }
    return [null,data];
};
