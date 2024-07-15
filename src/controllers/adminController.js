const { Response } = require("../services/constants");
const { getAllOrders, getOrderDetails, createProduct, removeProduct, updateProduct } = require('../services/adminServices');
const { isAdmin } = require('../services/validations');

const fetchAllOrders = async (req, res) => {
    try {
        if (await isAdmin(req?.user?.user_id)) {
            console.info('/admin/view-orders called');
            const result = await getAllOrders(req);
            if (result?.error) {
                return res.status(500).send(new Response(false, 'Error while fetching orders', {}));
            }
            return res.status(200).send(new Response(true, 'Orders fetched', result));
            // if (result?.orders?.length) {
            // }
            // return res.status(400).send(new Response(false, 'Orders empty!!', { orders: []}));
        }
        else {
            return res.status(403).send(new Response(false, 'User is Forbidden', {}));
        }
    }
    catch (e) {
        console.error('Admin Controller: Error occured in fetch orders', e);
        return res.status(500).send(new Response(false, 'Error while fetching orders', {}));
    }
}

const fetchSpecificOrder = async (req, res) => {  //use path params
    try {
        if (await isAdmin(req?.user?.user_id)) {
            console.info('/admin/view-order called');
            const order_id = req?.params?.order_id;
            const result = await getOrderDetails(order_id);
            if (result?.error) {
                return res.status(500).send(new Response(false, 'Error while fetching order details', {}));
            }
            if (result) {
                return res.status(200).send(new Response(true, 'Order details fetched', result));
            }
            return res.status(400).send(new Response(false, 'Order not found', {}));
        }
        else {
            return res.status(403).send(new Response(false, 'User is Forbidden', {}));
        }
    }
    catch (e) {
        console.error('Admin Controller: Error occurred in fetching order details', e);
        return res.status(500).send(new Response(false, 'Error while fetching order details', {}));
    }
}

// const editOrder = async (req, res) => {
//     if (await isAdmin(req?.user?.user_id)) {
//         console.info('/admin/edit-order called');
//         const result = await updateOrder(req);
//         if (result?.error) {
//             return res.status(500).send(new Response(false, 'Error while fetching orders', {}));
//         }
//         return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
//     }
//     else {
//         return res.status(403).send(new Response(false, 'User is Forbidden', {}));
//     }
// }

const addProduct = async (req, res) => {
    try {
        if (await isAdmin(req?.user?.user_id)) {
            console.info('/admin/add-product called');   //
            const result = await createProduct(req?.body);
            if (!result?.success) {
                return res.status(500).send(new Response(false, 'Error while adding new productt', {}));
            }
            return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
        }
        else {
            return res.status(403).send(new Response(false, 'User is Forbidden', {}));
        }
    }
    catch (e) {
        console.error("Admin Controller: Error occured in addProduct", e);
        return res.status(500).send(new Response(false, 'Error while adding new product', {}));
    }
}

const deleteProduct = async (req, res) => {
    try {
        if (await isAdmin(req?.user?.user_id)) {
            console.info('/admin/delete-product called');   //
            const { product_id } = req?.body;
            const result = await removeProduct({ product_id: product_id });
            if (result?.error) {
                return res.status(500).send(new Response(false, 'Error while removing product', {}));
            }
            return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
        }
        else {
            return res.status(403).send(new Response(false, 'User is Forbidden', {}));
        }
    }
    catch (e) {
        console.error('Admin Controller: Error occurred while deleting product', e);
        return res.status(500).send(new Response(false, 'Error while removing product', {}));
    }
}

const editProduct = async (req) => {
    try {
        if (await isAdmin(req?.user?.user_id)) {
            console.info('/admin/delete-product called');   //
            const result = await updateProduct(req?.body);
            if (result?.error) {
                return res.status(500).send(new Response(false, 'Error while updating product', {}));
            }
            return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
        }
        else {
            return res.status(403).send(new Response(false, 'User is Forbidden', {}));
        }
    }
    catch (e) {
        console.error('Admin Controller: Error occurred while updating product', e);
        return res.status(500).send(new Response(false, 'Error while updating product', {}));
    }
}

module.exports = {
    fetchAllOrders,
    fetchSpecificOrder,
    //editOrder,
    addProduct,
    deleteProduct,
    editProduct
}