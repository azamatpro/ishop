const Shop = require('../models/shopModel');
const factory = require('./factoryHandler');

exports.createShop = factory.createOne(Shop);
exports.updateShop = factory.updateOne(Shop);
exports.deleteShop = factory.deleteOne(Shop);
exports.getShop = factory.getOne(Shop, { path: 'products' });
exports.getAllShops = factory.getAll(Shop);
