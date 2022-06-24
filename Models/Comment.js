const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        comment: {type: String, required: true},
        status: {type: String, required: true, default: "pending"},
        PostID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        postTitle: {type: String, required: true}
    },
    {timestamps: true}
);



module.exports = mongoose.model("Comment", CommentSchema);