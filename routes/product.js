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
        const fetchProducts = await Product.find();
        const findExactProduct = await Product.find({productName: req.body.productName, size: req.body.size});
        const findProductWithSimCategories = await Product.find({productName: req.body.productName, categories: req.body.categories});
        const findProductWithSizeandCategories = await Product.find({productName: req.body.productName, size: req.body.size, categories: req.body.categories});
        const isMajorProduct = await Product.find({productName: req.body.productName, majorProduct: req.body.majorProduct});

        if(fetchProducts.length !== 0){

            if(findExactProduct.length !== 0){
                res.status(401).json("A product with the same name and size exists");
            }else if(findProductWithSizeandCategories.length === 0){
                const savedProduct = await newProduct.save();
                res.status(200).json(savedProduct);
            }else if (findProductWithSimCategories.length === 0){
                res.status(401).json("The categories selected does not tally with the product name as gotten from other similar product");
            }else if (isMajorProduct.length === 0){
                res.status(401).json("This product is a major product");
            }else{
                const savedProduct = await newProduct.save();

                res.status(200).json(savedProduct);
            }

        }else{
            const savedProduct = await newProduct.save();

            res.status(200).json(savedProduct);
        }
    }catch(err){
        res.status(500).json(err);
    }
});

router.get("/newProducts", async (req, res) => {
    try{
        const newProducts = await Product.find().sort({_id: -1}).limit(3);

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
router.get("/find/:productName", async (req, res) => {
    try{
        const products = await Product.find({productName: req.params.productName});

        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});


//GET RELATED PRODUCT
router.get("/category/:productName", async (req, res) => {
    const categoriesParams = req.query;
    const retrievedTags = [];

    for (const key in categoriesParams){
        retrievedTags.push(categoriesParams[key]); 
    }

    try{
        const relatedProducts = await Product.find({ categories: { $in: retrievedTags } });

        // FILTER PRODUCT BY EXCEPTING THE PRODUCT NAME PARAM
        const filterProducts = relatedProducts.filter(relatedProduct => relatedProduct.productName !== req.params.productName);

        res.status(200).json(filterProducts);
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
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qMax = req.query.max;
    const qMin = req.query.min;
    const qSortBy = req.query.sortby;

    try{
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(4);
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
            products = await Product.find().sort({price: 1, discountPrice: 1});
        }else if(qSortBy === "desc"){
            products = await Product.find().sort({price: -1, discountPrice: -1});
        }
        else{
            products = await Product.find().sort({createdAt: -1});
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})

// Product stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date (date.setFullYear(date.getFullYear() - 1));

    try{
        const data = await Product.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            }, 
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);

        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
