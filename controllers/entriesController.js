const Entry = require("../models/Entry");
const Groomer = require("../models/Groomer");
const _ = require("lodash");
const create = async (req, res) => {
  const gpsEntries = req.body;
  try {
    const activeGroomers = await Groomer.find({ isActive: true }).exec();
    const groomersIds = _.uniq(activeGroomers.map((item) => item.gpsId));
    const filteredGpsEntries = groomersIds
      .map((g) => gpsEntries.filter((entry) => entry.deviceId === g))
      .flat();
    //console.log({ fil: filteredGpsEntries.length, act: gpsEntries.length });
    const savedClub = await Entry.insertMany(filteredGpsEntries);
    res.status(201).json({
      succeed: true,
      message: "Data saved successfully!!!!",
    });
  } catch (err) {
    const errMessage =
      err?.code === 11000
        ? "Duplicate record found!!!"
        : "There was an error to save these record!!";
    console.log(err.message);
    res.status(500).json({ message: errMessage });
  }
};

module.exports = { create };
