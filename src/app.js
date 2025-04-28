const express = require("express");
const app = express();

app.use(express.json());

const apiRouter = require("./routers/api.router");

app.use("/api", apiRouter);

app.use("/*splat", (error, req, res, next) => {
  const { message, statusCode = 500 } = error;
  console.log(error, "<<<<<< error");
  return res.status(statusCode).json({ message });
});

module.exports = app;
