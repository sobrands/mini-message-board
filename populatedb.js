#!/usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (username, message)
VALUES
  ('Amando', 'Hello there!'),
  ('Charles', 'Hello World!');
`;

async function main() {
  const user = process.env.DATABASE_USERNAME;
  const pass = process.env.DATABASE_PASSWORD;
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${user}:${pass}@localhost:5432/mini_message_board`
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();