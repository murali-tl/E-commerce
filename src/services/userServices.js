const { user, wishlist, cart, product, role } = require('../models/index');
require('dotenv').config({ path: '../.env' });
const crypto = require('crypto');
const { validateUser } = require('../services/validations');
const { attempt } = require('joi');

const createUser = async (req) => {

    const { full_name, email, password } = req?.body;
    const validated = validateUser(req?.body);
    if (validated.error) {
        return { "error": validated?.error.details };
        }
    try {
        const roleDetails = await role.findOne({
            where: {
                role_name: 'customer'
            }
        });
        await user.create({
            full_name: full_name,
            email: email,
            password: crypto.createHash('md5').update(password).digest('hex'),
            user_status: 'active',
            role_id: roleDetails?.role_id
        });
        let currentUser = await user.findOne({
            where: {
                email: email
            }
        });
        await wishlist.create({
            user_id: currentUser?.user_id,
            product_ids: []
        });
        await cart.create({
            user_id: currentUser?.user_id,
            product_details: []
        });
        return currentUser;
    }

    catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return { "error": 'User already exist' };
        }
        console.log(err);
        return { "error": err };
    }
}

const getWishListDetails = async (req) => {
    console.log(req?.user);
    try {
        let result = await wishlist.findAll({
            where: {
                user_id: req?.user?.user_id
            }
        })
        let products = await product.findAll({
            where: {
                product_id: result[0]?.product_ids
            }
        });
        result['products'] = products;
        return result;
    }
    catch (err) {
        return { "error": err };
    }
}

const getCartDetails = async (req) => {
    //console.log(req?.user);
    try {
        const cartDetails = await cart.findOne({
            where: {
                user_id: req?.user?.user_id
            }
        });
        //console.log(cartDetails);
        const productIds = cartDetails.product_details.map(item => item.product_id);
        const products = await product.findAll({
            where: { product_id: productIds },
            attributes: ['product_name', 'images', 'price', 'category']
        });
        cartDetails["products"] = products
        return cartDetails ;
    }
    catch (err) {
        console.log(err);
        return { "error": err };
    }
}



module.exports = {
    createUser,
    getWishListDetails,
    getCartDetails
}