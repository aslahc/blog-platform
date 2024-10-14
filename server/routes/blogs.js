// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const blogController = require("../controllers/blogController");

// Route to get all blogs
router.get("/", blogController.getAllBlogs);

// Route to create a new blog (protected with authMiddleware)
router.post("/", blogController.createBlog);

// Route to update a blog (protected with authMiddleware)
router.put("/:id", blogController.updateBlog);

// Route for Razorpay checkout (protected with authMiddleware)
router.post("/checkout", blogController.createCheckout);

module.exports = router;
