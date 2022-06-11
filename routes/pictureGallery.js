const Picture = require("../models/Picture");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// POST Picture
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newPicture = new Picture(req.body);

    try{
        const savedPicture = await newPicture.save();

        res.status(200).json(savedPicture);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE Picture
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Picture.findByIdAndDelete(req.params.id);

        res.status(200).json("Picture has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET Picture
router.get("/find/:id", async (req, res) => {
    try{
        const Picture = await Picture.findById(req.params.id);

        res.status(200).json(Picture);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL Pictures
router.get("/", async (req, res) => {
    const query = req.query.new;

    try{
        let Pictures = query? await Picture.find().sort({ _id: -1 }).limit(5) : await Picture.find();

        res.status(200).json(Pictures);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
