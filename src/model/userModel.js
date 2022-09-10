const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    userName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        trim: true, 
        required: true,  
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    followers:[{
        type: String
    }],
    following: [{
        type: String
    }],

} , 

{timestamps : true})

module.exports = mongoose.model("user" , userSchema)