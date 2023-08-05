const express = require("express");
const axios = require("axios");

const marvelApiKey = process.env.MARVEL_API_KEY;

const router = express.Router();

router.get("/comics", async (req, res) => {
  try {
    const { page, name } = req.query;

    const skip = (page - 1) * 100;

    let query = "";

    if (name) {
      query = `skip=${skip}&title=${name}&apiKey=${marvelApiKey}`;
    } else {
      query = `skip=${skip}&apiKey=${marvelApiKey}`;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?${query}`
    );
    return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/comic/:comicID", async (req, res) => {
  try {
    const { comicID } = req.params;
    const query = `${comicID}?apiKey=${marvelApiKey}`;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${query}`
    );

    return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/comics/:characterID", async (req, res) => {
  try {
    const { characterID } = req.params;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterID}?apiKey=${marvelApiKey}`
    );

    return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
