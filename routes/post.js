const BlogPost = require("../Models/BlogPost");

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

// UPDATE POST
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

module.exports = router;
