const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true },
        shortDesc: {type: String, required: true},
        desc: { type: String, required: true },
        img: { type: String, required: true },
        majorProduct: { type: Boolean, required: true },
        categories: { type: Array, required: true },
        size: {type: String, required: true},
        packingOptions: {type: Array},
        inStock: {type: Boolean, required: true},
        discount: {type: Boolean, default: false},       
        price: {type: Number, required: true },
        discountPrice: { type: Number, default: 0 }                
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema);