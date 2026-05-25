import express from "express";
import saves from "./models/saves.js";
import accounts from "./models/accounts.js";
import session from "express-session";

const port = 8000;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 
    }
  })
);

app.get("/", (req, res) => {
  res.render("index", { 
    title: "Home",
    user_login: req.session.user_login || null,
    error: req.query.error || null
  });
});

app.use(express.static("public"));

app.get("/saves/", accounts.requireLogin, (req, res) => {
  res.render("saves", {
    title: "Load Save",
    saves: saves.getSaveSummaries(req.session.user_id),
    user_login: req.session.user_login || null,
    error: req.query.error || null
  });
});

app.get("/new_save/", accounts.requireLogin, (req, res) => {
  res.render("new_save", {
    title: "Create New Save",
    user_login: req.session.user_login || null,
    error: req.query.error || null
  });
});

app.get("/saves/:id/", (req, res) => {
  console.log(req.session.user_id);
  const saveId = req.params.id;
  const save = saves.getSave(saveId, req.session.user_id) || null;
  if (!save) {
    return res.sendStatus(404);
  }
  res.render("save", { 
    id: saveId, save: save, title: `save ${saveId}`,
    user_login: req.session.user_login || null,
    error: req.query.error || null
  });
});

app.get("/register/", (req, res) => {
  res.render("register", {
    title: "Register",
    user_login: req.session.user_login || null,
    error: req.query.error || null
  });
});

app.get("/login/", (req, res) => {
  res.render("login", {
    title: "Login",
    user_login: req.session.user_login || null,
    error: req.query.error || null
  });
});

function handleNewSave(req, res) {
  console.log(req.session.user_id);
  const save_id = req.body.name;
  if (!save_id) return res.sendStatus(400);

  if (saves.hasSave(save_id, req.session.user_id)) {
    return res.sendStatus(409);
  }

  if (req.body.progress !== "" && (!Number.isInteger(parseInt(req.body.progress)) || parseInt(req.body.progress) < 0 || parseInt(req.body.progress) > 100)) {
    return res.redirect("/new_save?error=progress_invalid");
  }

  saves.addSave(save_id, { difficulty: req.body.difficulty, progress: req.body.progress }, req.session.user_id);

  res.redirect("/saves/");
}

app.post(["/saves/new", "/saves/new/"], handleNewSave);

// Edit form
app.get("/saves/:id/edit", (req, res) => {
  console.log(req.session.user_id);
  const id = req.params.id;
  const save = saves.getSave(id, req.session.user_id) || null;
  res.render("edit_save", { id, save, title: `Edit ${id}`, user_login: req.session.user_login, error: req.query.error || null});
});

app.post("/saves/:id/edit", (req, res) => {
  console.log(req.session.user_id);
  const id = req.params.id;
  if (!saves.hasSave(id, req.session.user_id)) return res.sendStatus(404);
  const name = req.body.name;
  const difficulty = req.body.difficulty;
  const progress = req.body.progress;

  if (progress !== "" && (!Number.isInteger(parseInt(progress)) || parseInt(progress) < 0 || parseInt(progress) > 100)) {
    return res.redirect(`/saves/${encodeURIComponent(id)}/edit?error=progress_invalid`);
  }

  saves.updateSave(id, { name, difficulty, progress });
  res.redirect(`/saves/${encodeURIComponent(id)}/`);
});

// Delete
app.post("/saves/:id/delete", (req, res) => {
  console.log(req.session.user_id);
  const id = req.params.id;
  if (!saves.hasSave(id, req.session.user_id)) return res.redirect("/saves/:id/delete");
  saves.deleteSave(id);
  res.redirect("/saves/");
});

app.post("/register", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.redirect("/register?error=missing_fields");
  }

  const user = await accounts.registerAccount(login, password);

  if (user !== false) {
    req.session.user_id = user.id;
    req.session.user_login = user.login;

    req.session.save(() => {
      res.redirect("/");
    });
  } else {
    return res.redirect("/register?error=user_exists");
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;

    if (!login || !password) {
    return res.redirect("/login?error=missing_fields");
  }

  const user = await accounts.loginAccount(login, password);
  console.log("Login result:", user);

  if (!user) {
    return res.redirect("/login?error=user_not_found");
  }

  req.session.user_id = user.id;
  req.session.user_login = user.login;

  res.redirect("/");
});

app.post(["/logout", "/logout/"], (req, res) => {
    if (!req.session) return res.status(200).json({ ok: true });
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ ok: false, error: "Could not destroy session" });

      res.clearCookie("connect.sid");
      return res.status(200).json({ ok: true });
    });
  });

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
