const mongoose = require("mongoose");


const AddressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        addresses: [
            {
                address: {
                    firstName: {type: String,required: true},
                    lastName: {type: String, required: true},
                    phoneNo: {type: String, required: true},
                    addPhoneNo: {type: String},
                    additionalInfo:{type: String},
                    addressNo: {type: String, required: true},
                    address: {type: String, required: true},
                    region: {type: String, required: true},
                    city: {type: String, required: true},
                }
            }
        ]         
    },
    {timestamps: true}
);

module.exports = mongoose.model("Address", AddressSchema);