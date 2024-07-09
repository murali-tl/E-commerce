const { Response } = require("../services/constants");
const { createUser, getWishListDetails, getCartDetails } = require('../services/userServices');
const {insertIntoWishList, deleteFromWishList} = require('../services/wishListServices');
const {insertIntoCart, deleteFromCart, orderSummary} = require('../services/cartServices');
const {addReview, updateReview} = require('../services/reviewServices');
const {getAdresses, createAddress} = require('../services/addressServices');
const {viewFilterOrders} = require('../services/orderServices');

const registerUser = async (req, res,) => {
  console.info('/user/create-user called');
  const result = await createUser(req);
  //console.log(result);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while registering user', { "error": result.error }));
  }
  return res.status(200).send(new Response(true, 'User registered', { "user_id": result.user_id }));
}

const fetchWishList = async (req, res) => {
  console.info('/user/wish-list called');
  const result = await getWishListDetails(req);
  //console.log(result);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while fetching wishlist', { "error": result.error }));
  }
  if (result.length) {
    return res.status(200).send(new Response(true, 'WishList details fetched', result[0]));
  }
  return res.status(400).send(new Response(false, 'WishList empty!!', {}));
}

const addToWishList = async (req, res) => {
  console.info('/user/add-to-wish-list called');
  const result = await insertIntoWishList(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while adding product to wishlist', { "error": result.error }));
  }
  return res.status(200).send(new Response(true, result?.status , {}));
}

const removeFromWishList = async (req, res) => {
  console.info('/user/remove-from-wish-list called');
  const result = await deleteFromWishList(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while removing product from wishlist', { "error": result.error }));
  }
  return res.status(200).send(new Response(true, result?.status , {}));
}

const fetchCart = async (req, res) => {
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

const addToCart = async (req, res) => {
  console.info('/user/add-to-cart called.');
  const result = await insertIntoCart(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while adding product to cart', { "error": result.error }));
  }
  return res.status(200).send(new Response(true, result?.status , {}));
}

const removeFromCart = async (req, res) => {
  console.info('/user/remove-from-cart called');
  const result = await deleteFromCart(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while removing product from cart', { "error": result.error }));
  }
  return res.status(200).send(new Response(true, result?.status , {}));
}

const createReview = async (req, res) => {
  console.info('/user/create-review called');
  const result = await addReview(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while saving review', { "error": result.error }));
  }
  return res.status(result?.status).send(new Response(result?.success, result?.message , result?.data));
}

const markReview = async (req, res) => {
  console.info('/user/mark-review called');
  const result = await updateReview(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while updating review', { "error": result.error }));
  }
  return res.status(result?.status).send(new Response(result?.success, result?.message , result?.data));
}

const fetchAddresses = async (req, res) => {
  console.info('/user/addresses called.');
  const result = await getAdresses(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while fetchin addresses', { "error": result.error }));
  }
  return res.status(result?.status).send(new Response(result?.success, result?.message , result?.data));
}

const addAddress = async (req, res) => {
  console.info('/user/add-address called');
  const result = await createAddress(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while saving address', { "error": result.error }));
  }
  return res.status(result?.status).send(new Response(result?.success, result?.message , result?.data));
}

const viewFilterUserOrders = async (req, res) => {
  console.info('/user/view-orders called');
  const result = await viewFilterOrders(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while fetching orders', { "error": result.error }));
  }
  return res.status(result?.status).send(new Response(result?.success, result?.message , result?.data));
}

const calculateOrderAmount = async (req, res) => {
  console.info('/user/calculate-order-amount called');
  const result = await orderSummary(req);
  if (result?.error) {
    return res.status(500).send(new Response(false, 'Error while calculating order summary', { "error": result.error }));
  }
  return res.status(200).send(new Response(true, 'Order summary calculated' , result));
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