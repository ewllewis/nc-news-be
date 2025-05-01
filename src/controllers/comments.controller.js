const {
  deleteCommentByCommentId,
  updateCommentByCommentId,
} = require("../models/comments.model");

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

async function patchCommentByCommentId(req, res, next) {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes || isNaN(inc_votes)) {
    return res.status(400).send({ msg: "Invalid votes format" });
  }

  try {
    const updatedComment = await updateCommentByCommentId(
      comment_id,
      inc_votes
    );
    res.status(200).send({ updatedComment });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  removeCommentByCommentId,
  patchCommentByCommentId,
};
