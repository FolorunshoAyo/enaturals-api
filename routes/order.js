const Order = require("../models/Order");

const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// CREATE ORDER
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();

        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json("Order has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


//GET ORDER
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const orders = await Order.find({userID: req.params.id});

        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET RECENT ORDERS
router.get("/newOrders", async (req, res) => {

    try{
        const newOrders = await Order.find().sort({_id: -1}).limit(5);

        res.status(200).json(newOrders);
    }catch (err){
        res.status(500).json(err);
    }
});

// GET ALL
router.get("/", verifyToken, async (req, res) => {
    try{
        const orders = await Order.find();
        
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME 
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    /* BUG */
    
    try{
       const income = await Order.aggregate([
           { $match: { createdAt: { $gte: previousMonth }, ...(productId && {
               products: { $elemMatch: { productId }}
           }) } },
           {
               $project: {
                   month: { $month: "$createdAt" },
                   sales: "$amount"
               }
           },
           {
               $group: {
                   _id: "$month",
                   total: { $sum: "$sales" }
               }
           }
       ]); 
       
       res.status(200).json(income);
    }catch(err){
        res.status(500).json(err);
    }

    /* BUG */
});

module.exports = router;


