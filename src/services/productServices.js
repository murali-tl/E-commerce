const { Op } = require('sequelize');
const { product, color, size, category } = require('../models/index');
const { Constants } = require('./constants');

const getProducts = async (data) => {
    try {
        let { page = 1, limit = 10, search, sort_by = 'rating', color_id, category_id } = data;
       let whereConditions = {
        deleted_at: null,
        product_status: Constants?.PRODUCT_STATUS[0],
    };
        if (!(typeof(color_id[0]) === 'undefined')) {
            whereConditions.color_ids = { 
                [Op.overlap]: color_id 
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
        const offset = (page - 1) * limit;
        const totalCount = await product.count({ where: whereConditions });
        const totalPages = Math.ceil(totalCount / limit);

        const products = await product.findAll({
            where: whereConditions,
            attributes: { exclude: ['createdAt', 'created_by', 'updated_by', 'updatedAt', 'deletedAt'] },
            order: [[sort_by, 'ASC']],
            limit: parseInt(limit),
            offset: offset,
        });
        let size_objs = await size?.findAll();
        products.forEach(obj => {
            obj["dataValues"]["sizes"] = [];
            obj?.size_ids?.forEach(sizeId => {
                for (let size_obj of size_objs) {
                    if (size_obj?.dataValues?.size_id === sizeId) {
                        obj["dataValues"]["sizes"].push(size_obj?.dataValues?.size_type);
                    }
                }
            });
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
            },
            attributes: { exclude: ['createdAt', 'created_by', 'updated_by', 'updatedAt', 'deletedAt'] },
        });
        if (!result.length) {
            return { success: true, message: "product not found", data: result };
        }
        let colorIds = result[0]?.color_ids;
        let sizeIds = result[0]?.size_ids;
        let categoryId = result[0]?.category_id;
        let resultObj = result[0].dataValues;
        let colors = await color.findAll({
            where: {
                color_id: colorIds
            },
            attributes: ['color_id', 'color_name', 'color_code']
        });
        let colorValues = [];
        colors.forEach(element => {
            colorValues.push(element.dataValues);
        });
        resultObj['colors'] = colorValues;
        let sizes = await size.findAll({
            where: {
                size_id: sizeIds
            },
            attributes: ['size_id', 'size_type']
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
            attributes: ['category_id', 'category_name']
        });
        resultObj['category'] = categoryy;
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
                attributes: { exclude: ['createdAt', 'created_by', 'updated_by', 'updatedAt', 'deletedAt'] },
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