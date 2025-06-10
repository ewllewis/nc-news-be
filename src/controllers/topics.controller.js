const { selectTopics, insertTopic } = require("../models/topics.model");

async function getTopics(req, res, next) {
  try {
    const topics = await selectTopics();
    res.status(200).send({ topics });
  } catch (error) {
    next(err);
  }
}

async function postTopic(req, res, next) {
  const { slug, description, img_url } = req.body;

  if (!slug || !description) {
    return res.status(400).send({ msg: "Topic is missing properties" });
  }

  try {
    const topic = await insertTopic(slug, description, img_url);
    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTopics,
  postTopic,
};
