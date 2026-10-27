# 🌾 AgriHub — Empowering Farmers with Digital Innovation

A farmer-first AgriTech web platform built with vanilla HTML5, CSS3, and JavaScript. Backend: Supabase. Deployment: Vercel.

## Features

- **Fertilizer Calculator** — NPK dosage for 20+ crops
- **Government Schemes** — 15+ central schemes with apply links
- **Live Weather** — GPS-based forecast with farming advice
- **AI Crop Advisor** — 36-combination recommendation engine
- **Kisan AI Assistant** — 24/7 Voice & Chat intelligent agriculture advisor with interactive leaf disease photo scanning
- **Multilingual** — English, Hindi (हिंदी), Marathi (मराठी)
- **User Auth** — Supabase-powered registration & OTP/password login
- **Dashboard** — Personal farming command center

## Quick Start

### 1. Clone & Open
```bash
git clone <repo-url>
cd agrihub
```

### 2. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
```

3. Copy your **Project URL** and **anon key** from Settings → API
4. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `assets/js/auth.js`

### 3. Weather API
1. Get a free API key from [openweathermap.org](https://openweathermap.org/api)
2. Update `WEATHER_API_KEY` in `assets/js/weather.js`

### 4. Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```
Set environment variables in Vercel Dashboard if needed.

### 5. Local Development
Simply open `index.html` in a browser, or use a local server:
```bash
npx serve .
```

## File Structure

```
├── index.html              Landing page (6 Services + Floating AI Bot)
├── ai-assistant.html        Kisan AI Assistant (Voice + Diagnostics)
├── fertilizer.html          Fertilizer calculator
├── pesticide.html           Pesticide safety guidelines & spray dosage calculator
├── schemes.html             Government schemes directory
├── weather.html             Live weather forecast
├── crop-advisor.html        AI crop advisor
├── dashboard.html           User dashboard
├── 404.html                 Error page
├── vercel.json              Vercel deployment config
├── .env.example             Environment template
├── assets/
│   ├── css/
│   │   ├── style.css        Master stylesheet
│   │   └── animations.css   Keyframes & transitions
│   └── js/
│       ├── main.js          Core: navbar, modals, scroll
│       ├── auth.js          Supabase authentication
│       ├── translations.js  i18n (EN, HI, MR)
│       ├── ai-assistant.js  Kisan AI Assistant & Floating Widget
│       ├── fertilizer.js    Calculator + crop database
│       ├── schemes.js       15 schemes + filter/search
│       ├── weather.js       Geolocation + weather API
│       ├── crop-advisor.js  36-combo recommendation engine
│       └── dashboard.js     Dashboard logic
```

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Speech API**: Web Speech API (Speech Recognition + Speech Synthesis)
- **Backend/Auth**: Supabase (PostgreSQL + Auth)
- **Fonts**: Google Fonts (Playfair Display + DM Sans + Poppins)
- **Icons**: Lucide Icons
- **Weather API**: OpenWeatherMap
- **Deployment**: Vercel

## License

© 2025 AgriHub. Made with 💚 for Indian Farmers.
