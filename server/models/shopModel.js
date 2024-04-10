const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your shop name!'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your shop email address'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [8, 'Password should be greater than 6 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm shop password'],
      validate: {
        // This only works on CREATE and SAVE methods!
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords must be the same!',
      },
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'seller',
    },
    photo: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    zipCode: {
      type: Number,
      required: true,
    },
    withdrawMethod: {
      type: Object,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    transections: [
      {
        amount: {
          type: Number,
          // required: true,
        },
        status: {
          type: String,
          default: 'Processing',
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        updatedAt: {
          type: Date,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

shopSchema.pre('save', async function (next) {
  // Do not run the function If password was NOT modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// Hash password
shopSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Virtual populate
shopSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'shop', // property where Ref to the current Model is stored
  localField: '_id', // id of current model
});

// comapre password
// shopSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

shopSchema.methods.comparePassword = async function (candidatePass, shopPass) {
  console.log(candidatePass, shopPass);
  return await bcrypt.compare(candidatePass, shopPass);
};

shopSchema.methods.checkChangedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
