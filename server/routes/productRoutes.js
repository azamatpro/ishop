const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();
// Merging routes
router.use('/:productId/reviews', reviewRouter);

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

module.exports = router;
