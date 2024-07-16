const { Op } = require('sequelize');
const { product, color, size, category } = require('../models/index');
const { Constants } = require('./constants');

const getProducts = async (data) => {
    //const categories = req?.body?.categories; //get categories as array
    try {
        const { page = 1, limit = 10, search, sort_by = 'rating', color_id, category_id } = data;
        let whereConditions = {};
        if (color_id) {
            whereConditions.colour_ids = {
                [sequelize.Sequelize.Op.contains]: [color_id],
            }
        }
        if (search) {
            whereConditions.product_name = { [Op.iLike]: `%${search}%` };
        }
        if (category_id) {
            whereConditions.category_id = category_id;
        }
        if (sort_by) {
            if (sort_by === 'recent') {
                sort_by = 'created_at';
            }
        }
        whereConditions.product_status = Constants?.PRODUCT_STATUS[0];
        const offset = (page - 1) * limit;
        const totalCount = await product.count({ where: whereConditions });
        const totalPages = Math.ceil(totalCount / limit);

        const products = await product.findAll({
            where: whereConditions,
            order: [[sort_by, 'ASC']], //sort_by may need to change based on req
            limit: parseInt(limit),
            offset: offset,
        });
        return { success: true, products: products, totalPages: totalPages, current_page: page, total_productss: totalCount };
    }
    catch (e) {
        console.error(e);
        return { success: false };
    }
}

const getProduct = async (productId) => {
    try {
        let result = await product.findAll({
            where: {
                product_id: productId,
                product_status: Constants?.PRODUCT_STATUS[0]
            }
        });
        if (!result.length) {
            return { success: true, message: "product not found", data: result };
        }
        let colorIds = result[0]?.color_ids;
        let sizeIds = result[0]?.size_ids;
        let categoryId = result[0]?.category_id;
        //let colors = [];
        //console.log(result[0], 'check1', colorIds, sizeIds, categoryId);
        let resultObj = result[0].dataValues;
        let colors = await color.findAll({
            where: {
                color_id: colorIds
            },
            attributes: ['color_name']
        });
        //console.log(colors);
        let colorValues = [];
        colors.forEach(element => {
            colorValues.push(element.dataValues);
        });
        resultObj['colors'] = colorValues;
        let sizes = await size.findAll({
            where: {
                size_id: sizeIds
            },
            attributes: ['size_type']
        });
        let sizeValues = [];
        sizes.forEach(element => {
            sizeValues.push(element.dataValues);
        });
        resultObj['sizes'] = sizeValues;
        let categoryy = await category.findOne({
            where: {
                category_id: categoryId
            },
            attributes: ['category_name']
        });
        resultObj['category'] = categoryy.dataValues;
        //console.log(resultObj)
        if (result?.length) {
            return { success: true, message: "product details fetched", data: result };
        }
    }
    catch (err) {
        console.error("Exception occurred in get products ", err);
        return { success: false, message: "Error occurred while fetching product" };
    }
}



const getRecentProducts = async () => {
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
        return { success: true, products: products };
    }
    catch (err) {
        console.log(err);
        return { success: false, message: "Error occurred while fetching recent products" };
    }
}

const getProductParameters = async () => {
    try {
        let colors = await color.findAll({
            attributes: ['color_id', 'color_name', 'color_code']
        });
        let sizes = await size.findAll({
            attributes: ['size_id', 'size_type']
        });
        let categories = await category.findAll({
            attributes: ['category_id', 'category_name']
        });
        //console.log(colors, sizes, categories);
        return {
            success: true, message: "product parameters fetched", data: {
                colors: colors,
                sizes: sizes,
                categories: categories
            }
        };

    }
    catch (e) {
        console.error(e);
        return { success: false, message: "Error occurred while fetching product parameters" };

    }
}
module.exports = {
    getProducts,
    getProduct,
    getRecentProducts,
    getProductParameters
}
