const db = require("../../db/connection");

async function selectArticleById(articleId) {
  const { rows } = await db.query(
    `SELECT 
            *
    FROM
        articles
    WHERE
        article_id = $1;`,
    [articleId]
  );
  return rows[0];
}

async function selectArticles() {
  const { rows } = await db.query(
    `SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COALESCE(COUNT(comments.comment_id), 0) AS comment_count
    FROM 
        articles
    LEFT JOIN
        comments ON articles.article_id = comments.article_id
    GROUP BY
        articles.article_id
    ORDER BY
        articles.created_at DESC`
  );
  return rows;
}

async function selectCommentsByArticleID(articleId) {
  const { rows } = await db.query(
    `SELECT
      comments.comment_id,
      comments.votes,
      comments.created_at,
      comments.author,
      comments.body,
      comments.article_id 
    FROM 
      comments
    WHERE 
      comments.article_id = $1
    ORDER BY
      comments.created_at DESC`,
    [articleId]
  );
  return rows;
}

module.exports = {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleID,
};
