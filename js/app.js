// Unified site script

function getById(id) {
    return document.getElementById(id);
}

// --- Weather and Time Display ---
async function fetchWeather() {
    const apiKey = 'b6ef80911881923a32fa9978ec0935c0';
    const city = 'New York';
    const weatherElement = getById('weather');

    if (!weatherElement) {
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.statusText}`);
        }

        const data = await response.json();
        weatherElement.innerHTML = `<p><strong>Weather in ${city}:</strong> ${data.weather[0].description}, ${data.main.temp}°C</p>`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherElement.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
    }
}

function displayTime() {
    const timeElement = getById('time');
    if (!timeElement) {
        return;
    }

    const now = new Date();
    timeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
}

// --- Preferences (formerly system settings) ---
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift() || null;
    }
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function clearPreferences() {
    setCookie('bgColor', '', -1);
    setCookie('textColor', '', -1);
    window.location.href = window.location.pathname;
}

function applyPreferences() {
    const params = new URLSearchParams(window.location.search);
    const bgColor = params.get('bgColor') || getCookie('bgColor') || '#fff7de';
    const textColor = params.get('textColor') || getCookie('textColor') || '#000000';

    let styleElement = getById('dynamicStyles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamicStyles';
        document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
        body {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
        }
    `;

    setCookie('bgColor', bgColor, 7);
    setCookie('textColor', textColor, 7);

    const preferencesElement = getById('currentPreferences');
    if (preferencesElement) {
        preferencesElement.innerText = `Background Color: ${bgColor}, Text Color: ${textColor}`;
    }
}

function wirePreferencesForm() {
    const form = getById('customization-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const bgInput = getById('bg-color');
            const textInput = getById('text-color');
            if (!bgInput || !textInput) {
                return;
            }

            const queryString = `?bgColor=${encodeURIComponent(bgInput.value)}&textColor=${encodeURIComponent(textInput.value)}`;
            window.location.href = window.location.pathname + queryString;
        });
    }

    const resetButton = getById('reset-colors-button');
    if (resetButton) {
        resetButton.addEventListener('click', (event) => {
            event.preventDefault();
            clearPreferences();
        });
    }
}

// --- Contact Form ---
function wireContactForm() {
    const submitBtn = getById('submitBtn');
    const clearBtn = getById('clearBtn');
    const contactForm = getById('contactForm');
    const emailInput = getById('emailInput');
    const messageInput = getById('messageInput');

    if (!submitBtn || !clearBtn || !contactForm || !emailInput || !messageInput) {
        return;
    }

    const updateSendButtonState = () => {
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        submitBtn.disabled = !(email && message);
    };

    emailInput.addEventListener('input', updateSendButtonState);
    messageInput.addEventListener('input', updateSendButtonState);
    updateSendButtonState();

    if (typeof emailjs !== 'undefined') {
        emailjs.init('5EiLR_KxRE779EoD3');
    }

    submitBtn.addEventListener('click', async () => {
        const selectedReason = document.querySelector('input[name="reason"]:checked');

        const reason = selectedReason ? selectedReason.value : '';
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!email || !message) {
            alert('Please enter your email and message before sending.');
            return;
        }

        try {
            if (typeof emailjs !== 'undefined') {
                const response = await emailjs.send('service_lpz45m9', 'template_kqz281p', {
                    reason,
                    email,
                    message,
                    to_email: 'trey.brown256@gmail.com'
                });

                if (response.status === 200) {
                    alert('Your message has been successfully submitted! Thank you for reaching out.');
                    contactForm.reset();
                    updateSendButtonState();
                } else {
                    alert('Oops! Something went wrong while sending your message. Please try again.');
                }
            } else {
                alert('Email service is not available right now.');
            }
        } catch (error) {
            alert('An error occurred while sending your message. Please check your internet connection and try again.');
            console.error(error);
        }
    });

    clearBtn.addEventListener('click', () => {
        contactForm.reset();
        updateSendButtonState();
        alert('The form has been cleared.');
    });
}

// --- Guestbook ---
function wireGuestbook() {
    const guestForm = getById('guestForm');
    const guestList = getById('guestList');

    if (!guestForm || !guestList) {
        return;
    }

    guestForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = (getById('username')?.value || '').trim();
        const entryDate = (getById('entryDate')?.value || '').trim();
        const comment = (getById('comment')?.value || '').trim();

        if (!username || !entryDate || !comment) {
            alert('All fields are required to submit a guestbook entry.');
            return;
        }

        const guestEntry = document.createElement('div');
        guestEntry.classList.add('guest-entry');
        guestEntry.innerHTML = `
            <div class="guest-card">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Entry Date:</strong> ${entryDate}</p>
                <p><strong>Comment:</strong> ${comment}</p>
            </div>
        `;

        guestList.appendChild(guestEntry);
        alert('Your guestbook entry has been added successfully!');
        guestForm.reset();
    });
}

// --- Boot ---
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    displayTime();
    setInterval(displayTime, 1000);

    applyPreferences();
    wirePreferencesForm();
    wireContactForm();
    wireGuestbook();
});
