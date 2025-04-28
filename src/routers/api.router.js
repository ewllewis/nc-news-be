const express = require("express");
const apiRouter = express.Router();

const { getAPIEndpoints } = require("../controllers/api.controller");

apiRouter.get("/", getAPIEndpoints);

module.exports = apiRouter;
