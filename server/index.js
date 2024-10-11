const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: "*", // The frontend origin that should be allowed
  methods: "GET,POST,PUT,DELETE", // Specify which HTTP methods are allowed
  credentials: true, // Enable cookies if needed
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
