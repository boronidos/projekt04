(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const back = document.querySelector(".back-button");
        const home = document.querySelector(".home-button");

        const load = document.querySelector(".load-button");
        const play = document.querySelector(".play-button");
        const logout = document.querySelector(".logout-button");

        const loadSaveButtons = document.querySelectorAll(".load-save-button");

        // Make it keyboard accessible
        back.setAttribute("role", "button");
        back.setAttribute("tabindex", "0");

        function goBack() {
            if (window.history.length > 1) window.history.back();
            else window.location.href = "/";
        }

        function goHome() {
            window.location.href = "/";
        }

        home.addEventListener("click", function (e) {
            goHome();
        });

        back.addEventListener("click", function (e) {
            goBack();
        });


        if (play && load && logout) {
            play.addEventListener("click", function (e) {
                window.location.href = "/new_save/";
            });

            load.addEventListener("click", function (e) {
                window.location.href = "/saves/";
            });

            logout.addEventListener("click", function (e) {
                fetch("/logout/", {
                     method: "POST",
                     credentials: "same-origin",
                     headers: { "Content-Type": "application/json" }
                 })
                .then((resp) => {
                    if (resp.ok) {
                        window.location.href = "/";
                    } else {
                        console.error("Logout failed");
                    }
                })
                .catch((err) => console.error("Logout error", err));
             });
        }

        function loadSave(saveId) {
            window.location.href = `/saves/${saveId}/`;
        }

        loadSaveButtons.forEach(function (button) {
            button.addEventListener("click", function (e) {
                const saveId = button.getAttribute("data-save-id");
                loadSave(saveId);
            });
        });
    });
})();
