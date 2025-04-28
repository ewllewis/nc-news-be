const express = require("express");
const apiRouter = express.Router();

const { getAPIEndpoints } = require("../controllers/api.controller");

//define routers
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");

//mount routers
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

//get API Endpoints
apiRouter.get("/", getAPIEndpoints);

module.exports = apiRouter;
