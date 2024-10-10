const express = require("express");
const { signup, login, getAllUsers } = require("../controllers/authController");
const router = express.Router();

// Register and login routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getAllUsers);
module.exports = router;
