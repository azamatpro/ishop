const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/factoryHandler');

// exports.createProduct = factory.createOne(Product);

// exports.deleteProduct = factory.deleteOne(Product);

// exports.updateProduct = factory.updateOne(Product);

exports.getProduct = factory.getOne(Product);

exports.getAllProducts = factory.getAll(Product);
