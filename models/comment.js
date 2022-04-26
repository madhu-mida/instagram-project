const mongoose = require("../config/db");
const User = require("./user");

// Use JS destructuring syntax to unpack properties from mongoose
const { Schema, model } = mongoose;


// User Schema
const commentSchema = new Schema({
    user: {
        type: Object
    },
    comment: {
        type: String
    },
    createdAt: {
        type: Date
    }
})
// User Model and exporting model
const Comment = model("Comment", commentSchema);
module.exports = Comment;