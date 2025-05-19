const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env.production" }); // Ensure the production .env file is loaded

const ENV = process.env.NODE_ENV || "development";
const config = {};

if (ENV === "production") {
  // Ensure the connection string is set correctly in production
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2; // Limit number of connections
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE or DATABASE_URL configured");
}

const pool = new Pool(config);

pool.on("connect", () => {
  console.log("Connected to the database");
});

module.exports = pool;
