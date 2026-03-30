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
  res.render("index", { title: "Home" });
});

app.use(express.static("public"));

app.get("/saves/", accounts.requireLogin, (req, res) => {
  res.render("saves", {
    title: "Load Save",
    saves: saves.getSaveSummaries(req.session.user_id),
  });
});

app.get("/new_save/", accounts.requireLogin, (req, res) => {
  res.render("new_save", {
    title: "Create New Save",
  });
});

app.get("/saves/:id/", (req, res) => {
  console.log(req.session.user_id);
  const saveId = req.params.id;
  const save = saves.getSave(saveId, req.session.user_id);
  if (!save) {
    return res.status(404).render("save", { id: saveId, save: null, title: "save not found" });
  }
  res.render("save", { id: saveId, save: save, title: `save ${saveId}` });
});

app.get("/register/", (req, res) => {
  res.render("register", {
    title: "Register",
  });
});

app.get("/login/", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

function handleNewSave(req, res) {
  console.log(req.session.user_id);
  const save_id = req.body.name;
  if (!save_id) return res.sendStatus(400);

  if (saves.hasSave(save_id, req.session.user_id)) {
    return res.sendStatus(409);
  }

  saves.addSave(save_id, { difficulty: req.body.difficulty, progress: req.body.progress }, req.session.user_id);

  res.redirect("/saves/");
}

app.post(["/saves/new", "/saves/new/"], handleNewSave);

// Edit form
app.get("/saves/:id/edit", (req, res) => {
  console.log(req.session.user_id);
  const id = req.params.id;
  const save = saves.getSave(id, req.session.user_id);
  res.render("edit_save", { id, save, title: `Edit ${id}` });
});

app.post("/saves/:id/edit", (req, res) => {
  console.log(req.session.user_id);
  const id = req.params.id;
  if (!saves.hasSave(id, req.session.user_id)) return res.sendStatus(404);
  const name = req.body.name;
  const difficulty = req.body.difficulty;
  const progress = req.body.progress;
  saves.updateSave(id, { name, difficulty, progress });
  res.redirect(`/saves/${encodeURIComponent(id)}/`);
});

// Delete
app.post("/saves/:id/delete", (req, res) => {
  console.log(req.session.user_id);
  const id = req.params.id;
  if (!saves.hasSave(id, req.session.user_id)) return res.sendStatus(404);
  saves.deleteSave(id);
  res.redirect("/saves/");
});

app.post("/register", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).send("Login and password required");
  }

  const ans = await accounts.registerAccount(login, password);

  if (ans !== false) {
    req.session.user_id = ans;

    req.session.save(() => {
      res.redirect("/");
    });
  } else {
    res.status(400).send("User already exists");
  }
});

app.get("/test", (req, res) => {
  res.send(`Logged in user: ${req.session.user_id}`);
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  const id = await accounts.loginAccount(login, password);
  console.log("Login result:", id);

  if (!id) {
    return res.status(401).send("Invalid login");
  }

  req.session.user_id = id;

  res.redirect("/new_save/");
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
