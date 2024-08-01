const router = require('express').Router();
const loginController = require('../../controllers/loginController.js');
const { refreshToken } = require('../../controllers/authController.js');


router.post('/login', loginController.login);
router.post('/refresh-auth', refreshToken);
router.post('/generate-otp', loginController.generateOTP);
router.patch('/reset-password', loginController.resetPassword);

module.exports = router;