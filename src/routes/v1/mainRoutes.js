const router = require('express').Router();

router.use('/', require('./auth.js'));
router.use('/', require('./utils.js'));
router.use('/user', require('./users.js'));
router.use('/admin', require('./admin.js'));

module.exports = router;