const Product = require("../models/Product");

const { 
        verifyToken, 
        verifyTokenAndAuthorization,
        verifyTokenAndAdmin 
    } = require("./verifyToken");

const router = require("express").Router();

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();

        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

router.get("/newProducts", async (req, res) => {
    try{
        const newProducts = await Product.find().sort({_id: -1}).limit(2);

        res.status(200).json(newProducts);
    }catch (err){
        res.status(500).json(err);
    }
});

//UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json("Product has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


//GET PRODUCT
router.get("/find/:productName", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;

    try{
        const products = await Product.find({name: req.params.productName});

        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MAJOR PRODUCTS
router.get("/majorProducts", async (req, res) => {
    try{
        const majorProducts = await Product.find({majorProduct: true});

        res.status(200).json(majorProducts);
    }catch (err){
        res.status(500).json(err);
    }
});

// GET ALL PRODUCTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qMax = req.query.max;
    const qMin = req.query.min;
    const qSortBy = req.query.sortby

    try{
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(1);
        }else if(qCategory){
            products = await Product.find({categories: {
                $in: [qCategory]
            }});
        }else if(qMax && qMin){
            products = await Product.find({price: {
                $gte: qMax,
                $lte: qMin
            }});
        }else if(qSortBy === "asc"){
            products = await Product.find().sort({price: 1});
        }else if(qSortBy === "desc"){
            products = await Product.find().sort({price: -1});
        }
        else{
            products = await Product.find().sort({createdAt: -1});
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
