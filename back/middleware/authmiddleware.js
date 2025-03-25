const jwt = require("jsonwebtoken");
const express = require('express');

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};


exports.authenticatedUser = (req, res, next) => {
  
  try {
    const token = req.headers.authorization;
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    req.user = { id: userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Add this utility function
exports.getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};