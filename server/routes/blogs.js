const express = require("express");
const Blog = require("../models/Blog");
const router = express.Router();
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
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
router.post("/", authMiddleware, async (req, res) => {
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
    // Delete all documents in the Blog collection
    // await Blog.deleteMany({});
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
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("entering to the edit post");
    const { id } = req.params;
    const { title, content, location, image, video } = req.body;

    // Find the blog by ID
    const blog = await Blog.findById(id);
    console.log("got bloc", blog);
    // Check if the logged-in user is the author of the blog
    // if (blog.author.toString() !== req.user.id) {
    //   return res
    //     .status(403)
    //     .json({ message: "Not authorized to edit this post" });
    // }
    console.log("12");

    // Update the blog post
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.location = location || blog.location;
    blog.image = image || blog.image;
    blog.video = video || blog.video;

    const updatedBlog = await blog.save();
    console.log("edited complete");
    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
});
// Razorpay Checkout Route
// Razorpay Checkout Route
router.post("/checkout", authMiddleware, async (req, res) => {
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
