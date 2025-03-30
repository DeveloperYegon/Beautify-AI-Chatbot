
const express = require('express');
const router = express.Router();
const { fetchAll} = require('../controllers/resourceControllers');
const { authMiddleware, adminMiddleware } = require("../middleware/authmiddleware");

router.get('/fetch-all', authMiddleware,adminMiddleware,fetchAll);

module.exports = router;    
