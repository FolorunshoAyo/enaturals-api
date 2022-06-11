const Video = require("../models/Video");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// POST Video
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newVideo = new Video(req.body);

    try{
        const savedVideo = await newVideo.save();

        res.status(200).json(savedVideo);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE Video
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Video.findByIdAndDelete(req.params.id);

        res.status(200).json("Video has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET Video
router.get("/find/:id", async (req, res) => {
    try{
        const Video = await Video.findById(req.params.id);

        res.status(200).json(Video);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL VideoS
router.get("/", async (req, res) => {
    const query = req.query.new;

    try{
        let Videos = query? await Video.find().sort({ _id: -1 }).limit(5) : await Video.find();

        res.status(200).json(Videos);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
