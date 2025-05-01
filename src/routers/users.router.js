const express = require("express");
const router = new express.Router();

//users.controller
const {
  getUsers,
  getUserbyUsername,
} = require("../controllers/users.controller");

router.route("/").get(getUsers);
router.route("/:username").get(getUserbyUsername);

module.exports = router;
