const router = require('express').Router();
const {authenticate} = require('../services/authServices.js');
const adminController = require('../controllers/adminController.js');

router.post('/add-product', authenticate, adminController.addProduct);
router.put('/edit-product', authenticate, adminController.editProduct);
router.delete('/delete-product', authenticate, adminController.deleteProduct);
router.get('/view-orders', authenticate, adminController.fetchAllOrders); //how to use query params
router.get('/view-order/:order_id', authenticate, adminController.fetchSpecificOrder);
//router.get('/order-status', authenticate, adminController.fetchSpecificOrder);
//router.patch('/update-order', authenticate, adminController.editOrder);

module.exports = router;