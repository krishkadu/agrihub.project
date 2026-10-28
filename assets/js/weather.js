/* ═════════════════════════════════════════════════════════════════════
   AgriHub — Enterprise Agricultural Weather Module
   Powered by Open-Meteo & BigDataCloud (Free, No API Keys Required)
   Features: Real-time Data, 24h Hourly Strip, 7-Day Forecast,
             Rule-based Agro-Advisory Engine, Extreme Alerts,
             Offline Caching, Multi-language (EN / HI / MR)
   ═════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Configuration Constants ──
  const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
  const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  const CACHE_KEY = 'agrihub_weather_cache';
  const LAST_LOCATION_KEY = 'agrihub_last_location';
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
  const AUTO_REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
  const FETCH_TIMEOUT_MS = 8000; // 8 seconds
  const GEO_TIMEOUT_MS = 10000; // 10 seconds

  // Default fallback location: Nagpur, Maharashtra (Central India agriculture hub)
  const FALLBACK_LOCATION = {
    name: 'Nagpur',
    admin1: 'Maharashtra',
    country: 'India',
    latitude: 21.1458,
    longitude: 79.0882,
    isFallback: true
  };

  // ── WMO Weather Interpretation Table ──
  const WMO_MAP = {
    0: { label: { en: 'Clear Sky', hi: 'साफ़ आसमान', mr: 'निरभ्र आकाश' }, icon: '☀️' },
    1: { label: { en: 'Mainly Clear', hi: 'मुख्यतः साफ़', mr: 'मुख्यत्वे निरभ्र' }, icon: '🌤️' },
    2: { label: { en: 'Partly Cloudy', hi: 'आंशिक रूप से बादल', mr: 'अंशतः ढगाळ' }, icon: '⛅' },
    3: { label: { en: 'Overcast', hi: 'घने बादल', mr: 'दाट ढगाळ' }, icon: '☁️' },
    45: { label: { en: 'Fog', hi: 'कोहरा', mr: 'धुके' }, icon: '🌫️' },
    48: { label: { en: 'Depositing Rime Fog', hi: 'घना कोहरा', mr: 'दाट धुके' }, icon: '🌫️' },
    51: { label: { en: 'Light Drizzle', hi: 'हल्की बूंदाबांदी', mr: 'हलकी रिमझिम' }, icon: '🌦️' },
    53: { label: { en: 'Moderate Drizzle', hi: 'मध्यम बूंदाबांदी', mr: 'मध्यम रिमझिम' }, icon: '🌦️' },
    55: { label: { en: 'Dense Drizzle', hi: 'घनी बूंदाबांदी', mr: 'दाट रिमझिम' }, icon: '🌧️' },
    56: { label: { en: 'Light Freezing Drizzle', hi: 'हल्की बर्फीली बूंदाबांदी', mr: 'हलकी अतिथंड रिमझिम' }, icon: '🌧️' },
    57: { label: { en: 'Dense Freezing Drizzle', hi: 'घनी बर्फीली बूंदाबांदी', mr: 'दाट अतिथंड रिमझिम' }, icon: '🌧️' },
    61: { label: { en: 'Slight Rain', hi: 'हल्की बारिश', mr: 'हलका पाऊस' }, icon: '🌦️' },
    63: { label: { en: 'Moderate Rain', hi: 'मध्यम बारिश', mr: 'मध्यम पाऊस' }, icon: '🌧️' },
    65: { label: { en: 'Heavy Rain', hi: 'भारी बारिश', mr: 'मुसळधार पाऊस' }, icon: '🌧️' },
    66: { label: { en: 'Light Freezing Rain', hi: 'हल्की बर्फीली बारिश', mr: 'हलका अतिथंड पाऊस' }, icon: '🌧️' },
    67: { label: { en: 'Heavy Freezing Rain', hi: 'भारी बर्फीली बारिश', mr: 'मुसळधार अतिथंड पाऊस' }, icon: '🌧️' },
    71: { label: { en: 'Slight Snow', hi: 'हल्की बर्फबारी', mr: 'हलकी बर्फवृष्टी' }, icon: '🌨️' },
    73: { label: { en: 'Moderate Snow', hi: 'मध्यम बर्फबारी', mr: 'मध्यम बर्फवृष्टी' }, icon: '🌨️' },
    75: { label: { en: 'Heavy Snow', hi: 'भारी बर्फबारी', mr: 'जोरदार बर्फवृष्टी' }, icon: '❄️' },
    77: { label: { en: 'Snow Grains', hi: 'बर्फ के कण', mr: 'बर्फाचे कण' }, icon: '❄️' },
    80: { label: { en: 'Slight Rain Showers', hi: 'हल्की बौछारें', mr: 'हलक्या पावसाच्या सरी' }, icon: '🌦️' },
    81: { label: { en: 'Moderate Rain Showers', hi: 'मध्यम बौछारें', mr: 'मध्यम पावसाच्या सरी' }, icon: '🌧️' },
    82: { label: { en: 'Violent Rain Showers', hi: 'मूसलाधार बारिश', mr: 'मुसळधार पावसाच्या सरी' }, icon: '⛈️' },
    85: { label: { en: 'Slight Snow Showers', hi: 'हल्की हिम बौछारें', mr: 'हलक्या हिमवर्षावाच्या सरी' }, icon: '🌨️' },
    86: { label: { en: 'Heavy Snow Showers', hi: 'भारी हिम बौछारें', mr: 'जोरदार हिमवर्षावाच्या सरी' }, icon: '❄️' },
    95: { label: { en: 'Thunderstorm', hi: 'गरज के साथ तूफान', mr: 'विजांच्या कडकडाटासह वादळ' }, icon: '⛈️' },
    96: { label: { en: 'Thunderstorm with Slight Hail', hi: 'हल्की ओलावृष्टि व तूफान', mr: 'हलकी गारपीट आणि वादळ' }, icon: '⛈️' },
    99: { label: { en: 'Thunderstorm with Heavy Hail', hi: 'भारी ओलावृष्टि व तूफान', mr: 'मुसळधार गारपीट आणि वादळ' }, icon: '⛈️' }
  };

  // ── In-Memory Application State ──
  let state = {
    currentLocation: null,
    weatherData: null,
    lastFetchedAt: null,
    isOfflineData: false,
    autoRefreshTimer: null,
    searchDebounceTimer: null
  };

  // ── Helper: Safe Language Resolution ──
  function getLang() {
    if (window.AgriHubI18n && typeof window.AgriHubI18n.getLang === 'function') {
      return window.AgriHubI18n.getLang();
    }
    const saved = localStorage.getItem('agrihub_lang');
    if (saved && ['en', 'hi', 'mr'].includes(saved)) return saved;
    return 'en';
  }

  // ── Helper: Fetch with AbortController Timeout ──
  async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  }

  // ── Helper: DOM Element Safe Toggle ──
  function showElement(el, shouldShow = true) {
    if (!el) return;
    if (shouldShow) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }

  function setView(view) {
    // view: 'initial' | 'loading' | 'display' | 'error'
    const initialEl = document.getElementById('weatherInitial');
    const loadingEl = document.getElementById('weatherLoading');
    const displayEl = document.getElementById('weatherDisplay');
    const errorEl = document.getElementById('weatherError');

    showElement(initialEl, view === 'initial');
    showElement(loadingEl, view === 'loading');
    showElement(displayEl, view === 'display');
    showElement(errorEl, view === 'error');
  }

  // ── Geocoding & Reverse Geocoding ──

  /**
   * Reverse-geocode coordinates to readable place name.
   * Free & no key required via BigDataCloud.
   */
  async function reverseGeocode(latitude, longitude) {
    console.log(`[AgriHub Weather] Reverse geocoding coords: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    try {
      const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const res = await fetchWithTimeout(url, {}, 6000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      const city = data.city || data.locality || data.principalSubdivision || 'Farm Location';
      const admin1 = data.principalSubdivision || '';
      const country = data.countryName || 'India';

      return {
        name: city,
        admin1: admin1,
        country: country,
        latitude,
        longitude
      };
    } catch (err) {
      console.warn('[AgriHub Weather] Reverse geocoding failed, falling back to coordinate label:', err.message);
      return {
        name: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`,
        admin1: '',
        country: 'India',
        latitude,
        longitude
      };
    }
  }

  /**
   * City Search via Open-Meteo Geocoding
   */
  async function searchCities(query) {
    if (!query || query.trim().length < 2) return [];
    console.log(`[AgriHub Weather] Searching cities for: "${query}"`);
    try {
      const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`;
      const res = await fetchWithTimeout(url, {}, 6000);
      if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
      const data = await res.json();
      return data.results || [];
    } catch (err) {
      console.error('[AgriHub Weather] Geocoding search error:', err.message);
      return [];
    }
  }

  // ── Open-Meteo Weather Forecast Fetch ──
  async function fetchForecastData(latitude, longitude) {
    console.log(`[AgriHub Weather] Fetching Open-Meteo forecast for ${latitude}, ${longitude}`);
    
    const params = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure',
      hourly: 'temperature_2m,precipitation_probability,soil_moisture_0_to_1cm,soil_temperature_0cm,visibility',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,et0_fao_evapotranspiration',
      timezone: 'auto',
      forecast_days: '7'
    });

    const url = `${OPEN_METEO_FORECAST_URL}?${params.toString()}`;
    const res = await fetchWithTimeout(url, {}, FETCH_TIMEOUT_MS);
    if (!res.ok) {
      throw new Error(`Open-Meteo error: HTTP ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  }

  // ── Rule-Based Agricultural Advisory Engine ──
  function generateFarmingAdvisories(current, daily, lang) {
    const tips = [];
    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m; // km/h
    const rainProb = (daily && daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
    const rainSum = (daily && daily.precipitation_sum && daily.precipitation_sum[0]) || 0;
    const et0 = (daily && daily.et0_fao_evapotranspiration && daily.et0_fao_evapotranspiration[0]) || 3.5;

    // Rule 1: Rain Probability / Spraying safety
    if (rainProb >= 60 || rainSum > 5) {
      tips.push({
        icon: '⚠️',
        text: {
          en: `Rain probability is high (${rainProb}%). Postpone spraying pesticides and foliar fertilizer to prevent chemical runoff. Ensure clear drainage channels.`,
          hi: `बारिश की उच्च संभावना (${rainProb}%) है। कीटनाशक या पर्णीय उर्वरक का छिड़काव टालें ताकि दवा न धुले। खेतों में जल निकासी की व्यवस्था रखें।`,
          mr: `पावसाची शक्यता जास्त (${rainProb}%) आहे. औषध वाहून जाणे टाळण्यासाठी कीटकनाशक किंवा खतांची फवारणी पुढे ढकला. शेतात पाण्याचा निचरा योग्य ठेवा.`
        }
      });
    }

    // Rule 2: Wind Speed & Spraying Drift
    if (windSpeed >= 20) {
      tips.push({
        icon: '💨',
        text: {
          en: `Wind speed is high (${Math.round(windSpeed)} km/h). Avoid all spray operations to prevent chemical drift and ensure maximum efficacy.`,
          hi: `हवा की गति अधिक (${Math.round(windSpeed)} किमी/घंटा) है। रासायनिक बहाव और बर्बादी से बचने के लिए अभी छिड़काव का कार्य न करें।`,
          mr: `वाऱ्याचा वेग जास्त (${Math.round(windSpeed)} किमी/तास) आहे. औषध उडून वाया जाऊ नये म्हणून कोणतीही फवारणी करणे टाळा.`
        }
      });
    }

    // Rule 3: Extreme Heat & Irrigation Window
    if (temp >= 38) {
      tips.push({
        icon: '🌡️',
        text: {
          en: `High temperature alert (${Math.round(temp)}°C). Irrigate crops strictly during early morning (before 8 AM) or evening to minimize heat shock and evaporation losses.`,
          hi: `उच्च तापमान चेतावनी (${Math.round(temp)}°C)। फसलों की सिंचाई केवल सुबह जल्दी (8 बजे से पहले) या शाम को करें ताकि वाष्पीकरण नुकसान कम हो।`,
          mr: `उष्णतेचा इशारा (${Math.round(temp)}°C). पिकांना पाणी सकाळी लवकर (८ च्या आधी) किंवा संध्याकाळीच द्या, जेणेकरून बाष्पीभवन कमी होईल.`
        }
      });
    }

    // Rule 4: High Humidity & Fungal Pathogen Watch
    if (humidity >= 80 && temp >= 22) {
      tips.push({
        icon: '🍄',
        text: {
          en: `Elevated humidity (${humidity}%). Monitor crops closely for fungal diseases (blight, blast, rust, powdery mildew). Maintain ventilation in polyhouses.`,
          hi: `उच्च आर्द्रता (${humidity}%)। फसलों में फफूंद जनित रोगों (झुलसा, रतुआ, चूर्णी फफूंद) की निगरानी करें। पॉलीहाउस में वायु संचार बनाए रखें।`,
          mr: `जास्त आर्द्रता (${humidity}%). पिकांवर बुरशीजन्य रोगांचा (करपा, तांबेरा, भुरी) प्रादुर्भाव तपासत राहा. पॉलिहाऊसमध्ये हवा खेळती ठेवा.`
        }
      });
    }

    // Rule 5: Evapotranspiration & Irrigation Reminder
    if (rainProb < 20 && et0 >= 4.5) {
      tips.push({
        icon: '💧',
        text: {
          en: `High water loss (ET0: ${et0.toFixed(1)} mm/day) under dry conditions. Increase drip irrigation cycles or check soil moisture to avoid crop stress.`,
          hi: `उच्च जल वाष्पीकरण (ET0: ${et0.toFixed(1)} मिमी/दिन)। शुष्क मौसम के कारण ड्रिप सिंचाई का समय बढ़ाएं ताकि फसल में नमी का तनाव न हो।`,
          mr: `जमिनीतील पाण्याचे बाष्पीभवन (ET0: ${et0.toFixed(1)} मिमी/दिवस) जास्त आहे. पिकाला पाण्याचा ताण पडू नये म्हणून ठिबक सिंचनाची वेळ वाढवा.`
        }
      });
    }

    // Rule 6: Frost Risk
    if (temp <= 4) {
      tips.push({
        icon: '❄️',
        text: {
          en: `Frost risk detected (${temp}°C). Protect young orchards and sensitive vegetable crops with light evening irrigation or straw covering.`,
          hi: `पाले का खतरा (${temp}°C)। शाम को हल्की सिंचाई करके या पुआल से ढककर संवेदनशील सब्जियों और फलदार पौधों की रक्षा करें।`,
          mr: `अतिथंडी आणि गारठ्याचा धोका (${temp}°C). संध्याकाळी हलके पाणी देऊन किंवा आच्छादन करून फळबागा व भाजीपाला पिकांचे रक्षण करा.`
        }
      });
    }

    // Favorable conditions fallbacks to ensure 3-5 practical tips are ALWAYS shown
    if (tips.length < 3) {
      tips.push({
        icon: '✅',
        text: {
          en: `Favorable fieldwork weather: Ideal conditions for weeding, plowing, intercultural hoeing, and crop harvesting today.`,
          hi: `खेत कार्यों के लिए उत्तम मौसम: आज निराई, गुड़ाई, जुताई और फसलों की कटाई के लिए अनुकूल परिस्थितियां हैं।`,
          mr: `शेतीकामांसाठी उत्तम हवामान: आज खुरपणी, आंतरमशागत, नांगरणी आणि पीक काढणीसाठी अत्यंत अनुकूल वातावरण आहे.`
        }
      });
    }
    if (tips.length < 4) {
      tips.push({
        icon: '🌱',
        text: {
          en: `Fertilizer application window: Moderate temperature and gentle wind create optimal conditions for soil nutrient absorption.`,
          hi: `उर्वरक उपयोग के लिए अनुकूल समय: मध्यम तापमान और हल्की हवा में मिट्टी में पोषक तत्वों का अवशोषण बेहतरीन होता है।`,
          mr: `खत व्यवस्थापनासाठी योग्य वेळ: मध्यम तापमान आणि मंद वाऱ्यामुळे जमिनीत खतांचे शोषण अतिशय चांगले होते.`
        }
      });
    }
    if (tips.length < 5) {
      tips.push({
        icon: '🌾',
        text: {
          en: `General Farm Care: Check field bunds, clean irrigation filters, and keep farm produce safely covered during storage.`,
          hi: `सामान्य कृषि देखभाल: खेत की मेड़ें जांचें, सिंचाई फिल्टर साफ रखें और भंडारण में कृषि उत्पाद को सुरक्षित रखें।`,
          mr: `नियमित शेती काळजी: शेताचे बांध तपासा, ठिबकचे फिल्टर स्वच्छ करा आणि गोदामात शेतमाल व्यवस्थित झाकून ठेवा.`
        }
      });
    }

    // Return the top 3 to 5 tips formatted for current lang
    return tips.slice(0, 5).map(item => ({
      icon: item.icon,
      text: item.text[lang] || item.text.en
    }));
  }

  // ── Extreme Agricultural Weather Alerts Engine ──
  function evaluateAlerts(current, daily, lang) {
    const alerts = [];
    const maxTemp = (daily && daily.temperature_2m_max && daily.temperature_2m_max[0]) || current.temperature_2m;
    const minTemp = (daily && daily.temperature_2m_min && daily.temperature_2m_min[0]) || current.temperature_2m;
    const rainSum = (daily && daily.precipitation_sum && daily.precipitation_sum[0]) || 0;
    const rainProb = (daily && daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
    const maxWind = (daily && daily.wind_speed_10m_max && daily.wind_speed_10m_max[0]) || current.wind_speed_10m;

    // Heatwave
    if (maxTemp >= 40 || current.apparent_temperature >= 42) {
      alerts.push({
        type: 'alert-heatwave',
        icon: '🔥',
        title: {
          en: 'Heatwave Alert',
          hi: 'लू / अत्यधिक गर्मी चेतावनी',
          mr: 'उष्णतेची लाट इशारा'
        },
        desc: {
          en: `Peak temperature expected at ${Math.round(maxTemp)}°C. High risk of moisture depletion and heat stress in standing crops.`,
          hi: `अधिकतम तापमान ${Math.round(maxTemp)}°C तक जाने की संभावना। फसलों में गंभीर जल तनाव का खतरा।`,
          mr: `कमाल तापमान ${Math.round(maxTemp)}°C पर्यंत जाण्याची शक्यता. उभ्या पिकांना तीव्र उष्णतेचा ताण जाणवेल.`
        }
      });
    }

    // Heavy Rain
    if (rainSum >= 25 || rainProb >= 75 || current.precipitation >= 10) {
      alerts.push({
        type: 'alert-heavy-rain',
        icon: '🌧️',
        title: {
          en: 'Heavy Rain Warning',
          hi: 'भारी बारिश की चेतावनी',
          mr: 'मुसळधार पाऊस इशारा'
        },
        desc: {
          en: `Rainfall forecast: ~${rainSum.toFixed(1)} mm with ${rainProb}% chance. Risk of field waterlogging and soil nutrient leaching.`,
          hi: `अनुमानित वर्षा: ~${rainSum.toFixed(1)} मिमी (${rainProb}% संभावना)। खेतों में जलभराव और पोषक तत्वों के बहने का खतरा।`,
          mr: `अंदाजे पाऊस: ~${rainSum.toFixed(1)} मिमी (${rainProb}% शक्यता). शेतात पाणी साचून खते वाहून जाण्याचा धोका.`
        }
      });
    }

    // Strong Wind
    if (maxWind >= 32 || current.wind_speed_10m >= 30) {
      alerts.push({
        type: 'alert-strong-wind',
        icon: '💨',
        title: {
          en: 'High Wind Warning',
          hi: 'तेज़ हवा की चेतावनी',
          mr: 'सोसाट्याचा वारा इशारा'
        },
        desc: {
          en: `Gusts up to ${Math.round(maxWind)} km/h expected. Stalk lodging risk in tall crops (sugarcane, maize, banana). Staking recommended.`,
          hi: `${Math.round(maxWind)} किमी/घंटे की हवा का अनुमान। गन्ने, मक्के व केले की फसल गिरने का जोखिम। सहारा प्रदान करें।`,
          mr: `${Math.round(maxWind)} किमी/तास वेगाने वारे वाहण्याची शक्यता. ऊस, मका, केळी या पिकांना टेकू देण्याची गरज.`
        }
      });
    }

    // Frost
    if (minTemp <= 4) {
      alerts.push({
        type: 'alert-frost',
        icon: '❄️',
        title: {
          en: 'Frost / Cold Shock Risk',
          hi: 'पाला / अत्यधिक ठंड का खतरा',
          mr: 'अतिथंडी / गारठ्याचा धोका'
        },
        desc: {
          en: `Minimum temperature falling to ${Math.round(minTemp)}°C. Immediate frost protection measures required for horticultural crops.`,
          hi: `न्यूनतम तापमान ${Math.round(minTemp)}°C तक गिरने की संभावना। बागवानी फसलों को पाले से बचाने के उपाय करें।`,
          mr: `किमान तापमान ${Math.round(minTemp)}°C पर्यंत घसरण्याची शक्यता. फळबागांचे थंडीपासून तात्काळ रक्षण करा.`
        }
      });
    }

    if (alerts.length === 0) {
      return [{
        type: 'alert-all-clear',
        icon: '✅',
        title: {
          en: 'All Clear — Normal Weather Conditions',
          hi: 'सब सामान्य — मौसम सामान्य स्थिति में है',
          mr: 'सर्व सुरक्षित — हवामान सामान्य स्थितीत आहे'
        },
        desc: {
          en: 'No adverse weather threats detected for your farm today. Proceed with standard seasonal crop management.',
          hi: 'आज आपके खेत के लिए कोई प्रतिकूल मौसम चेतावनी नहीं है। सामान्य मौसमी कृषि कार्य जारी रखें।',
          mr: 'आज शेतासाठी कोणताही प्रतिकूल हवामान इशारा नाही. नेहमीची पीक व्यवस्थापन कामे सुरू ठेवा.'
        }
      }];
    }

    return alerts;
  }

  // ── Render Complete Weather Interface ──
  function renderWeatherUI() {
    if (!state.weatherData || !state.currentLocation) {
      console.warn('[AgriHub Weather] Cannot render UI: missing weather data or location');
      return;
    }

    const data = state.weatherData;
    const loc = state.currentLocation;
    const lang = getLang();

    console.log(`[AgriHub Weather] Rendering weather view in language: "${lang}" for ${loc.name}`);

    // 1. Notice / Status Banner (Fallback or Offline)
    const noticeWrap = document.getElementById('weatherNoticeWrap');
    const noticePill = document.getElementById('weatherNoticePill');
    const noticeText = document.getElementById('weatherNoticeText');

    if (noticeWrap && noticePill && noticeText) {
      if (loc.isFallback) {
        noticeWrap.style.display = 'block';
        noticePill.className = 'weather-notice-pill weather-notice-fallback';
        noticeText.textContent = lang === 'hi' 
          ? 'नागपुर (डिफ़ॉल्ट) का मौसम दिखाया जा रहा है — स्थान बदलें या अपना शहर खोजें'
          : (lang === 'mr' 
            ? 'नागपूरचे (डिफॉल्ट) हवामान दाखवले आहे — स्थान बदला किंवा वर शोधा'
            : 'Showing Nagpur (Default Fallback) — Detect GPS or search your location above');
      } else if (state.isOfflineData) {
        const minutesAgo = state.lastFetchedAt ? Math.round((Date.now() - state.lastFetchedAt) / 60000) : 0;
        noticeWrap.style.display = 'block';
        noticePill.className = 'weather-notice-pill weather-notice-offline';
        noticeText.textContent = lang === 'hi'
          ? `अंतिम अपडेट ${minutesAgo} मिनट पहले (ऑफलाइन मोड)`
          : (lang === 'mr'
            ? `शेवटचे अपडेट ${minutesAgo} मिनिटांपूर्वी (ऑफलाइन मोड)`
            : `Last updated ${minutesAgo} min ago (offline cache)`);
      } else {
        noticeWrap.style.display = 'none';
      }
    }

    // 2. Location Heading
    const cityEl = document.getElementById('weatherCity');
    const countryEl = document.getElementById('weatherCountry');
    if (cityEl) cityEl.textContent = loc.name;
    if (countryEl) {
      const parts = [loc.admin1, loc.country].filter(Boolean);
      countryEl.textContent = parts.join(', ');
    }

    // 3. Current Weather Block
    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const code = current.weather_code ?? 0;
    const wmo = WMO_MAP[code] || WMO_MAP[0];
    const conditionText = (wmo.label && wmo.label[lang]) || wmo.label.en;

    const iconEl = document.getElementById('weatherIconLarge');
    const tempEl = document.getElementById('weatherTemp');
    const condEl = document.getElementById('weatherCondition');
    const feelsEl = document.getElementById('weatherFeelsLike');
    const highLowEl = document.getElementById('weatherHighLow');
    const rainSumEl = document.getElementById('weatherRainSum');

    if (iconEl) iconEl.textContent = wmo.icon;
    if (tempEl) tempEl.textContent = Math.round(current.temperature_2m ?? 0);
    if (condEl) condEl.textContent = conditionText;
    if (feelsEl) feelsEl.textContent = Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0);

    const todayMax = (daily.temperature_2m_max && daily.temperature_2m_max[0] != null) ? Math.round(daily.temperature_2m_max[0]) : '--';
    const todayMin = (daily.temperature_2m_min && daily.temperature_2m_min[0] != null) ? Math.round(daily.temperature_2m_min[0]) : '--';
    if (highLowEl) highLowEl.textContent = `H: ${todayMax}°C | L: ${todayMin}°C`;

    const rainToday = (daily.precipitation_sum && daily.precipitation_sum[0] != null) ? daily.precipitation_sum[0].toFixed(1) : (current.precipitation || 0).toFixed(1);
    if (rainSumEl) rainSumEl.textContent = rainToday;

    // 4. Primary Stats
    const humEl = document.getElementById('weatherHumidity');
    const windEl = document.getElementById('weatherWind');
    const visEl = document.getElementById('weatherVisibility');
    const pressEl = document.getElementById('weatherPressure');

    if (humEl) humEl.textContent = `${Math.round(current.relative_humidity_2m ?? 0)}%`;
    if (windEl) windEl.textContent = `${Math.round(current.wind_speed_10m ?? 0)} km/h`;

    // Visibility: Open-Meteo hourly visibility is in meters
    let visibilityKm = '10.0';
    if (hourly.visibility && hourly.visibility.length > 0) {
      const v = hourly.visibility[0];
      visibilityKm = (v / 1000).toFixed(1);
    }
    if (visEl) visEl.textContent = `${visibilityKm} km`;
    if (pressEl) pressEl.textContent = `${Math.round(current.surface_pressure ?? 1013)} hPa`;

    // 5. Secondary Agro Stats
    const rainProbEl = document.getElementById('weatherRainProb');
    const soilMoistEl = document.getElementById('weatherSoilMoist');
    const uvEl = document.getElementById('weatherUvIndex');
    const et0El = document.getElementById('weatherEt0');

    const rainProbVal = (daily.precipitation_probability_max && daily.precipitation_probability_max[0] != null) ? `${daily.precipitation_probability_max[0]}%` : '--%';
    if (rainProbEl) rainProbEl.textContent = rainProbVal;

    const soilMoistVal = (hourly.soil_moisture_0_to_1cm && hourly.soil_moisture_0_to_1cm[0] != null) ? `${hourly.soil_moisture_0_to_1cm[0].toFixed(2)} m³/m³` : '--';
    if (soilMoistEl) soilMoistEl.textContent = soilMoistVal;

    const uvVal = (daily.uv_index_max && daily.uv_index_max[0] != null) ? daily.uv_index_max[0].toFixed(1) : '--';
    if (uvEl) uvEl.textContent = uvVal;

    const et0Val = (daily.et0_fao_evapotranspiration && daily.et0_fao_evapotranspiration[0] != null) ? `${daily.et0_fao_evapotranspiration[0].toFixed(1)} mm` : '--';
    if (et0El) et0El.textContent = et0Val;

    // 6. Agricultural Weather Alerts
    const alertsListEl = document.getElementById('weatherAlertsList');
    if (alertsListEl) {
      const alerts = evaluateAlerts(current, daily, lang);
      alertsListEl.innerHTML = alerts.map(a => `
        <div class="weather-alert-card ${a.type}">
          <span class="weather-alert-icon">${a.icon}</span>
          <div>
            <strong>${a.title[lang] || a.title.en}</strong>
            <p style="margin:4px 0 0;font-size:0.86rem;">${a.desc[lang] || a.desc.en}</p>
          </div>
        </div>
      `).join('');
    }

    // 7. 24-Hour Hourly Forecast Strip
    const hourlyStrip = document.getElementById('weatherHourlyStrip');
    if (hourlyStrip && hourly.time && hourly.time.length > 0) {
      // Find current hour index
      const now = new Date();
      let startIndex = 0;
      for (let i = 0; i < hourly.time.length; i++) {
        const itemDate = new Date(hourly.time[i]);
        if (itemDate >= now) {
          startIndex = Math.max(0, i - 1);
          break;
        }
      }
      const next24 = hourly.time.slice(startIndex, startIndex + 24);
      hourlyStrip.innerHTML = next24.map((isoTime, idx) => {
        const globalIdx = startIndex + idx;
        const d = new Date(isoTime);
        const hourStr = d.toLocaleTimeString(lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN'), {
          hour: 'numeric',
          hour12: true
        });
        const hTemp = Math.round(hourly.temperature_2m[globalIdx] ?? 0);
        const hRainProb = hourly.precipitation_probability ? (hourly.precipitation_probability[globalIdx] ?? 0) : 0;
        
        // Approximate day/night icon
        const isNight = d.getHours() < 6 || d.getHours() >= 19;
        const hIcon = hRainProb > 50 ? '🌧️' : (isNight ? '🌙' : '☀️');

        return `
          <div class="weather-hourly-card">
            <div class="weather-hourly-time">${idx === 0 ? (lang === 'hi' ? 'अभी' : (lang === 'mr' ? 'आता' : 'Now')) : hourStr}</div>
            <div class="weather-hourly-icon">${hIcon}</div>
            <div class="weather-hourly-temp">${hTemp}°C</div>
            <div class="weather-hourly-rain">${hRainProb > 0 ? `💧 ${hRainProb}%` : '0%'}</div>
          </div>
        `;
      }).join('');
    }

    // 8. 7-Day Agricultural Forecast Grid
    const dailyGrid = document.getElementById('weatherDailyGrid');
    if (dailyGrid && daily.time && daily.time.length > 0) {
      const dayNames = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
        mr: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि']
      };

      dailyGrid.innerHTML = daily.time.map((dateStr, i) => {
        const d = new Date(dateStr + 'T00:00:00');
        const dayOfWeek = (dayNames[lang] || dayNames.en)[d.getDay()];
        const isToday = i === 0;
        const displayDay = isToday 
          ? (lang === 'hi' ? 'आज' : (lang === 'mr' ? 'आज' : 'Today')) 
          : dayOfWeek;
        
        const dateFormatted = `${d.getDate()}/${d.getMonth() + 1}`;
        const dayCode = (daily.weather_code && daily.weather_code[i]) ?? 0;
        const dayWmo = WMO_MAP[dayCode] || WMO_MAP[0];
        const maxT = Math.round(daily.temperature_2m_max[i] ?? 0);
        const minT = Math.round(daily.temperature_2m_min[i] ?? 0);
        const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[i] != null) ? daily.precipitation_probability_max[i] : 0;
        const rainSum = (daily.precipitation_sum && daily.precipitation_sum[i] != null) ? daily.precipitation_sum[i] : 0;
        const et0 = (daily.et0_fao_evapotranspiration && daily.et0_fao_evapotranspiration[i] != null) ? daily.et0_fao_evapotranspiration[i].toFixed(1) : null;

        return `
          <div class="weather-daily-card ${isToday ? 'today' : ''}">
            <div class="weather-daily-day">${displayDay}</div>
            <div class="weather-daily-date">${dateFormatted}</div>
            <div class="weather-daily-icon">${dayWmo.icon}</div>
            <div class="weather-daily-temp-range">
              <span>${maxT}°</span> / <span class="weather-daily-min">${minT}°</span>
            </div>
            <div class="weather-daily-rain">${rainProb > 0 ? `💧 ${rainProb}%` : '0%'}</div>
            ${et0 ? `<div class="weather-daily-et0" title="Crop evapotranspiration">ET: ${et0}mm</div>` : ''}
          </div>
        `;
      }).join('');
    }

    // 9. Rule-Based Farming Advice (3-5 tips)
    const adviceListEl = document.getElementById('weatherAdviceList');
    const legacyAdviceText = document.getElementById('adviceText');
    const advisories = generateFarmingAdvisories(current, daily, lang);

    if (adviceListEl) {
      adviceListEl.innerHTML = advisories.map(tip => `
        <li class="weather-advice-item">
          <span class="tip-icon">${tip.icon}</span>
          <span>${tip.text}</span>
        </li>
      `).join('');
    }
    if (legacyAdviceText && advisories[0]) {
      legacyAdviceText.textContent = advisories[0].text;
    }

    // 10. Last Updated Timestamp
    const timeEl = document.getElementById('weatherTime');
    if (timeEl) {
      const dateToFormat = state.lastFetchedAt ? new Date(state.lastFetchedAt) : new Date();
      timeEl.textContent = dateToFormat.toLocaleTimeString(
        lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN'),
        { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }
      );
    }

    // Switch view to display
    setView('display');

    // Trigger Lucide icons regeneration
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // ── Load Weather for Location with Caching ──
  async function loadWeatherForLocation(location, isManualRefresh = false) {
    console.log(`[AgriHub Weather] Requesting weather for ${location.name} (${location.latitude}, ${location.longitude})`);
    
    // Check local storage cache if network is offline or within 30 min cache and not manual refresh
    if (!isManualRefresh) {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          const isFresh = (Date.now() - cached.timestamp) < CACHE_TTL_MS;
          const isSameLoc = Math.abs(cached.location.latitude - location.latitude) < 0.05 &&
                            Math.abs(cached.location.longitude - location.longitude) < 0.05;

          if (isSameLoc && (isFresh || !navigator.onLine)) {
            console.log('[AgriHub Weather] Serving valid cached forecast data from localStorage');
            state.weatherData = cached.data;
            state.currentLocation = location;
            state.lastFetchedAt = cached.timestamp;
            state.isOfflineData = !navigator.onLine || !isFresh;
            renderWeatherUI();
            if (isFresh) return; // Keep cached version; otherwise background refresh
          }
        }
      } catch (cacheErr) {
        console.warn('[AgriHub Weather] Cache read error:', cacheErr);
      }
    }

    // If we already have view displayed, show subtle refresh spinner instead of full skeleton wipeout
    const refreshBtn = document.getElementById('refreshWeather');
    if (refreshBtn) refreshBtn.classList.add('spinning');
    if (!state.weatherData) {
      setView('loading');
    }

    try {
      const data = await fetchForecastData(location.latitude, location.longitude);
      
      state.weatherData = data;
      state.currentLocation = location;
      state.lastFetchedAt = Date.now();
      state.isOfflineData = false;

      // Save to localStorage
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: state.lastFetchedAt,
          location: location,
          data: data
        }));
        localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
        console.log('[AgriHub Weather] Successfully cached fresh weather and saved location');
      } catch (storageErr) {
        console.warn('[AgriHub Weather] LocalStorage save failed:', storageErr);
      }

      renderWeatherUI();
    } catch (fetchErr) {
      console.error('[AgriHub Weather] Fetch forecast failed:', fetchErr);

      // If we already have cached data in memory or localStorage, keep showing it gracefully
      if (state.weatherData) {
        state.isOfflineData = true;
        renderWeatherUI();
        return;
      }

      // Try reading fallback from cache
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          console.log('[AgriHub Weather] Network failed, serving stale cached forecast');
          state.weatherData = cached.data;
          state.currentLocation = cached.location || location;
          state.lastFetchedAt = cached.timestamp;
          state.isOfflineData = true;
          renderWeatherUI();
          return;
        }
      } catch (e) { /* ignore */ }

      // If absolutely no data is available, display friendly error
      displayError('network', fetchErr.message);
    } finally {
      if (refreshBtn) refreshBtn.classList.remove('spinning');
    }
  }

  // ── Error Display Helper ──
  function displayError(errorType, details = '') {
    const lang = getLang();
    const errorMsgEl = document.getElementById('weatherErrorMsg');
    const errorTitleEl = document.getElementById('weatherErrorTitle');

    let title = 'Unable to get weather data';
    let message = 'Location access denied or network unavailable.';

    if (errorType === 'permission_denied') {
      title = lang === 'hi' ? 'स्थान अनुमति अस्वीकृत' : (lang === 'mr' ? 'लोकेशन परवानगी नाकारली' : 'Location Permission Denied');
      message = lang === 'hi' 
        ? 'ब्राउज़र में स्थान अनुमति बंद है। नीचे दिए गए बटन से नागपुर का मौसम देखें या ऊपर अपना शहर खोजें।'
        : (lang === 'mr'
          ? 'ब्राउझरमध्ये लोकेशन परवानगी बंद आहे. खालील बटणाने नागपूरचे हवामान पहा किंवा वर तुमचे शहर शोधा.'
          : 'Location access was blocked or timed out. You can load Nagpur fallback below or search your city above.');
    } else if (errorType === 'network' || !navigator.onLine) {
      title = lang === 'hi' ? 'इंटरनेट कनेक्शन उपलब्ध नहीं है' : (lang === 'mr' ? 'इंटरनेट कनेक्शन उपलब्ध नाही' : 'Network Unavailable');
      message = lang === 'hi'
        ? 'इंटरनेट से कनेक्ट नहीं हो पा रहा है। कृपया अपना कनेक्शन जांचें या पुनः प्रयास करें।'
        : (lang === 'mr'
          ? 'इंटरनेटशी जोडणी होऊ शकली नाही. कृपया तुमचे कनेक्शन तपासा किंवा पुन्हा प्रयत्न करा.'
          : 'Unable to connect to weather satellites. Please verify your internet connection and try again.');
    } else {
      title = lang === 'hi' ? 'मौसम डेटा त्रुटि' : (lang === 'mr' ? 'हवामान माहिती त्रुटी' : 'Weather Data Unavailable');
      message = details || (lang === 'hi' ? 'मौसम डेटा लोड करते समय समस्या आई। कृपया पुनः प्रयास करें।' : 'An error occurred while loading weather data. Please try again.');
    }

    if (errorTitleEl) errorTitleEl.textContent = title;
    if (errorMsgEl) errorMsgEl.textContent = message;

    setView('error');
  }

  // ── Location Resolution Workflow (Never Dead-Ends) ──

  /**
   * Step 1: Detect GPS location with 10s timeout
   */
  function handleDetectLocation() {
    console.log('[AgriHub Weather] User triggered GPS location detection');
    
    const detectBtn = document.getElementById('detectLocation');
    const detectHeaderBtn = document.getElementById('detectLocationHeader');
    const originalText = detectBtn ? detectBtn.innerHTML : '';

    if (!navigator.geolocation) {
      console.warn('[AgriHub Weather] Geolocation API not supported by browser');
      displayError('permission_denied');
      return;
    }

    if (detectBtn) detectBtn.disabled = true;
    if (detectHeaderBtn) detectHeaderBtn.classList.add('loading');
    setView('loading');

    const loadingText = document.getElementById('weatherLoadingText');
    if (loadingText) {
      const lang = getLang();
      loadingText.textContent = lang === 'hi' ? 'GPS उपग्रह से आपका स्थान पता किया जा रहा है...' : (lang === 'mr' ? 'GPS उपग्रहावरून तुमचे लोकेशन शोधत आहे...' : 'Detecting your GPS farm location...');
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (detectBtn) { detectBtn.disabled = false; detectBtn.innerHTML = originalText; }
        if (detectHeaderBtn) detectHeaderBtn.classList.remove('loading');

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        console.log(`[AgriHub Weather] Geolocation acquired: ${lat}, ${lon}`);

        // Reverse geocode to get city / taluka / district
        const locationObj = await reverseGeocode(lat, lon);
        locationObj.isFallback = false;
        
        await loadWeatherForLocation(locationObj, true);
      },
      (geoError) => {
        if (detectBtn) { detectBtn.disabled = false; detectBtn.innerHTML = originalText; }
        if (detectHeaderBtn) detectHeaderBtn.classList.remove('loading');

        console.warn(`[AgriHub Weather] Geolocation error (${geoError.code}): ${geoError.message}`);
        
        // Check if we have a saved location or cached weather
        try {
          const savedLocRaw = localStorage.getItem(LAST_LOCATION_KEY);
          if (savedLocRaw) {
            const savedLoc = JSON.parse(savedLocRaw);
            console.log('[AgriHub Weather] Geolocation failed; auto-falling back to last saved location:', savedLoc.name);
            loadWeatherForLocation(savedLoc);
            return;
          }
        } catch (e) { /* ignore */ }

        // Fall back gracefully to Nagpur with visible banner notice
        console.log('[AgriHub Weather] Geolocation failed; auto-falling back to Nagpur default');
        loadWeatherForLocation(FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: GEO_TIMEOUT_MS,
        maximumAge: 60000
      }
    );
  }

  // ── City Search & Autocomplete Setup ──
  function initCitySearch() {
    const input = document.getElementById('citySearchInput');
    const dropdown = document.getElementById('citySearchResults');
    const clearBtn = document.getElementById('citySearchClear');

    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
      const query = input.value.trim();
      showElement(clearBtn, query.length > 0);

      clearTimeout(state.searchDebounceTimer);
      if (query.length < 2) {
        dropdown.innerHTML = '';
        dropdown.classList.remove('active');
        return;
      }

      state.searchDebounceTimer = setTimeout(async () => {
        const results = await searchCities(query);
        if (results.length === 0) {
          dropdown.innerHTML = `<div class="weather-dropdown-item" style="color:var(--color-text-secondary);cursor:default;">No matching districts or cities found</div>`;
          dropdown.classList.add('active');
          return;
        }

        dropdown.innerHTML = results.map((item, idx) => {
          const region = [item.admin2, item.admin1, item.country].filter(Boolean).join(', ');
          return `
            <div class="weather-dropdown-item" data-index="${idx}">
              <span class="weather-dropdown-name">${item.name}</span>
              <span class="weather-dropdown-region">${region}</span>
            </div>
          `;
        }).join('');
        dropdown.classList.add('active');

        // Attach click handlers to results
        dropdown.querySelectorAll('.weather-dropdown-item').forEach((el, index) => {
          el.addEventListener('click', () => {
            const selected = results[index];
            if (!selected) return;

            dropdown.classList.remove('active');
            input.value = selected.name;

            const selectedLocation = {
              name: selected.name,
              admin1: selected.admin1 || selected.admin2 || '',
              country: selected.country || 'India',
              latitude: selected.latitude,
              longitude: selected.longitude,
              isFallback: false
            };

            loadWeatherForLocation(selectedLocation, true);
          });
        });
      }, 300);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        showElement(clearBtn, false);
        dropdown.innerHTML = '';
        dropdown.classList.remove('active');
        input.focus();
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }

  // ── Auto-Refresh & Background Timers ──
  function setupAutoRefresh() {
    clearInterval(state.autoRefreshTimer);
    state.autoRefreshTimer = setInterval(() => {
      if (state.currentLocation && navigator.onLine) {
        console.log('[AgriHub Weather] 15-minute auto-refresh triggered');
        loadWeatherForLocation(state.currentLocation, true);
      }
    }, AUTO_REFRESH_INTERVAL_MS);
  }

  // ── Initialization Routine ──
  function initWeatherModule() {
    console.log('[AgriHub Weather] Initializing live weather module...');

    // 1. Attach Event Listeners
    const detectBtn = document.getElementById('detectLocation');
    const detectHeaderBtn = document.getElementById('detectLocationHeader');
    const refreshBtn = document.getElementById('refreshWeather');
    const retryBtn = document.getElementById('retryWeather');
    const useNagpurBtn = document.getElementById('useNagpurFallbackBtn');

    if (detectBtn) detectBtn.addEventListener('click', handleDetectLocation);
    if (detectHeaderBtn) detectHeaderBtn.addEventListener('click', handleDetectLocation);
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (state.currentLocation) {
          loadWeatherForLocation(state.currentLocation, true);
        } else {
          loadWeatherForLocation(FALLBACK_LOCATION, true);
        }
      });
    }
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (state.currentLocation) {
          loadWeatherForLocation(state.currentLocation, true);
        } else {
          handleDetectLocation();
        }
      });
    }
    if (useNagpurBtn) {
      useNagpurBtn.addEventListener('click', () => {
        loadWeatherForLocation(FALLBACK_LOCATION, true);
      });
    }

    // 2. City Search Bar
    initCitySearch();

    // 3. Online/Offline Network Listeners
    window.addEventListener('online', () => {
      console.log('[AgriHub Weather] Browser went online');
      if (state.currentLocation) {
        loadWeatherForLocation(state.currentLocation, true);
      }
    });

    window.addEventListener('offline', () => {
      console.log('[AgriHub Weather] Browser went offline');
      state.isOfflineData = true;
      renderWeatherUI();
    });

    // 4. Multilingual Switcher Listener
    window.addEventListener('agrihub:languageChanged', () => {
      console.log('[AgriHub Weather] Language changed event received, re-rendering UI without re-fetching');
      if (state.weatherData && state.currentLocation) {
        renderWeatherUI();
      }
    });

    // 5. Setup periodic background refresh (15 mins)
    setupAutoRefresh();

    // 6. Startup Location Resolution Order:
    //    a) Cached data from previous session
    //    b) Remembered last location in localStorage
    //    c) Fallback to Nagpur, Maharashtra so page is NEVER blank
    try {
      const savedLocRaw = localStorage.getItem(LAST_LOCATION_KEY);
      if (savedLocRaw) {
        const savedLoc = JSON.parse(savedLocRaw);
        console.log('[AgriHub Weather] Restoring last remembered location on startup:', savedLoc.name);
        loadWeatherForLocation(savedLoc);
        return;
      }
    } catch (e) {
      console.warn('[AgriHub Weather] Error reading remembered location:', e);
    }

    // Default cold boot: load Nagpur immediately so mentor/user sees rich live data instantly
    console.log('[AgriHub Weather] No prior location found. Loading default fallback (Nagpur)...');
    loadWeatherForLocation(FALLBACK_LOCATION);
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeatherModule);
  } else {
    initWeatherModule();
  }

  // Export module to global scope for debugging or external triggers
  window.AgriHubWeather = {
    loadLocation: (lat, lon, name) => loadWeatherForLocation({ latitude: lat, longitude: lon, name: name || 'Custom' }, true),
    detectLocation: handleDetectLocation,
    getState: () => ({ ...state })
  };

})();
