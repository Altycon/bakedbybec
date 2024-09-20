export function sanitizeInput(inputString){
    if(typeof inputString !== 'string') return inputString;
    inputString = inputString.trim();
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
    };
    // Replace any characters that could be used in an XSS attack
    inputString = inputString.replace(/[&<>"'/`=]/g, function(match) {
        return map[match];
    });
    // Handle non-printable and control characters
    inputString = inputString.replace(/[\x00-\x1F\x7F]/g, ''); 
    // remove or escape any non-ASCII characters
    inputString = inputString.replace(/[^\x20-\x7E]/g, ''); 
    return inputString;
};
export function sanitizeInputs(inputs){
    if(inputs instanceof Array){
        return inputs.map( inputs => sanitizeInput(inputs));
    }else{
        return sanitizeInput(inputs);
    }
};