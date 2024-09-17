const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        content: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            required: false
        },
        authorName: {
            type: String,
            required: true
        },
        categories: {
            type: Array,
            required: false
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("BlogPost", BlogPostSchema);