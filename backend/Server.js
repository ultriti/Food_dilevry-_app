const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")

const userRoute = require("./router/User.route")

dotenv.config()

app.use(cors())
app.use(express.json())


app.use("/User",userRoute)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

