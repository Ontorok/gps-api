const User = require("../models/User");
const bcrypt = require("bcrypt");

const fetchActiveUsers = async (req, res) => {
  const { page, perPage } = req.query;
  const excludedRoles = ["Super Admin"];
  if (req.role == "Admin") excludedRoles.push("Admin");
  const searchObj = {
    isActive: true,
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

const fetchArchiveUsers = async (req, res) => {
  const { page, perPage } = req.query;
  const excludedRoles = ["Super Admin"];
  if (req.role == "Admin") excludedRoles.push("Admin");
  const searchObj = {
    isActive: false,
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

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found!!" });
  }

  user.isActive = false;

  const result = await user.save();

  res.status(200).json({
    succeed: true,
    message: `User '${result.name}' removed successfully!!!`,
  });
};

const reStoreUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found!!" });
  }

  user.isActive = true;

  const result = await user.save();

  res.status(200).json({
    succeed: true,
    message: `User '${result.name}' re-stored successfully!!!`,
  });
};

const resetPassword = async (req, res) => {
  const { adminpassword, username, userpassword } = req.body;
  try {
    const admin = await User.findOne({ username: req.username }).exec();
    if (!admin) {
      return res
        .status(401)
        .json({ message: "You are not permitted to perform this job!!" });
    }
    const isMatchedAdminPassword = await bcrypt.compare(
      adminpassword,
      admin.password
    );
    if (!isMatchedAdminPassword) {
      return res.status(400).json({ message: "Incorrect Password!!!" });
    } else {
      const hashedPassword = await bcrypt.hash(userpassword, 10);
      const targetuser = await User.findOne({ username: username }).exec();

      targetuser.password = hashedPassword;
      await targetuser.save();
      res.status(200).json({ message: "Password resetted" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "There was an error to reset password!!!" });
  }
};

module.exports = {
  fetchActiveUsers,
  fetchArchiveUsers,
  deleteUser,
  reStoreUser,
  resetPassword,
};
