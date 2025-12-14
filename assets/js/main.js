/* Mobile Menu */
function toggleMenu() {
    const navMenu = document.getElementById("navMenu");
    if (!navMenu) {
        return;
    }

    const isOpen = navMenu.classList.toggle("open");
    const menuToggle = document.getElementById("menuToggle");

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
}

/* Dark Mode */
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
        return;
    }

    const updateToggleLabel = () => {
        const isDark = document.body.classList.contains("dark-mode");
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    };

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else if (savedTheme === "light") {
        document.body.classList.remove("dark-mode");
    }

    updateToggleLabel();

    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        updateToggleLabel();
    });
});
