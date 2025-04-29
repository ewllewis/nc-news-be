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

module.exports = {
  selectUsers,
};
