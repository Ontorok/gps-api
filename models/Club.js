const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubSchema = new Schema(
  {
    serial: {
      type: Number
    },
    name: {
      type: String,
      required: true
    },
    state: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true }
)

module.exports = mongoose.model("Club", clubSchema)