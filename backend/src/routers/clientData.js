const express = require("express")
const router = new express.Router()
const cData = require("../model/clientData")
const regData = require("../model/regConn")


router.get("", (req, res) => {
    res.send("hello this is the express home page ")
})

router.post("/clientdata", async (req, res) => {
    // console.log(req.body)
    const { name, mobile, email, subject, message } = req.body

    if (!name || !mobile || !email || !subject || !message) {
        return res.status(422).json({ error: "plz fill the fields properly" })
    }
    try {


        const user = new cData({ name, mobile, email, subject, message })
        const createUser = await user.save()
        res.send(createUser)

    }
    catch (e) {
        console.log(e)
        return res.sendStatus(400).send(e)
    }

})

router.post("/register", async (req, res) => {

    const { name, number, email, password, cPassword } = req.body

    if (!name || !number || !email || !password || !cPassword) {
        // console.log(req.body)
        return res.status(422).json({ error: "plz fill the fields properly" })
    }
    try {

        if (password === cPassword) {
            const user = new regData({ name, number, email, password, cPassword })

            const registered = await user.save()
            console.log("the success part 2" + registered)
            res.send(registered)

        }
        else {
            res.send("password are not matching")
        }
    }


    catch (err) {
        console.log(err)
    }

}
)

router.post("/login", async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "plz fill the fields properly" })
    }

    try {

        const useremail = await regData.findOne({ email: email })
        const userpassword = useremail.password


        if (password === userpassword) {

            return res.status(201).json({ success: "login successfully" })

        }
        else {
            return res.status(422).json({ error: "invalid details" })



        }

    } catch (error) {
        console.log(error)
    }

})

module.exports = router