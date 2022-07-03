const BlogPost = require("../Models/BlogPost");
const Comment = require("../models/Comment");
const Reply = require("../models/Reply");

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

// GET POST BASED ON CATEGORIES
router.get("/category/:categoryName", async (req, res) => {
    try{
        const fetchedBlogs = await BlogPost.find({ categories: { $all: req.params.categoryName } });

        res.status(200).json(fetchedBlogs);
    }catch(err){
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
        await Comment.deleteMany({PostID: req.params.id});
        await Reply.deleteMany({PostID: req.params.id});

        res.status(200).json("BlogPost has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET BLOG POST
router.get("/find/:blogTitle", async (req, res) => {
    try{
        const blogPost = await BlogPost.find({title: req.params.blogTitle});

        res.status(200).json(blogPost);
    }catch(err){
        res.status(500).json(err);
    }
});



// //GET POST
// router.get("/find/:id", async (req, res) => {
//     try{
//         const BlogPosts = await BlogPost.findById(req.params.id);

//         res.status(200).json(BlogPost);
//     }catch(err){
//         res.status(500).json(err);
//     }
// });

// GET ALL POSTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try{
        let BlogPosts;

        if(qNew){
            BlogPosts = await BlogPost.find().sort({createdAt: -1}).limit(2);
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
});

// GET RELATED POSTS
router.get("/relatedPosts/:blogTitle", async (req, res) => {
    const categoriesParams = req.query;
    const retrievedTags = [];

    for (const key in categoriesParams){
        retrievedTags.push(categoriesParams[key]); 
    }

    try{
        const relatedBlogs = await BlogPost.find({ categories: { $all: retrievedTags } }).sort({_id: -1}).limit(2);

        // FILTER PRODUCT BY EXCEPTING THE PRODUCT NAME PARAM
        const filterBlogs = relatedBlogs.filter(relatedBlog => relatedBlog.title !== req.params.blogTitle);

        res.status(200).json(filterBlogs);
    }catch(err){
        res.status(500).json(err);
    }
});

// SEARCH BLOG POSTS
router.get("/search", async (req, res) => {
    const searchQuery = req.query.q;

    try{
        const searchedBlogPost = await BlogPost.find({
            title: {
                $regex: searchQuery,
                $options: "i"
            }
        });

        res.status(200).json(searchedBlogPost);
    }catch(err){
        res.status(500).json(err);
    }
});

// COUNT ALL CATEGORIES OF POST
router.get("/countCategories", async (req, res) => {

    try{
        const allBlogPosts = await BlogPost.find();
        let allCategories = [];
        let resultObj = {};
        allBlogPosts.forEach(blogPost => {
            allCategories = [...allCategories, ...blogPost.categories];
        });

        const map = allCategories.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        const noOfEachMappedCategory = [...map.entries()];

        noOfEachMappedCategory.forEach((mappedCategory) => {
            resultObj = {...resultObj, [mappedCategory[0]]: mappedCategory[1]};
        });

        res.status(200).json(resultObj);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
