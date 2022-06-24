const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        ...req.body,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
        ).toString()
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch (err){
        res.status(500).json(err);
    }
});

//LOGIN 
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne(
            { 
                username: req.body.username,
            }
        );

        if(!user){
            return res.status(401).json("Incorrect Username or Password");
        };

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASS_SEC    
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.password){
            return res.status(401).json("Incorrect Username or Password");
        }

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC, {expiresIn: "3d"});

        const {password, ...others} = user._doc;

        return res.status(201).json({...others, accessToken});
    }catch (err){
        return res.status(500).json(err);
    }
});

//CHECK TOKEN VALIDITY
router.get("/", verifyToken, (req, res) => {
    res.status(201).json("Welcome back");
});

// CHANGE PASSWORD

router.post("/changepass", async (req, res) => {
    try{
        const user = await User.findOne({
            username: req.body.username
        });

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.formerPassword){
            return res.status(401).json("Incorrect password");
        }

        const updatedUser = await User.findByIdAndUpdate(user._id.toString(), {
            $set: {
                ...req.body, 
                password: CryptoJS.AES.encrypt(req.body.newPassword, process.env.PASS_SEC).toString()
            }
        }, {new: true});

        return res.status(200).json(updatedUser);
    }catch(error){
        return res.status(500).json(error);
    }
});

module.exports = router;
