const Comment = require("../models/Comment");
const Reply = require("../models/Reply");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// ADD REPLY 
router.post("/:id", verifyToken, async (req, res) => {
    const postID = req.query.postID;

    const newReply = new Reply({CommentID: req.params.id, postID, ...req.body});

    try {
        const savedReply = await newReply.save();

        res.status(200).json(savedReply);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// UPDATE REPLY
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    const commentID = req.query.commentID;
    try{
        const fetchedComment = await Comment.find({_id: commentID});

        if(fetchedComment[0].status === "pending"){
            return res.status(401).json("The comment is still pending");
        }

        const updatedReply = await Reply.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedReply);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET REPLYS FOR COMMENTS
router.get("/:id", async (req, res) => {
    try{
        const replies = await Reply.find({CommentID: req.params.id}).sort({_id: -1});

        res.status(200).json(replies);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL REPLIES
router.get("/", async (req, res) => {
    const query = req.query.new;

    try{
        let Replys = query? await Reply.find().sort({ _id: -1 }).limit(5) : await Reply.find();

        res.status(200).json(Replys);
    }catch(err){
        res.status(500).json(err);
    }
})

//DELETE REPLY
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Reply.findByIdAndDelete(req.params.id);

        res.status(200).json("Reply has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
