const db = require('../models');
const Joi = require('joi')

const isAdmin = async (userId) => {
  try {
    const userDetails = await db.user.findByPk(userId, {
      include: {
        model: db.role,
        as: 'role'
      }
    });

    if (!userDetails) {
      return 'User not found';
    }
    //console.log(userDetails);
    const roleName = userDetails.role.role_name;
    if (roleName === 'admin') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking user role:', error);
    throw error; // Handle or propagate error as needed
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
    mobile: Joi.string().pattern(/^[0-9]+$/).required().min(10).max(15)
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
    color_id: Joi.string().uuid.required(),
    quantity: Joi.number().integer().min(1).required()
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
  isAdmin,
  validateUser,
  validateProduct,
  validateUUID,
  validateAddress,
  validateProductDetails,
  validateCartDetails,
  validateReview
}

