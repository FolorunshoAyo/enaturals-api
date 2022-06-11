const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
    {
        video: {type: String, required: true},
        caption: {type: String, required: true}
    },
    {timestamps: true}
);



module.exports = mongoose.model("Video", VideoSchema);