const { Response } = require('../services/constants');
const Razorpay = require('razorpay');
const { validateAddress, validateProductDetails } = require('../services/validations');
require('dotenv').config({ path: './.env' });
const { order, payment } = require('../models/index');
const {Constants} = require('../services/constants');

const createOrder = async (req, res) => {
    try {
        console.info('/user/createOrder called');
        const amount = req?.body?.amount;
        const validated = validateAddress(req?.body?.address);
        const productValidation = validateProductDetails(req?.body?.product_details);
        if (validated.error) {
            return res.status(400).send(new Response(false, 'Invalid address format', { "error": validated?.error.details }));
            //return { "error": validated?.error.details };
        }
        if (productValidation.error) {
            return res.status(400).send(new Response(false, 'Invalid product_details format', { "error": productValidation?.error.details }));
            //return { "error": validated?.error.details };
        }
        if (amount && typeof (amount) === 'number') {
            const instance = new Razorpay(
                {
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET
                }
            )
            const options = {
                amount: amount * 100,
                currency: "INR",
                receipt: "rcp#1",
            }
            const myOrder = await instance.orders.create(options);
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
            if(req?.body?.shipping_type){
                futureDate.setDate(currentDate.getDate() + Constants.SHIPPING_DETAILS?.shipping_type[1]); //sure_post or ground_shipping
            }
            futureDate.setDate(currentDate.getDate() + 4);
            const futureTimestamp = futureDate.getTime();
            // store data in database ??
            await order.create({
                order_id: myOrder?.id,
                user_id: req?.user?.user_id,
                product_details: req?.body?.product_details,
                amount: amount,
                payment_status: 'pending',
                order_status: 'placed',
                shipping_type: req?.body?.shipping_type,
                address: req?.body?.address,
                delivery_status: '',
                estimated_delivery_date: futureTimestamp,
                delivered_at: ''
            });
            return res.status(200).send(new Response(true, 'Order Created', myOrder));
        }
        else {
            return res.status(400).send(new Response(false, 'Invalid amount', {}));
        }
    }
    catch (err) {
        console.log(err);
    }
};


const verifyPaymentSignature = async (req, res) => {
    try {
        console.info('/payment/verify called');
        const { order_id, payment_id } = req?.body;
        const razorpay_signature = req.headers['x-razorpay-signature'];

        if (order_id && payment_id && razorpay_signature) {
            const key_secret = process.env.RAZORPAY_KEY_SECRET;


            let hmac = crypto.createHmac('sha256', key_secret);

            hmac.update(order_id + "|" + payment_id);

            const generated_signature = hmac.digest('hex');


            if (razorpay_signature === generated_signature) {
                const razorpayResponse = await fetch(`https://api.razorpay.com/v1/payments/${payment_id}`, {
                    headers: {
                        'Authorization': `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`
                    }
                });
                const razorpayData = await razorpayResponse.json();
                const { contact, email, amount } = razorpayData;

                await payment.create({
                    payment_id: payment_id,
                    order_id: order_id,
                    payment_status: 'paid',
                    user_id: req?.user?.user_id,
                    amount: amount,
                    contact: contact,
                    email: email
                });
                await order.update({
                    payment_status: 'paid'
                },
                    {
                        where: {
                            order_id: order_id
                        }
                    }
                );
                return res.json(new Response(true, "Payment has been verified", {}));
            }
        }
        return res.json(new Response(false, "Payment verification failed", {}));
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = {
    createOrder,
    verifyPaymentSignature
}