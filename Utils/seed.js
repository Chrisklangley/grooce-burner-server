require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const seedDB = (req, res) => {
  sequelize
    .query(
      `
      DROP TABLE IF EXISTS  groovelistInfo;
      DROP TABLE IF EXISTS groovelist;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR(400) NOT NULL,
        email VARCHAR(400) UNIQUE, -- Make email a unique column
        password VARCHAR(400) NOT NULL
    );

    CREATE TABLE groovelist (
      groovelist_id SERIAL PRIMARY KEY,
      groovelist_song VARCHAR(400),
      price DECIMAL,
      user_email VARCHAR(400), 
      FOREIGN KEY (user_email) REFERENCES users(email)
  );

  CREATE TABLE groovelistInfo(
    groovelistInfo_id SERIAL PRIMARY KEY,
    groovelist_title VARCHAR(400),
    groovelist_img VARCHAR(400),
    user_email VARCHAR(400) 
  );

    `
    )
    .then(() => {
      console.log(`Database was seeded!`);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
    });
};

sequelize.authenticate().then(() => {
  console.log("Connection has been established successfully.");
});

module.exports = {
  seedDB,
};
