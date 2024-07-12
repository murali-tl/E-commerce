const { Response } = require("../services/constants");
const { createUser, getWishListDetails, getCartDetails } = require('../services/userServices');
const { insertIntoWishList, deleteFromWishList } = require('../services/wishListServices');
const { insertIntoCart, deleteFromCart, orderSummary } = require('../services/cartServices');
const { addReview, updateReview } = require('../services/reviewServices');
const { getAdresses, createAddress } = require('../services/addressServices');
const { viewFilterOrders } = require('../services/orderServices');
const { validateUser } = require('../services/validations');

const registerUser = async (req, res,) => {
  try {
    console.info('/user/create-user called');
    const { full_name, email, password } = req?.body;
    const validated = validateUser(req?.body);
    if (validated?.error) {
      return res.status(400).send(new Response(false, 'Invalid details', { "error": validated?.error }));
    }
    const result = await createUser({ full_name, email, password });
    //console.log(result);
    if (!result?.status) {
      return res.status(500).send(new Response(false, result?.message, {}));
    }
    return res.status(200).send(new Response(true, 'User registered', { "user_id": result?.data?.user_id }));
  }
  catch (e) {
    console.error("Error occurred while registering user", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const fetchWishList = async (req, res) => {
  try {
    console.info('/user/wish-list called');
    const userId = req?.user?.user_id;
    const result = await getWishListDetails(userId);
    //console.log(result);
    if (!result?.status) {
      return res.status(500).send(new Response(false, 'Error while fetching wishlist', {}));
    }
    if (result?.data?.length) {
      return res.status(200).send(new Response(true, 'WishList details fetched', result?.data[0]));
    }
    return res.status(200).send(new Response(true, 'WishList empty!!', {}));
  }
  catch (e) {
    console.error("Error occurred while fetching wishList", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const addToWishList = async (req, res) => {
  try {
    console.info('/user/add-to-wish-list called');
    const userId = req?.user?.user_id;
    const { product_id } = req?.body;
    const result = await insertIntoWishList({ user_id: userId, product_id: product_id });
    if (!result?.status) {
      return res.status(500).send(new Response(false, 'Error while adding product to wishlist', { "error": result.error }));
    }
    return res.status(200).send(new Response(true, result?.message, {}));
  }
  catch (e) {
    console.error("Error occurred while adding to wishlist", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}
//
const removeFromWishList = async (req, res) => {
  try {
    console.info('/user/remove-from-wish-list called');
    const result = await deleteFromWishList(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while removing product from wishlist', { "error": result.error }));
    }
    return res.status(200).send(new Response(true, result?.status, {}));
  }
  catch (e) {
    console.error("Error occurred while removing from wishlist", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const fetchCart = async (req, res) => {
  try {
    console.info('/user/cart called');
    const result = await getCartDetails(req);
    //console.log(result);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while fetching cart', { "error": result.error }));
    }
    if (result.length) {
      return res.status(200).send(new Response(true, 'Cart details fetched', result));
    }
    return res.status(400).send(new Response(false, 'Cart empty!!', {}));
  }
  catch (e) {
    console.error("Error occurred while fetching cart", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const addToCart = async (req, res) => {
  try {
    console.info('/user/add-to-cart called.');
    const result = await insertIntoCart(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while adding product to cart', { "error": result.error }));
    }
    return res.status(200).send(new Response(true, result?.status, {}));
  }
  catch (e) {
    console.error("Error occurred while adding to cart", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const removeFromCart = async (req, res) => {
  try {
    console.info('/user/remove-from-cart called');
    const result = await deleteFromCart(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while removing product from cart', { "error": result.error }));
    }
    return res.status(200).send(new Response(true, result?.status, {}));
  }
  catch (e) {
    console.error("Error occurred while removing from cart", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const createReview = async (req, res) => {
  try {
    console.info('/user/create-review called');
    const result = await addReview(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while saving review', { "error": result.error }));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Error occurred while creating Review", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const markReview = async (req, res) => {
  try {
    console.info('/user/mark-review called');
    const result = await updateReview(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while updating review', { "error": result.error }));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Error occurred while marking Review", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const fetchAddresses = async (req, res) => {
  try {
    console.info('/user/addresses called.');
    const result = await getAdresses(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while fetchin addresses', { "error": result.error }));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Error occurred while fetching addresses of user", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const addAddress = async (req, res) => {
  try {
    console.info('/user/add-address called');
    const result = await createAddress(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while saving address', { "error": result.error }));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Error occurred while adding address", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const viewFilterUserOrders = async (req, res) => {
  try {
    console.info('/user/view-orders called');
    const result = await viewFilterOrders(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while fetching orders', { "error": result.error }));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Error occurred while fetchin user orders", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const calculateOrderAmount = async (req, res) => {
  try {
    console.info('/user/calculate-order-amount called');
    const result = await orderSummary(req);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while calculating order summary', { "error": result.error }));
    }
    return res.status(200).send(new Response(true, 'Order summary calculated', result));
  }
  catch (e) {
    console.error("Error occurred while calculating order amount", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

module.exports = {
  registerUser,
  fetchWishList,
  addToWishList,
  removeFromWishList,
  fetchCart,
  addToCart,
  removeFromCart,
  createReview,
  markReview,
  fetchAddresses,
  addAddress,
  viewFilterUserOrders,
  calculateOrderAmount
}