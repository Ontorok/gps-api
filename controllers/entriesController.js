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

const fetchAllGrooming = async (req, res) => {
  const { page, perPage } = req.query;
  const searchObj = {
    isActive: true,
    eligibleTime: { $gt: 0 },
  };
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const clubs = await Entry.find(searchObj)
      .limit(perPage)
      .skip(startIndex)
      .select(
        "deviceId date clubId clubName trailId trailName fundingStatus eligibleTime"
      )
      .exec();

    const total = await Entry.countDocuments(searchObj).exec();

    return res.status(200).json({
      succeed: true,
      total: total,
      result: clubs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchAllNonGrooming = async (req, res) => {
  const { page, perPage } = req.query;
  const searchObj = {
    isActive: true,
    eligibleTime: { $lte: 0 },
  };
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const clubs = await Entry.find(searchObj)
      .limit(perPage)
      .skip(startIndex)
      .select(
        "deviceId date clubId clubName trailId trailName fundingStatus eligibleTime"
      )
      .exec();

    const total = await Entry.countDocuments(searchObj).exec();

    return res.status(200).json({
      succeed: true,
      total: total,
      result: clubs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { create, fetchAllGrooming, fetchAllNonGrooming };
