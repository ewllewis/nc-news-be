const { selectUsers, selectUserbyUsername } = require("../models/users.model");

async function getUsers(req, res, next) {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
}

async function getUserbyUsername(req, res, next) {
  const { username } = req.params;
  try {
    const user = await selectUserbyUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserbyUsername,
};
