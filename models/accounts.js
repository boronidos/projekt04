import db from "./db.js";
import * as bcrypt from "bcrypt"; 

export async function loginAccount(login, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

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

export function getLoginFromId(id) {
  const existing = db.getData(
    "SELECT * FROM accounts WHERE id = ?",
    [id]
  );

  if (!existing) return ""
  else {
    return db.getData("SELECT login FROM accounts WHERE id = ?", [id]).login;
  }
}

export function isAdmin(user_id) {
    const admin = db.getData(
      "SELECT admin FROM accounts WHERE id = ?",
      [user_id]
    );

    return admin.admin != 0;
}

export async function registerAccount(login, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

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
  isAdmin,
  getLoginFromId,
  registerAccount,
  loginAccount,
  requireLogin
};