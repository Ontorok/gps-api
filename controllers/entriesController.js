const Entry = require("../models/Entry");

const create = async (req, res) => {
  console.log(req.body);
  try {
    const savedClub = await Entry.insertMany(req.body);
    res.status(201).json({
      succeed: true,
      message: "Data saved successfully!!!!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { create };
