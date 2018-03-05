
const codes = {
    valueRequired: 'VALUE_REQUIRED',
    invalidProperty: 'INVALID_PROPERTY',
    invalidType: 'INVALID_TYPE',
    MaxValue: 'MAX_VALUE',
    MinValue: 'MIN_VALUE',
    MaxSize: 'MAX_SIZE',
    MinSize: 'MIN_SIZE'
};


function createErrorMsg(prop, msg, code) {
    return {
        property: prop,
        message: msg,
        code: code ? code : null
    };
}

module.exports.codes = codes;
module.exports.createErrorMsg = createErrorMsg;
module.exports.createErrorByCode = (prop, code) => createErrorMsg(prop, null, code);
module.exports.createValueRequiredMsg = prop => createErrorMsg(prop, null, codes.valueRequired);
module.exports.createInvalidTypeMsg = prop => createErrorMsg(prop, null, codes.invalidType);
module.exports.createInvalidPropertyMsg = prop => createErrorMsg(prop, null, codes.invalidProperty);
module.exports.createMaxValueMsg = prop => createErrorMsg(prop, null, codes.MaxValue);
module.exports.createMinValueMsg = prop => createErrorMsg(prop, null, codes.MinValue);
module.exports.createMaxSizeMsg = prop => createErrorMsg(prop, null, codes.MaxSize);
module.exports.createMinSizeMsg = prop => createErrorMsg(prop, null, codes.MinSize);
