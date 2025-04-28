const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../src/app");
const request = require("supertest");
const articles = require("../db/data/test-data/articles");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200; Responds with an array of all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        //check topics is an array
        expect(Array.isArray(topics)).toBe(true);
        //check size of array with known number of topic objects
        expect(topics).toHaveLength(3);
        //check each topic object contains the correct properties
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200; Responds with an article from a given article ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        //check article ID matches article requested
        expect(article.article_id).toEqual(1);
        //check article contains the correct properties
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400; Responds 'Invalid article ID format' when article_id is in the wrong format", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid article ID format");
      });
  });
  test("404; Responds 'Article not found' when article_id does not exist in the database", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200; Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        //check articles is an array
        expect(Array.isArray(articles)).toBe(true);
        //check size of array with known number of article objects
        expect(articles).toHaveLength(13);

        for (let i = 0; i > articles.length; i++) {
          //check each article object contains the correct properties
          expect(articles[i]).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          //check articles are sorted by date in descending order
          const currentArticle = articles[i];
          const nextArticle = articles[i + 1];
          expect(new Date(currentArticle.created_at)).toBeGreaterThanOrEqual(
            new Date(nextArticle.created_at)
          );
          //check body property is not present on any of the articles
          expect(articles[i]).not.toHaveProperty("body");
        }
      });
  });
});
