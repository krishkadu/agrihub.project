/* ═══════════════════════════════════════════════
   AgriHub — Weather Module
   ═══════════════════════════════════════════════ */

const WEATHER_API_KEY = 'ecf66ada1adb65ccd6f9da4625d577c0';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Demo fallback — shown when no real API key is configured
const DEMO_WEATHER = {
    name: 'Your Location',
    sys: { country: 'IN' },
    weather: [{ main: 'Clear', description: 'clear sky' }],
    main: { temp: 28, feels_like: 30, humidity: 62, pressure: 1013 },
    wind: { speed: 3.5 },
    visibility: 10000,
    _demo: true
};

const weatherIcons = {
    'Clear': '☀️', 'Clouds': '⛅', 'Rain': '🌧️', 'Drizzle': '🌦️',
    'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Fog': '🌫️',
    'Haze': '🌫️', 'Smoke': '💨', 'Dust': '🌪️', 'Tornado': '🌪️'
};

function isPlaceholderKey() {
    return !WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || WEATHER_API_KEY.trim() === '';
}

const weatherConditionTranslations = {
    'clear sky': { hi: 'साफ़ आसमान', mr: 'निरभ्र आकाश' },
    'few clouds': { hi: 'हल्के बादल', mr: 'कमी ढग' },
    'scattered clouds': { hi: 'बिखरे हुए बादल', mr: 'विखुरलेले ढग' },
    'broken clouds': { hi: 'घने बादल', mr: 'दाट ढगाळ वातावरण' },
    'overcast clouds': { hi: 'घने काले बादल', mr: 'पूर्णपणे ढगाळ आकाश' },
    'shower rain': { hi: 'तेज़ बौछारें', mr: 'मुसळधार सरी' },
    'rain': { hi: 'बारिश', mr: 'पाऊस' },
    'light rain': { hi: 'हल्की बारिश', mr: 'हलका पाऊस' },
    'moderate rain': { hi: 'मध्यम बारिश', mr: 'मध्यम पाऊस' },
    'heavy intensity rain': { hi: 'भारी बारिश', mr: 'जोरदार पाऊस' },
    'thunderstorm': { hi: 'गरज के साथ बारिश', mr: 'विजांच्या कडकडाटासह पाऊस' },
    'snow': { hi: 'बर्फबारी', mr: 'बर्फवृष्टी' },
    'mist': { hi: 'धुंध', mr: 'धुके' },
    'haze': { hi: 'धुंधला मौसम', mr: 'धुरकट हवामान' },
    'fog': { hi: 'घना कोहरा', mr: 'दाट धुके' }
};

function getFarmingAdvice(condition, temp, humidity, lang) {
    if (lang === 'hi') {
        if (condition.includes('Rain') || condition.includes('Thunderstorm'))
            return '⚠️ आज कीटनाशक या उर्वरक का छिड़काव न करें। खेतों में जल निकासी सुनिश्चित करें।';
        if (condition === 'Clear' && temp > 35)
            return '🌡️ अत्यधिक तापमान चेतावनी: फसलों की सिंचाई सुबह जल्दी या शाम को करें। नमी बनाए रखने के लिए मल्चिंग करें।';
        if (condition === 'Clear' && temp >= 20 && temp <= 32)
            return '✅ खेत के काम, छिड़काव और कटाई के लिए उत्तम मौसम। अधिकांश कृषि कार्यों के लिए आदर्श परिस्थिति।';
        if (humidity > 80)
            return '🍄 उच्च आर्द्रता: फफूंद जनित रोगों के लिए फसलों की निगरानी करें। भंडारण में हवा का उचित प्रबंध रखें।';
        if (humidity < 30)
            return '💧 कम आर्द्रता: सिंचाई की आवृत्ति बढ़ाएं। मिट्टी में नमी का स्तर नियमित रूप से जांचें।';
        return '🌾 सामान्य कृषि कार्यों के लिए मौसम अनुकूल है।';
    } else if (lang === 'mr') {
        if (condition.includes('Rain') || condition.includes('Thunderstorm'))
            return '⚠️ आज कीटकनाशक किंवा खतांची फवारणी टाळा. शेतात अतिरिक्त पाणी साचणार नाही याची काळजी घ्या.';
        if (condition === 'Clear' && temp > 35)
            return '🌡️ उष्णतेचा इशारा: पिकांना पाणी सकाळी लवकर किंवा संध्याकाळी द्या. ओलावा टिकवण्यासाठी आच्छादन करा.';
        if (condition === 'Clear' && temp >= 20 && temp <= 32)
            return '✅ शेतीकामे, फवारणी आणि काढणीसाठी उत्तम हवामान. बहुतांश शेतीकामांसाठी अत्यंत अनुकूल दिवस.';
        if (humidity > 80)
            return '🍄 जास्त दमट हवामान: बुरशीजन्य रोगांचा प्रादुर्भाव तपासत राहा. साठवणुकीच्या जागेत हवा खेळती ठेवा.';
        if (humidity < 30)
            return '💧 कमी ओलावा: पिकांना नियमित पाणी द्या. जमिनीतील ओलावा सतत तपासा.';
        return '🌾 नियमित शेतीकामांसाठी हवामान सर्वसाधारणपणे अनुकूल आहे.';
    } else {
        if (condition.includes('Rain') || condition.includes('Thunderstorm'))
            return '⚠️ Avoid spraying pesticides or fertilizers today. Good day for soil absorption. Ensure proper drainage in fields.';
        if (condition === 'Clear' && temp > 35)
            return '🌡️ High temperature alert. Water crops in early morning or evening. Consider mulching to retain soil moisture.';
        if (condition === 'Clear' && temp >= 20 && temp <= 32)
            return '✅ Excellent conditions for field work, spraying, and harvesting. Ideal weather for most farming activities.';
        if (humidity > 80)
            return '🍄 High humidity: Monitor crops for fungal diseases. Ensure good ventilation in stored produce.';
        if (humidity < 30)
            return '💧 Low humidity: Increase irrigation frequency. Check soil moisture levels regularly.';
        return '🌾 Weather conditions are suitable for regular farming operations.';
    }
}

let activeWeatherData = null;

function displayWeather(data) {
    if (!data) return;
    activeWeatherData = data;
    showState('weatherDisplay');

    const lang = (window.AgriHubI18n ? window.AgriHubI18n.getLang() : (localStorage.getItem('agrihub_lang') || 'en'));
    const condition = data.weather[0].main;
    const rawDesc = (data.weather[0].description || '').toLowerCase();
    const localizedDesc = (weatherConditionTranslations[rawDesc] && weatherConditionTranslations[rawDesc][lang]) || data.weather[0].description;
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;

    const cityEl = document.getElementById('weatherCity');
    if (cityEl) {
        if (data._demo) {
            cityEl.textContent = lang === 'hi' ? 'आपका स्थान' : (lang === 'mr' ? 'तुमचे स्थान' : 'Your Location');
        } else {
            cityEl.textContent = data.name;
        }
    }

    document.getElementById('weatherCountry').textContent = data.sys?.country || '';
    document.getElementById('weatherIconLarge').textContent = weatherIcons[condition] || '🌡️';
    document.getElementById('weatherTemp').textContent = temp;
    document.getElementById('weatherCondition').textContent = localizedDesc;
    document.getElementById('weatherFeelsLike').textContent = Math.round(data.main.feels_like);
    document.getElementById('weatherHumidity').textContent = humidity + '%';
    document.getElementById('weatherWind').textContent = Math.round((data.wind?.speed || 0) * 3.6);
    document.getElementById('weatherVisibility').textContent = ((data.visibility || 10000) / 1000).toFixed(1);
    document.getElementById('weatherPressure').textContent = data.main.pressure;
    document.getElementById('adviceText').textContent = getFarmingAdvice(condition, temp, humidity, lang);

    const timeEl = document.getElementById('weatherTime');
    if (timeEl) {
        if (data._demo) {
            timeEl.textContent = lang === 'hi' ? '⚡ डेमो मोड — लाइव डेटा के लिए API कुंजी जोड़ें' : (lang === 'mr' ? '⚡ डेमो मोड — थेट डेटासाठी API की टाका' : '⚡ Demo mode — add your API key for live data');
        } else {
            timeEl.textContent = new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN'));
        }
    }
}

function showError(msg) {
    showState('weatherError');
    const el = document.getElementById('weatherErrorMsg');
    if (el) el.textContent = msg;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('detectLocation')?.addEventListener('click', getWeather);
    document.getElementById('refreshWeather')?.addEventListener('click', getWeather);
    document.getElementById('retryWeather')?.addEventListener('click', getWeather);

    // Listen for language switch
    window.addEventListener('agrihub:languageChanged', () => {
        if (activeWeatherData) {
            displayWeather(activeWeatherData);
        }
    });

    // Restore cached weather
    const cached = sessionStorage.getItem('agrihub_weather');
    if (cached) {
        try { displayWeather(JSON.parse(cached)); } catch (e) { /* ignore */ }
    }
});
