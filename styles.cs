* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #06b6d4;
    --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --text-tertiary: rgba(255, 255, 255, 0.5);
    --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 25px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 25px 50px rgba(0, 0, 0, 0.3);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    overflow-x: hidden;
    background: var(--background);
    min-height: 100vh;
}

.weather-app {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

.animated-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background);
    z-index: -2;
}

.animated-bg.sunny {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    animation: sunnyBg 15s ease infinite;
}

.animated-bg.rainy {
    background: linear-gradient(135deg, #4c5d7e 0%, #5a6c7d 100%);
    animation: rainyBg 10s ease infinite;
}

.animated-bg.snowy {
    background: linear-gradient(135deg, #b8c6db 0%, #d4dce9 100%);
    animation: snowyBg 12s ease infinite;
}

.animated-bg.stormy {
    background: linear-gradient(135deg, #2d3338 0%, #3d4347 100%);
    animation: stormyBg 8s ease infinite;
}

.animated-bg.foggy {
    background: linear-gradient(135deg, #7a8a9e 0%, #8b9bb0 100%);
    animation: foggyBg 14s ease infinite;
}

.animated-bg.night {
    background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
    animation: nightBg 16s ease infinite;
}

@keyframes sunnyBg {
    0%, 100% { filter: brightness(1) saturate(1); }
    50% { filter: brightness(1.1) saturate(1.1); }
}

@keyframes rainyBg {
    0%, 100% { filter: brightness(0.9) saturate(0.8); }
    50% { filter: brightness(0.95) saturate(0.85); }
}

@keyframes snowyBg {
    0%, 100% { filter: brightness(1) saturate(0.7); }
    50% { filter: brightness(1.05) saturate(0.75); }
}

@keyframes stormyBg {
    0%, 100% { filter: brightness(0.8); }
    50% { filter: brightness(0.85); }
}

@keyframes foggyBg {
    0%, 100% { filter: brightness(0.95) blur(2px); }
    50% { filter: brightness(1) blur(3px); }
}

@keyframes nightBg {
    0%, 100% { filter: brightness(0.7); }
    50% { filter: brightness(0.75); }
}

.animated-bg::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
        radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.2), transparent),
        radial-gradient(2px 2px at 60px 70px, rgba(255, 255, 255, 0.15), transparent),
        radial-gradient(1px 1px at 50px 50px, rgba(255, 255, 255, 0.1), transparent),
        radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.1), transparent),
        radial-gradient(2px 2px at 90px 10px, rgba(255, 255, 255, 0.2), transparent);
    background-repeat: repeat;
    background-size: 200px 200px;
    animation: particlesMove 20s linear infinite;
    opacity: 0.3;
    z-index: -1;
}

@keyframes particlesMove {
    0% { transform: translateX(0) translateY(0); }
    100% { transform: translateX(200px) translateY(200px); }
}

.container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    z-index: 1;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.logo {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 12px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.logo i {
    font-size: 32px;
    background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.search-container {
    flex: 1;
    min-width: 250px;
    max-width: 400px;
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 50px;
    padding: 12px 20px;
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-md);
    transition: var(--transition);
}

.search-box:focus-within {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.search-box i {
    color: var(--text-secondary);
    font-size: 16px;
}

.search-box input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 14px;
    outline: none;
}

.search-box input::placeholder {
    color: var(--text-tertiary);
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-top: none;
    border-radius: 0 0 20px 20px;
    backdrop-filter: blur(20px);
    max-height: 300px;
    overflow-y: auto;
    display: none;
    z-index: 1000;
}

.search-suggestions.active {
    display: block;
}

.suggestion-item {
    padding: 12px 20px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: var(--transition);
    color: var(--text-primary);
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
}

.glass-card:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

.main-content {
    display: grid;
    gap: 24px;
}

.current-weather-section {
    margin-bottom: 20px;
}

.current-weather {
    padding: 32px 40px;
}

.location-info {
    margin-bottom: 20px;
}

.location-info h2 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 5px;
}

.location-info p {
    font-size: 14px;
    color: var(--text-secondary);
}

.weather-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30px 0;
    gap: 20px;
    flex-wrap: wrap;
}

.weather-icon-large {
    font-size: 120px;
    color: #fbbf24;
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: floatIcon 3s ease-in-out infinite;
}

@keyframes floatIcon {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

.temperature-info {
    display: flex;
    flex-direction: column;
}

.temperature {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    margin-bottom: 10px;
}

.temperature span:first-child {
    font-size: 72px;
    font-weight: 300;
    line-height: 1;
}

.degree {
    font-size: 28px;
    font-weight: 400;
    margin-top: 5px;
}

.weather-desc {
    font-size: 16px;
    color: var(--text-secondary);
    text-transform: capitalize;
}

.weather-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item .label {
    font-size: 12px;
    text-transform: uppercase;
    color: var(--text-tertiary);
    letter-spacing: 0.5px;
}

.detail-item .value {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.forecast-section {
    margin: 20px 0;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 12px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hourly-forecast {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 20px;
    scroll-behavior: smooth;
}

.hourly-forecast::-webkit-scrollbar {
    height: 6px;
}

.hourly-forecast::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}

.hourly-forecast::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
}

.hourly-forecast::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

.hourly-item {
    flex: 0 0 auto;
    min-width: 100px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 16px 12px;
    text-align: center;
    transition: var(--transition);
    cursor: pointer;
}

.hourly-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
}

.hourly-item.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
}

.hourly-time {
    font-size: 12px;
    color: var(--text-tertiary);
    margin-bottom: 8px;
}

.hourly-icon {
    font-size: 24px;
    margin: 8px 0;
    color: #fbbf24;
}

.hourly-temp {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.seven-day-forecast {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    padding: 20px;
}

.day-item {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 16px 12px;
    text-align: center;
    transition: var(--transition);
    cursor: pointer;
}

.day-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
}

.day-name {
    font-size: 12px;
    color: var(--text-tertiary);
    margin-bottom: 8px;
    text-transform: uppercase;
}

.day-icon {
    font-size: 28px;
    margin: 10px 0;
    color: #fbbf24;
}

.day-temps {
    font-size: 12px;
    color: var(--text-secondary);
}

.day-max {
    font-weight: 600;
    color: var(--text-primary);
}

.day-min {
    color: var(--text-tertiary);
}

.additional-info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.info-card {
    min-height: 250px;
    display: flex;
    flex-direction: column;
    padding: 24px;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-title i {
    font-size: 20px;
}

.air-quality-content {
    display: flex;
    gap: 20px;
    flex: 1;
}

.aqi-index {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.aqi-value {
    font-size: 48px;
    font-weight: 700;
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.aqi-label {
    font-size: 12px;
    text-transform: uppercase;
    color: var(--text-secondary);
}

.air-quality-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.pollutant {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding: 8px 0;
}

.pollutant span:first-child {
    color: var(--text-secondary);
}

.pollutant span:last-child {
    font-weight: 600;
    color: var(--text-primary);
}

.uv-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-around;
}

.uv-value {
    font-size: 48px;
    font-weight: 700;
    background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.uv-label {
    font-size: 12px;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 8px 0;
}

.uv-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    margin: 12px 0;
}

.uv-progress {
    height: 100%;
    background: linear-gradient(90deg, #22c55e 0%, #fbbf24 50%, #ef4444 100%);
    border-radius: 10px;
    transition: var(--transition);
}

.uv-advice {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 8px;
}

.alerts-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.alert-item {
    background: rgba(239, 68, 68, 0.2);
    border-left: 3px solid #ef4444;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 13px;
    color: var(--text-primary);
}

.alert-item:last-child {
    margin-bottom: 0;
}

.no-alerts {
    text-align: center;
    color: var(--text-secondary);
    font-size: 14px;
}

.loading {
    text-align: center;
    color: var(--text-secondary);
    padding: 20px;
}

@media (max-width: 768px) {
    .container {
        padding: 15px;
    }

    .header {
        flex-direction: column;
        gap: 15px;
        margin-bottom: 30px;
    }

    .search-container {
        width: 100%;
        max-width: none;
    }

    .logo {
        font-size: 24px;
    }

    .current-weather {
        padding: 20px;
    }

    .weather-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .weather-icon-large {
        font-size: 80px;
    }

    .temperature span:first-child {
        font-size: 56px;
    }

    .weather-details {
        grid-template-columns: repeat(2, 1fr);
    }

    .hourly-forecast {
        grid-template-columns: repeat(3, 1fr);
        overflow-x: visible;
        gap: 10px;
    }

    .hourly-item {
        min-width: auto;
        flex: 0 0 calc(33.333% - 7px);
    }

    .seven-day-forecast {
        grid-template-columns: repeat(2, 1fr);
    }

    .additional-info-section {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 12px;
    }

    .logo {
        font-size: 20px;
    }

    .search-box {
        padding: 10px 15px;
    }

    .current-weather {
        padding: 16px;
    }

    .location-info h2 {
        font-size: 24px;
    }

    .weather-icon-large {
        font-size: 60px;
    }

    .temperature span:first-child {
        font-size: 42px;
    }

    .degree {
        font-size: 20px;
    }

    .weather-details {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .hourly-forecast {
        grid-template-columns: repeat(2, 1fr);
    }

    .hourly-item {
        flex: 0 0 calc(50% - 6px);
    }

    .seven-day-forecast {
        grid-template-columns: 1fr;
    }

    .glass-card {
        padding: 16px;
        border-radius: 16px;
    }

    .section-title {
        font-size: 18px;
    }
}
