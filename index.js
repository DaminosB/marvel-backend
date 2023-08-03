require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
const charactersRoute = require("./routes/characters");
const comicsRoute = require("./routes/comics");

app.use(userRoutes);
app.use(charactersRoute);
app.use(comicsRoute);

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome route" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  try {
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🦹‍♀️🦹‍♀️🦹‍♀️`);
});
