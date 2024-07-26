const router = require('express').Router();
const productController = require('../../controllers/productController.js');
const { userAuth } = require('../../services/authServices.js');


router.get('/home', userAuth , productController.fetchRecentProducts);
router.get('/list-products', userAuth, productController.fetchProducts);
router.get('/products/:product_id', userAuth, productController.fetchProduct);
router.get('/product/reviews/:product_id', userAuth, productController.fetchReviews);
router.get('/get-product-parameters', userAuth, productController.fetchProductParameters);

module.exports = router;