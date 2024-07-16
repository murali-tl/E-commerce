const { product } = require('../models/index');
require('dotenv').config({ path: '../.env' });

const validateArgs = (arr) => {
    for (let ele of arr) {
        if (typeof (ele) === 'object' && !Array.isArray(ele) && !Object.keys(ele).length) {
            return false;
        }
        else if (typeof (ele) === 'object' && !ele.length) {
            return false;
        }
        else if (!ele) {
            return false;
        }
    }
    return true;
}

const updateProductQuantity = async (productId, soldQuantity) => {
    try{
    let productDetails = await product.findOne({
        where: {
            product_id: productId
        }
    });
    await product.update({
        quantity: productDetails?.quantity - soldQuantity
    },
        {
            where: {
                product_id: productId
            }
        }
    );}
    catch(e){
        console.error('Error while updating quantity for product:', productId);
    }
}

module.exports = {
    validateArgs,
    updateProductQuantity
}