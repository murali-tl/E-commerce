const { order } = require('../models/index');

const viewFilterOrders = async (data) => {
    try {
        const { order_id } = data;
        if (order_id) {
            const orderDetails = await order.findOne({
                where: {
                    order_id: order_id,
                    user_id: data?.user_id
                }
            });
            if (orderDetails) {
                return { success: true, status: 200, message: 'Order details fetched', data: orderDetails };
            }
            return { success: false, status: 400, message: 'No order found', data: {} };
        }
        else {
            const orders = await order.findAll({
                where: {
                    order_id: order_id,
                    user_id: data?.user_id
                }
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


module.exports = {
    viewFilterOrders
}