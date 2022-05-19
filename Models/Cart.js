const mongoose = require("mongoose");


const CartSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1,
                }
            }
        ]               
    },
    {timestamps: true}
);

module.exports = mongoose.model("Cart", CartSchema);