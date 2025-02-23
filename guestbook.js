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

    console.log('User Input:', { username, date, comment, birthdate });
    console.log('Calculated Age:', age, 'years or', months, 'months');
    console.log('Zodiac Sign:', zodiacSign);
    console.log('Personalized Message:', message);

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
