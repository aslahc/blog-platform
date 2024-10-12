const mongoose = require("mongoose");

// Define a schema for a block
const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // Block type (e.g., paragraph, header, image)
  },
  data: {
    type: Object,
    required: true,
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
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
