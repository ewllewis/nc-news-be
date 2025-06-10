const express = require("express");
const router = new express.Router();

//topics.controller
const { getTopics, postTopic } = require("../controllers/topics.controller");

router.route("/").get(getTopics).post(postTopic);

module.exports = router;
