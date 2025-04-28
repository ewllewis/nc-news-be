//articles.model
const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleID,
} = require("../models/articles.model");

async function getArticleById(req, res, next) {
  const { article_id } = req.params;
  try {
    const article = await selectArticleById(article_id);

    //check if article exists in database
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
}

async function getArticles(req, res, next) {
  try {
    const articles = await selectArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
}

async function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  try {
    const comments = await selectCommentsByArticleID(article_id);

    //check if comments exists in database
    if (comments.length === 0) {
      return res.status(404).json({ msg: "Comments not found" });
    }

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
};
