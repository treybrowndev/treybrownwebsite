// --- Weather and Time Display ---
async function fetchWeather() {
    const apiKey = 'b6ef80911881923a32fa9978ec0935c0'; // OpenWeather API key
    const city = 'New York'; // Replace with your desired city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.statusText}`);
        }

        const data = await response.json();
        const weatherElement = document.getElementById('weather');
        if (weatherElement) {
            weatherElement.innerHTML = `
                <p><strong>Weather in ${city}:</strong> ${data.weather[0].description}, ${data.main.temp}°C</p>
            `;
        } else {
            console.error('Weather element not found in the DOM.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        const weatherElement = document.getElementById('weather');
        if (weatherElement) {
            weatherElement.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
        }
    }
}

function displayTime() {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
    }
}

// --- Color Changer ---
function applyPreferences() {
    const params = new URLSearchParams(window.location.search);

    // Get preferences from query string or cookies
    const bgColor = params.get('bgColor') || getCookie('bgColor') || '#ffddb3';
    const textColor = params.get('textColor') || getCookie('textColor') || '#000000';
    const fontSize = params.get('fontSize') || getCookie('fontSize') || '16px';

    // Create or update a <style> element
    let styleElement = document.getElementById('dynamicStyles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamicStyles';
        document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
        body {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
            font-size: ${fontSize} !important;
        }
    `;

    // Save preferences in cookies
    setCookie('bgColor', bgColor, 7);
    setCookie('textColor', textColor, 7);
  

    // Display current preferences to the user
    const preferencesElement = document.getElementById('currentPreferences');
    if (preferencesElement) {
        preferencesElement.innerText = 
            `Background Color: ${bgColor}, Text Color: ${textColor}`;
    }
}

// Helper function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Helper function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Helper function to clear cookies
function clearPreferences() {
    setCookie('bgColor', '', -1);
    setCookie('textColor', '', -1);
    window.location.href = window.location.pathname; // Reload without query string
}

// Attach event listener to the customization form
document.addEventListener('DOMContentLoaded', () => {
    applyPreferences(); // Apply preferences on page load

    const form = document.getElementById('customization-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Get form values
            const bgColor = document.getElementById('bg-color').value;
            const textColor = document.getElementById('text-color').value;
        

            // Redirect with query string
            const queryString = `?bgColor=${encodeURIComponent(bgColor)}&textColor=${encodeURIComponent(textColor)}`;
            window.location.href = window.location.pathname + queryString;
        });
    }

    // Attach event listener to the reset colors button
    const resetColorsButton = document.getElementById('reset-colors-button');
    if (resetColorsButton) {
        resetColorsButton.addEventListener('click', () => {
            clearPreferences(); // Clear preferences and reload the page
        });
    }
});