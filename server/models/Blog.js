const mongoose = require("mongoose");

// Define a schema for a block
const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // Block type (e.g., paragraph, header, image)
  },
  data: {
    type: Object,
    required: true, // Data associated with the block (content, image URL, etc.)
  },
});

// Main blog schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: [blockSchema], // Use the block schema as an array
    required: true,
  },
  location: {
    type: String, // Location based on user's IP
    required: true,
    // default: "india road, delhi, city - 680208, delhi, India",
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
