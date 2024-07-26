const db = require('../models');
const Joi = require('joi');
const { Response } = require('./constants');

const getRole = async (userId) => {
  const userDetails = await db.user.findByPk(userId, {
    include: {
      model: db.role,
      as: 'role'
    }
  });
  return userDetails?.role?.role_name;
}

const isCustomer = async (req, res, next) => {
  try {
    console.log('=',req?.url);
    const roleName = await getRole(req?.user?.user_id);
    if (!roleName || roleName !== 'customer') {
      return res.status(403).send(new Response(false, 'Access denied.', {}));
    }
    next();

  } catch (error) {
    console.error('Error checking user role:', error);
    return res.status(500).send(new Response(false, 'Error while verifying admin', {}));
  }
}

function validateUser(user) {
  const JoiSchema = Joi.object({

    full_name: Joi.string()
      .min(5)
      .max(30)
      .required(),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .min(5)
      .max(50)
      .required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()-_+=]{8,30}$'))
      .required(),

  }).options({ abortEarly: false });

  return JoiSchema.validate(user)
}

function validateLoginDetails(user) {
  const JoiSchema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .min(5)
      .max(50)
      .required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()-_+=]{8,30}$'))
      .required(),

  }).options({ abortEarly: false });

  return JoiSchema.validate(user)
}

function validateResetPaswordDetails(obj){
  const JoiSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
    otp: Joi.string().min(6).max(6).required(),
    new_password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()-_+=]{8,30}$'))
      .required(),

  }).options({ abortEarly: false });

  return JoiSchema.validate(obj);
}

function validateProduct(product) {
  const productSchema = Joi.object({
    product_id: Joi.string().uuid(),
    product_name: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(1024).required(),
    images: Joi.array().items(Joi.string()).required(),
    quantity: Joi.number().integer().min(0).required(),
    size_ids: Joi.array().items(Joi.string().uuid()).required(),
    price: Joi.number().precision(2).positive().required(),
    color_ids: Joi.array().items(Joi.string().uuid()),
    category_id: Joi.string().uuid().min(1).max(255).required()
  }).options({ abortEarly: false });
  return productSchema.validate(product);
}

function validateAddress(addressObj) {
  const addressSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address_line1: Joi.string().required(),
    address_line2: Joi.string(),
    city: Joi.string().required(),
    pincode: Joi.string().required(),
    country: Joi.string().required(),
    mobile: Joi.string().pattern(/^[0-9]+$/).min(10).max(15)
  }).options({ abortEarly: false });
  return addressSchema.validate(addressObj);
}

const productDetailSchema = Joi.object({
  product_id: Joi.string().uuid().required(),
  size: Joi.string().required(),
  colour: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

function validateProductDetails(product) {
  const productDetailsArraySchema = Joi.array().items(productDetailSchema).min(1).required();
  return productDetailsArraySchema.validate(product);
}


function validateCartDetails(product) {
  const cartDetailSchema = Joi.object({
    product_id: Joi.string().uuid().required(),
    size_id: Joi.string().uuid().required(),
    color_id: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(-1)
  });
  return cartDetailSchema.validate(product);
}

function validateReview(reviewObj) {
  const schema = Joi.object({
    product_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    rating: Joi.number().integer().min(1).required()
  });
  return schema.validate(reviewObj);
}
function validateUUID(obj) {
  const schema = Joi.object({ product_id: Joi.string().uuid().required() });
  return schema.validate(obj);
}

module.exports = {
  isCustomer,
  getRole,
  validateUser,
  validateLoginDetails,
  validateResetPaswordDetails,
  validateProduct,
  validateUUID,
  validateAddress,
  validateProductDetails,
  validateCartDetails,
  validateReview
}

