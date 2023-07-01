const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const router = express.Router();

const api = express();

api.use(cors());
api.use(express.json());

const { seedDB } = require("../Utils/seed");
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
} = require("../controller");

router.get("/getTotal/:email", getTotal);
router.get("/getCover/:email", getCover);
router.get("/getTrackList/:email", getTrackList);

router.post("/getSongs", getSongs);
router.post("/seed", seedDB);
router.post("/login", login);
router.post("/register", register);
router.post("/addSong", addSong);
router.post("/addCover/Title/:title/:email", addCover);

router.delete("/deleteSong/:songId/:email", deleteSong);

router.get("/test", (req, res) => {
  res.status(200).send("It worked");
});

api.use("/.netlify/functions/api", router);
const PORT = process.env.PORT || 54789;

api.listen(PORT, () => console.log(`running on ${PORT}`));
module.exports.handler = serverless(api);
