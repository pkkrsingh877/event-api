const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const { userCreationRules, validateRequest } = require('../middlewares/validator');

// @route   POST /api/users
// @desc    Create a new user
router.post('/', userCreationRules(), validateRequest, createUser);

module.exports = router;
