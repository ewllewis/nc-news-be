const express = require("express");
const router = new express.Router();

//users.controller
const { getUsers } = require("../controllers/users.controller");

router.route("/").get(getUsers);

module.exports = router;
