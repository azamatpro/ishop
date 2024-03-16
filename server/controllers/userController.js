const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/factoryHandler');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const filterData = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/users');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true);
  }
  return cb(new AppError('Not an image! Please upload images only.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log('REQ_Body:', req.body);
  // console.log('REQ_File:', req.file);

  // 1) Create an error If user posts password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
  }
  // 2) filter necassary fields
  const allowedFields = ['name', 'email', 'dateOfBirth', 'gender', 'phoneNumber', 'address', 'about'];

  const filteredData = filterData(req.body, allowedFields);
  if (req.file) filteredData.photo = req.file.filename;

  // 3) Update User doc
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredData, { new: true, runValidators: true });

  // 4) Send a respone
  const token = signToken(updatedUser._id);
  res.status(200).json({ status: 'success', token, data: { user: updatedUser } });
});

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
