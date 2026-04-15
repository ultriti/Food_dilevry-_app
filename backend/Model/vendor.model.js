const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    // Link to your User (required, only VENDOR‑type users become vendors)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Vendor metadata (can be used for admin panel / dashboard)
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: "",
    },
    gstNumber: {
      type: String,
      trim: true,
      default: "",
    },
    panNumber: {
      type: String,
      trim: true,
      default: "",
    },

    // Business address
    businessAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      coordinates: [Number], // [lng, lat]
    },

    // Bank info for payout (not strictly for auth)
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifsc: String,
      upiId: String,
    },

    // Status & contracts
    isVerified: {
      type: Boolean,
      default: false, // needs admin / onboarding approval
    },
    verificationDocumentUrl: String,
    contractSigned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "SUSPENDED", "DELISTED"],
      default: "PENDING",
    },

    // Stats (can be calculated from Restaurant + Order models if you have them)
    totalCompletedOrders: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },

    // Sometimes you want a vendor to run multiple restaurants
    // This enforces that each vendor can have multiple restaurants
    // (if you change your current 1‑vendor‑to‑1‑restaurant logic later)
    restaurantIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
  },
  { timestamps: true }
);

// Index for fast lookup by userId or status
vendorSchema.index({ userId: 1 });
vendorSchema.index({ status: 1 });

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;