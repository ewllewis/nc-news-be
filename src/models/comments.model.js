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

async function updateCommentByCommentId(commentId, inc_votes) {
  const commentResult = await db.query(
    `SELECT 
      * 
    FROM 
      comments 
    WHERE 
      comment_id = $1`,
    [commentId]
  );

  //check if the first query returns a comment
  if (!commentResult.rows.length) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }

  const currentVotes = commentResult.rows[0].votes;

  const updatedComment = await db.query(
    `UPDATE 
      comments
     SET 
      votes = $1
     WHERE 
      comment_id = $2
     RETURNING *`,
    [currentVotes + inc_votes, commentId]
  );

  return updatedComment.rows[0];
}

module.exports = {
  deleteCommentByCommentId,
  updateCommentByCommentId,
};
