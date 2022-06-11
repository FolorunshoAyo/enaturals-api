const BlogPost = require("../Models/BlogPost");
const Comment = require("../Models/Comment");
const Reply = require("../Models/Reply");

const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// CREATE POST
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newBlogPost = new BlogPost(req.body);

    try{
        const savedBlogPost = await newBlogPost.save();

        res.status(200).json(savedBlogPost);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET RECENT POSTS
router.get("/newBlogPosts", async (req, res) => {
    try{
        const newBlogPosts = await BlogPost.find().sort({_id: -1}).limit(3);

        res.status(200).json(newBlogPosts);
    }catch (err){
        res.status(500).json(err);
    }
});

//UPDATE POST
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedBlogPost);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE POST
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await BlogPost.findByIdAndDelete(req.params.id);

        res.status(200).json("BlogPost has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


//GET POST
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const BlogPosts = await BlogPost.findById(req.params.id);

        res.status(200).json(BlogPost);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL POSTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try{
        let BlogPosts;

        if(qNew){
            BlogPosts = await BlogPost.find().sort({createdAt: -1}).limit(1);
        }else if(qCategory){
            BlogPosts = await BlogPost.find({categories: {
                $in: [qCategory]
            }});
        }else{
            BlogPosts = await BlogPost.find();
        }

        res.status(200).json(BlogPosts);
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
    const newComment = new Comment({BlogPostID: req.params.id, ...req.body});

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
