const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterData = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error If user posts password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
  }
  // 2) filter necassary fields
  const filteredData = filterData(req.body, 'name', 'email');
  if (req.file) filteredData.photo = req.file.filename;

  // 3) Update User doc
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredData, { new: true, runValidators: true });

  // 4) Send a respone
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('There is no user with this ID!', 404));
  }
  res.status(200).json({ status: 'success', data: { user } });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Check if Amin tries to update user's password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Admins can not update user passwords!', 400));
  }
  // 2) Update user
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updatedUser) {
    return next(new AppError('No user found with this ID', 404));
  }
  // 3) Send a response
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});
