(function () {
    document.addEventListener("DOMContentLoaded", function () {
        // Use Optional Chaining or check for existence before using
        const back = document.querySelector(".back-button");
        const home = document.querySelector(".home-button");
        const load = document.querySelector(".load-button");
        const play = document.querySelector(".play-button");
        const logout = document.querySelector(".logout-button");

        // 1. Only set attributes if the button actually exists
        if (back) {
            back.setAttribute("role", "button");
            back.setAttribute("tabindex", "0");
            back.addEventListener("click", function (e) {
                if (window.history.length > 1) window.history.back();
                else window.location.href = "/";
            });
        }

        if (home) {
            home.addEventListener("click", () => window.location.href = "/");
        }

        // 2. Add listeners individually so they don't block each other
        if (play) {
            play.addEventListener("click", () => window.location.href = "/new_save/");
        }

        if (load) {
            load.addEventListener("click", () => window.location.href = "/saves/");
        }

        if (logout) {
            logout.addEventListener("click", function (e) {
                fetch("/logout/", {
                    method: "POST",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" }
                })
                .then((resp) => {
                    if (resp.ok) window.location.href = "/";
                    else console.error("Logout failed");
                })
                .catch((err) => console.error("Logout error", err));
            });
        }

        // 3. Load/Save buttons
        const loadSaveButtons = document.querySelectorAll(".load-save-button");
        loadSaveButtons.forEach(function (button) {
            button.addEventListener("click", function (e) {
                const saveId = button.getAttribute("data-save-id");
                window.location.href = `/saves/${saveId}/`;
            });
        });
    });
})();