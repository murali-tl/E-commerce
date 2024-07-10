const productService = require('../services/productServices.js');
const reviewService = require('../services/reviewServices.js');
const {Response} = require('../services/constants.js');


const fetchProducts = async (req, res) => {
    const result = await productService.getProducts(req);
    if (result?.error) {
        return res.status(500).send(new Response(false, 'Error while fetching products', { "error": result.error }));
    }
    return res.status(200).send(new Response(true, 'Products fetched', result));
    
}

const fetchProduct = async (req, res) => {
    //console.log('hello');
    console.info('/products/:product_id called');
    const products = await productService.getProduct(req);
    if (products?.error) {
        return res.status(500).send(new Response(false, 'Error while fetching data', { error: products.error }));
    }
    if (products.length) {
        return res.status(200).send(new Response(true, 'Product details fetched', products[0]));
    }

    return res.status(400).send(new Response(false, 'Product not found', {}));

}

const fetchReviews = (req, res) => {
    const result = reviewService.getReviews(req);
    if (result?.error) {
        return res.status(500).send(new Response(false, 'Error while fetching data', { error: product.error }));
    }
    if (result[0].length) {
        return res.status(200).send(new Response(true, 'Product reviews fetched', {average_rating: result[1], reviews: result[0], ratings_count: result[2]})); 
    }
    return res.status(400).send(new Response(false, 'Reviews not found', {}));
}

const fetchRecentProducts = async (req, res) => {
    const products = await productService.getRecentProducts();
    if (products?.error) {
        return res.status(500).send(new Response(false, 'Error while fetching data', { error: products.error }));
    }
    if (products.length) {
        return res.status(200).send(new Response(true, 'Products details fetched', {products: products}));
    }

    return res.status(400).send(new Response(false, 'Products not found', {}));
}


module.exports = {
    fetchProduct,
    fetchProducts,
    fetchReviews,
    fetchRecentProducts
}