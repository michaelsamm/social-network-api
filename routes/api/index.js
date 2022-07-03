const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// Add prefix of '/users' to routes from 'user-routes.js'
router.use('/users', userRoutes);

// Add prefix of '/thoughts' to routes from 'thought-routes.js'
router.use('/thoughts', thoughtRoutes);

module.exports = router;