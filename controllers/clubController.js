const Club = require('../models/Club');

const fetchAll = async (req, res) => {
  const { page, perPage, sortedColumn, sortedBy, status } = req.query

  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage)
    const endIndex = ((parseInt(page) - 1) + 1) * parseInt(perPage)
    const clubs = await Club
      .find({ status: status })
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .exec();
    const total = await Club.countDocuments({ status: status }).exec()

    return res.status(200).json({
      succeed: true,
      total: total,
      result: clubs,
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const create = async (req, res) => {
  const { serial, name, state } = req.body;

  try {
    const savedClub = await Club.create({ serial, name, state })
    res.status(201).json({
      succeed: true,
      data: savedClub
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



module.exports = {
  fetchAll, create
}