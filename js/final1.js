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

// --- YouTube Player ---
const youtubePlaylistId = 'PL3tRBEVW0hiA8SaR1o_IqK6AGp5FJt8d2';
const youtubeIframeSrc = `https://www.youtube.com/embed?listType=playlist&list=${youtubePlaylistId}&loop=1&modestbranding=1&rel=0`;

function initializeYouTubePlayer() {
    const iframe = document.getElementById('youtube-iframe');
    const closeButton = document.getElementById('close-player');
    const floatingPlayer = document.getElementById('floating-player');

    if (iframe) {
        iframe.src = youtubeIframeSrc;
    }

    closeButton.addEventListener('click', () => {
        floatingPlayer.style.display = 'none';
    });

    makePlayerDraggable(floatingPlayer);
}

function makePlayerDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
            element.style.position = 'fixed';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.cursor = 'grab';
    });
}

// --- Color Changer ---
function applyPreferences() {
    const bgColor = localStorage.getItem('bgColor') || '#ffddb3';
    const textColor = localStorage.getItem('textColor') || '#000000';
    const fontSize = localStorage.getItem('fontSize') || '16px';

    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    document.body.style.fontSize = fontSize;

    const bgColorInput = document.getElementById('bg-color');
    const textColorInput = document.getElementById('text-color');
    const fontSizeInput = document.getElementById('font-size');

    if (bgColorInput) bgColorInput.value = bgColor;
    if (textColorInput) textColorInput.value = textColor;
    if (fontSizeInput) fontSizeInput.value = fontSize.replace('px', '');
}

// --- Guestbook ---
function initializeGuestbook() {
    const guestForm = document.getElementById('guestForm');
    const guestList = document.getElementById('guestList');

    if (guestForm) {
        guestForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const entryDate = document.getElementById('entryDate').value.trim();
            const comment = document.getElementById('comment').value.trim();
            const birthdate = document.getElementById('birthdate').value.trim();

            if (!username || !entryDate || !comment || !birthdate) {
                alert('⚠️ All fields are required to submit a guestbook entry.');
                return;
            }

            // Parse birthdate and determine zodiac sign
            const [year, month, day] = birthdate.split('-').map(Number);
            const zodiacSign = getZodiacSign(month, day);

            // Create guestbook entry
            if (guestList) {
                const guestEntry = document.createElement('div');
                guestEntry.classList.add('guest-entry');
                guestEntry.innerHTML = `
                    <div class="guest-card">
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Entry Date:</strong> ${entryDate}</p>
                        <p><strong>Comment:</strong> ${comment}</p>
                        <p><strong>Birthdate:</strong> ${birthdate}</p>
                        <p><strong>Zodiac Sign:</strong> ${zodiacSign}</p>
                    </div>
                `;
                guestList.appendChild(guestEntry);

                // Fade in the new entry
                $(guestEntry).hide().fadeIn(500);

                alert('🎉 Your guestbook entry has been added successfully!');
                guestForm.reset();
            } else {
                console.error('Guest list container not found.');
                alert('❌ Unable to add your entry. Please try again later.');
            }
        });
    }
}

function getZodiacSign(month, day) {
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    return 'Capricorn';
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    displayTime();
    setInterval(displayTime, 1000);

    initializeYouTubePlayer();
    applyPreferences();
    initializeGuestbook();
});