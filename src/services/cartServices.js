const { cart, product } = require('../models/index');
const { Constants } = require('./constants');

const insertIntoCart = async (data, userId) => {
    try {
        let cartDetails = await cart.findOne({
            where: {
                user_id: userId
            }
        });
        //console.log(true, cartDetails);
        if (cartDetails) {
            const productDetails = await product.findOne({
                where: {
                    product_id: data?.product_id,
                    product_status: Constants?.PRODUCT_STATUS[0]
                }
            });
            if (productDetails) {
                //console.log('check1');
                const { product_id, size_id, color_id } = data;
                let productObj = {
                    product_id: product_id,
                    size_id: size_id,
                    color_id: color_id
                };
                console.log('check0', cartDetails?.dataValues);
                //let cartProductDetails = cartDetails?.dataValues?.product_details;
                let product_details = [...cartDetails?.dataValues?.product_details];
                console.log('check0')
                let foundProduct = product_details.filter(element => {
                    let { product_id, size_id, color_id } = element;
                    let cartObj = {
                        product_id: product_id,
                        size_id: size_id,
                        color_id: color_id
                    };
                    return JSON.stringify(cartObj) === JSON.stringify(productObj)

                });
                //console.log(foundProduct);
                if (foundProduct.length) {
                    //console.log('check2');
                    let otherProducts = product_details.filter(element => {
                        let { product_id, size_id, color_id } = element;
                        let cartObj = {
                            product_id: product_id,
                            size_id: size_id,
                            color_id: color_id
                        };
                        return JSON.stringify(cartObj) !== JSON.stringify(productObj)

                    });
                    let newQuantity = foundProduct[0]?.quantity + data?.quantity;
                    productObj['quantity'] = newQuantity;
                    otherProducts.push(productObj);
                    console.log('Inserted into cart');
                    await cart.update({
                        product_details: otherProducts
                    },
                        {
                            where: {
                                user_id: userId
                            }
                        });
                    return { status: "Product already exist... quantity updated" };
                }
                await cart.update(
                    {
                        product_details: data
                    },
                    {
                        where: {
                            user_id: userId
                        },
                    },
                );
                return { status: 200, message: "product added to cart" }
            }
            else {
                return { status: 200, message: "Product not found" };
            }
        }
        else if (!cartDetails) {
            return { status: 400, message: "User does not exist" };
        }
        else {
            return { status: 400, message: "Invalid details" };
        }
    }
    catch (err) {
        console.error(err);
        return { "error": err };
    }
}

const deleteFromCart = async (data, user_id) => {
    try {
        let cartDetails = await cart.findOne({
            where: {
                user_id: user_id
            }
        });

        if (cartDetails) {
            const productDetails = product.findOne({
                where: {
                    product_id: data?.product_id
                }
            });
            if (productDetails) {
                let product_details = [...cartDetails?.product_details];
                let foundProduct = product_details.filter(element => {
                    let { product_id, size_id, color_id } = element;
                    let cartObj = {
                        product_id: product_id,
                        size_id: size_id,
                        color_id: color_id
                    };
                    return JSON.stringify(cartObj) === JSON.stringify(data)

                });
                if (foundProduct.length) {
                    product_details = product_details.filter(element => {
                        let { product_id, size_id, color_id } = element;
                        let cartObj = {
                            product_id: product_id,
                            size_id: size_id,
                            color_id: color_id
                        };
                        return JSON.stringify(cartObj) !== JSON.stringify(data)
                    });
                    await cart.update(
                        {
                            product_details: product_details
                        },
                        {
                            where: {
                                user_id: user_id
                            },
                        },
                    );
                    return { status: 200, message: "Product removed from cart" };
                }

                return { status: 400, message: "product does not exist in cart" };
            }
            else {
                return { status: 400, message: "Product not found" };
            }
        }
        else if (!cartDetails) {
            return { status: 400, message: "User does not exist" };
        }
        else {
            return { status: 400, message: "Invalid details" };
        }
    }
    catch (err) {
        console.error(err);
        return { "error": err };
    }
}

const orderSummary = async (req) => {
    try {
        let { shipping_type, product_ids } = req?.body;
        let sub_amount = 0, total_amount = 0;
        let whereConditions = {};
        if (product_ids?.length) {
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
