const mongoose = require("mongoose")

const registerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        reuired: true,


    },
    password: {
        type: String,
        reuired: true,


    },
    cPassword: {
        type: String,
        reuired: true,


    },
    date: {
        type: Date,
        default: Date.now
    }


})

const regdata = new mongoose.model("regdata", registerSchema)

module.exports = regdata