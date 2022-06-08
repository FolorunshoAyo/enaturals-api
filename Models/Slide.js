const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema(
    {
        slideImg: {type: String, required: true},
        title: {type: String, required: true},
        desc: {type: String, required: true}
    },
    {timestamps: true}
);



module.exports = mongoose.model("Slide", SlideSchema);