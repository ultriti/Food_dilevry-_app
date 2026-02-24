const express = require("express")
const router = express.Router()
const {RegisterUser, userLogin, getUserProfile, updateUserProfile} = require("../Controller/User.controller")

router.post("/Register",RegisterUser)
router.post("/Login",userLogin)

router.get("/getUserProfile/:id",getUserProfile)
router.put("/updateUserProfile/:id",updateUserProfile)





module.exports = router;