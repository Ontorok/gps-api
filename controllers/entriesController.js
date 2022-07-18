const Entry = require("../models/Entry");
const Groomer = require("../models/Groomer");
const _ = require("lodash");
const moment = require("moment");
const axios = require("axios");
const { convertSecondToHour } = require("../helpers/commonHelper");

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
  const entries = gpsEntries.map((entry) => ({
    ...entry,
    createdBy: req.id,
    createdAt: new Date(),
  }));
  try {
    const savedEntries = await Entry.insertMany(entries);
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
    const groomers = activeGroomers.map((item) => ({
      gpsId: item.gpsId,
      groomerName: item.name,
      rate: item.rate,
    }));

    const gpsData = Object.keys(rest)
      .map((key) => rest[key])
      .map((entry, index) => ({
        comparatorKey: `${entry.deviceID}_${entry.date}_${
          JSON.parse(entry.County)[0]["id"]
        }_${entry["Funded/non-funded"]}`,
        deviceId: entry.deviceID,
        date: entry.date,
        countyId: JSON.parse(entry.County)[0]["id"],
        countyName: JSON.parse(entry.County)[0]["identifier"],
        trailId: JSON.parse(entry.Trail)["id"],
        trailName: JSON.parse(entry.Trail)["identifier"],
        fundingStatus: entry["Funded/non-funded"],
        eligibleTime: Number(entry["Eligible Time"]),
        eligibleTimeInHour: convertSecondToHour(Number(entry["Eligible Time"])),
      }));

    const uniqueGpsData = _.uniqBy(gpsData, "comparatorKey");

    const filteredGpsEntries = groomers
      .map((g) =>
        uniqueGpsData
          .filter((entry) => entry.deviceId === g.gpsId)
          .map((item) => ({
            ...item,
            groomerName: g.groomerName,
            rate: g.rate,
            total: Number((g.rate * item.eligibleTimeInHour).toFixed(2)),
          }))
      )
      .flat();

    res.status(200).json({
      message: "Date Fetched Successfully",
      data: filteredGpsEntries,
    });
  }
};

const fetchAllFunded = async (req, res) => {
  const { page, perPage } = req.query;
  const searchObj = {
    isActive: true,
    isInvalid: false,
    fundingStatus: { $eq: "Funded" },
  };
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const clubs = await Entry.find(searchObj)
      .limit(perPage)
      .skip(startIndex)
      .select(
        "deviceId groomerName date countyId countyName trailId trailName fundingStatus eligibleTime eligibleTimeInHour rate total isInvalid"
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

const fetchAllNonFunded = async (req, res) => {
  const { page, perPage } = req.query;
  const searchObj = {
    isActive: true,
    isInvalid: false,
    fundingStatus: { $eq: "Non-Funded" },
  };
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const clubs = await Entry.find(searchObj)
      .limit(perPage)
      .skip(startIndex)
      .select(
        "deviceId groomerName date countyId countyName trailId trailName fundingStatus eligibleTime eligibleTimeInHour rate total isInvalid"
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

const fetchAllInvalid = async (req, res) => {
  const { page, perPage } = req.query;
  const searchObj = {
    isActive: true,
    isInvalid: true,
  };
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const clubs = await Entry.find(searchObj)
      .limit(perPage)
      .skip(startIndex)
      .select(
        "deviceId groomerName date countyId countyName trailId trailName fundingStatus eligibleTime eligibleTimeInHour rate total isInvalid"
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

const changeEntriesValidityByRange = async (req, res) => {
  const { markedIds, isInvalid } = req.body;
  const entries = await Entry.updateMany(
    { _id: { $in: markedIds } },
    {
      $set: {
        isInvalid: isInvalid,
        updatedBy: req.id,
        updatedAt: new Date(),
      },
    }
  );
  if (entries.acknowledged) {
    res.status(200).json({
      succeed: true,
      message: `Mark as ${isInvalid ? "valid" : "invalid"} ${
        entries.modifiedCount
      } Entries`,
    });
  }
};

module.exports = {
  create,
  createByUser,
  fetchAllFunded,
  fetchAllNonFunded,
  fetchAllInvalid,
  fetchGpsDataFromKnackApi,
  changeEntriesValidityByRange,
};
