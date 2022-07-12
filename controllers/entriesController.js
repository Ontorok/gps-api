const Entry = require("../models/Entry");
const Groomer = require("../models/Groomer");
const _ = require("lodash");
const moment = require("moment");
const axios = require("axios");

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

const createByUser = async (req, res) => {
  const gpsEntries = req.body;
  try {
    const savedEntries = await Entry.insertMany(gpsEntries);
    res.status(201).json({
      succeed: true,
      data: savedEntries,
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

const fetchGpsDataFromKnackApi = async (req, res) => {
  const { date } = req.query;
  const _date = moment(date).format("yyyy-MM-DD");
  const url = `http://54.203.84.201/knack_api/getdata.php?date=${date}`;
  const response = await axios.post(url, null, {
    headers: {
      Authorization: "Bearer 05cd2aae5110da03fee3b47ecc2c41bc",
    },
  });
  const data = response.data;

  const { status, ...rest } = data;

  const hasNoData = rest.Data && rest.Data === "No Record Found";

  if (hasNoData) {
    res.status(200).json({ message: "No Record Found", data: [] });
  } else {
    const activeGroomers = await Groomer.find({ isActive: true }).exec();
    const groomersIds = _.uniq(activeGroomers.map((item) => item.gpsId));

    const gpsData = Object.keys(rest)
      .map((key) => rest[key])
      .map((entry, index) => ({
        comparatorKey: `${entry.deviceID}_${entry.date}_${
          JSON.parse(entry.County)[0]["id"]
        }_${entry["Funded/non-funded"]}`,
        deviceId: entry.deviceID,
        date: entry.date,
        clubId: JSON.parse(entry.County)[0]["id"],
        clubName: JSON.parse(entry.County)[0]["identifier"],
        trailId: JSON.parse(entry.Trail)["id"],
        trailName: JSON.parse(entry.Trail)["identifier"],
        fundingStatus: entry["Funded/non-funded"],
        eligibleTime: Number(entry["Eligible Time"]),
      }));

    const uniqueGpsData = _.uniqBy(gpsData, "comparatorKey");

    const filteredGpsEntries = groomersIds
      .map((g) => uniqueGpsData.filter((entry) => entry.deviceId === g))
      .flat();

    res.status(200).json({
      message: "Date Fetched Successfully",
      data: filteredGpsEntries,
    });
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

module.exports = {
  create,
  createByUser,
  fetchAllGrooming,
  fetchAllNonGrooming,
  fetchGpsDataFromKnackApi,
};
