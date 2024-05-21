// controllers/userController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const register = [
  check("username")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const user = new User({ username, password });
      await user.save();
      res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
      res.status(400).send({ error: "Error registering user" });
    }
  },
];

const login = [
  check("username").notEmpty().withMessage("Username is required"),
  check("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).send({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, "secretkey", {
        expiresIn: "1h",
      });
      res.send({ token });
    } catch (error) {
      res.status(400).send({ error: "Error logging in" });
    }
  },
];

module.exports = { register, login };
