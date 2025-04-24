// Function to fetch and display weather
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

// Function to display the current time
function displayTime() {
  const timeElement = document.getElementById('time');
  if (timeElement) {
      const now = new Date();
      timeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
  }
}

// Initialize weather and time display
document.addEventListener('DOMContentLoaded', () => {
  fetchWeather(); // Fetch and display weather
  displayTime(); // Display the current time
  setInterval(displayTime, 1000); // Update time every second
});