const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groomerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  clubId: {
    type: Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  clubName: {
    type: String,
    required: true,
  },
  gpsId: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Groomer", groomerSchema);
