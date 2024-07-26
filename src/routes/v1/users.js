const router = require('express').Router();
const customerController = require('../../controllers/customerController.js');
const paymentController = require('../../controllers/paymentController.js');
const {userAuth} = require('../../services/authServices.js');

router.post('/create-user', customerController.registerUser);
router.get('/wish-list', userAuth, customerController.fetchWishList);
router.post('/add-to-wish-list', userAuth, customerController.addToWishList);
router.delete('/remove-from-wish-list/:product_id', userAuth, customerController.removeFromWishList);
router.get('/cart', userAuth, customerController.fetchCart);
router.post('/add-to-cart', userAuth, customerController.addToCart);
router.delete('/remove-from-cart', userAuth, customerController.removeFromCart);
router.get('/view-orders', userAuth, customerController.viewFilterUserOrders);
router.get('/addresses', userAuth, customerController.fetchAddresses);
router.post('/add-address', userAuth, customerController.addAddress);
router.get('/calculate-order-amount', userAuth, customerController.calculateOrderAmount);
router.post('/create-order', userAuth, paymentController.createOrder);
router.post('/webhook', userAuth, paymentController.confirmOrder);

/* Based on discussion with FE below routes are commented */

// router.post('/create-review', userAuth, customerController.createReview);
// router.patch('/mark-review', userAuth, customerController.markReview);

module.exports = router;