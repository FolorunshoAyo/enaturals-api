const Address = require("../models/Address");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// POST Address
router.post("/", verifyToken, async (req, res) => {
    const addresses = await Address.find();
    try{

        if(addresses.length === 0){
            const newAddress = new Address({...req.body, isDefault: true});
            const savedAddress = await newAddress.save();

            res.status(200).json(savedAddress);
        }else{
            const newAddress = new Address(req.body);

            const savedAddress = await newAddress.save();

            res.status(200).json(savedAddress);
        }
        
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE Address
router.put("/:id", verifyToken, async (req, res) => {
    try{
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedAddress);
    }catch(err){
        res.status(500).json(err);
    }
});

// CHANGE DEFAULT ADDRESS
router.put("/changeDefault/:id", verifyToken, async (req, res) => {
    const formerDefaultAddressID = req.query.formerDefaultAddress;

    try{
        await Address.findByIdAndUpdate(formerDefaultAddressID, {
            $set: {isDefault: false}
        }, {new: true});

        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, {
            $set: {isDefault: true}
        }, {new: true});

        res.status(200).json(updatedAddress);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE Address
router.delete("/:id", verifyToken, async (req, res) => {
    try{
        await Address.findByIdAndDelete(req.params.id);

        res.status(200).json("Address has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET USER ADDRESS
router.get("/:id", async (req, res) => {
    try{
        const address = await Address.find({userId: req.params.id});

        res.status(200).json(address);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL Address
router.get("/", async (req, res) => {
    const query = req.query.new;

    try{
        let addresss = query? await Address.find().sort({ _id: -1 }).limit(5) : await Address.find();

        res.status(200).json(addresss);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET DEFAULT ADDRESS 
router.get("/default/:userID", async (req, res) => {

    try{
        let defaultAddresss = await Address.find({userId: req.params.userID, isDefault: true});

        res.status(200).json(defaultAddresss);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;
