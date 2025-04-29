const express = require("express");
const router = new express.Router();

//comments.controller
const {
  removeCommentByCommentId,
} = require("../controllers/comments.controller");

//routes
router.route("/:comment_id").delete(removeCommentByCommentId);

module.exports = router;
