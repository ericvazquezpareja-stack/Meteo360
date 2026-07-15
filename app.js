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
            <div class="suggestion-item`

