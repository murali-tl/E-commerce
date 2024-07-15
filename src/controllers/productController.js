const productService = require('../services/productServices.js');
const reviewService = require('../services/reviewServices.js');
const { Response } = require('../services/constants.js');


const fetchProducts = async (req, res) => {
    try {
        console.info(`/list-products called`);
        const { page = 1, limit = 10, search, sort_by = 'rating', color_id, category_id } = req?.query;
        const result = await productService.getProducts({ page: page, limit: limit, search: search, sort_by: sort_by, color_id: color_id, category_id: category_id });
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
        return res.status(200).send(new Response(true, product?.message, product.data));
    } catch (e) {
        console.error("Product Controller: Error occurred while fetching product", e)
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}

const fetchReviews = (req, res) => {
    try {
        const { productId } = req?.params?.product_id;
        console.info(`/reviews of ${productId} called`);
        const result = reviewService.getReviews(productId);
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
            console.log()
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
        //console.log(result);
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