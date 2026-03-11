document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    // Perform search with Google
    searchBtn.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            const googleSearchURL = "https://www.google.com/search?q=" + encodeURIComponent(query);
            window.location.href = googleSearchURL;
        }
    });

    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
});