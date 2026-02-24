const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    userName : {
        type:String,
        require:true,
        minlength:[3,'first name must be greater than 3 letters'],
    },
    email : {
        type: String,
        require : true,
        minlength:[5,'password must be at least 5 characters long'],
        match:[/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password : {
        type : String,
        require : true ,
        minlength:[4,'password must be at least 4 characters long'],
    },
    role : {
        type : String,
        enum : ["USER", "VENDOR", "ADMIN", "SUPERADMIN", "DELIVERY_PARTNER"],
        require : true,
        default : "User"
    },
    phoneNumber : {
        type : Number,
        require : true
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    

})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;