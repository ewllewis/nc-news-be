const db = require("../../db/connection");

async function selectArticleById(articleId) {
  const { rows } = await db.query(
    `SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.body, 
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COALESCE(COUNT(comments.comment_id), 0) AS comment_count
    FROM
      articles
    LEFT JOIN
      comments ON articles.article_id = comments.article_id
    WHERE
      articles.article_id = $1
    GROUP BY
      articles.author, 
      articles.title,
      articles.article_id,
      articles.body,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url;`,
    [articleId]
  );
  return rows[0];
}

async function selectArticles(
  sortBy = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1
) {
  const allowedSorts = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
  ];
  const allowedOrder = ["asc", "desc"];

  if (
    !allowedSorts.includes(sortBy) ||
    !allowedOrder.includes(order.toLowerCase()) ||
    isNaN(Number(limit)) ||
    Number(limit) <= 0 ||
    isNaN(Number(p)) ||
    Number(p) <= 0
  ) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  let queryString = `
    SELECT
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
      comments ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    queryParams.push(topic);
    queryString += `
    WHERE
      articles.topic = $1`;
  }

  queryString += `
    GROUP BY
      articles.article_id
    ORDER BY
      articles.${sortBy} ${order.toLowerCase()}`;

  const { rows } = await db.query(queryString, queryParams);

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No articles found for that query",
    });
  }
  const startingIndex = Number(limit) * (Number(p) - 1);
  const endingIndex = startingIndex + Number(limit);

  const paginatedRows = rows.slice(startingIndex, endingIndex);
  const total_count = rows.length;

  return { articles: paginatedRows, total_count };
}

async function selectCommentsByArticleId(articleId, limit = 10, p = 1) {
  if (
    isNaN(Number(limit)) ||
    Number(limit) <= 0 ||
    isNaN(Number(p)) ||
    Number(p) <= 0
  ) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

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

  const startingIndex = Number(limit) * (Number(p) - 1);
  const endingIndex = startingIndex + Number(limit);

  const paginatedRows = rows.slice(startingIndex, endingIndex);

  return paginatedRows;
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

async function insertArticle(author, title, body, topic, article_img_url = "") {
  const insertResult = await db.query(
    `INSERT INTO
        articles 
        (author,title,body,topic,article_img_url)
      VALUES 
        ($1,$2,$3,$4,$5) 
      RETURNING *`,
    [author, title, body, topic, article_img_url]
  );
  const insertedArticle = insertResult.rows[0];

  const { rows } = await db.query(
    `
    SELECT
      articles.author,
      articles.title,
      articles.body,
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
    WHERE
      articles.article_id = $1
    GROUP BY
      articles.article_id`,
    [insertedArticle.article_id]
  );
  return rows[0];
}

async function removeArticle(article_id) {
  const { rows } = await db.query(
    `
    DELETE FROM 
      articles 
    WHERE 
      article_id = $1
    RETURNING *`,
    [article_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }

  return rows[0];
}

module.exports = {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesOnArticleByArticleId,
  insertArticle,
  removeArticle,
};
