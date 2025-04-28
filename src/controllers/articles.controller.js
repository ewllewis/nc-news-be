const { selectArticleById } = require("../models/articles.models");

async function getArticleById(req, res, next) {
  const { article_id } = req.params;
  try {
    //check if article_id is in a valid format
    if (isNaN(article_id)) {
      return res.status(400).json({ msg: "Invalid article ID format" });
    }

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

module.exports = {
  getArticleById,
};
