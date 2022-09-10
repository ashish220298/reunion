const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new mongoose.Schema({
    postId: {
        type: ObjectId,
        ref: 'posts',
        required: true
    },
    user : {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    comment: { 
        type: String, 
        required: true, 
        trim: true 
    },
} , {timestamps : true})

module.exports = mongoose.model("comment" , commentSchema)