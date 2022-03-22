const Cart = require("../models/Cart");
const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// CREATE Cart
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();

        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE CART
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE CART
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json("Product has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


//GET CART
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    const query = req.query.new;

    try{
        const cart = await Product.findOne({userId: req.params.id});

        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const carts = await Cart.find();
        
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;

