const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function getMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;  
}

async function getMessage(id) {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = ($1)", [id]);
  return rows[0];
}

async function insertMessage(username, message) {
  await pool.query("INSERT INTO messages (username, message) VALUES ($1, $2)", [username, message]);
}

async function deleteMessage(id) {
  await pool.query(`
    DELETE FROM messages
    WHERE id = $1
  `, [id]);
}

async function getUser(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

async function createUser(data) {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error(err);
      throw Error("FAILED TO GENERATE BCRYPT SALT")
    }
    bcrypt.hash(data.password, salt, async (err, hash) => {
      if (err) {
        console.error(err);
        throw Error("FAILED TO HASH PASSWORD");
      }
      await pool.query(`
        INSERT INTO users (
          firstname,
          lastname,
          username,
          password,
          ismember,
          isadmin
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $5
        )
      `, [data.firstName, data.lastName, data.username, hash, data.admin === "on"]);
    })
  })
}

async function updateUserMembership(id) {
  await pool.query(`
  UPDATE users 
  SET ismember = TRUE
    WHERE id = $1
  `, [id]);
}

module.exports = {
  getMessage,
  getMessages,
  insertMessage,
  deleteMessage,
  getUser,
  getUserById,
  createUser,
  updateUserMembership,
}