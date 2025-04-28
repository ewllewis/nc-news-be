const express = require("express");
const router = new express.Router();

//topics.controller
const { getTopics } = require("../controllers/topics.controller");

router.route("/").get(getTopics);

module.exports = router;
