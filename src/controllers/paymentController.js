const { orderSummary } = require('../services/cartServices');
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51Paw4TRrpeYldV0YLx1Zy1fd62mObPUpNBytFST6kTuWDL9qLThGQcSfJJaXmztZ0m1zvqHMjJvKpLhrsXPpqpI700Z7CA6wHH');
const { order} = require('../models/index');
const {ifPaymentSuccess} = require('../services/paymentServices');

const calculateOrderAmount = (productIds) => {
    let { sub_amount, total_amount } = orderSummary({
        product_ids: productIds
    })
    return total_amount || 0;
};

const createOrder = async (req, res) => {
    try {
        const amount = req?.body?.amount;
        const { product_details } = req.body;
        const productIds = product_details.map(obj => { return obj?.product_id });
        console.log(productIds);
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
            let createdOrder = await order.create({
                user_id: req?.user?.user_id,
                product_details: req?.body?.product_details,
                amount: amount,
                payment_status: 'pending',
                order_status: 'created',
                shipping_type: req?.body?.shipping_type,
                address: req?.body?.address,
                delivery_status: '',
                estimated_delivery_date: '',
                delivered_at: ''
            });
            const paymentIntent = await stripe.paymentIntents.create({
                amount: calculateOrderAmount(productIds),
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
        console.log(err);
    }
};

const confirmOrder = (request, response) => {
    try{
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
            //console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            ifPaymentSuccess(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log('case2')
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
}
catch(e){
    console.error('Error occurred in payment webhook', e);
}
};

module.exports = {
    createOrder,
    confirmOrder
}
