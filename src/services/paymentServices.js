const { order, payment, product } = require('../models/index');
const { Constants } = require('./constants');
const { updateProductQuantity } = require('./utils');
const ifPaymentSuccess = async (paymentIntent) => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    if (paymentIntent?.shipping?.shipping_type) {
        futureDate.setDate(currentDate.getDate() + Constants.SHIPPING_DETAILS?.shipping_type[1]); //sure_post or ground_shipping
    }
    let futureTime = futureDate.setDate(currentDate.getDate() + 4);
    order.update({
        order_status: Constants?.ORDER_STATUS[1],
        payment_status: Constants?.PAYMENT_STATUS[1],
        estimated_delivery_date: futureTime
    },
        {
            where: {
                order_id: paymentIntent?.metadata?.order_id
            }
        });
    // update quantity in db
    const orderDetails = order.findOne({
        where: {
            order_id: paymentIntent?.metadata?.order_id
        }
    });
    if (orderDetails) {
        const productsDetails = orderDetails?.product_details;
        productsDetails.forEach(element => {
            updateProductQuantity(element?.product_id, element?.quantity);
        });
        await payment.create({
            payment_id: paymentIntent?.id,
            user_id: paymentIntent?.customer,
            payment_status: Constants?.PAYMENT_STATUS[1],
            order_id: paymentIntent?.metadata?.order_id,
            amount: paymentIntent?.amount,
            payment_type: paymentIntent?.payment_method_types[0]
        });
    }
    return;
}


module.exports = {
    ifPaymentSuccess
}