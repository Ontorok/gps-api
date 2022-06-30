const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  deviceID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  CountyID: {
    type: String,
    required: true,
  },
  CountyName: {
    type: String,
    required: true,
  },
  TrailID: {
    type: String,
    required: true,
  },
  TrailName: {
    type: String,
    required: true,
  },
});

entrySchema.index({ deviceID: 1, CountyID: 1 }, { unique: true });

module.exports = mongoose.model("Entry", entrySchema);
