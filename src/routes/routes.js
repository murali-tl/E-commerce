const router = require('express').Router();

router.use('/v1', require('./v1/mainRoutes.js'));


module.exports = router;