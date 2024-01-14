
const express = require('express');
const router = express.Router();

// Import your Users controller
const usersController = require('../controllers/users');
// Define your API endpoints
router.post('/registerUser', usersController.registerUser);
router.post('/loginUser', usersController.loginUser);
router.get('/getUserById/:id', usersController.getUserById);
router.put('/updateUserById/:userId', usersController.updateUserById);
router.delete('/deleteUserById/:userId', usersController.deleteUserById);

module.exports = router;