const { Response } = require("../services/constants");
const { getAllOrders, getOrderDetails, updateOrder, createProduct, removeProduct, updateProduct } = require('../services/adminServices');
const { isAdmin } = require('../services/validations');

const fetchAllOrders = async (req, res) => {
    if (await isAdmin(req?.user?.user_id)) {
        console.info('/admin/view-orders called');
        const result = await getAllOrders(req);
        if (result?.error) {
            return res.status(500).send(new Response(false, 'Error while fetching orders', { "error": result.error }));
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

const fetchSpecificOrder = async (req, res) => {
    if (await isAdmin(req?.user?.user_id)) {
        console.info('/admin/view-order called');
        const result = await getOrderDetails(req);
        if (result?.error) {
            return res.status(500).send(new Response(false, 'Error while fetching orders', { "error": result.error }));
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

const editOrder = async (req, res) => {
    if (await isAdmin(req?.user?.user_id)) {
        console.info('/admin/edit-order called');
        const result = await updateOrder(req);
        if (result?.error) {
            return res.status(500).send(new Response(false, 'Error while fetching orders', { "error": result.error }));
        }
        return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
    }
    else {
        return res.status(403).send(new Response(false, 'User is Forbidden', {}));
    }
}

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
        console.error("Error occured in addProduct", e);
        return res.status(500).send(new Response(false, 'Error while adding new product', { }));
    }
}

const deleteProduct = async (req, res) => {
    if (await isAdmin(req?.user?.user_id)) {
        console.info('/admin/delete-product called');   //
        const result = await removeProduct(req);
        if (result?.error) {
            return res.status(500).send(new Response(false, 'Error while removing product', { "error": result.error }));
        }
        return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
    }
    else {
        return res.status(403).send(new Response(false, 'User is Forbidden', {}));
    }
}

const editProduct = async (req) => {

}

module.exports = {
    fetchAllOrders,
    fetchSpecificOrder,
    editOrder,
    addProduct,
    deleteProduct,
    editProduct
}