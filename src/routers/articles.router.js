const express = require("express");
const router = new express.Router();

//articles.controller
const { getArticleById } = require("../controllers/articles.controller");

//routes
router.route("/:article_id").get(getArticleById);

module.exports = router;
