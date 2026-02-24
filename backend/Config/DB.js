const mongoose = require("mongoose")

const DbConnect = ()=>{
  mongoose.connect("mongodb://localhost:27017/Food_Delivery_app")
  .then(()=>{console.log("Connected to MongoDB")})
  .catch((err)=>{console.log("Error connecting to MongoDB", err)})
}

module.exports = DbConnect;
