const mongoose = require("mongoose");

const User = mongoose.model("User", {
  account: {
    email: { type: String, unique: true },
    username: { type: String, unique: true },
  },
  bookmarks: {
    comics: [],
    characters: [],
  },
  connexion: {
    token: String,
    hash: String,
    salt: String,
  },
});

module.exports = User;
