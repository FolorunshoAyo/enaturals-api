const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
    {
        testifierImg: {type: String, required: true},
        testifierName: {type: String, required: true},
        testimony: {type: String, required: true}
    },
    {timestamps: true}
);



module.exports = mongoose.model("Testimonial", TestimonialSchema);