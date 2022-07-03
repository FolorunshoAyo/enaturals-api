const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        reply: {type: String, required: true},
        CommentID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        },
        PostID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        status: {type: String, required: true, default: "pending"}
    },
    {timestamps: true}
);



module.exports = mongoose.model("Reply", ReplySchema);