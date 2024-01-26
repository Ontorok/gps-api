const { ROLES } = require("../constants/roleList");
const { normalizeField } = require("../helpers/commonHelper");
const Groomer = require("../models/Groomer");
const User = require("../models/User");

const fetchAll = async (req, res) => {
  const { page, perPage, sortedColumn, sortedBy, clubId, name, gpsId } =
    req.query;
  const searchObj = {
    isActive: true,
  };
  // If user is not Admin or Super Admin
  if (req.role !== ROLES.SuperAdmin && req.role !== ROLES.Admin) {
    const loggedInUser = await User.findOne({ username: req.username }).exec();
    searchObj["clubId"] = loggedInUser.clubId;
  } else {
    // If user is Admin or Super Admin
    if (clubId) searchObj["clubId"] = clubId;
  }
  if (name)
    searchObj["normalizeName"] = {
      $regex: ".*" + normalizeField(name) + ".*",
    };
  if (gpsId)
    searchObj["normalizeGpsId"] = {
      $regex: ".*" + normalizeField(gpsId) + ".*",
    };

  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const groomers = await Groomer.find(searchObj)
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .select("name clubId clubName gpsId rate isActive")
      .exec();

    const total = await Groomer.countDocuments(searchObj).exec();

    return res.status(200).json({
      succeed: true,
      total: total,
      result: groomers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchAllArchive = async (req, res) => {
  const { page, perPage, sortedColumn, sortedBy, clubId, name, gpsId } =
    req.query;
  const searchObj = {
    isActive: false,
  };

  // If user is not Admin or Super Admin
  if (req.role !== ROLES.SuperAdmin && req.role !== ROLES.Admin) {
    const loggedInUser = await User.findOne({ username: req.username }).exec();
    searchObj.clubId = loggedInUser.clubId;
  } else {
    // If user is Admin or Super Admin
    if (clubId) searchObj["clubId"] = clubId;
  }

  if (name)
    searchObj["normalizeName"] = {
      $regex: ".*" + normalizeField(name) + ".*",
    };
  if (gpsId)
    searchObj["normalizeGpsId"] = {
      $regex: ".*" + normalizeField(gpsId) + ".*",
    };

  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const groomers = await Groomer.find(searchObj)
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .select("name clubId clubName gpsId rate isActive")
      .exec();

    const total = await Groomer.countDocuments(searchObj).exec();

    return res.status(200).json({
      succeed: true,
      total: total,
      result: groomers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchAllActiveGroomers = async (req, res) => {
  const searchObj = {
    isActive: true,
  };
  try {
    const groomers = await Groomer.find(searchObj)
      .select("name clubId clubName gpsId normalizeGpsId rate isActive")
      .exec();

    return res.status(200).json({
      succeed: true,
      result: groomers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchGroomerByClub = async (req, res) => {
  const clubId = req.params.id === "undefined" ? "" : req.params.id;

  try {
    const clubWiseGroomers = await Groomer.find({
      ...(clubId && { clubId: clubId }),
    }).exec();
    res
      .status(200)
      .json({ message: "success", succeed: true, result: clubWiseGroomers });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "There was an error to load groomers" });
  }
};

const create = async (req, res) => {
  const { name, clubId, clubName, gpsId, rate, isActive } = req.body;
  try {
    const savedGroomer = await Groomer.create({
      name: name.trim(),
      normalizeName: normalizeField(name),
      clubId,
      clubName,
      gpsId: gpsId.trim(),
      normalizeGpsId: normalizeField(gpsId),
      rate,
      isActive,
    });
    res.status(201).json({
      succeed: true,
      message: "Data saved successfully!!!!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  const { _id, name, clubId, clubName, gpsId, rate, isActive } = req.body;
  try {
    const updatedGroomer = await Groomer.findOneAndUpdate(
      { _id: _id },
      { name, clubId, clubName, gpsId, rate, isActive }
    );
    res.status(200).json({
      succeed: true,
      message: "Data updated successfully!!!!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRecord = async (req, res) => {
  const { id } = req.query;
  try {
    const updatedGroomer = await Groomer.findOneAndUpdate(
      { _id: id },
      { isActive: false }
    );
    res.status(200).json({
      succeed: true,
      message: "Data deleted successfully!!!!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const restore = async (req, res) => {
  const { id } = req.query;
  try {
    const updatedGroomer = await Groomer.findOneAndUpdate(
      { _id: id },
      { isActive: true }
    );
    res.status(200).json({
      succeed: true,
      message: "Data re-stored successfully!!!!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  fetchAll,
  fetchAllArchive,
  fetchAllActiveGroomers,
  fetchGroomerByClub,
  create,
  update,
  deleteRecord,
  restore,
};
