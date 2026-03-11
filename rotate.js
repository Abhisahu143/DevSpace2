document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchBtn');

    if (searchInput && searchIcon) {
        searchInput.addEventListener('input', function () {
            if (searchInput.value.trim() !== "") {
                searchIcon.style.color = "#00ffcc";
                searchIcon.style.transform = "scale(1.1)";
            } else {
                searchIcon.style.color = "";
                searchIcon.style.transform = "";
            }
        });
    }
});
