function validateForm() {
    try {
      let form = document.forms.registrationForm;
      let fullName = form.fullName.value.trim();
      let username = form.username.value.trim();
      let email = form.email.value.trim();
      let password = form.password.value;
      let confirmPassword = form.confirmPassword.value;
      let phoneNumber = form.phoneNumber.value.trim();
      let dob = form.dob.value;
      let agreeTerms = form.agreeTerms.checked;
      
  
      clearErrors();
  
      let isValid = true;
  
      // Full Name Validation
      if (!fullName) {
        displayError("fullNameError", "Full Name is required.");
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
        displayError("fullNameError", "Full Name should only contain letters and spaces.");
        isValid = false;
      }
  
      // Username Validation
      if (!username) {
        displayError("usernameError", "Username is required.");
        isValid = false;
      } else if (username.length < 6 || username.length > 15) {
        displayError("usernameError", "Username must be between 6 and 15 characters.");
        isValid = false;
      } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        displayError("usernameError", "Username can only contain alphanumeric characters.");
        isValid = false;
      } else if (/^[0-9]/.test(username)) {
        displayError("usernameError", "Username cannot start with a number.");
        isValid = false;
      }
  
      // Email Validation
      if (!email) {
        displayError("emailError", "Email is required.");
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayError("emailError", "Invalid email format.");
        isValid = false;
      }
  
      // Password Validation
      if (!password) {
        displayError("passwordError", "Password is required.");
        isValid = false;
      } else if (password.length < 8 || password.length > 20) {
        displayError("passwordError", "Password must be between 8 and 20 characters.");
        isValid = false;
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
        displayError("passwordError", "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        isValid = false;
      }
  
      // Confirm Password Validation
      if (password !== confirmPassword) {
        displayError("confirmPasswordError", "Passwords do not match.");
        isValid = false;
      }
  
      // Phone Number Validation
      if (phoneNumber && !/^(\+\d{1,3}\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/.test(phoneNumber)) {
        displayError("phoneNumberError", "Invalid phone number format.");
        isValid = false;
      }
  
      // Date of Birth Validation
      if (!dob) {
        displayError("dobError", "Date of Birth is required.");
        isValid = false;
      } else {
        let birthDate = new Date(dob);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          displayError("dobError", "You must be at least 18 years old.");
          isValid = false;
        }
      }
  
      // Agree to Terms Validation
      if (!agreeTerms) {
        displayError("agreeTermsError", "You must agree to the terms and conditions.");
        isValid = false;
      }
  
      if (!isValid) {
        return false; // Prevent form submission
      }
  
      return true; // Allow form submission
  
    } catch (error) {
      console.error("An error occurred during form validation:", error);
      alert("An unexpected error occurred. Please try again.");
      return false;
    }
  }
  
  function displayError(elementId, message) {
    document.getElementById(elementId).textContent = message;
    console.warn("Validation Error: " + message);
  }
  
  function clearErrors() {
    let errorElements = document.getElementsByClassName("error");
    for (let element of errorElements) {
      element.textContent = "";
    }
  }