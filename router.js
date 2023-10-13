const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");
const countryController = require("./controllers/countryController");
const authController = require("./controllers/authController");
const searchController = require("./controllers/searchController");

// Country Routes for the homepage
router.get("/", countryController.getCountries);
router.get("/total-cases", countryController.getTotalCases);

// Admin Routes for searching/editing/deleting data
router.get("/admin/search", adminController.searchCountries);
router.post("/admin/update/:countryId", adminController.updateData);
router.delete("/admin/delete/:countryId", adminController.deleteCountry);

// Auth Routes for jwt
router.post("/login", authController.login);
router.post("/register", authController.register);

// Search routes for main search bar and charts
router.get("/search", searchController.searchCountry);
router.get("/search/:countryId", searchController.getCountryData);
router.get("/search/totals/:countryId", searchController.getCountryTotalCases);
module.exports = router;
