// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { addUser,getUsers,getUser,updateUser,deleteUser,loginUser } = require('../controllers/usercontroller');
const { authMiddleware, adminMiddleware } = require("../middleware/authmiddleware");

// Public Routes
router.post('/register', addUser);
router.post("/login", loginUser);

//private routes
router.get('/user/:id', authMiddleware, getUser);  
router.get('/users', authMiddleware, adminMiddleware, getUsers);  
router.put('/user/:id', authMiddleware, updateUser);
router.delete('/user/:id', authMiddleware, adminMiddleware,deleteUser);

module.exports = router;