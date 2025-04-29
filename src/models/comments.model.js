const db = require("../../db/connection");

async function deleteCommentByCommentId(commentId) {
  const { rows } = await db.query(
    `DELETE FROM
        comments
    WHERE
        comment_id = $1
    RETURNING *`,
    [commentId]
  );
  return rows.length > 0;
}

module.exports = {
  deleteCommentByCommentId,
};
