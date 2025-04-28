const express = require("express");
const router = new express.Router();

//articles.controller
const {
  getArticleById,
  getArticles,
} = require("../controllers/articles.controller");

//routes
router.route("/:article_id").get(getArticleById);
router.route("/").get(getArticles);

module.exports = router;
