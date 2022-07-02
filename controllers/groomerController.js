const Groomer = require("../models/Groomer");

const fetchAll = async (req, res) => {
  const { page, perPage, sortedColumn, sortedBy } = req.query;
  const searchObj = {
    isActive: true,
  };
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const groomers = await Groomer.find(searchObj)
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .select("name gpsId rate isActive")
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
  const { page, perPage, sortedColumn, sortedBy } = req.query;
  const searchObj = {
    isActive: false,
  };
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const groomers = await Groomer.find(searchObj)
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .select("name gpsId rate")
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

const create = async (req, res) => {
  const { name, gpsId, rate, isActive } = req.body;
  //console.log(JSON.stringify(req.body, null, 2));
  try {
    const savedGroomer = await Groomer.create({ name, gpsId, rate, isActive });
    res.status(201).json({
      succeed: true,
      message: "Data saved successfully!!!!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  const { _id, name, gpsId, rate, isActive } = req.body;
  try {
    const updatedGroomer = await Groomer.findOneAndUpdate(
      { _id: _id },
      { name, gpsId, rate, isActive }
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
  create,
  update,
  deleteRecord,
  restore,
};
