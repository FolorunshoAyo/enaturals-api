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
        price: {type: Number, required: true }                
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema);