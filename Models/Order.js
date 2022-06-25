const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        products: [
            {
                product: {
                    productName: {type: String, required: true},
                    productImg: {type: String, required: true},
                    productSize: {type: String, required: true}
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        amount: {type: Number, required: true},
        status: {type: String, default: "pending"}              
    },
    {timestamps: true}
);

module.exports = mongoose.model("Order", OrderSchema);