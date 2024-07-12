const { cart, product } = require('../models/index');
const { Constants } = require('./constants');

const insertIntoCart = async (req) => {
    try {
        let cartDetails = await cart.findOne({
            where: {
                user_id: req?.user?.user_id
            }
        });
        if (cartDetails && req?.body?.product_id && req?.body?.size && req?.body?.colour && req?.body?.quantity) {
            const productDetails = product.findOne({
                where: {
                    product_id: req?.body?.product_id,
                    product_status: 'available'
                }
            });
            if (productDetails) {
                const { product_id, size, colour } = req?.body;
                let productObj = {
                    product_id: product_id,
                    size: size,
                    colour: colour
                };
                let product_details = [...cartDetails?.product_details];
                let foundProduct = product_details.filter(element => {
                    let { product_id, size, colour } = element;
                    let cartObj = {
                        product_id: product_id,
                        size: size,
                        colour: colour
                    };
                    return JSON.stringify(cartObj) === JSON.stringify(productObj)

                });
                //console.log(foundProduct);
                if (foundProduct.length) {
                    let otherProducts = product_details.filter(element => {
                        let { product_id, size, colour } = element;
                        let cartObj = {
                            product_id: product_id,
                            size: size,
                            colour: colour
                        };
                        return JSON.stringify(cartObj) !== JSON.stringify(productObj)

                    });
                    let newQuantity = foundProduct[0]?.quantity + req?.body?.quantity;
                    productObj['quantity'] = newQuantity;
                    otherProducts.push(productObj);
                    await cart.update({
                        product_details: otherProducts
                    },
                        {
                            where: {
                                user_id: req?.user?.user_id
                            }
                        });
                    return { status: "Product already exist... quantity updated" };
                }
                await cart.update(
                    {
                        product_details: req?.body
                    },
                    {
                        where: {
                            user_id: req?.user?.user_id
                        },
                    },
                );
                return { status: "product added to cart" }
            }
            else {
                return { status: "Product not found" };
            }
        }
        else if (!cartDetails) {
            return { status: "User does not exist" };
        }
        else {
            return { status: "Invalid details" };
        }
    }
    catch (err) {
        return { "error": err };
    }
}

const deleteFromCart = async (req) => {
    try {
        let cartDetails = await cart.findOne({
            where: {
                user_id: req?.user?.user_id
            }
        })
        if (cartDetails && req?.body?.product_id && req?.body?.size && req?.body?.colour && req?.body?.quantity) {
            const productDetails = product.findOne({
                where: {
                    product_id: req?.body?.product_id
                }
            });
            if (productDetails) {
                let { product_details } = [...cartDetails?.product_details];
                let foundProduct = product_details.filter(element => {
                    return JSON.stringify(element) === JSON.stringify(req?.body)

                });
                if (foundProduct.length) {
                    product_details = product_details.filter(element => {
                        return JSON.stringify(element) !== JSON.stringify(req?.body)
                    });
                    await cart.update(
                        {
                            product_details: product_details
                        },
                        {
                            where: {
                                user_id: req?.user?.user_id
                            },
                        },
                    );
                    return { status: "Product removed from cart" };
                }

                return { status: "product does not exist in cart" };
            }
            else {
                return { status: "Product not found" };
            }
        }
        else if (!cartDetails) {
            return { status: "User does not exist" };
        }
        else {
            return { status: "Invalid details" };
        }
    }
    catch (err) {
        return { "error": err };
    }
}

const orderSummary = async (req) => {
    try {
        let { shipping_type, product_ids } = req?.body;
        let sub_amount = 0, total_amount = 0;
        let whereConditions = {};
        if(product_ids?.length){
            whereConditions['product_id'] = [product_ids]
        }
        const product_prices = await product.findAll({
            where: whereConditions,
            attributes: ['price']
        })
        sub_amount = product_prices.reduce((acc, value) => {
            return acc + value;
        }, 0);
        total_amount = sub_amount;
        if (shipping_type && (shipping_type in Constants.SHIPPING_DETAILS)) {
            total_amount += Constants.SHIPPING_DETAILS?.shipping_type;
        }
        return { total_amount: total_amount, sub_amount: sub_amount };
    }
    catch (err) {
        console.log(err);
        return { "error": err };
    }
}

module.exports = {
    insertIntoCart,
    deleteFromCart,
    orderSummary
}
