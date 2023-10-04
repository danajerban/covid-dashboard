const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");
const countryController = require("./controllers/countryController");
const authController = require("./controllers/authController");

// Country Routes
router.get("/", countryController.getCountries);

// Admin Routes
router.get("/admin/search", adminController.searchCountries);
router.post("/admin/update/:countryId", adminController.updateData);
router.delete("/admin/delete/:countryId", adminController.deleteCountry);

// Auth Routes
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
