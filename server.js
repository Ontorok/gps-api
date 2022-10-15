require("dotenv").config();
// Core modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Local modules
const { logger } = require("./middleware/logEvents");
const { errorHander } = require("./middleware/errorHandler");
const {
  rootRoute,
  employeesRoute,
  authRoute,
  clubRoute,
  groomerRoute,
  entriesRoute,
  usersRoute,
} = require("./routes");
const corsOptions = require("./config/corsConfig");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const connectDB = require("./config/dbConnection");

const PORT = process.env.PORT || 3500;

const app = express();

// connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS
// and fetch cookies credentials requiremnts
app.use(credentials);

// CORS (Cross Origin Resource Sharing)
app.use(cors(corsOptions));

// build-in- middleware to handle urlencoded data  in other words form data
app.use(express.urlencoded({ extended: false }));

// build-in- middleware for json
app.use(express.json());

// cookies middleware
app.use(cookieParser());

// routes handler
app.get("/test", (req, res) => {
  res.send("Test Success");
});
app.use("/api/auth", authRoute);
app.use("/api/club", clubRoute);
app.use("/api/groomer", groomerRoute);
app.use("/api/entries", entriesRoute);
app.use("/api/users", usersRoute);

app.use(errorHander);

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
