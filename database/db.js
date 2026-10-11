const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
require('dotenv').config();

const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '..', process.env.DB_PATH) 
  : path.resolve(__dirname, 'stylez.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode & foreign keys for optimal SQLite integrity and performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema if not present
const schemaPath = path.resolve(__dirname, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

module.exports = db;
