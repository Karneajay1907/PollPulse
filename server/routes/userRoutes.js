const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

// 🔹 Register
router.post("/Register", registerUser);

// 🔹 Login
router.post("/Login", loginUser);

module.exports = router;
