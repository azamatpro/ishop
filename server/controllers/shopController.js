const jwt = require('jsonwebtoken');
const Shop = require('../models/shopModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const { promisify } = require('util');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (shop, statusCode, res) => {
  console.log(shop);
  const token = signToken(shop._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  // Remove passwords
  shop.password = undefined;
  res.status(statusCode).json({ status: 'success', token, data: { shop } });
};

exports.createShop = catchAsync(async (req, res, next) => {
  const newShop = await Shop.create(req.body);
  createSendToken(newShop, 201, res);
});

exports.updateShop = catchAsync(async (req, res, next) => {
  // 1) Check if Admin tries to update user's password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You can not update user passwords here!', 400));
  }
  // 2) Update doc
  const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!updatedShop) {
    return next(new AppError('No document found with this ID', 404));
  }
  // 3) Send a response
  createSendToken(updatedShop, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  console.log('RU', req);
  const shop = await Shop.findById(req.user.id).select('+password');
  if (!shop) {
    return next(new AppError('There is no user with this email!', 401));
  }
  console.log(req.body.passwordCurrent, shop.password);
  // 2) Check If posted current password is correct
  const checkPass = await shop.comparePassword(req.body.passwordCurrent, shop.password);
  console.log(checkPass);
  if (!checkPass) {
    return next(new AppError('Incorrect password! Please try with correct password!', 401));
  }
  // 3) If so, update password
  shop.password = req.body.password;
  shop.passwordConfirm = req.body.passwordConfirm;
  await shop.save();
  // 4) Log user in, send JWT token
  createSendToken(shop, 200, res);
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it is here
  console.log(req.headers.authorization);
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get an access.'), 401);
  }

  // 2) Verify token, gets issued time and owner of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await Shop.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user changed password after token is issued
  if (currentUser.checkChangedPassword(decoded.iat)) {
    return next(new AppError('User recently changed password! Please login in again.', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.deleteShop = factory.deleteOne(Shop);
exports.getShop = factory.getOne(Shop, { path: 'products' });
exports.getAllShops = factory.getAll(Shop);
