const { order, payment, cart } = require('../models/index');
const { Constants } = require('./constants');
const { addProductQuantity } = require('./utils');
const { deleteFromCart } = require('./cartServices');

const ifPaymentSuccess = async (paymentIntent) => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    if (paymentIntent?.shipping?.shipping_type) {
        futureDate.setDate(currentDate.getDate() + Constants.SHIPPING_DETAILS?.shipping_type[1]);
    }
    else {
        futureDate.setDate(currentDate.getDate() + 4);
    }
    order.update({
        order_status: Constants?.ORDER_STATUS[1],
        payment_status: Constants?.PAYMENT_STATUS[1],
        estimated_delivery_date: futureDate
    },
        {
            where: {
                order_id: paymentIntent?.metadata?.order_id
            }
        });
    const orderDetails = await order.findOne({
        where: {
            order_id: paymentIntent?.metadata?.order_id
        }
    });
    if (orderDetails) {
        const productsDetails = orderDetails?.product_details;
        if (productsDetails?.length > 1) {
            await cart.update({
                product_details: []
            },
                {
                    where: {
                        user_id: paymentIntent?.metadata?.user_id
                    }
                }
            );
        }
        else {
            let { product_id, color_id, size_id } = productsDetails[0];
            let dataObj = {
                product_id: product_id,
                color_id: color_id,
                size_id: size_id
            };
            await deleteFromCart(dataObj, paymentIntent?.metadata?.user_id);
        }
        await payment.create({
            payment_id: paymentIntent?.id,
            user_id: paymentIntent?.metadata?.user_id,
            payment_status: Constants?.PAYMENT_STATUS[1],
            order_id: paymentIntent?.metadata?.order_id,
            amount: paymentIntent?.amount,
            payment_type: paymentIntent?.payment_method_types[0]
        });
    }
    return;
}

const ifPaymentFailed = async (paymentIntent) => {
    order.update({
        order_status: Constants?.ORDER_STATUS[2],
        payment_status: Constants?.PAYMENT_STATUS[2],
    },
        {
            where: {
                order_id: paymentIntent?.metadata?.order_id
            }
        });
    const orderDetails = await order.findOne({
        where: {
            order_id: paymentIntent?.metadata?.order_id
        }
    });
    if (orderDetails) {
        const productsDetails = orderDetails?.product_details;
        productsDetails.forEach(element => {
            addProductQuantity(element?.product_id, element?.quantity);
        });
        await payment.create({
            payment_id: paymentIntent?.id,
            user_id: paymentIntent?.metadata?.user_id,
            payment_status: Constants?.PAYMENT_STATUS[2],
            order_id: paymentIntent?.metadata?.order_id,
            amount: paymentIntent?.amount,
            payment_type: paymentIntent?.payment_method_types[0]
        });
    }
    return;
}

module.exports = {
    ifPaymentSuccess,
    ifPaymentFailed
}