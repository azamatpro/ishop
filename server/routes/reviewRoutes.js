const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get('/', reviewController.getAllReviews);

router.use(authController.protect);

router.post('/', authController.restrictTo('user'), reviewController.setProductUserIds, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview);

module.exports = router;
