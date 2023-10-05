const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");
const countryController = require("./controllers/countryController");
const authController = require("./controllers/authController");
const searchController = require("./controllers/searchController");
// Country Routes
router.get("/", countryController.getCountries);
router.get("/total-cases", countryController.getTotalCases);

// Admin Routes
router.get("/admin/search", adminController.searchCountries);
router.post("/admin/update/:countryId", adminController.updateData);
router.delete("/admin/delete/:countryId", adminController.deleteCountry);

// Auth Routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// Chart Routes
router.get("/search", searchController.searchCountry);
router.get("/search/:countryId", searchController.getCountryData);
router.get("/search/totals/:countryId", searchController.getCountryTotalCases);
module.exports = router;
