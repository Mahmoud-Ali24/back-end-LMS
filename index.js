require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const httpStatusText = require("./utils/httpStatusText");
const cors = require("cors"); // Import the 'cors' package

const app = express();

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => console.log("Connected to MongoDB..."));

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000", // Replace with the origin of your React app
};

app.use(cors());

const studentsRoute = require("./routes/students.route");

app.use("/students", studentsRoute);

const classesRoute = require("./routes/classes.route");

app.use("/classes", classesRoute);

const usersRoute = require("./routes/users.route");

app.use("/users", usersRoute);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    massage: "this resource is not available",
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT, () => console.log(`Listening on port 4000...`));
