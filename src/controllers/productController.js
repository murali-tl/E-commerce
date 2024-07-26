const productService = require('../services/productServices.js');
const reviewService = require('../services/reviewServices.js');
const { Response } = require('../services/constants.js');

const fetchProducts = async (req, res) => {
    try {
        console.info(`/list-products called`);
        const { page = 1, limit = 10, search, sort_by = 'rating', category_id } = req?.query;
        const requestedColors = Array.isArray(req.query.color_id) ? req.query.color_id : [req.query.color_id];
        const result = await productService.getProducts({ page: page, limit: limit, search: search, sort_by: sort_by, color_id: requestedColors, category_id: category_id });
        if (!result?.success) {
            return res.status(500).send(new Response(false, 'Error while fetching products', {}));
        }
        return res.status(200).send(new Response(true, 'Products fetched', result));
    }
    catch (e) {
        console.error("Product Controller: Error occurred while fetching product", e)
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}

const fetchProduct = async (req, res) => {
    try {
        const productId = req?.params?.product_id;
        console.info(`/products/${productId} called`);
        if (!productId) {
            return res.status(400).send(new Response(false, 'Invalid details', {}));
        }
        const product = await productService.getProduct(productId);
        if (!product?.success) {
            return res.status(500).send(new Response(false, 'Error while fetching data', {}));
        }
        return res.status(200).send(new Response(true, product?.message, product.data[0]));
    } catch (e) {
        console.error("Product Controller: Error occurred while fetching product", e)
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}

const fetchReviews = async (req, res) => {
    try {
        const product_id = req?.params?.product_id;
        console.info(`/reviews of ${product_id} called`);
        const result = await reviewService.getReviews(product_id);
        if (!result?.status) {
            return res.status(500).send(new Response(false, 'Error while fetching reviews', {}));
        }
        return res.status(200).send(new Response(true, 'Product reviews fetched', { average_rating: result[1], reviews: result[0], ratings_count: result[2] }));
    }
    catch (e) {
        console.error("Product Controller: Error occurred while fetching Review", e)
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}

const fetchRecentProducts = async (req, res) => {
    try {
        console.info(`/home called`);
        const products = await productService.getRecentProducts();
        if (!products?.success) {
            return res.status(500).send(new Response(false, 'Error while fetching recent products', {}));
        }
        if (products?.products.length) {
            return res.status(200).send(new Response(true, 'Products details fetched', { products: products?.products }));
        }

        return res.status(200).send(new Response(true, 'Products not found', {}));
    }
    catch (e) {
        console.error("Product Controller: Error occurred while fetching recent products", e)
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}

const fetchProductParameters = async (req, res) => {
    try {
        console.info(`/get-product-parameters called`);
        const result = await productService.getProductParameters();
        if (!result?.success) {
            return res.status(500).send(new Response(false, 'Error while fetching products parameters', {}));
        }
        return res.status(200).send(new Response(true, 'Products parameters fetched', result?.data));
    }
    catch (e) {
        console.error("Product Controller: Error occurred while fetching recent products", e)
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}


module.exports = {
    fetchProduct,
    fetchProducts,
    fetchReviews,
    fetchRecentProducts,
    fetchProductParameters
}