const express = require("express");
const serverless = require("serverless-http");

const api = express();

const router = express.Router();
router.get("/hello", (req, res) => {
  res.json({
    hey: "hello",
  });
});

api.use("/api/", router);
const PORT = 9001;

api.listen(PORT, () => console.log(`running on ${PORT}`));

module.exports.handler = serverless(api);
