const User = require("../models/User");

const fetchActiveUsers = async (req, res) => {
  const { page, perPage } = req.query;
  const excludedRoles = ["Super Admin"];
  if (req.role == "Admin") excludedRoles.push("Admin");
  const searchObj = {
    role: { $nin: excludedRoles },
  };
  if (req.role !== "Super Admin" && req.role !== "Admin") {
    const loggedInUser = await User.findOne({ username: req.username }).exec();
    searchObj.clubId = loggedInUser.clubId;
    searchObj.username = { $ne: req.username };
  }
  try {
    const startIndex = (parseInt(page) - 1) * parseInt(perPage);
    const endIndex = (parseInt(page) - 1 + 1) * parseInt(perPage);
    const users = await User.find(searchObj)
      .limit(perPage)
      .skip(startIndex)
      .select("name username email address phone role clubId clubName");

    const total = await User.countDocuments(searchObj).exec();
    res.status(200).json({
      succeed: true,
      result: users,
      totalRows: total,
    });
  } catch (err) {
    res.status(500).json({ message: "internal" });
  }
};

module.exports = {
  fetchActiveUsers,
};
0;
