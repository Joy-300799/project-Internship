const mongoose = require('mongoose');

//validation checking function 
const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidObjectId = function(ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
module.exports.isValid = isValid
module.exports.isValidRequestBody = isValidRequestBody
module.exports.isValidObjectId = isValidObjectId