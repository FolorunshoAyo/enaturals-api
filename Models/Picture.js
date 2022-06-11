const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema(
    {
        picture: {type: String, required: true},
        caption: {type: String, required: true},
        tag: {type: String, required: true}
    },
    {timestamps: true}
);



module.exports = mongoose.model("Picture", PictureSchema);