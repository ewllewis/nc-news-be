const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Testing this thing!"));

module.exports = app;
