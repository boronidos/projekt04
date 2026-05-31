Aby uruchomic strone:
npm install 
node seed.js
node index.js

Automatycznie tworzą sie użytkownicy:
admin, admin (admin)
user1, password1
user2, password2

oraz dane dla każdego z nich.

FUNKCJONALNOSC:
mozna tworzyc saves, modyfikować je, usuwać oraz oglądać. Admin ma dostęp do wszystkich saves.
(odpalanie save nie działa bo nie ma gry zrobionej)

ŚCIEŻKI:
/ - Strona główna
/login - logowanie
/register - rejestrowanie
/new_save - tworzenie save
/saves - podgląd saves
/saves/:id: - podgląd save
/saves/:id:/edit - edytowanie save
/saves/:id:/delete - usuwanie save



```text
     /\__ /\
    /       \
   |  o   o  |
   |     X   /
  /         |
 /          |
C     U   U |
```
