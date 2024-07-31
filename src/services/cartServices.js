const { cart, product } = require('../models/index');
const { Constants } = require('./constants');

const insertIntoCart = async (data, userId) => {
    try {
        let cartDetails = await cart.findOne({
            where: {
                user_id: userId
            }
        });
        if (!cartDetails) {
            return { status: 400, message: "User does not exist" };
        }
        if (cartDetails) {
            const productDetails = await product.findOne({
                where: {
                    product_id: data?.product_id,
                    product_status: Constants?.PRODUCT_STATUS[0]
                }
            });
            if(!productDetails){
                return { status: 200, message: "Product not found" };
            }
            if (productDetails) {
                const { product_id, size_id, color_id } = data;
                let productObj = {
                    product_id: product_id,
                    size_id: size_id,
                    color_id: color_id
                };
                // Check available stock in DB
                let quantityInCart = 0;
                cartDetails?.product_details?.forEach(productObj => {
                    if (productObj?.product_id == product_id) {
                        quantityInCart += productObj?.quantity;
                    }
                });
                let maxQuantity = productDetails?.quantity;
                if (quantityInCart > 0) {
                    maxQuantity -= quantityInCart;
                }
                if ((maxQuantity - data?.quantity) < 0) {
                    return { status: 200, message: "Cannot update Quantity: Current quantity exceeds product Stock", data: { cart_size: cartDetails?.product_details?.length } };
                }
                let product_details = [...cartDetails?.dataValues?.product_details];
                let foundProduct = product_details.filter(element => {
                    let { product_id, size_id, color_id } = element;
                    let cartObj = {
                        product_id: product_id,
                        size_id: size_id,
                        color_id: color_id
                    };
                    return JSON.stringify(cartObj) === JSON.stringify(productObj)

                });
                if (foundProduct?.length) {
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
                    return { status: 200, message: "Product already exist... quantity updated", data: { cart_size: otherProducts?.length } };
                }
                product_details.push(data);
                await cart.update(
                    {
                        product_details: product_details
                    },
                    {
                        where: {
                            user_id: userId
                        },
                    },
                );
                return { status: 200, message: "product added to cart", data: { cart_size: product_details?.length } }
            }
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
        if (!cartDetails) {
            return { status: 400, message: "User does not exist" };
        }
        if (cartDetails) {
            const productDetails = product.findOne({
                where: {
                    product_id: data?.product_id
                }
            });
            if (!productDetails) {
                return { status: 400, message: "Product not found" };
            }
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

        }
        return { status: 400, message: "Invalid details" };
    }
    catch (err) {
        console.error(err);
        return { "error": err };
    }
}

const orderSummary = async (req) => {
    try {
        let { shipping_type, product_details } = req?.body;
        let sub_amount = 0, total_amount = 0;
        let whereConditions = {};
        const productIds = product_details?.map(item => item.product_id);
        if (productIds?.length) {
            whereConditions['product_id'] = productIds
        }
        const products = await product.findAll({
            where: whereConditions,
            attributes: ['product_id', 'price']
        });
        product_details.forEach(element => {
            const productItem = products.find(item => item.product_id === element?.product_id);
            sub_amount += (element?.quantity * productItem?.price);
        });
        total_amount = sub_amount;
        if (shipping_type && (shipping_type in Constants.SHIPPING_DETAILS)) {
            total_amount += Constants.SHIPPING_DETAILS[shipping_type][1];
        }
        return { total_amount: total_amount, sub_amount: sub_amount };
    }
    catch (err) {
        console.error(err);
        return { "error": err };
    }
}

module.exports = {
    insertIntoCart,
    deleteFromCart,
    orderSummary,
}