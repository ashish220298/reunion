const mongoose = require("mongoose")

const valid = function (value) {
    if (typeof value === "undefined" || value === null ) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const validObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.valid(ObjectId)
}

const validString= function (value) {
    const nothingNumber =/^[^0-9]+$/g    //////regexforvalidation                             
    if(typeof value !== 'string') return false
    if(nothingNumber.test(value) === false) return false
    return true;
}


module.exports.valid = valid;
module.exports.validString=validString;
module.exports.validObjectId=validObjectId;