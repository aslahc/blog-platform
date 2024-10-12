const jwt = require("jsonwebtoken");

//this is the middleware for authanticate

const authMiddleware = (req, res, next) => {
  console.log("Checking Authorization...");

  const token = req.header("Authorization")?.split(" ")[1];

  console.log(token, "from header");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
