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
