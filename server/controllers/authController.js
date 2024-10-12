const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Signup user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });

    await user.save();
    console.log("user saved......");

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "Secretjwt",
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials check email or password" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "Secretjwt",
      {
        expiresIn: "1h",
      }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// controler for retriev all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log("enter to fetch all users ");
    const users = await User.find({}, "id name email");
    console.log("get all users", users);
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
