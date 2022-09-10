
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const postSchema = new mongoose.Schema({
    user : {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    Title : { 
        type: String, 
        required: true, 
        trim: true 
    },
    Description: {
        type: String, 
        required: true, 
        trim: true 
    },
    unlike : [{
        type: String
    }],
    like : [{
        type: String
    }],
    Time : {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
      type : Date,
      default : null
    }, 
} ,
 {timestamps : true})

module.exports = mongoose.model("posts" , postSchema);