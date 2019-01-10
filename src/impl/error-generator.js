
const codes = {
    notNull: 'NOT_NULL',
    invalidProperty: 'INVALID_PROPERTY',
    MaxValue: 'MAX_VALUE',
    MinValue: 'MIN_VALUE',
    MaxSize: 'MAX_SIZE',
    MinSize: 'MIN_SIZE',
    invalidValue: 'INVALID_VALUE'
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
module.exports.createNotNullMsg = prop => createErrorMsg(prop, 'Value is required', codes.notNull);
module.exports.createInvalidPropertyMsg = prop => createErrorMsg(prop, 'Property is not valid', codes.invalidProperty);
module.exports.createMaxValueMsg = prop => createErrorMsg(prop, 'Maximum value exceeded', codes.MaxValue);
module.exports.createMinValueMsg = prop => createErrorMsg(prop, 'Minimum value exceeded', codes.MinValue);
module.exports.createMaxSizeMsg = prop => createErrorMsg(prop, 'Value is too big', codes.MaxSize);
module.exports.createMinSizeMsg = prop => createErrorMsg(prop, 'Value is too short', codes.MinSize);
module.exports.createInvalidValue = prop => createErrorMsg(prop, 'Value is not valid', codes.invalidValue);
