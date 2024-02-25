const express = require('express');
const productControl = require('../controllers/productController');

const router = express.Router();

router.route('/').post(productControl.createProduct);

module.exports = router;
