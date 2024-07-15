const { order, payment } = require('../models/index');

const ifPaymentSuccess = async (paymentIntent) => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    if (paymentIntent?.shipping?.shipping_type) {
        futureDate.setDate(currentDate.getDate() + Constants.SHIPPING_DETAILS?.shipping_type[1]); //sure_post or ground_shipping
    }
    let futureTime = futureDate.setDate(currentDate.getDate() + 4);
    order.update({
        order_status: 'placed',
        payment_status: 'paid',
        estimated_delivery_date: futureTime
    },
        {
            where: {
                order_id: paymentIntent?.metadata?.order_id
            }
        });
    await payment.create({
        payment_id: paymentIntent?.id,
        user_id: paymentIntent?.customer,
        payment_status: 'paid',
        order_id: paymentIntent?.metadata?.order_id,
        amount: paymentIntent?.amount,
        payment_type: paymentIntent?.payment_method_types[0]
    });
    return ;
}


module.exports = {
    ifPaymentSuccess
}