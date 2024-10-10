const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Object, // To store the block editor data
    required: true,
  },
  location: {
    type: String, // Location based on user's IP
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  image: {
    type: String, // Location based on user's IP
    required: false,
  },
  video: {
    type: String, // Location based on user's IP
    required: false,
  },
  isPublished: {
    type: Boolean,
    default: false, // Blogs are not published until payment is confirmed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
