const Restaurant = require("../Model/restaurant.model");
const User = require("../Model/user.model");
const MenuItem = require("../Model/menu.model");

// ✅ CREATE Restaurant (Vendor creates their restaurant)
// exports.createRestaurant = async (req, res) => {
//   console.log("createRestaurant called with body:", req.body);

//   const { name, description, address, phoneNumber, cuisineType, deliveryTime, priceRange, images } = req.body;
//   const vendorId = req.user?.userId || req.params.vendorId;

//   if (!name || !address?.street || !phoneNumber || !cuisineType) {
//     return res.status(400).json({
//       error: [{ message: "Name, address (street), phone, and cuisine are required." }],
//     });
//   }

//   try {
//     // const vendor = await User.findById(vendorId);
//     // if (!vendor || vendor.role !== "VENDOR") {
//     //   return res.status(403).json({
//     //     error: [{ message: "Vendor access required." }],
//     //   });
//     // }

//     const existingRestaurant = await Restaurant.findOne({ vendorId });
//     if (existingRestaurant) {
//       return res.status(400).json({
//         error: [{ message: "Vendor already has a restaurant." }],
//       });
//     }

//     const newRestaurant = new Restaurant({
//       name,
//       description,
//       address: {
//         street: address.street,
//         city: address.city,
//         state: address.state,
//         pincode: address.pincode,
//         coordinates: address.coordinates || [],
//       },
//       phoneNumber,
//       cuisineType: String(cuisineType)
//         .split(",")
//         .map((c) => c.trim())
//         .filter(Boolean),
//       deliveryTime: parseInt(deliveryTime, 10) || 30,
//       priceRange: priceRange || "$$",
//       images: Array.isArray(images)
//         ? images
//         : (images || "")
//             .split(",")
//             .map((img) => img.trim())
//             .filter(Boolean),
//       vendorId,
//       vendorName: vendor.userName,
//       isActive: true,
//       rating: 0,
//       reviewCount: 0,
//       menuItems: [], // will be populated later via MenuItem
//     });

//     await newRestaurant.save();

//     return res.status(201).json({
//       message: "Restaurant created successfully.",
//       restaurant: newRestaurant,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       error: [{ message: "Internal server error." }],
//     });
//   }
// };

exports.createRestaurant = async (req, res) => {
  console.log("createRestaurant called with body:", req.body);

  const {
    name,
    description,
    address,
    phoneNumber,
    cuisineType,
    deliveryTime,
    priceRange,
    images,
  } = req.body;

  const vendorId = req.user?.userId || req.params.vendorId || '69df7660e019ab82a10606ed';

  if (!vendorId) {
    return res.status(401).json({
      errors: [{ message: "Unauthorized: vendor ID is required." }],
    });
  }

  if (!name || !phoneNumber || !cuisineType) {
    return res.status(400).json({
      errors: [{ message: "Name, phone, and cuisine are required." }],
    });
  }

  let parsedAddress = address;

  if (typeof address === "string") {
    try {
      parsedAddress = JSON.parse(address);
    } catch (err) {
      return res.status(400).json({
        errors: [{ message: "Address must be a valid object." }],
      });
    }
  }

  if (!parsedAddress?.street) {
    return res.status(400).json({
      errors: [{ message: "Address street is required." }],
    });
  }

  try {
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        errors: [{ message: "Vendor not found." }],
      });
    }

    if (vendor.role !== "VENDOR") {
      return res.status(403).json({
        errors: [{ message: "Vendor access required." }],
      });
    }

    const existingRestaurant = await Restaurant.findOne({ vendorId });
    if (existingRestaurant) {
      return res.status(400).json({
        errors: [{ message: "Vendor already has a restaurant." }],
      });
    }

    const newRestaurant = new Restaurant({
      name,
      description,
      address: {
        street: parsedAddress.street,
        city: parsedAddress.city || "",
        state: parsedAddress.state || "",
        pincode: parsedAddress.pincode || "",
        coordinates: parsedAddress.coordinates || [],
      },
      phoneNumber,
      cuisineType: String(cuisineType)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      deliveryTime: parseInt(deliveryTime, 10) || 30,
      priceRange: priceRange || "$$",
      images: Array.isArray(images)
        ? images
        : String(images || "")
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean),
      vendorId,
      vendorName: vendor.userName,
      isActive: true,
      rating: 0,
      reviewCount: 0,
      menuItems: [],
    });

    await newRestaurant.save();

    return res.status(201).json({
      message: "Restaurant created successfully.",
      restaurant: newRestaurant,
    });
  } catch (err) {
    console.error("createRestaurant error:", err);
    return res.status(500).json({
      errors: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET All Restaurants (customer view)
exports.getAllRestaurants = async (req, res) => {
  const { cuisine, priceRange, city, page = 1, limit = 10 } = req.query;
  const filters = {};

  if (cuisine) {
    filters.cuisineType = { $in: String(cuisine).split(",").map((c) => c.trim()) };
  }
  if (priceRange) {
    filters.priceRange = priceRange;
  }
  if (city) {
    filters["address.city"] = city;
  }

  try {
    const restaurants = await Restaurant.find(filters)
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .populate("vendorId", "userName phoneNumber");

    const total = await Restaurant.countDocuments(filters);

    return res.status(200).json({
      restaurants,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET Single Restaurant
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("vendorId", "userName phoneNumber")
      .populate("menuItems.menuItemId");

    if (!restaurant) {
      return res.status(404).json({
        error: [{ message: "Restaurant not found." }],
      });
    }

    return res.status(200).json({ restaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ UPDATE Restaurant (Vendor updates their restaurant)
exports.updateRestaurant = async (req, res) => {
  const vendorId = req.user?.userId || req.params.vendorId;

  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      vendorId,
    });

    if (!restaurant) {
      return res.status(404).json({
        error: [{ message: "Restaurant not found or access denied." }],
      });
    }

    const updates = req.body;

    // Simple shallow update for allowed fields
    if (updates.name) restaurant.name = updates.name;
    if (updates.description) restaurant.description = updates.description;
    if (updates.address?.street) restaurant.address.street = updates.address.street;
    if (updates.address?.city) restaurant.address.city = updates.address.city;
    if (updates.address?.state) restaurant.address.state = updates.address.state;
    if (updates.address?.pincode) restaurant.address.pincode = updates.address.pincode;
    if (updates.address?.coordinates) restaurant.address.coordinates = updates.address.coordinates;
    if (updates.phoneNumber) restaurant.phoneNumber = updates.phoneNumber;
    if (updates.cuisineType) {
      restaurant.cuisineType = String(updates.cuisineType)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }
    if (updates.deliveryTime) restaurant.deliveryTime = parseInt(updates.deliveryTime, 10);
    if (updates.priceRange) restaurant.priceRange = updates.priceRange;
    if (updates.images) {
      restaurant.images = Array.isArray(updates.images)
        ? updates.images
        : String(updates.images)
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean);
    }
    if ("isActive" in updates) restaurant.isActive = Boolean(updates.isActive);

    await restaurant.save();

    return res.status(200).json({
      message: "Restaurant updated successfully.",
      restaurant,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ DELETE Restaurant (Vendor deletes)
exports.deleteRestaurant = async (req, res) => {
  const vendorId = req.user?.userId || req.params.vendorId;

  try {
    const restaurant = await Restaurant.findOneAndDelete({
      _id: req.params.id,
      vendorId,
    });

    if (!restaurant) {
      return res.status(404).json({
        error: [{ message: "Restaurant not found or access denied." }],
      });
    }

    // Optionally delete associated MenuItems here

    return res.status(200).json({
      message: "Restaurant deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ Toggle Restaurant Status (Open/Close)
exports.toggleRestaurantStatus = async (req, res) => {
  const vendorId = req.user?.userId || req.params.vendorId;

  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      vendorId,
    });

    if (!restaurant) {
      return res.status(404).json({
        error: [{ message: "Restaurant not found." }],
      });
    }

    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    return res.status(200).json({
      message: `Restaurant ${restaurant.isActive ? "opened" : "closed"}.`,
      restaurant,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET Vendor's Restaurant
exports.getVendorRestaurant = async (req, res) => {
  const vendorId = req.user?.userId || req.params.vendorId;

  try {
    const restaurant = await Restaurant.findOne({ vendorId })
      .populate("vendorId", "userName phoneNumber")
      .populate("menuItems.menuItemId");

    if (!restaurant) {
      return res.status(404).json({
        error: [{ message: "No restaurant found." }],
      });
    }

    return res.status(200).json({ restaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};