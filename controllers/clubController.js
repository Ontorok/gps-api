const Club = require('../models/Club');

const fetchAll = async (req, res) => {
  const page = 4
  const limit = 4
  const startIndex = (page - 1) * limit
  const endIndex = ((page - 1) + 1) * limit
  // const clubs = await Club.find().limit(limit).skip(startIndex).exec()
  const clubs = await Club
    .find()
    .exec()
  return res.status(200).json({
    succeed: true,
    result: clubs
  })
}

const create = async (req, res) => {
  const { serial, name, status } = req.body;
  try {
    const savedClub = await Club.create({ serial, name, status })
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