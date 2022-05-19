const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true},
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        phoneno: {type: String, required: true},
        gender: {type: String },
        dob: { type: String },
        password: { type: String },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);