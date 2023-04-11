const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type: String,
        default:"https://res.cloudinary.com/dm6m7j48j/image/upload/v1680860800/samples/people/boy-snow-hoodie.jpg"
    },
    resetToken : String,
    expireToken: Date, 
    followers:[{type:mongoose.Schema.Types.ObjectId,
        ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId,
        ref:'User'}]
})

const User=mongoose.model("User",userSchema)
module.exports = User;