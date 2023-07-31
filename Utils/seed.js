require("dotenv").config();
const mongoose = require("mongoose");

const seedDB = async (req, res) => {
  const { MONGODB_CONNECTION } = process.env;

  try {
    await mongoose.connect(MONGODB_CONNECTION);
    res.status(200).send("connected");
  } catch (error) {
    console.error("Connection error:", error);
  }
};

module.exports = {
  seedDB,
};
