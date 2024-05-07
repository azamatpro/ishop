const express = require('express');
const shopController = require('./../controllers/shopController');
const productRoutes = require('.././routes/productRoutes');

const router = express.Router();

router.post('/', shopController.createShop);
router.get('/', shopController.getAllShops);
router.post('/loginShop', shopController.loginShop);
router.get('/logoutShop', shopController.logoutShop);
router.post('/forgetPassword', shopController.forgetPassword);
router.patch('/resetPassword/:token', shopController.resetPassword);

router.use(shopController.protect); // works to protect all routes below

// Merging Routes
router.use('/:shopId/products', productRoutes);

router.patch('/updateShopPassword', shopController.updatePassword);
router.post('/unlockAccount', shopController.unlockAccount);

router.route('/:id').get(shopController.getShop).patch(shopController.updateShop).delete(shopController.deleteShop);

module.exports = router;
