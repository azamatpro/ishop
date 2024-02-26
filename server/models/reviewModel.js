const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// To make review unique from one user to one tour
// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// pre middleware runs before doc creation
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 4.5,
      ratingsAverage: 0,
    });
  }
};

// Middleware below runs after doc is created
reviewSchema.post('save', function () {
  // post middleware does not access to next()
  // this points to current review doc
  // constructor points to the model which created current review doc
  this.constructor.calcAverageRatings(this.product);
});

// Query execution to retriew current doc (review obj)
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // You can not get review doc (this.findOne()) here, query already created
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
