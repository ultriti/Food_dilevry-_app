const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const menuItemController = require("../Controller/menuItem.controller");



router.post(
  "/restaurants/:restaurantId/menu",
  auth.verifyToken,
  auth.isVendor,
  menuItemController.createMenuItem
);


router.get(
  "/restaurants/:restaurantId/menu",
  menuItemController.getRestaurantMenu
);


router.get(
  "/menu/:itemId",
  menuItemController.getMenuItemById
);

router.put(
  "/menu/:itemId",
  auth.verifyToken,
  auth.isVendor,
  menuItemController.updateMenuItem
);

router.delete(
  "/menu/:itemId",
  auth.verifyToken,
  auth.isVendor,
  menuItemController.deleteMenuItem
);

router.patch(
  "/menu/:itemId/toggle-availability",
  auth.verifyToken,
  auth.isVendor,
  menuItemController.toggleMenuItemAvailability
);

module.exports = router;