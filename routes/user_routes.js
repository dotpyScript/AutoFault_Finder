const express = require("express");
const { body } = require("express-validator");
const { ensureUser, ensureAdmin } = require("../middleware/ensureAdmin");
const auth = require("../middleware/auth");
const {
  RegValidateInput,
  loginValidation,
  newCodeValidation,
} = require("../middleware/validator");

const Codes = require("../models/code.schema");

const {
  controller,
  adminPanel,
  logout,
} = require("../controller/adminController");

const router = express.Router();

// Route: GET / register
router.get("/register", controller.getRegister);

// Route: POST / register
router.post("/register", RegValidateInput, controller.postRegister);

// Route: GET / login
router.get("/login", controller.getLogin);

// Route: POST / login
router.post("/login", loginValidation, controller.postLogin);

// Route: GET / Index
router.get("/index", auth, ensureUser, adminPanel.getIndex);

// Route: GET / addNewCodes
router.get("/addNewCodes", auth, ensureUser, adminPanel.getnewCodes);

// Route: GET / addNewCodes
router.post(
  "/addNewCodes",
  auth,
  ensureUser,
  newCodeValidation,
  adminPanel.postNewCodes
);

// Route: GET / listCodes
router.get("/listCode", auth, ensureUser, adminPanel.getListCode);

// Route to delete a code
router.delete("/codes/:id", async (req, res) => {
  try {
    await Codes.findByIdAndDelete(req.params.id);
    res.json({ message: "Code deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// View specific code route
router.get("/view/:id", auth, ensureUser, async (req, res) => {
  const codeId = req.params.id;

  try {
    // Find the code by its ID
    const code = await Codes.findById(codeId);

    if (code) {
      // Return JSON response with the redirect URL
      const redirectUrl = `/viewCode/${code._id}`;
      res.status(200).json({ redirect: redirectUrl });
    } else {
      // If the code is not found
      res.status(404).json({ message: "Code not found" });
    }
  } catch (error) {
    console.error("Error fetching code:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route for fetching a single OBD code by ID
router.get("/getCode/:id", auth, ensureUser, adminPanel.getCodeById); // New route to get a specific code

// Route for updating an OBD code
router.post("/editCode/:id", auth, ensureUser, adminPanel.updateCode); // Route to handle the update

// Search route
router.get("/search", auth, ensureUser, adminPanel.searchCode);

router.get("/viewCode/:id", auth, ensureUser, adminPanel.ViewSearchCode);

// Route: GET / logout
router.get("/logout", logout.getLogout);

module.exports = router;
