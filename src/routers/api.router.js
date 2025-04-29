const express = require("express");
const apiRouter = express.Router();

const { getAPIEndpoints } = require("../controllers/api.controller");

//define routers
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");

//mount routers
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

//get API Endpoints
apiRouter.get("/", getAPIEndpoints);

module.exports = apiRouter;
