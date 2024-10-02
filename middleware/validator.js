const { body } = require("express-validator");

// registration page Input Validation
const RegValidateInput = [
  // Input validation
  body("name").notEmpty().escape().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

// login page Input valiadtion
const loginValidation = [
  body("email").isEmail().withMessage("Invalid emil or password"),
  body("password").notEmpty().withMessage("Invalid email or password"),
];

// new code validation
const newCodeValidation = [
  body("code").notEmpty().escape().withMessage("Code is required"),
  body("description")
    .notEmpty()
    .escape()
    .withMessage("Description is required"),
  body("possibleCauses")
    .notEmpty()
    .escape()
    .withMessage("Possible causes is required"),
  body("suggestedFixes")
    .notEmpty()
    .escape()
    .withMessage("Suggested fixes is required"),
];

module.exports = { RegValidateInput, loginValidation, newCodeValidation };
