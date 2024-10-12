// controllers/blogController.js
const Blog = require("../models/Blog");
const Razorpay = require("razorpay");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    console.log("allblogs", blogs);
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, location, image, video } = req.body;
    const newBlog = new Blog({
      title,
      content,
      author,
      location,
      image,
      video,
    });

    const savedBlog = await newBlog.save();
    console.log("Blog saved successfully");
    res
      .status(201)
      .json({ message: "Blog saved successfully", blog: savedBlog });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Failed to save blog" });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, location, image, video } = req.body;

    const blog = await Blog.findById(id);

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.location = location || blog.location;
    blog.image = image || blog.image;
    blog.video = video || blog.video;

    const updatedBlog = await blog.save();
    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// Razorpay checkout
exports.createCheckout = async (req, res) => {
  const { blogId, amount } = req.body;
  const instance = new Razorpay({
    key_id: "rzp_test_O3ookB75C6tQTa",
    key_secret: "FzbCouEwD2w6LTyIuYA85P5w",
  });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: blogId,
  };

  try {
    const order = await instance.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};
