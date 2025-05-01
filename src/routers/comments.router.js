const express = require("express");
const router = new express.Router();

//comments.controller
const {
  removeCommentByCommentId,
  patchCommentByCommentId,
} = require("../controllers/comments.controller");

//routes
router
  .route("/:comment_id")
  .delete(removeCommentByCommentId)
  .patch(patchCommentByCommentId);

module.exports = router;
