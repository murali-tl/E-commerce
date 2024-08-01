const { order, product } = require('../models/index');

const viewFilterOrders = async (data) => {
    try {
        const { order_id } = data;
        if (order_id) {
            const orderDetails = await order.findOne({
                where: {
                    order_id: order_id,
                    user_id: data?.user_id
                },
                attributes: { exclude: ['createdAt', 'updated_by', 'updatedAt', 'deletedAt'] }
            });
            if (orderDetails) {
                return { success: true, status: 200, message: 'Order details fetched', data: orderDetails };
            }
            return { success: false, status: 400, message: 'No order found', data: {} };
        }
        else {
            const orders = await order.findAll({
                where: {
                    user_id: data?.user_id
                },
                attributes: { exclude: ['createdAt', 'updated_by', 'updatedAt', 'deletedAt'] }
            });
            if (orders.length) {
                return { success: true, status: 200, message: 'Orders fetched', data: orders };
            }
            return { success: false, status: 400, message: 'No orders found', data: {} };
        }
    }
    catch (err) {
        return { "error": err };
    }
}

const checkProductStock = async (productQuantities) => {
    if (typeof (productQuantities) === 'object') {
        for (let key in productQuantities) {
            const productDetails = await product.findOne({
                where: {
                    product_id: key
                }
            });
            let currQuantity = productDetails?.quantity;
            if (productQuantities[key] > currQuantity) {
                return false;
            }
        }
        return true;
    }
    return false
}
module.exports = {
    viewFilterOrders,
    checkProductStock
}