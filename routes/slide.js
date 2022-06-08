const Slide = require("../models/Slide");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// POST SLIDE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newSlide = new Slide(req.body);

    try{
        const savedSlide = await newSlide.save();

        res.status(200).json(savedSlide);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE SLIDE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedSlide = await Slide.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedSlide);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE SLIDE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Slide.findByIdAndDelete(req.params.id);

        res.status(200).json("Slide has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET SLIDE
router.get("/find/:id", async (req, res) => {
    try{
        const slide = await Slide.findById(req.params.id);

        res.status(200).json(slide);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL SLIDES
router.get("/", async (req, res) => {
    const query = req.query.new;

    try{
        let slides = query? await Slide.find().sort({ _id: -1 }).limit(5) : await Slide.find();

        res.status(200).json(slides);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
