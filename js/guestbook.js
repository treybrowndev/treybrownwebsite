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
    Capricorn: { dates: "Dec 22 – Jan 19", traits: "Disciplined, determined, wise" }
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

function getZodiacSignByDate(month, day) {
    return getZodiacSign(month, day);
}

function displayZodiacInfo(signName) {
    const info = zodiacSigns[signName];
    const $infoDiv = $('#zodiacInfo');

    if (info) {
        $infoDiv.fadeOut(300, function () {
            $infoDiv.html(`
                <div class="zodiac-card">
                    <h4>${signName}</h4>
                    <p><strong>Dates:</strong> ${info.dates}</p>
                    <p><strong>Traits:</strong> ${info.traits}</p>
                </div>
            `).slideDown(400);
        });
    } else {
        $infoDiv.fadeOut(300, function () {
            $infoDiv.html(`<p>No info found for "${signName}".</p>`).slideDown(400);
        });
    }
}

function fuzzyMatch(input, candidates) {
    input = input.toLowerCase();
    return candidates.find(sign => {
        const signLower = sign.toLowerCase();
        return signLower.includes(input) || input.includes(signLower) || signLower.startsWith(input);
    });
}

const $zodiacSearchInput = $('#zodiacSearch');
const $zodiacInfoDiv = $('#zodiacInfo');

$zodiacSearchInput.autocomplete({
    source: function (request, response) {
        const term = request.term.toLowerCase();
        let results = [];

        for (const sign in zodiacSigns) {
            if (sign.toLowerCase().includes(term)) {
                results.push(sign);
            }
        }

        const dateMatch = term.match(/^(\d{1,2})[/-](\d{1,2})$/);
        if (dateMatch) {
            const month = parseInt(dateMatch[1], 10);
            const day = parseInt(dateMatch[2], 10);
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                const signByDate = getZodiacSignByDate(month, day);
                if (signByDate && !results.includes(signByDate)) {
                    results.push(signByDate);
                }
            }
        }

        // Fuzzy match fallback
        if (results.length === 0) {
            const fuzzy = fuzzyMatch(term, Object.keys(zodiacSigns));
            if (fuzzy) results.push(fuzzy);
        }

        response(results);
    },
    minLength: 2,
    select: function (event, ui) {
        displayZodiacInfo(ui.item.value);
    }
});

$zodiacSearchInput.on('keypress', function (e) {
    if (e.which === 13) {
        e.preventDefault();
        const input = $(this).val().trim().toLowerCase();
        if (!input) return;

        let matched = Object.keys(zodiacSigns).find(sign => sign.toLowerCase() === input);

        if (!matched) {
            const match = input.match(/^(\d{1,2})[/-](\d{1,2})$/);
            if (match) {
                const month = parseInt(match[1], 10);
                const day = parseInt(match[2], 10);
                if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                    matched = getZodiacSignByDate(month, day);
                }
            }
        }

        if (!matched) {
            matched = fuzzyMatch(input, Object.keys(zodiacSigns));
        }

        if (matched) {
            displayZodiacInfo(matched);
        } else {
            $zodiacInfoDiv.fadeOut(300, function () {
                $(this).html(`<p>No match for "${input}".</p>`).slideDown(400);
            });
        }
    }
});
