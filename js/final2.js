export function initializeGuestbook() {
    const guestForm = document.getElementById('guestForm');
    const guestList = document.getElementById('guestList');

    if (guestForm && guestList) {
        guestForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const date = document.getElementById('entryDate').value.trim();
            const comment = document.getElementById('comment').value.trim();
            const birthdate = document.getElementById('zodiacSign').value.trim();

            if (!username || !date || !comment || !birthdate) {
                alert('All fields are required!');
                return;
            }

            const guestCard = document.createElement('div');
            guestCard.classList.add('guest-card');
            guestCard.innerHTML = `
                <p><strong>Written By:</strong> ${username}</p>
                <p><strong>Entry Date:</strong> ${date}</p>
                <p><strong>Comment:</strong> ${comment}</p>
            `;

            guestList.appendChild(guestCard);
            guestForm.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your public key
    emailjs.init('5EiLR_KxRE779EoD3'); // Replace with your public key

    // --- Email Form Functionality ---
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');
    const contactForm = document.getElementById('contactForm');

    if (submitBtn && contactForm) {
        submitBtn.addEventListener('click', async () => {
            const selectedReason = document.querySelector('input[name="reason"]:checked');
            const emailInput = document.getElementById('emailInput');
            const messageInput = document.getElementById('messageInput');

            const reason = selectedReason ? selectedReason.value : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (reason && email && message) {
                try {
                    // Send email using EmailJS
                    const response = await emailjs.send('service_lpz45m9', 'template_kqz281p', {
                        reason,
                        email,
                        message,
                        to_email: 'trey.brown256@gmail.com' // Replace with the recipient email
                    });

                    if (response.status === 200) {
                        alert('Your message has been submitted. We will review it and respond if necessary.');
                        contactForm.reset();
                    } else {
                        alert('Failed to send your message. Please try again later.');
                    }
                } catch (error) {
                    alert('An error occurred while sending your message.');
                    console.error(error);
                }
            } else {
                alert('Please select a reason, enter your email, and provide a message.');
            }
        });

        clearBtn?.addEventListener('click', () => {
            contactForm.reset();
        });
    }

    // Initialize guestbook
    initializeGuestbook();

    // Fetch weather and display time
    fetchWeather();
    setInterval(displayTime, 1000); // Update time every second
});

export async function fetchWeather() {
    const apiKey = 'b6ef80911881923a32fa9978ec0935c0'; // Provided API key
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

export function displayTime() {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
    }
}