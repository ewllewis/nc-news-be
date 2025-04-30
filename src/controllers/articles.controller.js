//articles.model
const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesOnArticleByArticleId,
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
  const { sort_by, order } = req.query;
  try {
    const articles = await selectArticles(sort_by, order);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
}

async function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  try {
    const comments = await selectCommentsByArticleId(article_id);

    //check if comments exists in database
    if (comments.length === 0) {
      return res.status(404).json({ msg: "Comments not found" });
    }

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
}

async function postCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  try {
    //check if comment body is empty
    if (body.length === 0) {
      return res.status(400).json({ msg: "Comment body empty" });
    }

    const newComment = await insertCommentByArticleId(
      article_id,
      username,
      body
    );
    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
}

async function patchArticleByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes || isNaN(inc_votes)) {
    return res.status(400).send({ msg: "Invalid votes format" });
  }

  try {
    const article = await updateVotesOnArticleByArticleId(
      article_id,
      inc_votes
    );

    //check if article exists
    if (!article) {
      return res.status(404).send({ msg: "Article not found" });
    }

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
};
