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

async function selectCommentsByArticleId(articleId) {
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

async function insertCommentByArticleId(
  articleId,
  commentUsername,
  commentBody
) {
  const { rows } = await db.query(
    `INSERT INTO
      comments (article_id,author,body)
    VALUES
      ($1,$2,$3)
    RETURNING *`,
    [articleId, commentUsername, commentBody]
  );
  return rows[0];
}

async function updateVotesOnArticleByArticleId(article_id, inc_votes) {
  const articleResult = await db.query(
    `SELECT 
      * 
    FROM 
      articles 
    WHERE 
      article_id = $1`,
    [article_id]
  );

  //check if the first query returns an article
  if (!articleResult.rows.length) {
    return null;
  }

  const currentVotes = articleResult.rows[0].votes;

  const updatedArticle = await db.query(
    `UPDATE 
      articles
     SET 
      votes = $1
     WHERE 
      article_id = $2
     RETURNING *`,
    [currentVotes + inc_votes, article_id]
  );

  return updatedArticle.rows[0];
}

module.exports = {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesOnArticleByArticleId,
};
