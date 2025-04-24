document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your public key
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
});