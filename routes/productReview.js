const ProductReview = require("../Models/ProductReview");

const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// ADD PRODUCT REVIEW
router.post("/:id", verifyTokenAndAdmin, async (req, res) => {
    const newReview = new ProductReview({ProductID: req.params.id, ...req.body});

    try{
        const savedPost = await newReview.save();

        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET RECENT PRODUCT REVIEWS
router.get("/newReviews", async (req, res) => {
    try{
        const newReviews = await ProductReview.find().sort({_id: -1}).limit(3);

        res.status(200).json(newReviews);
    }catch (err){
        res.status(500).json(err);
    }
});

// DELETE PRODUCT REVIEW
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await ProductReview.findByIdAndDelete(req.params.id);

        res.status(200).json("Review has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE PRODUCT REVIEW
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedProductReview = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedProductReview);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET PRODUCT REVIEW
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const productReview = await ProductReview.findById(req.params.id);

        res.status(200).json(productReview);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL PRODUCT REVIEWS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qRating = req.query.rating;

    try{
        let productReview;

        if(qNew){
            productReview = await ProductReview.find().sort({createdAt: -1}).limit(1);
        }else if(qRating){
            productReview = await ProductReview.find({rating: {
                $in: [qRating]
            }});
        }else{
            productReview = await ProductReview.find();
        }

        res.status(200).json(productReview);
    }catch(err){
        res.status(500).json(err);
    }
});


// GET ALL PRODUCT REVIEW FOR A PRODUCT
router.get("/:id", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try{
        const productReviews = await ProductReview.find({ProductID: req.params.id});

        res.status(200).json(productReviews);
    }catch (err){
        res.status(500).json(err);
    }
});

module.exports = router;
