const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: [Number] // [lng, lat]
    },
    phoneNumber: { type: String, required: true },
    cuisineType: [String],
    deliveryTime: { type: Number, default: 30 }, // minutes
    priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'] },
    images: [String],
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorName: String,
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    menuItems: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        price: Number,
        available: { type: Boolean, default: true }
    }],
    createdAt: { type: Date, default: Date.now }
});


const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;