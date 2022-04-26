const mongoose = require("../config/db")

// Use JS destructuring syntax to unpack properties from mongoose
const { Schema, model } = mongoose;


// User Schema
const postSchema = new Schema({
    userId: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    caption: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    like: {
        type: Number
    },
    comment: {
        type: Array
    },
    createdAt: {
        type: Date
    }
})
// User Model and exporting model
const Post = model("Post", postSchema);
module.exports = Post;