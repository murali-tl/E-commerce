const { Op } = require('sequelize');
const { product } = require('../models/index');

const getProducts = async (req) => {
    const categories = req?.body?.categories; //get categories as array
    const { page = 1, limit = 10, search, sort_by = 'rating' , color} = req?.query;
    let whereConditions = {};
    if(color){
        whereConditions.colours = {
            [sequelize.Sequelize.Op.contains]: [color],
        }
    }
    if (search) {
        whereConditions.product_name = { [Op.iLike]: `%${search}%` };
    }
    if (categories) {
        whereConditions.category = categories;
    }
    if (sort_by) {
        if (sort_by === 'recent') {
            sort_by = 'created_at';
        }
    }
    whereConditions.product_status = 'available';
    const offset = (page - 1) * limit;
    const totalCount = await product.count({ where: whereConditions });
    const totalPages = Math.ceil(totalCount / limit);

    const products = await product.findAll({
        where: whereConditions,
        order: [[sort_by, 'ASC']], //sort_by may need to change based on req
        limit: parseInt(limit),
        offset: offset,
    });
    return { products: products, totalPages: totalPages, current_page: page, total_orders: totalCount};
    
}

const getProduct = async (req) => {
    try {
        let result = await product.findAll({
            where: {
                product_id: req?.params?.product_id,
                product_status: 'available'
            }
        });
        if(result[0].product_status === 'available'){
        return result;
        }
        return [];
        
    }
    catch (err) {
        console.log(err);
        return {"error": err};
    }
}



const getRecentProducts = async (req) => {
    try {
        let products = await product.findAll(
            {
                where: {
                    product_status: 'available'
                },
                order: [['created_at', 'DESC']],
                limit: 3
            }
        )
        return products;
    }
    catch (err) {
        console.log(err);
        return {"error": err};
    }
}

module.exports = {
    getProducts,
    getProduct,
    getRecentProducts
}
