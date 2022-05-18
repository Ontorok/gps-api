const Club = require('../models/Club');

const fetchAll = async (req, res) => {
  const { page, perPage, sortedColumn, sortedBy, clubName, status } = req.query
  const searchObj = {
    isActive: true
  }
  if (clubName) searchObj['name'] = clubName
  if (status) searchObj['status'] = status === 'active' ? true : false
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage)
    const endIndex = ((parseInt(page) - 1) + 1) * parseInt(perPage)
    const clubs = await Club
      .find(searchObj)
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .select("name status")
      .exec();


    const total = await Club.countDocuments({
      isActive: true, ...searchObj
    }).exec()

    return res.status(200).json({
      succeed: true,
      total: total,
      result: clubs,
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const fetchAllArchive = async (req, res) => {
  const { page, perPage, sortedColumn, sortedBy } = req.query
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage)
    const endIndex = ((parseInt(page) - 1) + 1) * parseInt(perPage)
    const clubs = await Club
      .find({ isActive: false })
      .sort({ [sortedColumn]: sortedBy })
      .limit(perPage)
      .skip(startIndex)
      .select("name status")
      .exec();
    const total = await Club.countDocuments({ isActive: false }).exec()

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
  const { name, state } = req.body;
  try {
    const savedClub = await Club.create({ name, state })
    res.status(201).json({
      succeed: true,
      message: 'Data saved successfully!!!!'
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const update = async (req, res) => {
  const { _id, name, status } = req.body;
  try {
    const updatedClub = await Club.findOneAndUpdate(
      { _id: _id },
      { name: name, status: status });
    res.status(200).json({
      succeed: true,
      message: 'Data updated successfully!!!!'
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const deleteRecord = async (req, res) => {
  const { id } = req.query;
  try {
    const updatedClub = await Club.findOneAndUpdate(
      { _id: id },
      { isActive: false });
    res.status(200).json({
      succeed: true,
      message: 'Data deleted successfully!!!!'
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const restore = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    const updatedClub = await Club.findOneAndUpdate(
      { _id: id },
      { isActive: true }
    );
    res.status(200).json({
      succeed: true,
      message: 'Data re-stored successfully!!!!'

    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



module.exports = {
  fetchAll, fetchAllArchive, create, update, deleteRecord, restore
}