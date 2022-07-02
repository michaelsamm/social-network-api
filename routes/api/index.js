const router = require('express').Router();
const userRoutes = require('./user-routes');

// Add prefix of '/users' to routes from 'user-routes.js'
router.use('/users', userRoutes);

module.exports = router;