const { user, wishlist, cart, product, role } = require('../models/index');
require('dotenv').config({ path: '../.env' });
const crypto = require('crypto');
const { validateUser } = require('../services/validations');

const createUser = async (data) => {
    const { full_name, email, password } = data;
    //const validated = validateUser(data);
    // if (validated.error) {
    //     return { "error": validated?.error.details };
    // }
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
        return { statusCode: 200, status: true, message: 'User registered', data: { user_id: currentUser?.user_id } };
    }

    catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return { statusCode: 409, status: true, "message": 'User already exist', data: {} };
        }
        console.error(err);
        return { status: false, message: "Error while registering user" };
    }
}

const getWishListDetails = async (userId) => {
    //console.log(req?.user);
    try {
        let result = await wishlist.findAll({
            where: {
                user_id: userId
            },
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },            
        })
        let products = await product.findAll({
            where: {
                product_id: result[0]?.product_ids
            },
            attributes: { exclude: ['createdAt', 'created_by', 'updated_by', 'updatedAt', 'deletedAt'] },            
        });
        result['products'] = products;
        return { status: true, data: result };
    }
    catch (err) {
        return { status: false, message: "Error occured while fetching Wishist details" };
    }
}

const getCartDetails = async (user_id) => {
    //console.log(req?.user);
    try {
        const cartDetails = await cart.findOne({
            where: {
                user_id: user_id
            },
            attributes: { exclude: ['createdAt', 'updatedAt' ] },            
        });
        //console.log(cartDetails);
        if (cartDetails?.product_details?.length) {
            const productIds = cartDetails.product_details.map(item => item.product_id);
            const products = await product.findAll({
                where: { product_id: productIds },
                attributes: ['product_id', 'product_name', 'images', 'price', 'category']
            });
            cartDetails.product_detail.forEach((element, index) => {
                products[index]['size'] = element?.size;
                products[index]['quantity'] = element?.quantity;
                products[index]['colour'] = element?.colour;
            });
            cartDetails["products"] = products;
        }
        return cartDetails;
    }
    catch (err) {
        console.error(err);
        return { "error": err };
    }
}



module.exports = {
    createUser,
    getWishListDetails,
    getCartDetails
}