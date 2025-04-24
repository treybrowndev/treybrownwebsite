document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your public key
    emailjs.init('5EiLR_KxRE779EoD3'); // Replace with your public key

    // --- Email Form Functionality ---
    document.getElementById('submitBtn').addEventListener('click', async () => {
        const selectedReason = document.querySelector('input[name="reason"]:checked');
        const emailInput = document.getElementById('emailInput');
        const messageInput = document.getElementById('messageInput');

        const reason = selectedReason ? selectedReason.value : '';
        const email = emailInput ? emailInput.value : '';
        const message = messageInput ? messageInput.value : '';

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
                    document.getElementById('contactForm').reset();
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

    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('contactForm').reset();
    });

    // --- Guest Form Functionality ---
    const guestForm = document.getElementById('guestForm');
    const guestList = document.getElementById('guestList');

    function calculateAge(birthdate) {
        const today = new Date();
        const birthDate = new Date(birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const months = (today.getMonth() - birthDate.getMonth()) + (age * 12);
        return { age, months };
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

    function displayMessage(username, age, zodiacSign) {
        const messages = [
            `Keep shining, ${username}!`,
            `Remember, age is just a number, but yours looks good! :3`,
            `As a ${zodiacSign}, you're destined for greatness!`,
            `Every day is a chance to grow. Keep thriving, ${username}!`
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    guestForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const date = document.getElementById('entryDate').value;
        const comment = document.getElementById('comment').value;
        const birthdate = document.getElementById('zodiacSign').value;

        if (!username || !date || !comment || !birthdate) {
            console.warn('Please fill out all fields.');
            alert('All fields are required!');
            return;
        }

        const [year, month, day] = birthdate.split('-').map(Number);
        const { age, months } = calculateAge(birthdate);
        const zodiacSign = getZodiacSign(month, day);
        const message = displayMessage(username, age, zodiacSign);

        const guestCard = document.createElement('div');
        guestCard.classList.add('guest-card');
        guestCard.innerHTML = `
            <p><strong>Written By:</strong> ${username}</p>
            <p><strong>Entry Date:</strong> ${date}</p>
            <p><strong>Age:</strong> ${age} years (${months} months)</p>
            <p><strong>Zodiac Sign:</strong> ${zodiacSign}</p>
            <p><strong>Comment:</strong> ${comment}</p>
            <p><strong>Message:</strong> ${message}</p>
        `;

        guestList.appendChild(guestCard);
        guestForm.reset();
    });

    // --- Preferences Functionality ---
    function applyPreferences() {
        const params = new URLSearchParams(window.location.search);

        const bgColor = params.get('bgColor') || getCookie('bgColor') || '#ffddb3';
        const textColor = params.get('textColor') || getCookie('textColor') || '#000000';
        const fontSize = params.get('fontSize') || getCookie('fontSize') || '16px';

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

        setCookie('bgColor', bgColor, 7);
        setCookie('textColor', textColor, 7);
        setCookie('fontSize', fontSize, 7);

        const preferencesElement = document.getElementById('currentPreferences');
        if (preferencesElement) {
            preferencesElement.innerText = 
                `Background Color: ${bgColor}, Text Color: ${textColor}, Font Size: ${fontSize}`;
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    function clearPreferences() {
        setCookie('bgColor', '', -1);
        setCookie('textColor', '', -1);
        setCookie('fontSize', '', -1);
        window.location.href = window.location.pathname;
    }

    applyPreferences();

    const form = document.getElementById('customization-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const bgColor = document.getElementById('bg-color').value;
            const textColor = document.getElementById('text-color').value;
            const fontSize = document.getElementById('font-size').value;

            const queryString = `?bgColor=${encodeURIComponent(bgColor)}&textColor=${encodeURIComponent(textColor)}&fontSize=${encodeURIComponent(fontSize)}`;
            window.location.href = window.location.pathname + queryString;
        });
    }

    const resetColorsButton = document.getElementById('reset-colors-button');
    if (resetColorsButton) {
        resetColorsButton.addEventListener('click', () => {
            clearPreferences();
        });
    }
});