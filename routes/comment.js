const Comment = require("../models/Comment");
const Reply = require("../models/Reply");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// GET POST COMMENTS
router.get("/:id", async (req, res) => {
    try{
        const comments = await Comment.find({PostID: req.params.id}).sort({_id: -1});

        // ONLY ALLOW AUTHORIZED COMMENTS
        // const filteredComments = comments.filter(comment => comment.status !== "pending");

        res.status(200).json(comments);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL COMMENTS
router.get("/", async (req, res) => {
    try{
        const comment = await Comment.find();

        res.status(200).json(comment);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET RECENT COMMENTS 
router.get("/new/comments", async (req, res) => {
    try{
        const newComments = await Comment.find().sort({ _id: -1 }).limit(3);

        // ONLY ALLOW AUTHORIZED COMMENTS
        // const filteredComments = newComments.filter(comment => comment.status !== "pending");

        res.status(200).json(newComments);
    }catch(error){
        res.status(500).json(error);
    }
});

// ADD COMMENT 
router.post("/:id", verifyToken, async (req, res) => {
    const newComment = new Comment({PostID: req.params.id, ...req.body});

    try{
        const savedComment = await newComment.save();

        res.status(200).json(savedComment);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE COMMENT 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedComment);
    }catch(err){
        res.status(500).json(err);
    }
});

//DELETE COMMENT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Comment.findByIdAndDelete(req.params.id);
        await Reply.deleteMany({CommentID: req.params.id});

        res.status(200).json("Comment and respective replies has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
