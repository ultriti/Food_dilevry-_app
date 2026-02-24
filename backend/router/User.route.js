const express = require("express")
const router = express.Router()
const {RegisterUser} = require("../Controller/User.controller")

router.post("/Register",RegisterUser)

module.exports = router;