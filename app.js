const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
require("dotenv").config();

// initailize port
const PORT = process.env.PORT || 5000;

// initialize app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Successfully Connected"))
  .catch((err) => {
    console.error(`Failed to connect: ${err}`);
    process.exit(1);
  });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// init cookie perser
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "myComplexAndRandomSecretKey123!",
    resave: false,
    saveUninitialized: true,
  })
);

// Connect flash
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Router middleware
const userRoutes = require("./routes/user_routes");
app.use("/", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
