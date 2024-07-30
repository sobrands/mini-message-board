const { Pool } = require("pg");

const user = process.env.DATABASE_USERNAME;
const pass = process.env.DATABASE_PASSWORD;

module.exports = new Pool({
  host: "localhost",
  user: user,
  database: "mini_message_board",
  password: pass,
  port: 5432
});
