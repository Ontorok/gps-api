const Entry = require("../models/Entry");

const create = async (req, res) => {
  try {
    const savedClub = await Entry.insertMany(req.body);
    res.status(201).json({
      succeed: true,
      message: "Data saved successfully!!!!",
    });
  } catch (err) {
    const errMessage =
      err?.code === 11000
        ? "Duplicate record found!!!"
        : "There was an error to save these record!!";
    console.log(errMessage);
    res.status(500).json({ message: errMessage });
  }
};

module.exports = { create };
