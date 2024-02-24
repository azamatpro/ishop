const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});
