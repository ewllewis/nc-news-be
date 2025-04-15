const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(() => db.query(`DROP TABLE IF EXISTS articles`))
  .then(() => db.query(`DROP TABLE IF EXISTS users`))
  .then(() => db.query(`DROP TABLE IF EXISTS topics`))

  .then(() => {
    return db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR NOT NULL,
        img_url VARCHAR(1000) NOT NULL
        );
      `)
  })

  .then(() => {
    const formattedTopics = topicData.map(({ slug, description, img_url}) => [
      slug,
      description,
      img_url
    ]);

    const insertTopicsQuery = format(`
      INSERT INTO topics 
        (slug,description,img_url) 
      VALUES
        %L RETURNING *;`, 
        formattedTopics
    );

    return db.query(insertTopicsQuery)
  })

  .then(() => {
    return db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY UNIQUE,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR(1000) NOT NULL
        );
      `)
  })

  .then(() => {
    const formattedUsers = userData.map(({username, name, avatar_url}) => [
      username,
      name,
      avatar_url
    ]);

    const insertUsersQuery = format(`
      INSERT INTO users 
        (username, name, avatar_url) 
      VALUES
        %L RETURNING *;`, 
        formattedUsers
    );

    return db.query(insertUsersQuery)
  })

  .then(() => {
    return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000) NOT NULL
        );
      `)
    })

  .then(() => {
    const formattedArticles = articleData.map(article => {
      const formatted = convertTimestampToDate(article);
      return [
      formatted.title, 
      formatted.topic, 
      formatted.author, 
      formatted.body, 
      formatted.created_at, 
      formatted.votes, 
      formatted.article_img_url
      ];
    });

    const insertArticlesQuery = format(`
      INSERT INTO articles 
        (title, topic, author, body, created_at, votes, article_img_url) 
      VALUES
        %L RETURNING *;`, 
        formattedArticles
    );

    return db.query(insertArticlesQuery)
   })

  .then(() => {
    return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users(username) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
  })

  .then(() => {
    const formattedComments = commentData.map(comment => {
      const formatted = convertTimestampToDate(comment);
      return [
      formatted.article_id,
      formatted.body,
      formatted.votes,
      formatted.author,
      formatted.created_at
      ];
    });

    const insertCommentsQuery = format(`
      INSERT INTO comments
        (article_id,body,votes,author,created_at) 
      VALUES
        %L RETURNING *;`, 
        formattedComments
    );

    return db.query(insertCommentsQuery)
  })

};
module.exports = seed;
