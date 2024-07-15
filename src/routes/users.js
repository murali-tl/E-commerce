const router = require('express').Router();
const customerController = require('../controllers/customerController');
const paymentController = require('../controllers/paymentController.js');
const {authenticate} = require('../services/authServices.js');

router.post('/create-user', customerController.registerUser);
router.get('/wish-list',authenticate, customerController.fetchWishList);
router.post('/add-to-wish-list', authenticate, customerController.addToWishList);
router.delete('/remove-from-wish-list', authenticate, customerController.removeFromWishList);
router.get('/cart',authenticate, customerController.fetchCart);
router.post('/add-to-cart', authenticate, customerController.addToCart);
router.delete('/remove-from-cart', authenticate, customerController.removeFromCart);
router.post('/create-review', authenticate, customerController.createReview);
router.patch('/mark-review', authenticate, customerController.markReview);
router.get('/view-orders', authenticate, customerController.viewFilterUserOrders);
router.get('/addresses', authenticate, customerController.fetchAddresses);
router.post('/add-address', authenticate, customerController.addAddress);
router.get('/calculate-order-amount', authenticate, customerController.calculateOrderAmount);
router.post('/create-order', authenticate, paymentController.createOrder);
router.post('/webhook', authenticate, paymentController.confirmOrder);

module.exports = router;