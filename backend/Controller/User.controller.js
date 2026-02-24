const express = require("express")
const userModel = require("../Model/user.model")


// register user route
module.exports.RegisterUser = async (req, res, next) => {

    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
        return res.status(400).json({ error: [{ message: "all Fields are required" }] })
    }

    try {
        const user = await userModel.findOne({ email: Email })

        if (user) {
            return res.status(400).json({ error: [{ message: "user already exist" }] })
        }

        const newUser = new userModel({
            email: Email,
            password: Password,
            userName: Username,
            role: "USER",
            phoneNumber: req.body.phoneNumber || null


        })
        await newUser.save()

        return res.status(201).json({ message: "user registered successfully" })







    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: [{ message: "internal server error" }] })

    }



}


// user login register
module.exports.userLogin = async (req, res, next) => {

    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ error: [{ message: "all Fields are required" }] })
    }

    try {
        const user = await userModel.findOne({ email: Email })

        if (!user) {
            return res.status(400).json({ error: [{ message: "user not found" }] })
        }

        if (user.password !== Password.toString()) {
            return res.status(400).json({ error: [{ message: "incorrect password" }] })
        }

        return res.status(200).json({ message: "login successful", user })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: [{ message: "internal server error" }] })
    }
}

// get user profile
module.exports.getUserProfile = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: [{ message: "user not found" }] });
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: [{ message: "internal server error" }] });
    }
}

// update user profile
module.exports.updateUserProfile = async (req, res, next) => {
    const userId = req.params.id;
    const { Username, Email, Password, phoneNumber } = req.body;

    try {
        const updatedUser = await userModel.findById(userId);

        if (!updatedUser) {
            return res.status(404).json({ error: [{ message: "user not found" }] });
        }

        if (Username) {
            if (updatedUser) { updatedUser.userName = Username };
        }
        if (Email) {
            if (updatedUser) { updatedUser.email = Email };
        }
        if (Password) {
            if (updatedUser) { updatedUser.password = Password };
        }
        if (phoneNumber) {
            if (updatedUser) { updatedUser.phoneNumber = phoneNumber };
        }

        await updatedUser.save();
        return res.status(200).json({ message: "user updated successfully", user: updatedUser });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: [{ message: "internal server error" }] });
    }
}