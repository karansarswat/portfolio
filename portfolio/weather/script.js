const apiKey = 'd408af0314c6d92c831455310b7018c5'; 

function selectCity(city) {
  document.getElementById('cityInput').value = city;
  getWeather();
}

async function getWeather() {
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value;
  
  if (!city) {
    alert('Please enter a city name');
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await response.json();

    if (weatherData.cod !== 200) {
      throw new Error(weatherData.message);
    }

    // Update UI
    document.getElementById('cityName').textContent = weatherData.name;
    
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    weatherIcon.style.display = 'block';
    
    document.getElementById('temperature').textContent = `${Math.round(weatherData.main.temp)}°C`;
    document.getElementById('description').textContent = weatherData.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${weatherData.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;

    showWeatherResult();
  } catch (error) {
    alert('Error fetching weather data: ' + error.message);
  }
}

// Add event listener for Enter key
document.getElementById('cityInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    getWeather();
  }
});