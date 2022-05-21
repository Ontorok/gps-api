const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groomerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    gpsId: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true,
    },
    club: {
      required: true,
      _id: false,
      type: {
        id: mongoose.Types.ObjectId,
        name: String
      }

    },
    isActive: {
      type: Boolean,
      default: true
    }
  }
);

module.exports = mongoose.model("Groomer", groomerSchema)