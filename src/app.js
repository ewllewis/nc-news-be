const express = require("express");
const app = express();

const apiRouter = require("./routers/api.router");

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Invalid article ID format" });
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
