import db from "./db.js";
import * as bcrypt from "bcrypt"; 

export async function loginAccount(login, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  if (login == "admin" && await bcrypt.compare("admin", hashedPassword)) {
    return { id: -1, login: "admin" }; // Admin user id is -1
  }

  const user = db.getData(
    "SELECT * FROM accounts WHERE login = ?",
    [login]
  );

  console.log("DB result:", user);

  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return false;
}

export async function registerAccount(login, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  if (login == "admin" && await bcrypt.compare("admin", hashedPassword)) {
    return false; // cant register admin
  }

  const existing = db.getData(
    "SELECT * FROM accounts WHERE login = ?",
    [login]
  );

  if (!existing) {
    db.runData(
      "INSERT INTO accounts (login, password) VALUES (?, ?)",
      [login, hashedPassword]
    );

    const user = db.getData(
      "SELECT * FROM accounts WHERE login = ?",
      [login]
    );

    return user;
  }

  return false;
}

function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect("/login/");
  }
  next();
}

export default {
  registerAccount,
  loginAccount,
  requireLogin
};