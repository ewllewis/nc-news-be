const { deleteCommentByCommentId } = require("../models/comments.model");

async function removeCommentByCommentId(req, res, next) {
  const { comment_id } = req.params;
  try {
    const wasDeleted = await deleteCommentByCommentId(comment_id);
    if (!wasDeleted) {
      return res.status(404).send({ msg: "Comment not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  removeCommentByCommentId,
};
