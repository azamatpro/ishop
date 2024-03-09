const express = require('express');
const productController = require('../controllers/productController');
// const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router({ mergeParams: true });
// Merging routes
router.use('/:productId/reviews', reviewRouter);

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
