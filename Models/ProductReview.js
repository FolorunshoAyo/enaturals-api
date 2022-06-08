const mongoose = require("mongoose");


const ProductReviewSchema = new mongoose.Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        fullname: {type: String, required: true},
        productImg: {type: String, required: true},
        email: {type: String, required: true},
        review: {type: String, required: true},
        status: {type: String, required: true, default: "pending"},
        rating: {type: Number, required: true},
        ProductID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);