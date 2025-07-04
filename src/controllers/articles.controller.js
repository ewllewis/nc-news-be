//articles.model
const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesOnArticleByArticleId,
  insertArticle,
  removeArticle,
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
  const { sort_by, order, topic, limit, p } = req.query;
  try {
    const { articles, total_count } = await selectArticles(
      sort_by,
      order,
      topic,
      limit,
      p
    );
    res.status(200).send({ articles, total_count });
  } catch (err) {
    next(err);
  }
}

async function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  try {
    const comments = await selectCommentsByArticleId(article_id, limit, p);

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

async function postArticle(req, res, next) {
  const { author, title, body, topic, article_img_url } = req.body;

  if (!author || !title || !body || !topic) {
    return res.status(400).send({ msg: "Article is missing properties" });
  }

  try {
    const newArticle = await insertArticle(
      author,
      title,
      body,
      topic,
      article_img_url
    );
    res.status(200).send({ newArticle });
  } catch (err) {
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  const { article_id } = req.params;

  try {
    const deletedArticle = await removeArticle(article_id);
    res.status(204).send();
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
  postArticle,
  deleteArticle,
};
