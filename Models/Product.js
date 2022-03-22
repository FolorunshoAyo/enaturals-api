const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        img: { type: String, required: true },
        majorProduct: { type: Boolean, required: true },
        categories: { type: Array, required: true },
        size: {type: String, default: "No Size" },
        tag: {type: String, required: true },
        packingOptions: {type: Array, required: true },       
        price: {type: Number, required: true }                
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema);