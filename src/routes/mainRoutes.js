const express = require("express");
const router = require('express').Router();
const app = express();
const loginController = require('../controllers/loginController.js');
const productController = require('../controllers/productController.js');
const { refreshToken } = require('../controllers/authController.js');
const { authenticate } = require('../services/authServices.js');

// router.get('/', (req, res) => {
//     console.info("/ root api called at", new Date().toISOString());
//     res.status(200).send("Welcome to root URL of Server");
// })
router.post('/login', loginController.login);
router.post('/refresh-auth', refreshToken);
router.post('/generate-otp', loginController.generateOTP);
router.patch('/reset-password', loginController.resetPassword);
router.get('/home', authenticate, productController.fetchRecentProducts);
router.get('/list-products', authenticate, productController.fetchProducts);  //add authenticate from here
router.get('/products/:product_id', authenticate, productController.fetchProduct);
router.get('/product/reviews', authenticate, productController.fetchReviews);
router.get('/get-product-parameters',  productController.fetchProductParameters);

router.use('/user', require('./users.js'));
router.use('/admin', require('./admin.js'));

module.exports = router;