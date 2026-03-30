import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "db.sqlite");
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    progress TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

const countRow = db.prepare("SELECT COUNT(*) as c FROM saves").get();
if (countRow && countRow.c === 0) {
  const now = new Date().toISOString();

  // Create 2 users
  db.prepare(
    "INSERT INTO accounts (login, password) VALUES (?, ?)"
  ).run("user1", "$2a$10$ZVxxhDfd/KCWoyuJJ9xSJ.OUE.xOSivEsmtHI90BmpJ9Jq5YQ1Koq"); // hashed "password1"

  db.prepare(
    "INSERT INTO accounts (login, password) VALUES (?, ?)"
  ).run("user2", "$2a$10$sBfqeKHPjFQMfLRftetDc.4Tu66Ti.sFOPy7H0WTiOFXu8Fp3ciSe"); // hashed "password2"

  // Create 2 saves for user 1 (user_id = 1)
  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(1, "save-u1-01", "hard", "74%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(1, "save-u1-02", "medium", "36%", now, now);

  // Create 2 saves for user 2 (user_id = 2)
  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(2, "save-u2-01", "easy", "50%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(2, "save-u2-02", "hard", "90%", now, now);

  // Create 2 admin saves (user_id = -1)
  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(-1, "admin-save-01", "nightmare", "100%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(-1, "admin-save-02", "impossible", "0%", now, now);
}

export function getAllData(sql, params = []) {
  return db.prepare(sql).all(...params);
}

export function getData(sql, params = []) {
  return db.prepare(sql).get(...params);
}

export function runData(sql, params = []) {
  return db.prepare(sql).run(...params);
}

export default {
  db,
  getAllData,
  getData,
  runData,
};
