const express = require('express')
require('dotenv').config()
require("./db/conn")
const clientRouter = require("./routers/clientData")

const app = express()
const port = 7000
app.use(express.json())
app.use(clientRouter)



app.listen(port, () => {
    console.group(`this app listning on  port no. ${port}`)
})

