const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Department = require("../models/Department");

//  1. Register a new user
router.post("/", async (req, res) => {
  try {
    const { email, password, name, deptId } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let department = null;
    if (deptId) {
      department = await Department.findById(deptId);
      if (!department) {
        return res.status(400).json({ message: "Invalid department ID" });
      }
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      deptId: department ? department._id : null, 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  2. Get user details with department name and location
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("deptId", "name location");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  3. User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email }).populate("deptId", "name location");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found. Login successful.");
    res.json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;