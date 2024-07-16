const { order, product } = require('../models/index');
const { validateProduct, validateUUID } = require('./validations');
const { Constants } = require('./constants');

const getAllOrders = async (req) => {
    try {
        const { page = 1, limit = 10, search } = req?.query;
        let whereConditions = {};
        if (search) {
            whereConditions = {
                [Op.or]: [{
                    order_id: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    user_id: {
                        [Op.like]: `%${search}%`
                    }
                }
                ]
            }
        }

        const offset = (page - 1) * limit;
        const totalCount = await order.count({ where: whereConditions });
        const totalPages = Math.ceil(totalCount / limit);
        const orders = await order.findAll({
            where: whereConditions,
            attributes: ['user_id', 'order_id'],
            limit: parseInt(limit),
            offset: offset,
        });
        return { orders: orders, totalPages: totalPages, current_page: page, total_orders: totalCount };
        //const orders = await order.findAll();
    }
    catch (err) {
        return { "error": err };
    }
}

const getOrderDetails = async (orderId) => {
    try {
        const orderDetails = await order.findOne({
            where: {
                order_id: orderId
            }
        });
        const productIds = cart.product_details.map(item => item.product_id);
        const products = await product.findAll({
            where: { product_id: productIds },
            attributes: ['product_name', 'images', 'price', 'category']
        });
        orderDetails["products"] = products;
        return orderDetails;
    }
    catch (err) {
        return { success: false, "error": err };
    }
}

// const updateOrder = async (req) => {
//     try {
//         const { order_id, estimated_delivery_date, delivery_status } = req?.body;
//         const orderDetails = await order.findOne({
//             where: {
//                 order_id: order_id
//             }
//         });
//         if (!orderDetails) {
//             return { status: 400, success: false, message: 'order not found', data: {} };
//         }
//         let details_to_update = {};
//         if (estimated_delivery_date) {
//             details_to_update.estimated_delivery_date = estimated_delivery_date;
//         }
//         if (delivery_status) {
//             details_to_update.delivery_status = delivery_status;
//         }
//         await order.update(
//             details_to_update,
//             {
//                 where: {
//                     order_id: orderDetails?.order_id
//                 }
//             }
//         );
//         return { status: 200, success: true, message: 'Order details updated', data: { order_id: order_id } };
//     }
//     catch (err) {
//         return { "error": err };
//     }
// }

const createProduct = async (data) => {
    try {
        const productAdded = await product.create({
            product_name: data?.product_name,
            description: data?.description,
            images: data?.images,
            quantity: data?.quantity,
            size_ids: data?.size_ids,
            price: data?.price,
            color_ids: data?.color_ids,
            category_id: data?.category_id,
            product_status: Constants?.PRODUCT_STATUS[0],
        })
        return { success: true, status: 200, message: 'Product created', data: { product_id: productAdded?.product_id } }; //should we need to send product_details
    }
    catch (err) {
        return { success: false, message: " Error while creating new prodct" , err};
    }
}

const removeProduct = async (data) => {
    try {
        const { product_id } = data;
        let validate = validateUUID(data);
        if (validate.error) {
            return { status: 400, message: 'Product_id invalid', success: false, data: {} }
        }
        let result = product.update({
            product_status: Constants?.PRODUCT_STATUS[1]
        },
            {
                where: {
                    product_id: product_id
                }
            });
        if (result?.affectedRows > 0) { //check affectedRows or count
            return { success: true, status: 200, message: 'Product removed', data: {} };
        }
        return { success: false, status: 400, message: 'Product not found', data: {} };
    }
    catch (err) {
        return { "error": err };
    }
}

const updateProduct = async (data) => { //check product quantity
    let result = validateProduct(data);
    if (result.error) {
        return { "error": result.error.details };
    }
    try {
        let result = await product.update({
            product_name: data?.product_name,
            description: data?.description,
            images: data?.images,
            quantity: data?.quantity,
            sizes: data?.sizes,
            price: data?.price,
            colours: data?.colours,
            category: data?.category,
        },
            {
                where: {
                    product_id: data?.product_id
                }
            }
        );
        if (result?.affectedRows > 0) {
            return { success: true, status: 200, message: 'Product removed', data: {} };
        }
        return { success: false, status: 400, message: 'Product not found', data: {} };
    }
    catch (err) {
        console.error('error occurred while adding product', err)
        return { "error": 'error occurred' };
    }
}

module.exports = {
    getAllOrders,
    getOrderDetails,
    //updateOrder,
    createProduct,
    removeProduct,
    updateProduct
}