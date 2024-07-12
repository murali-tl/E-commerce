const { wishlist, product } = require('../models/index');
// const wishlist = require('../models/wishlist');

const insertIntoWishList = async (data) => {
    try {
        let wishList = await wishlist.findOne({
            where: {
                user_id: data?.user_id
            }
        })
        if ((wishList.product_ids).includes(req?.body?.product_id)) {
            return { status: 'product already exist' };
        }
        else {
            const productDetails = product.findOne({
                where: {
                    product_id: data?.product_id,
                    product_status: 'available'
                }
            });
            if (productDetails) {
                let productIds = [...wishList['product_ids']];
                productIds.push(data?.product_id);
                await wishlist.update(
                    {
                        product_ids: productIds
                    },
                    {
                        where: {
                            user_id: data?.user_id
                        },
                    },
                );
                return { status: true, message: 'updated product to wishList' };
            }
            else {
                return { status: true, message: "Product not found" };
            }
        }
    }
    catch (err) {
        return { status: false, message: "Error while inserting into wishlist" };
    }
}

const deleteFromWishList = async (req) => {
    try {
        let wishList = await wishlist.findOne({
            where: {
                user_id: req?.user?.user_id
            }
        })
        if ((wishList.product_ids).includes(req?.body?.product_id)) {
            const productDetails = product.findOne({
                where: {
                    product_id: req?.body?.product_id,
                    product_status: 'available'
                }
            });
            if (productDetails) {
                let productIds = [...wishList['product_ids']];
                productIds = productIds.filter((item) => {
                    return item !== req?.body?.product_id;
                })
                await wishList.update(
                    {
                        product_ids: productIds
                    },
                    {
                        where: {
                            user_id: req?.user?.user_id
                        },
                    },
                );
                return { status: 'product removed from wishList' };
            }
            else {
                return { status: "Product not found" };
            }
        }
        else {

            return { status: 'product does not exist in wishList' };
        }
    }
    catch (err) {
        return { "error": err };
    }
}

module.exports = {
    insertIntoWishList,
    deleteFromWishList
}
