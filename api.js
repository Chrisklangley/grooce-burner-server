require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { seedDB } = require("./Utils/seed");
const {
  login,
  register,
  addSong,
  getSongs,
  deleteSong,
  getTotal,
  addCover,
  getCover,
  getTrackList,
} = require("./controller");

const api = express();
api.use(bodyParser.json({ limit: "60mb" }));
api.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));

api.use(cors());
const corsOptions = {
  origin: "http://localhost:3000",
};

api.use(cors(corsOptions));

const dbURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://christopherlangleydev:Dq8XRo8Gh7K3ErCq@groverburnerdb.odla6k1.mongodb.net/";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const router = express.Router();

router.get("/getTotal/:email", getTotal);
router.get("/getCover/:email", getCover);
router.get("/getTrackList/:email", getTrackList);

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Groove Burner Server" });
});

router.post("/getSongs", getSongs);
router.post("/seed", seedDB);
router.post("/login", login);
router.post("/register", register);
router.post("/addSong", addSong);
router.post("/addCover/Title/:title/:email", addCover);

router.delete("/deleteSong/:songId/:email", deleteSong);

router.get("/test", (req, res) => {
  res.status(200).send("Success");
});

api.use("/", router);
api.use("/.netlify/functions/api", router);

const PORT = process.env.PORT || 54783;
console.log(`Listening on port ${PORT}`);

// Start the server
api.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the serverless handler if needed
module.exports.handler = serverless(api);
