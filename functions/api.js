const express = require("express");
const serverless = require("serverless-http");
const router = express.Router();

const api = express();

router.get("/hello", (req, res) => {
  res.json({
    hey: "helloooooo",
  });
});

api.use("/.netlify/functions/api", router);
const PORT = 9001;

api.listen(PORT, () => console.log(`running on ${PORT}`));
module.exports.handler = serverless(api);
