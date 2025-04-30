# Northcoders News API

A backend API built using Node.js and PostgreSQL. This API allows users to fetch articles, interact with comments, and manage news data.

## Hosted Version

🌐 [Northcoders News API on Render](https://nc-news-j5i5.onrender.com/)

## Summary

This project is a RESTful API that enables users to read and interact with news articles. It includes endpoints for topics, articles, users, and comments. It is built with:

- Node.js
- Express
- PostgreSQL
- Deployed using Render
- Supabase PostgreSQL for hosting the production database

---

## Setup Instructions

### Prerequisites

- **Node.js**: v14 or higher
- **PostgreSQL**: v12 or higher

### 1. Clone the Repository

```bash
git clone https://github.com/ewllewis/nc_news.git
cd nc_news
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` Files

You need two environment files:

- `.env.development`
- `.env.test`

#### Example `.env.development`:

```
PGDATABASE=nc_news
```

#### Example `.env.test`:

```
PGDATABASE=nc_news_test
```

For production environments (like Render), use a `DATABASE_URL` variable instead.

### 4. Setup and Seed the Local Database

```bash
npm run setup-dbs
npm run seed-dev
```

### 5. Run the API Locally

```bash
npm start
```

Your server should now be running at `http://localhost:9090`.

---

## Running Tests

To run the test suite (after setting up `.env.test`):

```bash
npm test
```

---

## Available Scripts

| Script      | Description                                  |
| ----------- | -------------------------------------------- |
| `start`     | Starts the server                            |
| `setup-dbs` | Creates local development and test databases |
| `seed-dev`  | Seeds the development database               |
| `seed-prod` | Seeds the production database                |
| `test`      | Runs all test suites                         |
| `test-seed` | Runs only seed tests                         |

---

## Deployment Notes

This API is deployed on [Render](https://render.com), with automatic redeployment on every push to the `main` branch on GitHub.

---
