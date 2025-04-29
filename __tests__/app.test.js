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

describe("/api", () => {
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
  describe("/api/topics", () => {
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
  });
  describe("/api/articles", () => {
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
      test("400; Responds 'Invalid ID format' when article_id is in the wrong format", () => {
        return request(app)
          .get("/api/articles/banana")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid ID format");
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

            articles.forEach((article) => {
              //check each article object contains the correct properties
              expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              });
              //check body property is not present on any of the articles
              expect(article).not.toHaveProperty("body");
            });
            //check articles are sorted by date in descending order
            expect(articles).toBeSortedBy(`created_at`, { descending: true });
          });
      });
    });

    describe("GET /api/articles/:article_id/comments", () => {
      test("200; Responds with array of comments from a given article ID", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            //check comments is an array
            expect(Array.isArray(comments)).toBe(true);
            //check size of array with known number of comment objects
            expect(comments).toHaveLength(11);

            comments.forEach((comment) => {
              //check each comment object contains the correct properties
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              });
            });
            expect(comments).toBeSortedBy(`created_at`, { descending: true });
          });
      });
      test("400; Responds 'Invalid ID format' when article_id is in the wrong format", () => {
        return request(app)
          .get("/api/articles/banana/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid ID format");
          });
      });
      test("404; Responds 'Comments not found' when article_id does not exist in the database", () => {
        return request(app)
          .get("/api/articles/100/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Comments not found");
          });
      });
    });

    describe("POST /api/articles/:article_id/comments", () => {
      test("201; Responds with posted comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: "what does this mean for bananas?",
          })
          .expect(201)
          .then(({ body: { comment } }) => {
            //check response matches post input data and has correct properties
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              article_id: 1,
              body: "what does this mean for bananas?",
              votes: expect.any(Number),
              author: "butter_bridge",
              created_at: expect.any(String),
            });
          });
      });
      test("400; Responds 'Invalid ID format' when article_id is in the wrong format", () => {
        return request(app)
          .post("/api/articles/banana/comments")
          .send({
            username: "butter_bridge",
            body: "what does this mean for bananas?",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid ID format");
          });
      });
      test("404; Responds 'User or article not found' when article doesn't exisit in the database", () => {
        return request(app)
          .post("/api/articles/100/comments")
          .send({
            username: "butter_bridge",
            body: "what does this mean for bananas?",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User or article not found");
          });
      });
      test("404; Responds 'User or article not found' when user doesn't exisit in the database", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "banana",
            body: "what does this mean for bananas?",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User or article not found");
          });
      });
      test("400; Responds 'Comment body empty' when body is empty", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: "",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Comment body empty");
          });
      });
    });

    describe("PATCH /api/articles/:article_id", () => {
      test("200; Increment votes by 1 and responds with updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { article } }) => {
            //check votes for given article has been incremented to the correct value
            expect(article).toMatchObject({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: 101,
              article_img_url: expect.any(String),
            });
          });
      });
      test("200; Decrements votes by 100 and responds with updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -100 })
          .expect(200)
          .then(({ body: { article } }) => {
            //check votes for given article has been incremented to the correct value
            expect(article).toMatchObject({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: 0,
              article_img_url: expect.any(String),
            });
          });
      });
      test("400; Responds 'Invalid ID format' when article_id is in the wrong format", () => {
        return request(app)
          .patch("/api/articles/banana")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid ID format");
          });
      });
      test("404; Responds 'Article not found' when article doesn't exisit in the database", () => {
        return request(app)
          .patch("/api/articles/100")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article not found");
          });
      });
      test("400; Responds 'Invalid votes format' when vote format is incorrect", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid votes format");
          });
      });
    });
  });
  describe("/api/comments", () => {
    describe("DELETE /api/comments/:commend_id", () => {
      test("200; deletes comment, responds with no content", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("404; Responds 'Comment not found' when comment doesn't exist in the database", () => {
        return request(app)
          .delete("/api/comments/100")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Comment not found");
          });
      });
      test("400; Responds 'Invalid ID format' when comment ID is invalid", () => {
        return request(app)
          .delete("/api/comments/banana")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid ID format");
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET /api/users", () => {
      test.only("200; Responds wtih array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            //check users is an array
            expect(Array.isArray(users)).toBe(true);
            //check size of array with known number of user objects
            expect(users).toHaveLength(4);
            //check each user object contains the correct properties
            users.forEach((user) => {
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
            });
          });
      });
    });
  });
});
