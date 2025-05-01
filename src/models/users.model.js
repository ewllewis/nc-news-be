const db = require("../../db/connection");

async function selectUsers() {
  const { rows } = await db.query(`
    SELECT
      users.username,
      users.name,
      users.avatar_url
    FROM 
      users`);
  return rows;
}

async function selectUserbyUsername(userName) {
  const { rows } = await db.query(
    `
    SELECT
      users.username,
      users.name,
      users.avatar_url
    FROM 
      users
    WHERE
      users.username = $1`,
    [userName]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }
  return rows[0];
}

module.exports = {
  selectUsers,
  selectUserbyUsername,
};
