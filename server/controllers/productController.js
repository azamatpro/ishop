const Product = require('../models/productModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/factoryHandler');

exports.getProduct = factory.getOne(Product, { path: 'reviews' });

exports.getAllProducts = factory.getAll(Product);

exports.createProduct = factory.createOne(Product);
