const express = require("express");
const router = new express.Router();

//articles.controller
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controller");

//routes
router
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);
router
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleByArticleId)
  .delete(deleteArticle);
router.route("/").get(getArticles).post(postArticle);

module.exports = router;
