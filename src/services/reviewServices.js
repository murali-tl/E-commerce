const { review, product } = require('../models/index');
const { sequelize } = require('../models/index');
const { QueryTypes } = require('sequelize');

const getReviews = async (productId) => {  // instead of user_id send user_name
    try {
        //const product_id = `${productId}`;
        const query = `
      SELECT reviews.*, users.full_name AS user_full_name
      FROM reviews
      INNER JOIN users ON reviews.user_id = users.user_id
      WHERE reviews.product_id = '${productId}'
    `;

        let [reviews, metadata] = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });
        if (!reviews) {
            reviews = [];
        }
        //console.log('===', reviews);
        //return results;
        // let reviews = await review.findAll({
        //     where: {
        //         product_id: req?.body?.product_id
        //     }
        // });
        let productDetails = await product.findOne({
            where: {
                product_id: productId
            }
        });
        if (productDetails) {
            let avg_rating = productDetails.dataValues?.rating;
            const ratings = await review.findAll({
                attributes: [
                    'rating',
                    [sequelize.fn('COUNT', sequelize.col('rating')), 'rating_count']
                ],
                group: ['rating'],
                raw: true
            });

            const ratingCounts = {};
            ratings.forEach(rating => {
                ratingCounts[rating.rating] = rating.rating_count;
            });
            //const userIds = reviews.map(item => item.user_id);

            return { status: true, message: "Details fetched", data: [reviews, avg_rating, ratingCounts] };
        }

        return { status: true, message: "Product not found", data: [[], 0, {}] };

    }
    catch (err) {
        console.log('==', err);
        return { status: false, message: "Error while fetching product reviews" };
    }
}

const addReview = async (data, user_id) => {
    try {
        const { product_id, title, description, rating } = data;
        let productDetails = await product.findOne({
            where: {
                product_id: product_id
            }
        });
        let reviewDetails = checkReview(user_id, product_id);
        if (productDetails && !reviewDetails) {
            await review.create({
                product_id: product_id,
                user_id: user_id,
                title: title,
                description: description,
                rating: rating,
                useful_count: 0,
                not_useful_count: 0,
                inappropriate_flag_count: 0
            });
            const result = await review.findOne({
                attributes: [
                    [sequelize.fn('avg', sequelize.col('rating')), 'avg_rating']
                ],
                where: {
                    product_id: product_id
                }
            });

            const averageRating = result.dataValues.avg_rating || 0;

            await product.update(
                { rating: averageRating },
                { where: { id: product_id } }
            );

            let reviewDetails = checkReview(user_id, product_id);
            return { success: true, status: 200, message: "Review added.", data: reviewDetails?.review_id };
        }
        else {
            return { success: false, status: 400, message: "Product not found or review already exist", data: {} };
        }
    }
    catch (err) {
        return { "error": err }
    }

}

const updateReview = async (data) => {
    try {
        const { review_id, is_useful, inappropriate_flag = false } = data;
        let reviewDetails = await review.findOne({
            where: {
                review_id: review_id
            }
        });
        if (review_id && reviewDetails) {
            let useful_count = 0, not_useful_count = 0, inappropriate_flag_count = 0;
            if (typeof (is_useful) === 'boolean') {
                useful_count = ((is_useful) ? 1 : 0);
                not_useful_count = ((is_useful) ? 0 : 1);
            }
            else {
                inappropriate_flag_count = ((inappropriate_flag) ? 1 : 0);
            }
            await review.update({
                useful_count: reviewDetails?.useful_count + useful_count,
                not_useful_count: reviewDetails?.not_useful_count + not_useful_count,
                inappropriate_flag_count: reviewDetails?.inappropriate_flag_count + inappropriate_flag_count
            },
                {
                    where: {
                        review_id: review_id
                    }
                },
            );
            return { success: true, status: 200, message: "Review updated.", data: reviewDetails?.review_id };
        }
        else {
            return { success: false, status: 400, message: "Review not found", data: {} };
        }
    }
    catch (err) {
        return { "error": err }
    }
}

const checkReview = async (userId, productId) => {
    let review = await review.findOne({
        where: {
            user_id: userId,
            product_id: productId
        }
    });
    return review;
}
module.exports = {
    getReviews,
    addReview, //add routes
    updateReview
}