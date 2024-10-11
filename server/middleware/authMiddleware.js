const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("Checking Authorization...");

  // Extract token from Authorization header (assuming it's in the format 'Bearer <token>')
  const token = req.header("Authorization")?.split(" ")[1]; // Get the token after "Bearer "

  console.log(token, "from header");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Add the decoded user ID to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
