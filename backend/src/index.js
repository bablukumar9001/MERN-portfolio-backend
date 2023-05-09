const express = require('express')
require('dotenv').config()
require("./db/conn")
const clientRouter = require("./routers/clientData")
const cors = require("cors");



const app = express()
const PORT = process.env.PORT || 7000
app.use(express.json())
app.use(clientRouter)
// const cors = require('cors');
// const corsOpts = {
//     origin: '*',
//     credentials: true,
// };
// app.use(cors(corsOpts));


app.listen(PORT, () => {
    console.group(`this app listning on  port no. ${PORT}`)
})

