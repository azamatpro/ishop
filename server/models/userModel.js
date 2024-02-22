const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell as your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be more or equal to 8 characters"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetTime: Date,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
