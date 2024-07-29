const { orderSummary } = require('../services/cartServices');
const { Response, Constants } = require('../services/constants');
const { checkProductStock } = require('../services/orderServices');
const { validateAddress, validateProductDetails } = require('../services/validations');
require('dotenv').config({ path: '../.env' });

const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY);
const { order } = require('../models/index');
const { ifPaymentSuccess } = require('../services/paymentServices');

const calculateOrderAmount = (shippingType, productDetails) => {
    let { total_amount } = orderSummary({ shipping_type: shippingType, product_details: productDetails })
    return total_amount || 0;
};

const createOrder = async (req, res) => {
    try {
        console.info('/user/cretae-order called');
        const amount = req?.body?.amount;
        const { product_details } = req.body;
        const validated = validateAddress(req?.body?.address);
        const productValidation = validateProductDetails(req?.body?.product_details);
        if (validated.error) {
            return res.status(400).send(new Response(false, 'Invalid address format', { "error": validated?.error.details }));
        }
        if (productValidation.error) {
            return res.status(400).send(new Response(false, 'Invalid product_details format', { "error": productValidation?.error.details }));
        }
        let productQuantities = {};
        for (let obj of req?.body?.product_details) {
            if (obj?.product_id in productQuantities) {
                productQuantities[obj?.product_id] += obj?.quantity;
            }
            else {
                productQuantities[obj?.product_id] = obj?.quantity;
            }
        }
        if (!checkProductStock(productQuantities)) {
            return res.status(200).send(new Response(true, 'Some of the products are out of stock', {}));
        }
        let calculatedAmount = calculateOrderAmount(req?.body?.shipping_type, product_details);
        if (amount && typeof (amount) === 'number') {
            let createdOrder = await order.create({
                user_id: req?.user?.user_id,
                product_details: req?.body?.product_details,
                amount: calculatedAmount,
                payment_status: Constants?.PAYMENT_STATUS[0],
                order_status: Constants?.ORDER_STATUS[0],
                shipping_type: req?.body?.shipping_type,
                address: req?.body?.address,
                delivery_status: '',
                estimated_delivery_date: '',
                delivered_at: ''
            });
            const paymentIntent = await stripe.paymentIntents.create({
                amount: calculatedAmount,
                currency: "usd",
                customer: req?.user?.user_id,
                metadata: {
                    order_id: createdOrder?.order_id
                },
                automatic_payment_methods: {
                    enabled: true,
                },

            });

            return res.status(200).send(new Response(true, 'Order Created', paymentIntent));
        }
        else {
            return res.status(400).send(new Response(false, 'Invalid amount', {}));
        }
    }
    catch (err) {
        console.error("Error while creating order.", err);
        return res.status(500).send(new Response(false, 'Internal server error in create order', {}))
    }
};

const confirmOrder = (request, response) => {
    try {
        console.info('/user/webhook called');
        let event = request.body;

        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = request.headers['stripe-signature'];
            try {
                event = stripe.webhooks.constructEvent(
                    request.body,
                    signature,
                    endpointSecret
                );
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed.`, err.message);
                return response.sendStatus(400);
            }
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                ifPaymentSuccess(paymentIntent);
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                console.log('case2');
                break;
            default:
                // Unexpected event type
                console.log(`Unhandled event type ${event.type}.`);
        }

        response.send();
    }
    catch (e) {
        console.error('Error occurred in payment webhook', e);
    }
};

module.exports = {
    createOrder,
    confirmOrder
}
