const express = require('express');
const shopController = require('./../controllers/shopController');
// const authController = require('./../controllers/authController');
const productRoutes = require('.././routes/productRoutes');

const router = express.Router();
// Merging Routes
router.use('/:shopId/products', productRoutes);

router.post('/', shopController.createShop);
router.get('/', shopController.getAllShops);

router.route('/:id').get(shopController.getShop).patch(shopController.updateShop).delete(shopController.deleteShop);
module.exports = router;
