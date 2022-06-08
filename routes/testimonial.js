const Testimonial = require("../models/Testimonial");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// POST Testimonial
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newTestimonial = new Testimonial(req.body);

    try{
        const savedTestimonial = await newTestimonial.save();

        res.status(200).json(savedTestimonial);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE Testimonial
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedTestimonial);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE Testimonial
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Testimonial.findByIdAndDelete(req.params.id);

        res.status(200).json("Testimonial has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET Testimonial
router.get("/find/:id", async (req, res) => {
    try{
        const Testimonial = await Testimonial.findById(req.params.id);

        res.status(200).json(Testimonial);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL TestimonialS
router.get("/", async (req, res) => {
    const query = req.query.new;

    try{
        let Testimonials = query? await Testimonial.find().sort({ _id: -1 }).limit(5) : await Testimonial.find();

        res.status(200).json(Testimonials);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
