const pool = require("./pool");

async function getMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;  
}

async function getMessage(id) {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = ($1)", [parseInt(id) + 1]);
  return rows[0];
}

async function insertMessage(username, message) {
  console.log(message);
  await pool.query("INSERT INTO messages (username, message) VALUES ($1, $2)", [username, message]);
}

module.exports = {
  getMessages,
  getMessage,
  insertMessage
}