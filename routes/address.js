const Address = require("../models/Address");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// POST Address
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const newAddress = new Address(req.body);

    try{
        const savedAddress = await newAddress.save();

        res.status(200).json(savedAddress);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE Address
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedAddress);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE Address
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
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
        const Address = await Address.find({userId: req.params.id});

        res.status(200).json(Address);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL Address
router.get("/", async (req, res) => {
    const query = req.query.new;

    try{
        let Addresss = query? await Address.find().sort({ _id: -1 }).limit(5) : await Address.find();

        res.status(200).json(Addresss);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
