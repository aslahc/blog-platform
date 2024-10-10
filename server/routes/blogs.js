const express = require("express");
const Blog = require("../models/Blog");
const router = express.Router();
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

// Get blogs based on user location
// Get all blogs
router.get("/", async (req, res) => {
  try {
    // Fetch all blogs from the database
    const blogs = await Blog.find().populate("author", "name email"); // Optionally populate author details
    console.log("allblogs", blogs);
    // Send the blogs as a response
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Create a new blog
router.post("/", async (req, res) => {
  try {
    // Extract data from req.body
    const { title, content, author, location, image, video } = req.body;
    console.log(req.body);
    // Create a new blog post instance
    const newBlog = new Blog({
      title,
      content, // Editor.js content as blocks (array of objects)
      author, // Assumes author is sent as an ObjectId or user info
      location, // User location
      image,
      video,
    });

    // Save the new blog post to the database
    const savedBlog = await newBlog.save();
    console.log("Data saved sesefuly");
    // Send a success response with the saved blog data
    res
      .status(201)
      .json({ message: "Blog saved successfully", blog: savedBlog });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Failed to save blog" });
  }
});

// Razorpay Checkout Route
// Razorpay Checkout Route
router.post("/checkout", async (req, res) => {
  console.log("entering checkout");
  const { blogId, amount } = req.body;
  const instance = new Razorpay({
    key_id: "rzp_test_O3ookB75C6tQTa", // your Razorpay key_id
    key_secret: "FzbCouEwD2w6LTyIuYA85P5w", // your Razorpay key_secret
  });

  const options = {
    amount: amount * 100, // amount in paise (smallest currency unit)
    currency: "INR",
    receipt: blogId,
  };

  try {
    const order = await instance.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

module.exports = router;
