const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

const apiRouter = require("./routers/api.router");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Invalid ID format" });
  } else if (err.code === "23503") {
    const match = err.detail?.match(/\(([^)]+)\)=\(([^)]+)\)/);

    if (match) {
      const [, column, value] = match;

      let message;
      let statusCode;
      switch (column) {
        case "author":
          message = `User '${value}' does not exist`;
          statusCode = 404;
          break;
        case "topic":
          message = `Topic '${value}' does not exist`;
          statusCode = 404;
          break;
        case "article_id":
          message = `Article with ID '${value}' not found`;
          statusCode = 404;
          break;
        default:
          message = `Invalid input: ${column} '${value}' does not exist`;
          statusCode = 400;
      }

      res.status(statusCode).send({ msg: message });
    } else {
      res
        .status(400)
        .send({ msg: "Invalid input: related resource not found" });
    }
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
