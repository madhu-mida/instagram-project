const mongoose = require("../config/db")

// Use JS destructuring syntax to unpack properties from mongoose
const { Schema, model } = mongoose;


// User Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    fullname: {
        type: String,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
})
// User Model and exporting model
const User = model("User", userSchema);
module.exports = User;