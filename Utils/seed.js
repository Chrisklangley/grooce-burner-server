require("dotenv").config();
const mongoose = require("mongoose");

const seedDB = async (req, res) => {
  const { MONGODB_CONNECTION } = process.env;

  try {
    await mongoose.connect(
      "mongodb+srv://christopherlangleydev:Dq8XRo8Gh7K3ErCq@groverburnerdb.odla6k1.mongodb.net/"
    );
    res.status(200).send("connected");
  } catch (error) {
    console.error("Connection error:", error);
  }
};

module.exports = {
  seedDB,
};
