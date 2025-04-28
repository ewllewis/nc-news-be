const { selectTopics } = require("../models/topics.model");

async function getTopics(req, res, next) {
  try {
    const topics = await selectTopics();
    res.status(200).send({ topics });
  } catch (error) {
    next(err);
  }
}

module.exports = {
  getTopics,
};
