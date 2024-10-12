const express = require("express");
const { signup, login, getAllUsers } = require("../controllers/authController");
const router = express.Router();

// Register and login routes
router.post("/signup", signup);

//to user login routes
router.post("/login", login);

//get arr users
router.get("/users", getAllUsers);
module.exports = router;
