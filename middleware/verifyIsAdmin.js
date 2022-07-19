const jwt = require("jsonwebtoken");
const { ROLES } = require("../constants/roleList");

require("dotenv").config();

const verifyIsAdmin = (req, res, next) => {
  const isAdmin = req.role === ROLES.SuperAdmin || req.role === ROLES.Admin;
  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not permitted to perform this job!!" });
  } else {
    next();
  }
};

module.exports = verifyIsAdmin;
