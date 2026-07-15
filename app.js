// Weather API Configuration
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';
const AQI_URL = 'https://api.open-meteo.com/v1';

// Default coordinates (Madrid, Spain)
let currentCoords = { lat: 40.4168, lon: -3.7038, city: 'Madrid' };

// WMO Weather Code to description
const wmoDescription = {
    0: 'Cielo despejado',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia fuerte',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve fuerte',
    77: 'Granos de nieve',
    80: 'Lluvia ligera a intervalos',
    81: 'Lluvia moderada a intervalos',
    82: 'Lluvia fuerte a intervalos',
    85: 'Nieve ligera a intervalos',
    86: 'Nieve fuerte a intervalos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo fuerte'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeWeatherApp();
});

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchInput.blur();
        }
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            document.getElementById('searchSuggestions').classList.remove('active');
        }
    });
}

async function initializeWeatherApp() {
    try {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    currentCoords.lat = position.coords.latitude;
                    currentCoords.lon = position.coords.longitude;
                    fetchWeatherData();
                },
                (error) => {
                    console.log('Usando ubicación por defecto');
                    fetchWeatherData();
                }
            );
        } else {
            fetchWeatherData();
        }
    } catch (error) {
        console.error('Error inicializando app:', error);
    }
}

async function handleSearch(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        document.getElementById('searchSuggestions').classList.remove('active');
        return;
    }

    try {
        const response = await fetch(
            `${GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=5&language=es`
        );
        const data = await response.json();
        displaySearchSuggestions(data.results || []);
    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
}

function displaySearchSuggestions(results) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (results.length === 0) {
        suggestionsContainer.innerHTML = '<div class="suggestion-item">No se encontraron ciudades</div>';
        suggestionsContainer.classList.add('active');
        return;
    }

    suggestionsContainer.innerHTML = results
        .map(result => `
            <div class="suggestion-item" onclick="selectCity('${result.name}', ${result.latitude}, ${result.longitude})">
                <div><strong>${result.name}</strong></div>
                <div style="font-size: 12px; opacity: 0.7;">${result.admin1 || ''} ${result.country || ''}</div>
            </div>
        `)
        .join('');
    suggestionsContainer.classList.add('active');
}

function selectCity(cityName, lat, lon) {
    currentCoords = { lat, lon, city: cityName };
    document.getElementById('searchInput').value = '';
    document.getElementById('searchSuggestions').classList.remove('active');
    fetchWeatherData();
}

async function fetchWeatherData() {
    try {
        const { lat, lon, city } = currentCoords;

        // Fetch current weather and forecast
        const weatherResponse = await fetch(
            `${OPEN_METEO_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,uv_index&hourly=temperature_2m,weather_code,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max,precipitation_sum&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        // Fetch air quality data
        const aqiResponse = await fetch(
            `${AQI_URL}/air_quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,pm10,ozone`
        );
        const aqiData = await aqiResponse.json();

        updateWeatherUI(weatherData, aqiData);
    } catch (error) {
        console.error('Error obteniendo datos:', error);
    }
}

function updateWeatherUI(weatherData, aqiData) {
    try {
        const { current, hourly, daily, timezone } = weatherData;

        // Update current weather
        const temp = Math.round(current.temperature_2m);
        const feelsLike = Math.round(current.apparent_temperature);
        const humidity = current.relative_humidity_2m;
        const windSpeed = Math.round(current.wind_speed_10m);
        const pressure = current.pressure_msl;
        const weatherCode = current.weather_code;
        const uvIndex = Math.round(current.uv_index * 10) / 10;

        // Update DOM
        document.getElementById('cityName').textContent = currentCoords.city;
        document.getElementById('temperature').textContent = temp;
        document.getElementById('feelsLike').textContent = `${feelsLike}°C`;
        document.getElementById('humidity').textContent = `${humidity}%`;
        document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
        document.getElementById('pressure').textContent = `${pressure} mb`;
        document.getElementById('uvIndex').textContent = uvIndex;

        // Update date
        const now = new Date();
        document.getElementById('currentDate').textContent = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update weather description and icon
        const weatherDesc = wmoDescription[weatherCode] || 'Cielo despejado';
        document.getElementById('weatherDescription').textContent = weatherDesc;
        updateWeatherIcon(weatherCode);
        updateBackgroundAnimation(weatherCode);

        // Update UV advice
        updateUVAdvice(uvIndex);

        // Update air quality
        updateAirQuality(aqiData);

        // Update hourly forecast
        updateHourlyForecast(hourly, timezone);

        // Update 7-day forecast
        updateSevenDayForecast(daily);
    } catch (error) {
        console.error('Error actualizando UI:', error);
    }
}

function updateWeatherIcon(weatherCode) {
    let iconClass = 'fas fa-cloud';
    
    if (weatherCode === 0) {
        iconClass = 'fas fa-sun';
    } else if (weatherCode === 1 || weatherCode === 2) {
        iconClass = 'fas fa-cloud-sun';
    } else if (weatherCode === 3) {
        iconClass = 'fas fa-cloud';
    } else if (weatherCode === 45 || weatherCode === 48) {
        iconClass = 'fas fa-smog';
    } else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55) {
        iconClass = 'fas fa-cloud-rain';
    } else if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65 || weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
        iconClass = 'fas fa-cloud-showers-heavy';
    } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75 || weatherCode === 77 || weatherCode === 85 || weatherCode === 86) {
        iconClass = 'fas fa-snowflake';
    } else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
        iconClass = 'fas fa-bolt';
    }

    document.getElementById('weatherIcon').className = iconClass;
}

function updateBackgroundAnimation(weatherCode) {
    const bg = document.getElementById('animatedBg');
    
    // Remove all animation classes
    bg.classList.remove('sunny', 'rainy', 'snowy', 'stormy', 'foggy', 'night');
    
    // Add appropriate class based on weather code
    if (weatherCode === 0 || weatherCode === 1) {
        bg.classList.add('sunny');
    } else if (weatherCode === 2 || weatherCode === 3) {
        bg.classList.add('sunny');
    } else if (weatherCode === 45 || weatherCode === 48) {
        bg.classList.add('foggy');
    } else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55 || weatherCode === 61 || weatherCode === 63 || weatherCode === 65 || weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
        bg.classList.add('rainy');
    } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75 || weatherCode === 77 || weatherCode === 85 || weatherCode === 86) {
        bg.classList.add('snowy');
    } else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
        bg.classList.add('stormy');
    }
}

function updateUVAdvice(uvIndex) {
    let label = 'Bajo';
    let advice = 'No se requiere protección solar';
    
    if (uvIndex < 3) {
        label = 'Bajo';
        advice = 'No se requiere protección solar';
    } else if (uvIndex < 6) {
        label = 'Moderado';
        advice = 'Se recomienda usar protector solar';
    } else if (uvIndex < 8) {
        label = 'Alto';
        advice = 'Se recomienda protector solar factor 30+';
    } else if (uvIndex < 11) {
        label = 'Muy alto';
        advice = 'Se recomienda protector solar factor 50+';
    } else {
        label = 'Extremo';
        advice = 'Evitar exposición solar';
    }
    
    document.getElementById('uvLabel').textContent = label;
    document.getElementById('uvAdvice').textContent = advice;
    
    // Update UV progress bar
    const progress = Math.min((uvIndex / 11) * 100, 100);
    document.getElementById('uvProgress').style.width = progress + '%';
}

function updateAirQuality(aqiData) {
    try {
        const hourly = aqiData.hourly;
        const currentIndex = new Date().getHours();
        
        const pm25 = hourly.pm2_5[currentIndex] || 0;
        const pm10 = hourly.pm10[currentIndex] || 0;
        const o3 = hourly.ozone[currentIndex] || 0;
        
        let aqiLabel = 'Buena';
        
        if (pm25 < 12) {
            aqiLabel = 'Excelente';
        } else if (pm25 < 35) {
            aqiLabel = 'Buena';
        } else if (pm25 < 55) {
            aqiLabel = 'Moderada';
        } else if (pm25 < 150) {
            aqiLabel = 'Mala';
        } else {
            aqiLabel = 'Muy mala';
        }
        
        document.getElementById('aqiValue').textContent = Math.round(pm25);
        document.getElementById('aqiLabel').textContent = aqiLabel;
        document.getElementById('pm25').textContent = `${Math.round(pm25 * 10) / 10} μg/m³`;
        document.getElementById('pm10').textContent = `${Math.round(pm10 * 10) / 10} μg/m³`;
        document.getElementById('o3').textContent = `${Math.round(o3 * 10) / 10} ppb`;
    } catch (error) {
        console.error('Error actualizando calidad del aire:', error);
        document.getElementById('aqiValue').textContent = '--';
        document.getElementById('aqiLabel').textContent = 'No disponible';
    }
}

function updateHourlyForecast(hourly, timezone) {
    const container = document.getElementById('hourlyForecast');
    const now = new Date();
    const currentHour = now.getHours();
    
    let html = '';
    for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
        const time = new Date(hourly.time[i]);
        const hour = time.getHours();
        const temp = Math.round(hourly.temperature_2m[i]);
        const weatherCode = hourly.weather_code[i];
        
        let iconClass = 'fas fa-cloud';
        if (weatherCode === 0) iconClass = 'fas fa-sun';
        else if (weatherCode === 1 || weatherCode === 2) iconClass = 'fas fa-cloud-sun';
        else if (weatherCode === 3) iconClass = 'fas fa-cloud';
        else if (weatherCode === 45 || weatherCode === 48) iconClass = 'fas fa-smog';
        else if (weatherCode >= 51 && weatherCode <= 82) iconClass = 'fas fa-cloud-rain';
        else if (weatherCode >= 71 && weatherCode <= 86) iconClass = 'fas fa-snowflake';
        else if (weatherCode >= 95 && weatherCode <= 99) iconClass = 'fas fa-bolt';
        
        html += `
            <div class="hourly-item">
                <div class="hourly-time">${hour.toString().padStart(2, '0')}:00</div>
                <div class="hourly-icon"><i class="${iconClass}"></i></div>
                <div class="hourly-temp">${temp}°</div>
            </div>
        `;
    }
    
    container.innerHTML = html || '<div class="loading">No hay datos</div>';
}

function updateSevenDayForecast(daily) {
    const container = document.getElementById('sevenDayForecast');
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    let html = '';
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
        const date = new Date(daily.time[i]);
        const dayName = days[date.getDay()];
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const weatherCode = daily.weather_code[i];
        
        let iconClass = 'fas fa-cloud';
        if (weatherCode === 0) iconClass = 'fas fa-sun';
        else if (weatherCode === 1 || weatherCode === 2) iconClass = 'fas fa-cloud-sun';
        else if (weatherCode === 3) iconClass = 'fas fa-cloud';
        else if (weatherCode === 45 || weatherCode === 48) iconClass = 'fas fa-smog';
        else if (weatherCode >= 51 && weatherCode <= 82) iconClass = 'fas fa-cloud-rain';
        else if (weatherCode >= 71 && weatherCode <= 86) iconClass = 'fas fa-snowflake';
        else if (weatherCode >= 95 && weatherCode <= 99) iconClass = 'fas fa-bolt';
        
        html += `
            <div class="day-item">
                <div class="day-name">${dayName}</div>
                <div class="day-icon"><i class="${iconClass}"></i></div>
                <div class="day-temps">
                    <div class="day-max">${maxTemp}°</div>
                    <div class="day-min">${minTemp}°</div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html || '<div class="loading">No hay datos</div>';
}

// Auto-refresh weather data every 10 minutes
setInterval(fetchWeatherData, 10 * 60 * 1000);
