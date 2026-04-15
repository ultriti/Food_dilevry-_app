const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
const DbConnect = require("./Config/DB")
const userRoute = require("./router/User.route")
const restaurantRoute = require("./router/Restaurant.route")

dotenv.config()

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
   credentials: true 
}));

app.use(express.json())
DbConnect()

app.use("/api/User",userRoute)
app.use("/api/Restaurant",restaurantRoute)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

