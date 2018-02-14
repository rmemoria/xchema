
const codes = {
    valueRequired: 'VALUE_REQUIRED',
    invalidProperty: 'INVALID_PROPERTY',
    invalidType: 'INVALID_TYPE',
    MaxValue: 'MAX_VALUE',
    MinValue: 'MIN_VALUE',
    MaxSize: 'MAX_SIZE',
    MinSize: 'MIN_SIZE'
};

function createValueRequiredMsg(prop) {
    return createErrorMsg(prop, null, codes.valueRequired);
}

function createInvalidTypeMsg(prop) {
    return createErrorMsg(prop, null, codes.invalidType);
}

function createInvalidPropertyMsg(prop) {
    return createErrorMsg(prop, null, codes.invalidProperty);
}


function createErrorMsg(prop, msg, code) {
    return {
        property: prop,
        message: msg,
        code: code ? code : null
    };
}

module.exports.codes = codes;
module.exports.createErrorMsg = createErrorMsg;
module.exports.createValueRequiredMsg = createValueRequiredMsg;
module.exports.createInvalidTypeMsg = createInvalidTypeMsg;
module.exports.createInvalidPropertyMsg = createInvalidPropertyMsg;
module.exports.createMaxValueMsg = prop => createErrorMsg(prop, null, codes.MaxValue);
module.exports.createMinValueMsg = prop => createErrorMsg(prop, null, codes.MinValue);
module.exports.createMaxSizeMsg = prop => createErrorMsg(prop, null, codes.MaxSize);
module.exports.createMinSizeMsg = prop => createErrorMsg(prop, null, codes.MinSize);
