const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      minlength: [5, "Email must be at least 5 characters long"],
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["USER", "VENDOR", "ADMIN", "SUPERADMIN", "DELIVERY_PARTNER"],
      required: true,
      default: "USER",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;