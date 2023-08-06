const express = require("express");
const axios = require("axios");

const marvelApiKey = process.env.MARVEL_API_KEY;

const router = express.Router();

const User = require("../modeles/User");

router.get("/characters", async (req, res) => {
  try {
    const sentToken = req.headers.authorization.replace("Bearer ", "");
    const foundUser = await User.findOne({ "connexion.token": sentToken });

    const { page, name } = req.query;

    const skip = (page - 1) * 100;

    let query = "";

    if (name) {
      query = `skip=${skip}&name=${name}&apiKey=${marvelApiKey}`;
    } else {
      query = `skip=${skip}&apiKey=${marvelApiKey}`;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?${query}`
    );

    const dataToSend = response.data;

    if (foundUser) {
      dataToSend.bookmarks = [];
      foundUser.bookmarks.characters.map((bookmark) =>
        dataToSend.bookmarks.push(bookmark._id)
      );
    }

    return res.status(200).json({ message: dataToSend });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/character/:characterID", async (req, res) => {
  try {
    const { characterID } = req.params;

    const query = `${characterID}?apiKey=${marvelApiKey}`;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${query}`
    );
    return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
