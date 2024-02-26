const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: { data: doc } });
  });
};

exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).populate(popOptions);
    if (!doc) {
      return next(new AppError('There is no document with this ID!', 404));
    }
    res.status(200).json({ status: 'success', data: { data: doc } });
  });
};

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    // To allow for nested Get reviews on tour (hack)
    let filter = {};
    if (req.params.productId) filter = { tour: req.params.productId };
    const docs = await Model.find(filter);
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { data: docs },
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    // 1) Check if Admin tries to update user's password
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('Admins can not update user passwords!', 400));
    }
    // 2) Update doc
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedDoc) {
      return next(new AppError('No document found with this ID', 404));
    }
    // 3) Send a response
    res.status(200).json({ status: 'success', data: { data: updatedDoc } });
  });
};

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }
    res.status(204).json({ status: 'success', data: null });
  });
};
