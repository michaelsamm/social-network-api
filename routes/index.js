const router = require('express').Router();
const apiRoutes = require('./api');

// Add '/api' when using the routes in the api directory
router.use('/api', apiRoutes);

// Return cheeky 404 error text when hitting an unaccounted for destination
router.use((req, res) => {
    res.status(404).send('<h1>😝 404 Error!</h1>')
});

module.exports = router;