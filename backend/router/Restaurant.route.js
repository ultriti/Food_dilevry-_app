const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const restaurantController = require("../Controller/Restaurant.controller");

// router.post("/create", auth.verifyToken, auth.isVendor, restaurantController.createRestaurant);
router.post("/create", restaurantController.createRestaurant);

router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.put("/:id",restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);
router.patch("/:id/toggle-status", restaurantController.toggleRestaurantStatus);
router.get("/vendor/restaurant",  restaurantController.getVendorRestaurant);

module.exports = router;