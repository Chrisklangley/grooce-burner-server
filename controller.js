require("dotenv").config();
const { CONNECTION_STRING, SECRET, CLIENT_ID, CLIENT_SECRET } = process.env;
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("./Utils/cloudinary");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const getCover = (req, res) => {
  const { email } = req.params;
  sequelize
    .query(
      `
  SELECT groovelist_title, groovelist_img
  FROM groovelistInfo
  WHERE user_email = '${email}';


  `
    )
    .then((user) => {
      const content = user[0][0];
      res.status(200).send(content);
    })
    .catch((err) => console.log(err));
};

const getTrackList = (req, res) => {
  const { email } = req.params;
  sequelize
    .query(
      `SELECT  groovelist_id, groovelist_song
  From groovelist 
  WHERE user_email = '${email}';
  `
    )
    .then((songs) => {
      const songList = songs[0];
      res.status(200).send(songList);
    })
    .catch((err) => {
      console.error(err);
    });
};

const addCover = async (req, res) => {
  const { title, email } = req.params;
  console.log(title, email);

  const addDetails = (url) => {
    sequelize
      .query(
        `
       

  INSERT INTO groovelistInfo (groovelist_title, groovelist_img,  user_email)
  VALUES('${title}', '${url}','${email}');

  `
      )
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  try {
    const uploaderResponse = await cloudinary.uploader.upload(req.body.data, {
      folder: "newFolder",
    });
    const imgUrl = uploaderResponse.url;
    addDetails(imgUrl);
  } catch (error) {}
};

const getTotal = (req, res) => {
  const { email } = req.params;

  sequelize
    .query(
      `SELECT SUM(price)
    FROM groovelist
    WHERE user_email = '${email}';
    `
    )
    .then((sum) => {
      const total = sum[0][0];
      res.status(200).send(total);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteSong = (req, res) => {
  const { songId, email } = req.params;

  sequelize
    .query(
      `
   DELETE FROM groovelist WHERE groovelist_id ='${songId}';

   SELECT  groovelist_id, groovelist_song
  From groovelist 
  WHERE user_email = '${email}';




   `
    )
    .then((songs) => {
      const songList = songs[0];
      res.status(200).send(songList);
    })
    .catch((err) => {
      console.error(err);
    });
};

const getSongs = (req, res) => {
  const { email } = req.body;
  sequelize
    .query(
      `SELECT  groovelist_id, groovelist_song
  From groovelist 
  WHERE user_email = '${email}';
  `
    )
    .then((songs) => {
      const songList = songs[0];
      res.status(200).send(songList);
    })
    .catch((err) => {
      console.error(err);
    });
};

const addSong = (req, res) => {
  const { clicked, email } = req.body;

  sequelize
    .query(
      `
    
    INSERT INTO groovelist(groovelist_song, price, user_email)
      VALUES('${clicked}', 2.25, '${email}');


    `
    )
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => console.error(err));
};

const login = (req, res) => {
  const { username, email, password } = req.body;

  const payload = { username, email };

  const token = jwt.sign(payload, SECRET);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  sequelize
    .query(
      `
    SELECT email, password
    FROM users
    WHERE email = '${email}' AND password = '${hash}';`
    )
    .then((user) => {
      user = user[0][0];
      if (!user) {
        return res.status(401).send("User not found");
      }

      res.json({ token, email });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};

const register = (req, res) => {
  const { username, email, password } = req.body;

  const payload = { username, email };

  const token = jwt.sign(payload, SECRET);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  sequelize
    .query(
      `
  INSERT INTO users(user_name, email, password)
  VALUES('${username}', '${email}', '${hash}');

  `
    )
    .then((result) => {
      res.json({ token, email, username });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  login,
  register,
  addSong,
  getSongs,
  deleteSong,
  getTotal,
  addCover,
  getCover,
  getTrackList,
};
