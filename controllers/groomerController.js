const Groomer = require('../models/Groomer');

const fetchAll = async (req, res) => {
  const { page, perPage, sortedColumn, sortedBy } = req.query
  const searchObj = {
    isActive: true
  }
  // if (clubName) searchObj['name'] = { $regex: '.*' + clubName + '.*' }
  // if (status) searchObj['status'] = status === 'active' ? true : false
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage)
    const endIndex = ((parseInt(page) - 1) + 1) * parseInt(perPage)
    const groomers = await Groomer
      .find(searchObj)
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .select("club name gpsId rate")
      .exec();


    const total = await Groomer.countDocuments(searchObj).exec()

    return res.status(200).json({
      succeed: true,
      total: total,
      result: groomers,
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const create = async (req, res) => {
  const { name, gpsId, rate, club } = req.body;
  console.log(JSON.stringify(req.body, null, 2));
  try {
    const savedGroomer = await Groomer.create({ name, gpsId, rate, club })
    res.status(201).json({
      succeed: true,
      message: 'Data saved successfully!!!!'
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  fetchAll,
  create
}