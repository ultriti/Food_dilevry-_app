const express = require("express")


module.exports.RegisterUser = async (req,res,next) =>{

    const {Username,Email,Password} = req.body;

    if(!Username || !Email || !Password){
        return res.status(400).json({ error : [{message : "all Fields are required"}]})
    }
    


}