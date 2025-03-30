// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { addUser,getUsers,getUser,updateUser,deleteUser,loginUser,forgotPassword,updatePassword } = require('../controllers/usercontroller');
const { authMiddleware, adminMiddleware } = require("../middleware/authmiddleware");

// Public Routes
router.post('/register', addUser);
router.post("/login", loginUser);
router.post('/users/forgot-password',forgotPassword);

//private routes
router.get('/users/:id', authMiddleware, getUser);  
router.get('/users',  authMiddleware,adminMiddleware, getUsers);  
router.put('/users/:id', authMiddleware, updateUser);
router.patch('/users/update-password',authMiddleware,updatePassword);
router.delete('/users/:id', authMiddleware, adminMiddleware,deleteUser);

module.exports = router;