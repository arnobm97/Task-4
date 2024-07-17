const express = require('express');
const { getAllUsers, updateUserStatus, deleteUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/users', authMiddleware, getAllUsers);
router.patch('/users', authMiddleware, updateUserStatus);
router.delete('/users', authMiddleware, deleteUsers);

module.exports = router;
