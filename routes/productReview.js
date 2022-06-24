const ProductReview = require("../Models/ProductReview");

const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// ADD PRODUCT REVIEW
router.post("/:id", verifyToken, async (req, res) => {
    const newReview = new ProductReview({ProductID: req.params.id, ...req.body});

    try{
        const savedReview = await newReview.save();

        res.status(200).json(savedReview);
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
        const updatedProductReview = await ProductReview.findByIdAndUpdate(req.params.id, {
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

// FILTER PRODUCT REVIEWS
router.get("/filter", verifyTokenAndAdmin, async (req, res) => {
    const qStartDate = req.query.startDate;
    const qEndDate = req.query.endDate;
    const qRating = req.query.rating;
    const qStatus = req.query.status;

    try{
        let queriedProductReview;

        if(qStartDate && qEndDate && qRating && qStatus){
            queriedProductReview = await ProductReview.find({
                createdAt: {
                    $gte: new Date(new Date(qStartDate).setHours(00, 00, 00)).toISOString(),
                    $lt: new Date(new Date(qEndDate).setHours(23, 59, 59)).toISOString()
                },
                rating: qRating,
                status: qStatus
            });
        }else if (qStartDate && qEndDate && qRating){
            queriedProductReview = await ProductReview.find({
                createdAt: {
                    $gte: new Date(new Date(qStartDate).setHours(00, 00, 00)).toISOString(),
                    $lt: new Date(new Date(qEndDate).setHours(23, 59, 59)).toISOString()
                },
                rating: qRating
            });
        }else if(qStartDate && qEndDate && qStatus){
            queriedProductReview = await ProductReview.find({
                createdAt: {
                    $gte: new Date(new Date(qStartDate).setHours(00, 00, 00)).toISOString(),
                    $lt: new Date(new Date(qEndDate).setHours(23, 59, 59)).toISOString()
                },
                status: qStatus
            });
        }else if(qRating && qStatus){
            queriedProductReview = await ProductReview.find({
                qRating: qRating,
                status: qStatus
            });
        }else if(qStartDate && qEndDate){
            queriedProductReview = await ProductReview.find({
                createdAt: {
                    $gte: new Date(new Date(qStartDate).setHours(00, 00, 00)).toISOString(),
                    $lt: new Date(new Date(qEndDate).setHours(23, 59, 59)).toISOString()
                }
            });
        }else if (qRating){
            queriedProductReview = await ProductReview.find({
                rating: qRating
            });
        }else if(qStatus){
            queriedProductReview = await ProductReview.find({
                status: qStatus
            });
        }

        res.status(200).json(queriedProductReview);
    }catch(err){
        res.status(500).json(err);
    }
});


// SEARCH PRODUCT REVIEWS
router.get("/search", verifyTokenAndAdmin, async (req, res) => {
    const searchQuery = req.query.q;

    try{
        const searchedProductReview = await ProductReview.find({
            fullname: {
                $regex: searchQuery,
                $options: "i"
            }
        });

        res.status(200).json(searchedProductReview);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL PRODUCT REVIEW FOR A PRODUCT
router.get("/:id", async (req, res) => {
    try{
        const productReviews = await ProductReview.find({ProductID: req.params.id});

        res.status(200).json(productReviews);
    }catch (err){
        res.status(500).json(err);
    }
});


module.exports = router;
