const router = require('express').Router();
const { adminAuth } = require('../../services/authServices.js');
const adminController = require('../../controllers/adminController.js');

router.post('/add-product', adminAuth, adminController.addProduct);
router.put('/edit-product/:product_id', adminAuth, adminController.editProduct);
router.delete('/delete-product/:product_id', adminAuth, adminController.deleteProduct);
router.get('/view-orders', adminAuth, adminController.fetchAllOrders); //how to use query params
router.get('/view-order/:order_id', adminAuth, adminController.fetchSpecificOrder);

// ** Based on discussion with FE commented below routes **

//router.get('/order-status', adminAuth, adminController.fetchSpecificOrder);
//router.patch('/update-order', adminAuth, adminController.editOrder);

module.exports = router;