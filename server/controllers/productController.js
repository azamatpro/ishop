const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/factoryHandler');

exports.createProduct = factory.createOne(Product);
