const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/factoryHandler');

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

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
