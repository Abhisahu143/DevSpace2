document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const aiToolsContainer = document.querySelector('.ai-tools-container');
    const toggleAiToolsBtn = document.getElementById('toggleAiTools');
    const aiToolsGrid = document.querySelector('.ai-tools-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Initialize search input
    function initializeSearchInput() {
        searchInput.value = '';
        searchInput.disabled = false;
        searchInput.readOnly = false;
        searchInput.placeholder = "Search or enter URL...";
        searchInput.style.pointerEvents = 'auto';
        searchInput.style.userSelect = 'text';
        searchInput.style.cursor = 'text';

        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    // Function to show search suggestions
    function showSuggestions(query) {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (!query.trim()) {
            suggestionsContainer.classList.remove('active');
            return;
        }

        // Common search engines and suggestions
        const suggestions = [
            { icon: 'fa-search', text: `Search for "${query}"`, type: 'search' },
            { icon: 'fa-globe', text: `Visit ${query}`, type: 'url' },
            { icon: 'fa-youtube', text: `Search YouTube for "${query}"`, type: 'youtube' },
            { icon: 'fa-wikipedia-w', text: `Search Wikipedia for "${query}"`, type: 'wikipedia' }
        ];

        // Filter suggestions based on query
        const filteredSuggestions = suggestions.filter(suggestion =>
            suggestion.text.toLowerCase().includes(query.toLowerCase())
        );

        // Update suggestions HTML
        suggestionsContainer.innerHTML = filteredSuggestions.map(suggestion => `
            <div class="suggestion-item" data-type="${suggestion.type}">
                <i class="fab ${suggestion.icon}"></i>
                <span>${suggestion.text}</span>
            </div>
        `).join('');

        // Add click handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const query = searchInput.value.trim();

                switch (type) {
                    case 'search':
                        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'url':
                        window.location.href = addHttpIfNeeded(query);
                        break;
                    case 'youtube':
                        window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                        break;
                    case 'wikipedia':
                        window.location.href = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
                        break;
                }
            });
        });

        suggestionsContainer.classList.add('active');
    }

    // Function to perform search
    function performSearch(e) {
        e.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {
            searchInput.classList.add('shake');
            searchInput.placeholder = "Please enter a search term or URL...";
            searchInput.style.borderColor = "#ff4444";
            searchInput.focus();

            setTimeout(() => {
                searchInput.classList.remove('shake');
                searchInput.placeholder = "Search or enter URL...";
                searchInput.style.borderColor = "rgba(0, 255, 204, 0.3)";
            }, 2000);
            return;
        }

        try {
            if (isValidUrl(query)) {
                window.location.href = addHttpIfNeeded(query);
            } else {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
        } catch (error) {
            console.error('Search error:', error);
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }

    // Helper function to check if string is a valid URL
    function isValidUrl(string) {
        const domainPattern = /^[\w-]+(\.[\w-]+)+[/#?]?.*$/;
        const tldPattern = /\.(com|org|net|edu|gov|io|co|app|dev|me|info|biz|xyz|tech|online|site|website|blog|store|shop|club|design|studio|agency|digital|media|marketing|solutions|services|systems|software|cloud|host|email|mail|web)$/i;
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

        if (string === 'localhost' || string.startsWith('localhost:')) {
            return true;
        }

        if (domainPattern.test(string)) {
            return true;
        }

        if (ipPattern.test(string)) {
            return true;
        }

        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Helper function to add http:// if needed
    function addHttpIfNeeded(url) {
        if (!/^https?:\/\//i.test(url)) {
            return 'https://' + url;
        }
        return url;
    }

    // Add event listeners for search
    searchForm.addEventListener("submit", performSearch);
    searchBtn.addEventListener("click", performSearch);

    // Handle Enter key
    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            performSearch(e);
        }
    });

    // Initialize search input
    initializeSearchInput();

    // Add input event for real-time suggestions
    searchInput.addEventListener("input", function () {
        let query = this.value.trim();

        // Add space between words if missing
        query = query.replace(/([a-zA-Z])([A-Z])/g, '$1 $2'); // Add space between camelCase
        query = query.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase and uppercase
        query = query.replace(/([0-9])([a-zA-Z])/g, '$1 $2'); // Add space between numbers and letters
        query = query.replace(/([a-zA-Z])([0-9])/g, '$1 $2'); // Add space between letters and numbers

        // Update the input value with proper spacing
        this.value = query;

        if (query) {
            if (isValidUrl(query)) {
                this.style.borderColor = "#00ff00";
                this.title = "Press Enter to visit this URL";
            } else {
                this.style.borderColor = "rgba(0, 255, 204, 0.3)";
                this.title = "Press Enter to search";
            }
            showSuggestions(query);
        } else {
            this.style.borderColor = "rgba(0, 255, 204, 0.3)";
            this.title = "Search or enter URL...";
            document.querySelector('.search-suggestions').classList.remove('active');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-container')) {
            document.querySelector('.search-suggestions').classList.remove('active');
        }
    });

    // Handle keyboard navigation for suggestions
    searchInput.addEventListener('keydown', function (e) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        const activeSuggestion = document.querySelector('.suggestion-item.active');

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!activeSuggestion) {
                    suggestions[0]?.classList.add('active');
                } else {
                    const nextSuggestion = activeSuggestion.nextElementSibling;
                    if (nextSuggestion) {
                        activeSuggestion.classList.remove('active');
                        nextSuggestion.classList.add('active');
                    }
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (activeSuggestion) {
                    const prevSuggestion = activeSuggestion.previousElementSibling;
                    activeSuggestion.classList.remove('active');
                    if (prevSuggestion) {
                        prevSuggestion.classList.add('active');
                    }
                }
                break;
            case 'Enter':
                if (activeSuggestion) {
                    e.preventDefault();
                    activeSuggestion.click();
                }
                break;
            case 'Escape':
                document.querySelector('.search-suggestions').classList.remove('active');
                break;
        }
    });

    // Add focus/blur events
    searchInput.addEventListener("focus", function () {
        this.style.borderColor = "rgba(0, 255, 204, 0.8)";
        if (!this.value.trim()) {
            this.placeholder = "Type to search or enter URL...";
        }
    });

    searchInput.addEventListener("blur", function () {
        this.style.borderColor = "rgba(0, 255, 204, 0.3)";
        if (!this.value.trim()) {
            this.placeholder = "Search or enter URL...";
        }
    });

    // Ensure input is enabled and focused when clicking container
    document.querySelector('.search-container').addEventListener('click', function (e) {
        if (e.target !== searchInput) {
            searchInput.focus();
        }
    });

    // Prevent interference with input
    searchInput.addEventListener('mousedown', function (e) {
        e.stopPropagation();
    });

    // Add paste event to handle pasted URLs
    searchInput.addEventListener("paste", function (e) {
        setTimeout(() => {
            const query = this.value.trim();
            if (isValidUrl(query)) {
                this.style.borderColor = "#00ff00";
                this.title = "Press Enter to visit this URL";
            }
        }, 0);
    });

    // AI Tools Toggle Functionality
    toggleAiToolsBtn.addEventListener('click', () => {
        aiToolsContainer.classList.toggle('hidden');
        toggleAiToolsBtn.classList.toggle('active');

        // Save state to localStorage
        const isHidden = aiToolsContainer.classList.contains('hidden');
        localStorage.setItem('aiToolsHidden', isHidden.toString());
    });

    // Check if AI Tools should be hidden
    if (localStorage.getItem('aiToolsHidden') === 'true') {
        aiToolsContainer.classList.add('hidden');
        toggleAiToolsBtn.classList.remove('active');
    } else {
        toggleAiToolsBtn.classList.add('active');
    }

    // AI Tools Category Filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Update grid category
            const category = button.dataset.category;
            aiToolsGrid.dataset.category = category;
        });
    });


    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U (View Source)
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J")) ||
            (event.ctrlKey && event.key === "U")
        ) {
            event.preventDefault();
        }
    });

    // Improved DevTools detection
    let devtoolsOpen = false;
    const threshold = 160;

    setInterval(() => {
        const start = new Date().getTime();
        debugger; // Triggers a delay if DevTools is open
        const end = new Date().getTime();

        if (end - start > threshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                alert("Developer Tools detected! Closing the page.");
                window.location.href = "about:blank"; // Redirect instead of close
            }
        }
    }, 2000);
});

// Clock functionality
function updateClock() {
    const now = new Date();

    const bottomClock = document.getElementById('bottomClock');
    const bottomDate = document.getElementById('bottomDate');

    const hourHand = document.getElementById('hourHand');
    const minHand = document.getElementById('minHand');
    const secHand = document.getElementById('secHand');

    // Update digital time
    if (bottomClock) {
        bottomClock.textContent = now.toLocaleTimeString();
    }

    // Update digital date
    if (bottomDate) {
        bottomDate.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Update analog hands
    if (hourHand && minHand && secHand) {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate degrees (including smooth transitions)
        // 360 / 60 = 6 degrees per second/minute. Add ms/60000 for smooth second hand
        const secDeg = (seconds * 6) + (milliseconds * 0.006);
        // 360 / 60 = 6 degrees. Add seconds portion for smooth minute hand
        const minDeg = (minutes * 6) + (seconds * 0.1);
        // 360 / 12 = 30 degrees. Add minutes portion for smooth hour hand
        const hourDeg = ((hours % 12) * 30) + (minutes * 0.5);

        secHand.style.transform = `rotate(${secDeg}deg)`;
        minHand.style.transform = `rotate(${minDeg}deg)`;
        hourHand.style.transform = `rotate(${hourDeg}deg)`;

        // Celestial Orbit Tracker (Sun & Moon 24-hour cycle)
        const celestialOrbit = document.getElementById('celestialOrbit');
        const celestialBody = document.getElementById('celestialBody');

        if (celestialOrbit && celestialBody) {
            // Calculate total minutes elapsed in the 24-hour day (0 to 1440)
            const elapsedMinutes = (hours * 60) + minutes + (seconds / 60);

            // Map 0-1440 minutes to 0-360 degrees. 
            // We want 6 AM (360 mins) to be 90deg (left), 12 PM (720 mins) to be 180deg (top).
            // By default, 0deg points UP. So 12AM (0 mins) needs to point DOWN (180deg).
            const celestialDeg = (elapsedMinutes / 1440 * 360) + 180;
            celestialOrbit.style.transform = `translate(-50%, -50%) rotate(${celestialDeg}deg)`;

            // Keep the icon inside the orbit upright by reverse-rotating it
            celestialBody.style.transform = `rotate(-${celestialDeg}deg)`;

            // Determine Day (6:00 to 18:00) vs Night (18:00 to 6:00)
            const isDayTheme = hours >= 6 && hours < 18;

            if (isDayTheme) {
                celestialBody.innerHTML = '<i class="fas fa-sun"></i>';
                celestialBody.className = 'celestial-body tracker-sun';
            } else {
                celestialBody.innerHTML = '<i class="fas fa-moon"></i>';
                celestialBody.className = 'celestial-body tracker-moon';
            }
        }
    }
}

// Update clock 60 times a second for super smooth analog sweeping hand
setInterval(updateClock, 1000 / 60);
updateClock(); // Initial call

// Weather functionality
async function getWeather() {
    try {
        // Get user's current location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const API_KEY = '11001d06faeb403a8ea145113252102';
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${position.coords.latitude},${position.coords.longitude}&aqi=no`);
        const data = await response.json();

        const temperature = document.getElementById('temperature');
        const location = document.getElementById('location');
        const iconWrapper = document.getElementById('weatherIconWrapper');

        if (data.location) {
            temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
            location.textContent = `${data.location.name}`;

            if (iconWrapper) {
                const condition = data.current.condition.text.toLowerCase();
                let iconHtml = '<i class="fas fa-cloud"></i>';

                if (condition.includes('sunny') || condition.includes('clear')) {
                    if (data.current.is_day) {
                        iconHtml = '<i class="fas fa-sun icon-sun"></i>';
                    } else {
                        iconHtml = '<i class="fas fa-moon icon-moon"></i>';
                    }
                } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
                    iconHtml = '<i class="fas fa-cloud-showers-heavy icon-rain"></i>';
                } else if (condition.includes('snow') || condition.includes('ice') || condition.includes('blizzard')) {
                    iconHtml = '<i class="fas fa-snowflake" style="color: #fff; filter: drop-shadow(0 0 10px #fff); animation: floatOrb 3s infinite alternate;"></i>';
                } else if (condition.includes('thunder') || condition.includes('storm')) {
                    iconHtml = '<i class="fas fa-bolt" style="color: #FFD700; filter: drop-shadow(0 0 15px #FFD700); animation: floatOrb 1s infinite alternate;"></i>';
                } else if (condition.includes('cloud') || condition.includes('overcast')) {
                    iconHtml = '<i class="fas fa-cloud icon-cloud"></i>';
                } else if (condition.includes('mist') || condition.includes('fog')) {
                    iconHtml = '<i class="fas fa-smog icon-cloud"></i>';
                } else {
                    iconHtml = '<i class="fas fa-cloud-sun icon-cloud"></i>';
                }

                iconWrapper.innerHTML = iconHtml;
            }
        } else {
            throw new Error('Weather data not available');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('temperature').textContent = '--°C';
        document.getElementById('location').textContent = 'Weather unavailable';

        // Show error message if geolocation is denied
        if (error.code === 1) {
            alert('Please allow location access to get weather for your current location.');
        }
    }
}

// Initialize weather
getWeather();

// Refresh weather every 30 minutes
setInterval(getWeather, 30 * 60 * 1000);



// Custom App Functionality
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('customAppModal');
    const addCustomAppBtn = document.getElementById('addCustomApp');
    const closeModalBtn = document.querySelector('.close-modal');
    const customAppForm = document.getElementById('customAppForm');
    const appGrid = document.querySelector('.app');

    // Open modal
    addCustomAppBtn.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'block';
    });

    // Close modal
    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    customAppForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const appName = document.getElementById('appName').value;
        const appUrl = document.getElementById('appUrl').value;
        const appIcon = document.getElementById('appIcon').value;

        // Create new app element
        const newApp = document.createElement('a');
        newApp.href = appUrl;
        newApp.target = '_blank';
        newApp.title = appName;

        const img = document.createElement('img');
        img.src = appIcon;
        img.alt = appName;

        newApp.appendChild(img);

        // Insert before the add button
        appGrid.insertBefore(newApp, addCustomAppBtn);

        // Save to localStorage
        const customApps = JSON.parse(localStorage.getItem('customApps') || '[]');
        customApps.push({ name: appName, url: appUrl, icon: appIcon });
        localStorage.setItem('customApps', JSON.stringify(customApps));

        // Reset form and close modal
        customAppForm.reset();
        modal.style.display = 'none';
    });

    // Load saved custom apps
    function loadCustomApps() {
        const customApps = JSON.parse(localStorage.getItem('customApps') || '[]');
        customApps.forEach(app => {
            const newApp = document.createElement('a');
            newApp.href = app.url;
            newApp.target = '_blank';
            newApp.title = app.name;

            const img = document.createElement('img');
            img.src = app.icon;
            img.alt = app.name;

            newApp.appendChild(img);
            appGrid.insertBefore(newApp, addCustomAppBtn);
        });
    }

    // Load custom apps on page load
    loadCustomApps();


    // ====== EDITABLE TITLE PERSISTENCE =====
    const editableTitle = document.getElementById('editableTitle');
    if (editableTitle) {
        // Load saved title
        const savedTitle = localStorage.getItem('userTitle');
        if (savedTitle) {
            editableTitle.textContent = savedTitle;
        }

        // Save title when focus is lost
        editableTitle.addEventListener('blur', () => {
            const newTitle = editableTitle.textContent.trim();
            if (newTitle) {
                localStorage.setItem('userTitle', newTitle);
            } else {
                editableTitle.textContent = 'Coding lover';
                localStorage.setItem('userTitle', 'Coding lover');
            }
        });

        // Prevent newlines when pressing Enter
        editableTitle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                editableTitle.blur(); // Triggers the save
            }
        });
    }

});
