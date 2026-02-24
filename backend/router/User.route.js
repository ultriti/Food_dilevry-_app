const express = require("express")
const router = express.Router()
const {RegisterUser, userLogin, getUserProfile} = require("../Controller/User.controller")

router.post("/Register",RegisterUser)
router.post("/Login",userLogin)

router.get("/getUserProfile/:id",getUserProfile)



module.exports = router;