const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ status: 'success', data: { product } });
});
