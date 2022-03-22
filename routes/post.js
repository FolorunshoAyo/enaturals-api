const Post = require("../Models/Post");
const Comment = require("../Models/Comment");
const Reply = require("../Models/Reply");

const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// CREATE POST
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newPost = new Post(req.body);

    try{
        const savedPost = await newPost.save();

        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET RECENT POSTS
router.get("/newPosts", async (req, res) => {
    try{
        const newPosts = await Post.find().sort({_id: -1}).limit(3);

        res.status(200).json(newPosts);
    }catch (err){
        res.status(500).json(err);
    }
});

//UPDATE POST
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE POST
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json("Post has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


//GET POST
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const Posts = await Post.findById(req.params.id);

        res.status(200).json(Post);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL POSTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try{
        let Posts;

        if(qNew){
            Posts = await Post.find().sort({createdAt: -1}).limit(1);
        }else if(qCategory){
            Posts = await Post.find({categories: {
                $in: [qCategory]
            }});
        }else{
            Posts = await Post.find();
        }

        res.status(200).json(Posts);
    }catch(err){
        res.status(500).json(err);
    }
})

// GET POST COMMENTS
router.get("/:id/comment", async (req, res) => {
    try{
        const comment = await Comment.findById(req.params.id);

        res.status(200).json(comment);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL COMMENTS
router.get("/comments", async (req, res) => {
    try{
        const comment = await Comment.find();

        res.status(200).json(comment);
    }catch(err){
        res.status(500).json(err);
    }
});

// ADD COMMENT 
router.post("/:id/comment", verifyTokenAndAuthorization, async (req, res) => {
    const newComment = new Comment({PostID: req.params.id, ...req.body});

    try{
        const savedComment = await newComment.save();

        res.status(200).json(savedComment);
    }catch(err){
        res.status(500).json(err);
    }
});

//DELETE COMMENT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json("Comment has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

// ADD REPLY 
router.post("/:id/reply", verifyTokenAndAuthorization, async (req, res) => {
    const newReply = new Reply({CommentID: req.params.id, ...req.body});

    try {
        const savedReply = await newReply.save();

        res.status(200).json(savedReply);
    }
    catch(err){
        res.status(500).json(err);
    }
});


// GET REPLIES
router.get("/:id/reply", async (req, res) => {
    try{
        const Replies = await Reply.find({CommentID: req.params.id});

        res.status(200).json(Replies);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
