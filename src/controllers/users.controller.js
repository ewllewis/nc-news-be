const { selectUsers } = require("../models/users.model");

async function getUsers(req, res, next) {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
};
