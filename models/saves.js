import session, { Session } from "express-session";
import db from "./db.js";

function rowToSave(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || row.id,
    data: [
      { difficulty: row.difficulty || "" },
      { progress: row.progress || "" },
    ],
  };
}

export function getSaveSummaries(user_id) {
  if (user_id === -1) {
    const rows = db.getAllData("SELECT id, name, difficulty, progress FROM saves");
    return rows.map(rowToSave);
  }

  const rows = db.getAllData("SELECT id, name, difficulty, progress FROM saves WHERE user_id = ?", [user_id]);
  return rows.map(rowToSave);
}

export function hasSave(saveId, user_id) {
  if (user_id === -1) {
    const row = db.getData("SELECT id FROM saves WHERE id = ?", [saveId]);
    return !!row;
  }

  const uid = parseInt(user_id, 10);
  if (Number.isNaN(uid)) return false;

  const row = db.getData("SELECT id FROM saves WHERE id = ? AND user_id = ?", [saveId, uid]);
  return !!row;
}

export function getSave(saveId, user_id) {
  if (user_id === -1) {
    const row = db.getData("SELECT * FROM saves WHERE id = ?", [saveId]);
    return rowToSave(row);
  }

  const uid = parseInt(user_id, 10);
  if (Number.isNaN(uid)) return null;

  const row = db.getData("SELECT * FROM saves WHERE id = ? AND user_id = ?", [saveId, uid]);
  return rowToSave(row);
}

export function addSave(saveId, data, user_id) {
  console.log(user_id);
  const uid = parseInt(user_id, 10);
  if (Number.isNaN(uid)) {
    throw new Error("Invalid user_id");
  }
  const existing = db.getData("SELECT id FROM saves WHERE id = ?", [saveId]);
  console.log(user_id);
  const name = saveId;
  const difficulty = data.difficulty || "";
  const progress = data.progress || "";
  const now = new Date().toISOString();

  if (!existing) {
    db.runData(
      "INSERT INTO saves (user_id, name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, name, difficulty, progress, now, now]
    );
  } else {
    db.runData(
      "UPDATE saves SET difficulty = ?, progress = ?, updated_at = ? WHERE name = ?",
      [difficulty, progress, now, name]
    );
  }
}

export function updateSave(saveId, data) {
  const difficulty = data.difficulty || "";
  const progress = data.progress || "";
  const name = data.name || "";
  const now = new Date().toISOString();
  db.runData(
    "UPDATE saves SET name = ?, difficulty = ?, progress = ?, updated_at = ? WHERE id = ?",
    [name, difficulty, progress, now, saveId]
  );
}

export function deleteSave(saveId) {
  db.runData("DELETE FROM saves WHERE id = ?", [saveId]);
}

export default {
  getSaveSummaries,
  hasSave,
  getSave,
  addSave,
  updateSave,
  deleteSave,
};