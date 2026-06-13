# Aby uruchomić stronę

```bash
npm install
node seed.js
node index.js
```

Automatycznie tworzą się użytkownicy:

- `admin`, `admin` (admin)
- `user1`, `password1`
- `user2`, `password2`

oraz dane dla każdego z nich.

---

# Funkcjonalność

Można tworzyć saves, modyfikować je, usuwać oraz oglądać. Admin ma dostęp do wszystkich saves.

*(odpalanie save nie działa, bo nie ma gry zrobionej)*

---

# Ścieżki

| Ścieżka | Opis |
|----------|----------|
| `/` | Strona główna |
| `/login` | Logowanie |
| `/register` | Rejestrowanie |
| `/new_save` | Tworzenie save |
| `/saves` | Podgląd saves |
| `/saves/:id` | Podgląd save |
| `/saves/:id/edit` | Edytowanie save |
| `/saves/:id/delete` | Usuwanie save |

---

```text
     /\__ /\
    /       \
   |  o   o  |
   |     X   /
  /         |
 /          |
C     U   U |
```
