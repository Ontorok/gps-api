const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    normalizeName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    clubId: {
      type: String,
    },
    clubName: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
