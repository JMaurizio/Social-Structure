const router = require('express').Router();
const apiRoutes = require('./api-routes');

router.use('./api', apiRoutes);

router.use((req, res) => {
    res.status(404).json({message: '404 error'})
});

module.exports = router