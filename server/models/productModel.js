const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your product name!'],
      trim: true,
      maxlength: [40, 'A product must have less or equal than 40 characters'],
      minlength: [10, 'A product must have more or equal than 10 characters'],
    },
    price: {
      type: Number,
    },
    discountPrice: Number,
    image: {
      type: String,
      required: [true, 'A product must have an image!'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please describe your product!'],
    },
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shop',
      required: [true, 'Product must belong to a shop'],
    },
    category: {
      type: String,
      required: [true, 'Please enter your product category!'],
    },
    tags: [String],
    link: String,
    variants: [Object],
    sizes: {
      type: [String],
      required: [true, 'Please enter your product size!'],
    },
    allOfSizes: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    },
    status: {
      type: String,
      required: [true, 'Please enter your product status!'],
      enum: {
        values: ['New in', 'limited edition', 'Sold Out', '50% Discount'],
        message: 'Product status is either: New in, limited edition, Sold Out, 50% Discount',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must be above than 1.0'],
      max: [5, 'A tour must be below than 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.66666 * 10 => 47 /10 => 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    numberOfReviews: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ price: 1, ratingAvarage: -1 });
productSchema.index({ slug: 1 });

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product', // property where Ref to the current Model is stored
  localField: '_id', // id of current model
});

productSchema.pre('save', function (next) {
  this.link = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
