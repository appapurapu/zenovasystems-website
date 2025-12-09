/* Mobile Menu */
function toggleMenu() {
document.getElementById("navMenu").classList.toggle("open");
}

/* Dark Mode */
document.addEventListener("DOMContentLoaded", function () {
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    themeToggle.textContent = 
        document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

});

