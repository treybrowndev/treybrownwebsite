// --- Contact Form ---
document.addEventListener('DOMContentLoaded', () => {
    emailjs.init('5EiLR_KxRE779EoD3'); // Replace with your public key

    document.getElementById('submitBtn').addEventListener('click', async () => {
        const selectedReason = document.querySelector('input[name="reason"]:checked');
        const emailInput = document.getElementById('emailInput');
        const messageInput = document.getElementById('messageInput');

        const reason = selectedReason ? selectedReason.value : '';
        const email = emailInput ? emailInput.value : '';
        const message = messageInput ? messageInput.value : '';

        if (reason && email && message) {
            try {
                const response = await emailjs.send('service_lpz45m9', 'template_kqz281p', {
                    reason,
                    email,
                    message,
                    to_email: 'trey.brown256@gmail.com'
                });

                if (response.status === 200) {
                    alert('🎉 Your message has been successfully submitted! Thank you for reaching out.');
                    document.getElementById('contactForm').reset();
                } else {
                    alert('⚠️ Oops! Something went wrong while sending your message. Please try again.');
                }
            } catch (error) {
                alert('❌ An error occurred while sending your message. Please check your internet connection and try again.');
                console.error(error);
            }
        } else {
            alert('⚠️ Please fill out all fields before submitting the form.');
        }
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('contactForm').reset();
        alert('🧹 The form has been cleared.');
    });
});

// --- Guestbook ---
document.addEventListener('DOMContentLoaded', () => {
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
});

// --- Zodiac Predictive Search ---
const zodiacSigns = {
    Aquarius: { dates: "Jan 20 – Feb 18", traits: "Innovative, independent, humanitarian" },
    Pisces: { dates: "Feb 19 – Mar 20", traits: "Empathetic, artistic, intuitive" },
    Aries: { dates: "Mar 21 – Apr 19", traits: "Bold, ambitious, energetic" },
    Taurus: { dates: "Apr 20 – May 20", traits: "Reliable, patient, practical" },
    Gemini: { dates: "May 21 – Jun 20", traits: "Curious, adaptable, witty" },
    Cancer: { dates: "Jun 21 – Jul 22", traits: "Emotional, nurturing, intuitive" },
    Leo: { dates: "Jul 23 – Aug 22", traits: "Confident, charismatic, creative" },
    Virgo: { dates: "Aug 23 – Sep 22", traits: "Analytical, modest, responsible" },
    Libra: { dates: "Sep 23 – Oct 22", traits: "Diplomatic, fair, charming" },
    Scorpio: { dates: "Oct 23 – Nov 21", traits: "Intense, strategic, passionate" },
    Sagittarius: { dates: "Nov 22 – Dec 21", traits: "Optimistic, adventurous, honest" },
    Capricorn: { dates: "Dec 22 – Jan 19", traits: "Disciplined, determined, wise" },
};

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

$('#zodiacSearch').autocomplete({
    source: Object.keys(zodiacSigns),
    minLength: 2,
    select: function (event, ui) {
        const sign = ui.item.value;
        const info = zodiacSigns[sign];
        $('#zodiacInfo').slideUp(300, function () {
            $(this).html(`
                <div class="zodiac-card">
                    <h4>${sign}</h4>
                    <p><strong>Dates:</strong> ${info.dates}</p>
                    <p><strong>Traits:</strong> ${info.traits}</p>
                </div>
            `).slideDown(400);
        });
    },
});

$('#zodiacSearch').on('keypress', function (e) {
    if (e.which === 13) { // Check for Enter key
        e.preventDefault();
        const input = $(this).val().trim();

        // Check if the input is a date (e.g., 02/02, 2/2, 02-02)
        const dateMatch = input.match(/^(\d{1,2})[/-](\d{1,2})$/);

        if (dateMatch) {
            const month = parseInt(dateMatch[1], 10);
            const day = parseInt(dateMatch[2], 10);

            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                const sign = getZodiacSign(month, day);
                const info = zodiacSigns[sign];

                $('#zodiacInfo').slideUp(300, function () {
                    $(this).html(`
                        <div class="zodiac-card">
                            <h4>${sign}</h4>
                            <p><strong>Dates:</strong> ${info.dates}</p>
                            <p><strong>Traits:</strong> ${info.traits}</p>
                        </div>
                    `).slideDown(400);
                });
            } else {
                $('#zodiacInfo').slideUp(300, function () {
                    $(this).html('<p>Invalid date. Please enter a valid date (e.g., 02/02).</p>').slideDown(400);
                });
            }
        } else {
            const sign = Object.keys(zodiacSigns).find(
                (s) => s.toLowerCase() === input.toLowerCase()
            );

            if (sign) {
                const info = zodiacSigns[sign];
                $('#zodiacInfo').slideUp(300, function () {
                    $(this).html(`
                        <div class="zodiac-card">
                            <h4>${sign}</h4>
                            <p><strong>Dates:</strong> ${info.dates}</p>
                            <p><strong>Traits:</strong> ${info.traits}</p>
                        </div>
                    `).slideDown(400);
                });
            } else {
                $('#zodiacInfo').slideUp(300, function () {
                    $(this).html('<p>No match found. Please enter a valid zodiac sign or date (e.g., 02/02).</p>').slideDown(400);
                });
            }
        }
    }
});