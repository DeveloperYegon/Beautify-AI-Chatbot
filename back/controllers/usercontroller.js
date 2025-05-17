// /back/controllers/usercontroller.js
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//add new user

exports.addUser = async (req, res) => {
    try {
      const {name,email,role,password,} = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    // Create and save user
    user = new User({ name, email, role, password });
    await user.save();
    console.log("User created successfully");
    return res.status(201).json({ status: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};


//login users 
exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id,email: user.email,name:user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
  
      console.log("✅ User logged in successfully");
      return res.status(200).json({ token, user });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: error.message });
    }
  };
//get all users

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log("Users fetched successfully", users);
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("User fetched successfully", user);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

//update user 

exports.updateUser = async (req, res) => {
  console.log("Received request to update user:", req.params.id, req.body); // Debugging
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//update password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
//forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = password;
    await user.save();
    return res.status(200).json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//delete user

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};