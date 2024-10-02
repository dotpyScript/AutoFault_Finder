// token
const jwt = require("jsonwebtoken");
const User = require("../models/user.schema");

const auth = async (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  const token = req.cookies.token;

  if (!token) {
    return res.redirect(
      `/login?redirectTo=${encodeURIComponent(req.originalUrl)}`
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect(
        `/login?redirectTo=${encodeURIComponent(req.originalUrl)}`
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.redirect(
        `/login?redirectTo=${encodeURIComponent(req.originalUrl)}`
      );
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  }
};

module.exports = auth;
