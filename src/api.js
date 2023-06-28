// YOUR_BASE_DIRECTORY/netlify/functions/api.js

import express from "express";
import serverless from "serverless-http";

const api = express();

const router = express.Router();
router.get("/hello", (req, res) => {
  res.json({
    hey: "hello",
  });
});

api.use("/api/", router);

export const handler = serverless(api);
