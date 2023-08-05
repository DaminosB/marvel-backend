const express = require("express");
const axios = require("axios");

const marvelApiKey = process.env.MARVEL_API_KEY;

const router = express.Router();

router.get("/characters", async (req, res) => {
  try {
    const { page, name } = req.query;
    console.log(req.query);

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
    return res.status(200).json({ message: response.data });
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
