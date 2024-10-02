// liberies
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// imported schema from models
const User = require("../models/user.schema");
const Codes = require("../models/code.schema");

// jwt secrete code from .env
const jwtSecret = process.env.JWT_SECRET;

const controller = {
  getRegister: (req, res) => {
    res.render("register");
  },

  // Registeration page controller,
  // Request Type: POST
  postRegister: async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Collect errors and flash them for frontend display
      const errorMessages = errors.array().map((err) => err.msg);
      return res.status(400).json({
        // This will be handled by Toastify in frontend
        errors: errorMessages,
      });
    }

    const { name, email, password } = req.body;

    // Default role to 'user' if not specified
    const role = req.body.role || "user";
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Save user to the database
      await newUser.save();
      // Respond with success message
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      // Handle any server errors
      console.error(error);
      req.flash("error_msg", ["Internal server error"]);
      res.status(500).json({ message: "Server error" });
    }
  },

  // login page controller,
  // Request Type: GET
  getLogin: (req, res) => {
    res.render("login", {
      errors: req.flash("error_msg"),
      success: req.flash("success_msg"),
    });
  },

  // login page controller,
  // Request Type: POST
  postLogin: async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res.status(400).json({
        errors: errorMessages,
      });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          name: user.name,
        },
        jwtSecret,
        { expiresIn: "5h" }
      );

      res.cookie("token", token, { httpOnly: true });

      // Get the redirectTo URL from query parameters
      const redirectTo = req.query.redirectTo || "/index"; // Default to '/index' if not provided
      console.log("Redirecting to:", redirectTo); // Log the redirect URL

      res
        .status(200)
        .json({ message: "Login successful", redirect: redirectTo });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

// Helper function to capitalize first letter of each word
const capitalizeName = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const adminPanel = {
  getIndex: async (req, res) => {
    let user = req.user;

    // const sessionExpired = req.query.expired || false; // Example condition
    // Capitalize user name before passing to the view
    user.name = capitalizeName(user.name);
    res.render("index", { user });
  },

  // Get New codes
  getnewCodes: async (req, res) => {
    res.render("addNewCodes");
  },

  // Post New Codes
  postNewCodes: async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res.status(400).json({
        errors: errorMessages,
      });
    }
    const { code, description, possibleCauses, suggestedFixes } = req.body;

    try {
      const existingCode = await User.findOne({ code });
      if (existingCode) {
        return res.status(400).json({ message: "Code already exists" });
      }

      const newCode = new Codes({
        code,
        description,
        possibleCauses,
        suggestedFixes,
      });

      // Save user to the database
      await newCode.save();
      // Respond with success message
      res.status(201).json({
        message: "Code registered successfully!",
        redirect: "/addNewCodes",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // list codes
  getListCode: async (req, res) => {
    try {
      const getAllCode = await Codes.find();
      if (!getAllCode) {
        res.status(400).json({ message: "Please add OBD codes" });
      }
      res.render("listCode", { code: getAllCode });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  getCodeById: async (req, res) => {
    try {
      const code = await Codes.findById(req.params.id);
      if (!code) {
        return res.status(404).json({ message: "OBD code not found" });
      }
      res.json(code); // Return the code data as JSON
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update a specific code
  updateCode: async (req, res) => {
    try {
      const { code, description, possibleCauses, suggestedFixes } = req.body;
      const updatedCode = await Codes.findByIdAndUpdate(
        req.params.id,
        { code, description, possibleCauses, suggestedFixes },
        { new: true } // Return the updated document
      );

      if (!updatedCode) {
        return res.status(404).json({ message: "OBD code not found" });
      }

      res.json({ message: "Code updated successfully", code: updatedCode });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

// Route: GET /logout
const logout = {
  getLogout: async (req, res) => {
    // Invalidate the JWT token by clearing it from cookies (if stored in cookies)
    res.clearCookie("token");

    // Redirect to login page after token removal
    return res.redirect("/login");
  },
};

module.exports = { controller, adminPanel, logout };
