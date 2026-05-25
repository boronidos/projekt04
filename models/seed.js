const db = require("./db");

function seedDatabase() {
  const now = new Date().toISOString();

  db.prepare("DELETE FROM saves").run();
  db.prepare("DELETE FROM accounts").run();

  db.prepare("DELETE FROM sqlite_sequence WHERE name='accounts'").run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name='saves'").run();

  // Users
  db.prepare(
    "INSERT INTO accounts (login, password, admin) VALUES (?, ?, ?)"
  ).run(
    "admin",
    "$2a$10$fsLGhVVK6J5ZLvpFun50CuZwS2bpjTKZ39RGRHfPaG6NIlI1J.GUq",
    1
  );

  db.prepare(
    "INSERT INTO accounts (login, password, admin) VALUES (?, ?, ?)"
  ).run(
    "user1",
    "$2a$10$ZVxxhDfd/KCWoyuJJ9xSJ.OUE.xOSivEsmtHI90BmpJ9Jq5YQ1Koq",
    0
  );

  db.prepare(
    "INSERT INTO accounts (login, password, admin) VALUES (?, ?, ?)"
  ).run(
    "user2",
    "$2a$10$sBfqeKHPjFQMfLRftetDc.4Tu66Ti.sFOPy7H0WTiOFXu8Fp3ciSe",
    0
  );

  // Saves
  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(1, "save-u1-01", "hard", "74%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(1, "save-u1-02", "medium", "36%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(2, "save-u2-01", "easy", "50%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(2, "save-u2-02", "hard", "90%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(3, "admin-save-01", "nightmare", "100%", now, now);

  db.prepare(
    "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(3, "admin-save-02", "impossible", "0%", now, now);

  console.log("Database seeded.");
}

seedDatabase();