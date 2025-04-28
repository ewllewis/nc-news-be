const db = require("../../db/connection");

async function selectArticleById(articleId) {
  const { rows } = await db.query(
    `
        SELECT 
            *
        FROM
            articles
        WHERE
            article_id = $1;`,
    [articleId]
  );
  return rows[0];
}

module.exports = {
  selectArticleById,
};
