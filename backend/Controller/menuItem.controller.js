const MenuItem = require("../Model/menu.model");
const Restaurant = require("../Model/restaurant.model");

// ✅ CREATE Menu Item (Vendor adds food to their restaurant)
exports.createMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl, isAvailable } = req.body;
  const restaurantId = req.params.restaurantId || req.body.restaurantId;

  if (!name || !price || !category) {
    return res.status(400).json({
      error: [{ message: "Name, price, and category are required." }],
    });
  }

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        error: [{ message: "Restaurant not found." }],
      });
    }

    // If vendor auth is in place, check that this restaurant belongs to the vendor
    const vendorId = req.user?.userId;
    if (restaurant.vendorId.toString() !== vendorId) {
      return res.status(403).json({
        error: [{ message: "Access denied. Not owner of this restaurant." }],
      });
    }

    const newMenuItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
      isAvailable: isAvailable !== false, // default to true
      restaurantId: restaurant._id,
    });

    await newMenuItem.save();

    // Optionally push to restaurant.menuItems (embedded list)
    restaurant.menuItems.push({
      menuItemId: newMenuItem._id,
      price: newMenuItem.price,
      available: newMenuItem.isAvailable,
    });

    await restaurant.save();

    return res.status(201).json({
      message: "Menu item created successfully.",
      menuItem: newMenuItem,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET ALL Menu Items for a Restaurant
exports.getRestaurantMenu = async (req, res) => {
  const { restaurantId } = req.params;
  const { category, availableOnly = true } = req.query;

  try {
    const restaurant = await Restaurant.findById(restaurantId)
      .populate("menuItems.menuItemId");

    if (!restaurant) {
      return res.status(404).json({
        error: [{ message: "Restaurant not found." }],
      });
    }

    let items = restaurant.menuItems
      .map((item) => ({
        id: item.menuItemId._id,
        name: item.menuItemId.name,
        description: item.menuItemId.description,
        price: item.price, // can be overridden at restaurant level
        category: item.menuItemId.category,
        imageUrl: item.menuItemId.imageUrl,
        available: item.available,
      }))
      .filter((item) => !(availableOnly === "true" && !item.available));

    // If category filter
    if (category) {
      items = items.filter((item) =>
        String(category).split(",").map((c) => c.trim()).includes(item.category)
      );
    }

    return res.status(200).json({
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      menu: items,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET Single Menu Item
exports.getMenuItemById = async (req, res) => {
  const { itemId } = req.params;

  try {
    const menuItem = await MenuItem.findById(itemId).populate("restaurantId", "name");

    if (!menuItem) {
      return res.status(404).json({
        error: [{ message: "Menu item not found." }],
      });
    }

    return res.status(200).json({ menuItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ UPDATE Menu Item (Vendor edits food)
exports.updateMenuItem = async (req, res) => {
  const { itemId } = req.params;
  const { name, description, price, category, imageUrl, isAvailable } = req.body;

  try {
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({
        error: [{ message: "Menu item not found." }],
      });
    }

    // Check if vendor owns the restaurant
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (!restaurant || restaurant.vendorId.toString() !== req.user?.userId) {
      return res.status(403).json({
        error: [{ message: "Access denied." }],
      });
    }

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = parseFloat(price);
    if (category) menuItem.category = category;
    if (imageUrl !== undefined) menuItem.imageUrl = imageUrl;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    await menuItem.save();

    // Update restaurant.menuItems entry (if embedded)
    const itemInRest = restaurant.menuItems.find(
      (i) => i.menuItemId.toString() === menuItem._id.toString()
    );
    if (itemInRest) {
      itemInRest.price = menuItem.price;
      itemInRest.available = menuItem.isAvailable;
      await restaurant.save();
    }

    return res.status(200).json({
      message: "Menu item updated successfully.",
      menuItem,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ DELETE Menu Item (Vendor deletes food)
exports.deleteMenuItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const menuItem = await MenuItem.findByIdAndDelete(itemId);
    if (!menuItem) {
      return res.status(404).json({
        error: [{ message: "Menu item not found." }],
      });
    }

    // Also remove from restaurant.menuItems array
    await Restaurant.updateOne(
      { "menuItems.menuItemId": itemId },
      { $pull: { menuItems: { menuItemId: itemId } } }
    );

    return res.status(200).json({
      message: "Menu item deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ Toggle Menu Item Availability (e.g., "Temporarily Unavailable")
exports.toggleMenuItemAvailability = async (req, res) => {
  const { itemId } = req.params;

  try {
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({
        error: [{ message: "Menu item not found." }],
      });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (!restaurant || restaurant.vendorId.toString() !== req.user?.userId) {
      return res.status(403).json({
        error: [{ message: "Access denied." }],
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    const itemInRest = restaurant.menuItems.find(
      (i) => i.menuItemId.toString() === menuItem._id.toString()
    );
    if (itemInRest) {
      itemInRest.available = menuItem.isAvailable;
      await restaurant.save();
    }

    return res.status(200).json({
      message: `Menu item ${menuItem.isAvailable ? "enabled" : "disabled"}.`,
      menuItem,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};