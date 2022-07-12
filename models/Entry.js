const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  deviceId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  clubId: {
    type: String,
    required: true,
  },
  clubName: {
    type: String,
    required: true,
  },
  trailId: {
    type: String,
    required: true,
  },
  trailName: {
    type: String,
    required: true,
  },
  fundingStatus: {
    type: String,
    required: true,
  },
  eligibleTime: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  createdAt: {
    type: Date,
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

entrySchema.index(
  { deviceId: 1, date: 1, clubId: 1, fundingStatus: 1 },
  { unique: true }
);

module.exports = mongoose.model("Entry", entrySchema);
