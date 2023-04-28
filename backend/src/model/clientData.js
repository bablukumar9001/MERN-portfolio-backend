const mongoose = require("mongoose")
const validator = require('validator')
const contactSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        min: 10,
    },
    email: {
        type: String,
        required: true,
        Validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is Required")
            }
        }

    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true

    },
    // messages: [{
    //     message: {

    //         type: String,
    //         required: true,
    //     }
    // }],
    date: {
        type: Date,
        default: Date.now
    }



})




const contactData = new mongoose.model("contactData", contactSchema)

module.exports = contactData
