// proj9.js

// Function to get a cookie value by name
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

// Function to set a cookie with an expiration date
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

// Function to apply user preferences from query string or cookies
function applyPreferences() {
    const params = new URLSearchParams(window.location.search);

    // Get preferences from query string or cookies
    const bgColor = params.get('bgColor') || getCookie('bgColor') || '#ffffff';
    const textColor = params.get('textColor') || getCookie('textColor') || '#000000';
    const fontSize = params.get('fontSize') || getCookie('fontSize') || '16px';

    // Apply preferences to the page
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    document.body.style.fontSize = fontSize;

    // Save preferences in cookies
    setCookie('bgColor', bgColor, 7);
    setCookie('textColor', textColor, 7);
    setCookie('fontSize', fontSize, 7);

    // Display current preferences to the user
    document.getElementById('currentPreferences').innerText = 
        `Background Color: ${bgColor}, Text Color: ${textColor}, Font Size: ${fontSize}`;
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const bgColor = document.getElementById('bgColor').value;
    const textColor = document.getElementById('textColor').value;
    const fontSize = document.getElementById('fontSize').value;

    // Redirect with query string
    const queryString = `?bgColor=${encodeURIComponent(bgColor)}&textColor=${encodeURIComponent(textColor)}&fontSize=${encodeURIComponent(fontSize)}`;
    window.location.href = window.location.pathname + queryString;
}

// Attach event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    applyPreferences(); // Apply preferences on page load
    document.getElementById('customizationForm').addEventListener('submit', handleFormSubmit);
});