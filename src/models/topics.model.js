const db = require("../../db/connection");

async function selectTopics() {
  const { rows } = await db.query(`
        SELECT 
            *
        FROM
            topics;`);
  return rows;
}

async function insertTopic(slug, description, img_url = "") {
  const insertResult = await db.query(
    `INSERT INTO
        topics 
        (slug, description, img_url)
      VALUES 
        ($1,$2, $3) 
      RETURNING *`,
    [slug, description, img_url]
  );

  return insertResult.rows[0];
}

module.exports = {
  selectTopics,
  insertTopic,
};
