const express = require("express");
const fileUpload = require("express-fileupload");
const SHA256 = require("crypto-js/sha256");
const base64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const router = express.Router();

const User = require("../modeles/User");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/user/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const isEmailExist = await User.findOne({ "account.email": email });
    const isUsernameExist = await User.findOne({
      "account.username": username,
    });

    if (isEmailExist) {
      return res.status(400).json({ message: "This email is already used" });
    }

    if (isUsernameExist) {
      return res.status(400).json({ message: "This username is already used" });
    }

    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(base64);
    const token = uid2(64);

    const newUser = new User({
      account: { email, username },
      connexion: { hash, token, salt },
    });

    await newUser.save();

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ "account.email": email });

    let submittedHash = "";

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    } else {
      submittedHash = SHA256(password + user.connexion.salt).toString(base64);
    }

    if (user.connexion.hash !== submittedHash) {
      return res.status(400).json({ message: "Invalid email or password" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/user/bookmarks", isAuthenticated, async (req, res) => {
  try {
    const { user, type } = req.body;
    return res.status(200).json({ message: user.bookmarks[type] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post(
  "/user/add-bookmark",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const { user, type, itemID } = req.body;

      switch (type) {
        case "comic":
          user.bookmarks.comics.push(itemID);
          break;
        case "character":
          user.bookmarks.characters.push(itemID);
      }

      user.save();

      return res.status(200).json({ message: user.bookmarks });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

router.delete(
  "/user/remove-bookmark",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const { user, type, itemID } = req.body;

      const indexToRemove = user.bookmarks[type].indexOf(itemID);

      if (indexToRemove !== -1) {
        user.bookmarks[type].splice(indexToRemove, 1);
      } else {
        return res
          .status(400)
          .json({ message: "This bookmark does not exist" });
      }
      user.save();
      return res.status(200).json({ message: user.bookmarks });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
