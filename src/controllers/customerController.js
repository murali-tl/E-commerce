const { Response } = require("../services/constants");
const { createUser, getWishListDetails, getCartDetails } = require('../services/userServices');
const { insertIntoWishList, deleteFromWishList } = require('../services/wishListServices');
const { insertIntoCart, deleteFromCart, orderSummary, updateCartProduct } = require('../services/cartServices');
const { getAdresses, createAddress } = require('../services/addressServices');
const { viewFilterOrders } = require('../services/orderServices');
const { validateUser, validateAddress, validateCartDetails } = require('../services/validations');
// const { addReview, updateReview } = require('../services/reviewServices'); //commented based on discussion with FE

const registerUser = async (req, res,) => {
  try {
    console.info('/user/create-user called');
    const { full_name, email, password } = req?.body;
    const validated = validateUser(req?.body);
    if (validated?.error) {
      return res.status(400).send(new Response(false, 'Invalid details', { "error": validated?.error }));
    }
    const result = await createUser({ full_name: full_name, email: email, password: password });
    if (!result?.status) {
      return res.status(500).send(new Response(false, result?.message, {}));
    }
    return res.status(result?.statusCode).send(new Response(true, result?.message, result?.data));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while registering user", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const fetchWishList = async (req, res) => {
  try {
    console.info('/user/wish-list called');
    const userId = req?.user?.user_id;
    const result = await getWishListDetails(userId);
    if (!result?.status) {
      return res.status(500).send(new Response(false, 'Error while fetching wishlist', {}));
    }
    if (result?.data?.length) {
      return res.status(200).send(new Response(true, 'WishList details fetched', result?.data[0]));
    }
    return res.status(200).send(new Response(true, 'WishList empty!!', {}));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while fetching wishList", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const addToWishList = async (req, res) => {
  try {
    console.info('/user/add-to-wish-list called');
    const userId = req?.user?.user_id;
    const { product_id } = req?.body;
    if(!userId || !product_id){
      return res.status(400).send(new Response(false, 'Invalid details', {}));
    }
    const result = await insertIntoWishList({ user_id: userId, product_id: product_id });
    if (!result?.success) {
      return res.status(500).send(new Response(false, 'Error while adding product to wishlist', {}));
    }
    return res.status(200).send(new Response(true, result?.message, {}));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while adding to wishlist", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const removeFromWishList = async (req, res) => {
  try {
    console.info('/user/remove-from-wish-list called');
    const userId = req?.user?.user_id;
    const product_id = req?.params?.product_id;
    const result = await deleteFromWishList({ user_id: userId, product_id: product_id });
    if (!result?.success) {
      return res.status(500).send(new Response(false, 'Error while removing product from wishlist', {}));
    }
    return res.status(200).send(new Response(true, result?.message, {}));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while removing from wishlist", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const fetchCart = async (req, res) => {
  try {
    console.info('/user/cart called');
    const userId = req?.user?.user_id;
    const result = await getCartDetails(userId);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while fetching cart', {}));
    }
    if (result?.product_details?.length) {
      return res.status(200).send(new Response(true, 'Cart details fetched', result));
    }
    return res.status(200).send(new Response(true, 'Cart empty!!', {}));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while fetching cart", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const addToCart = async (req, res) => {
  try {
    console.info('/user/add-to-cart called.');
    const validated = validateCartDetails(req?.body);
    if (validated?.error) {
      return res.status(400).send(new Response(false, 'Invalid product details while adding to cart', { "error": validated?.error }));
    }
    const user_id = req?.user?.user_id;
    const { product_id, size_id, color_id, quantity } = req?.body;
    if(!quantity){
      return res.status(400).send(new Response(false, 'Invalid product details while adding to cart: Quantity missing', { }));
    }
    let data = {
      product_id: product_id,
      size_id: size_id,
      color_id: color_id,
      quantity: quantity
    }
    const result = await insertIntoCart(data, user_id);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while adding product to cart', {}));
    }
    return res.status(result?.status).send(new Response(true, result?.message, result?.data));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while adding to cart", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

// currently on hold

// const updateCart = async (req, res) => {
//   try {
//     console.info('/user/add-to-cart called.');
//     const validated = validateCartDetails(req?.body);
//     if (validated?.error) {
//       return res.status(400).send(new Response(false, 'Invalid product details while updating to cart', { "error": validated?.error }));
//     }
//     const user_id = req?.user?.user_id;
//     const { product_id, size_id, color_id, quantity } = req?.body;
//     if(!quantity){
//       return res.status(400).send(new Response(false, 'Invalid product details while updating to cart: Quantity missing', { }));
//     }
//     let data = {
//       product_id: product_id,
//       size_id: size_id,
//       color_id: color_id,
//       quantity: quantity
//     }
//     const result = await updateCartProduct(data, user_id);
//     if (result?.error) {
//       return res.status(500).send(new Response(false, 'Error while updating product quantity in cart', {}));
//     }
//     return res.status(result?.status).send(new Response(true, result?.message, result?.data));
//   }
//   catch (e) {
//     console.error("Customer Controller: Error occurred while adding to cart", e)
//     return res.status(500).send(new Response(false, 'while updating product quantity in cart', {}));
//   }
// }

const removeFromCart = async (req, res) => {
  try {
    console.info('/user/remove-from-cart called');
    const validated = validateCartDetails(req?.body);
    if (validated?.error) {
      return res.status(400).send(new Response(false, 'Invalid cart details while removing product', { "error": validated?.error }));
    }
    const user_id = req?.user?.user_id;
    const { product_id, size_id, color_id } = req?.body;
    let data = {
      product_id: product_id,
      size_id: size_id,
      color_id: color_id
    }
    const result = await deleteFromCart(data, user_id);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while removing product from cart', {}));
    }
    return res.status(result?.status).send(new Response(true, result?.message, {}));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while removing from cart", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}
// Based on discussion with FE createReview and markReview are commented
// const createReview = async (req, res) => {
//   try {
//     console.info('/user/create-review called');
//     const validated = validateReview(req?.body);
//     if (validated?.error) {
//       return res.status(400).send(new Response(false, 'Invalid review details while adding review', { "error": validated?.error }));
//     }
//     const result = await addReview(req?.body, req?.user?.user_id);
//     if (result?.error) {
//       return res.status(500).send(new Response(false, 'Error while saving review', {}));
//     }
//     return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
//   }
//   catch (e) {
//     console.error("Customer Controller: Error occurred while creating Review", e)
//     return res.status(500).send(new Response(false, 'Internal server Error', {}));
//   }
// }

// const markReview = async (req, res) => {
//   try {
//     console.info('/user/mark-review called');
//     const result = await updateReview(req?.body);
//     if (result?.error) {
//       return res.status(500).send(new Response(false, 'Error while updating review', {}));
//     }
//     return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
//   }
//   catch (e) {
//     console.error("Customer Controller: Error occurred while marking Review", e)
//     return res.status(500).send(new Response(false, 'Internal server Error', {}));
//   }
// }

const fetchAddresses = async (req, res) => {
  try {
    console.info('/user/addresses called.');
    const userId = req?.user?.user_id;
    const result = await getAdresses(userId);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while fetching addresses', {}));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while fetching addresses of user", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const addAddress = async (req, res) => {
  try {
    console.info('/user/add-address called');
    const validated = validateAddress(req?.body);
    if (validated?.error) {
      return res.status(400).send(new Response(false, 'Invalid Address details', { "error": validated?.error }));
    }
    const result = await createAddress(req?.body, req?.user?.user_id);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while saving address', {}));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while adding address", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const viewFilterUserOrders = async (req, res) => {
  try {
    console.info('/user/view-orders called');
    const { order_id } = req?.body;
    let data = {};
    if (order_id) {
      data['order_id'] = order_id;
    }
    data['user_id'] = req?.user?.user_id;
    const result = await viewFilterOrders(data);
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while fetching orders', {}));
    }
    return res.status(result?.status).send(new Response(result?.success, result?.message, result?.data));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while fetchin user orders", e)
    return res.status(500).send(new Response(false, 'Internal server Error', {}));
  }
}

const calculateOrderAmount = async (req, res) => {
  try {
    console.info('/user/calculate-order-amount called');
    let { shipping_type, product_details } = req?.body;
    const result = await orderSummary({ shipping_type: shipping_type, product_details: product_details });
    if (result?.error) {
      return res.status(500).send(new Response(false, 'Error while calculating order summary', {}));
    }
    return res.status(200).send(new Response(true, 'Order summary calculated', result));
  }
  catch (e) {
    console.error("Customer Controller: Error occurred while calculating order amount", e)
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
  fetchAddresses,
  addAddress,
  viewFilterUserOrders,
  calculateOrderAmount,
  //updateCart,
  // createReview,
  // markReview,
}