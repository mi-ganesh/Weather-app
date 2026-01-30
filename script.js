// ================= CONFIG =================
const API_KEY = "YOUR_OPENWEATHER_API_KEY";
 
const BASE_URL = "https://api.openweathermap.org/data/2.5";

let isFetching = false;

// ================= ICON FUNCTION =================
function getWeatherIcon(main) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Haze: "🌫️",
    Fog: "🌫️"
  };
  return icons[main] || "🌤️";
}

// ================= FETCH WEATHER =================
async function fetchWeather() {
  if (isFetching) return;
  isFetching = true;

  const city = document.getElementById("cityInput").value.trim();
  const weatherContent = document.getElementById("weatherContent");
  // const forecastSection = document.getElementById("forecast");

  if (!city) {
    weatherContent.innerHTML = `<div class="error">Please enter a city name</div>`;
    isFetching = false;
    return;
  }

  // weatherContent.innerHTML = `<div class="loading">Loading weather data...</div>`;
  // forecastSection.innerHTML = "";

  try {
    const res = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (res.status === 401) throw new Error("INVALID_KEY");
    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (!res.ok) throw new Error("CITY_NOT_FOUND");

    const data = await res.json();
    displayCurrentWeather(data);

  } catch (error) {
    let message = "Unable to fetch weather data.";

    if (error.message === "INVALID_KEY") {
      message = "Invalid API key.";
    } else if (error.message === "RATE_LIMIT") {
      message = "Too many requests. Try again later.";
    } else if (error.message === "CITY_NOT_FOUND") {
      message = "City not found.";
    }

    weatherContent.innerHTML = `<div class="error">❌ ${message}</div>`;
  } finally {
    isFetching = false;
  }
}

// ================= DISPLAY WEATHER =================
function displayCurrentWeather(data) {
  const weatherContent = document.getElementById("weatherContent");
  const icon = getWeatherIcon(data.weather[0].main);

  weatherContent.innerHTML = `
    <div class="weather-display">
      <h2>📍 ${data.name}, ${data.sys.country}</h2>
      <div class="weather-icon">${icon}</div>
      <div class="temperature">${Math.round(data.main.temp)}°C</div>
      <p>${data.weather[0].description}</p>

      <div class="weather-details">
        <p>🌡 Feels Like: ${Math.round(data.main.feels_like)}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
        <p>🎚️ Pressure: ${data.main.pressure} hPa</p>
      </div>
    </div>
  `;
}

// ================= EVENTS =================
document.getElementById("searchBtn").addEventListener("click", fetchWeather);

document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchWeather();
});
