const express = require("express");
const app = express();

const apiRouter = require("./routers/api.router");

app.use("/api", apiRouter);

app.use("/*splat", (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
});

app.use("/*splat", (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
