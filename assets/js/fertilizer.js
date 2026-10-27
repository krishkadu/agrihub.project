/* ═══════════════════════════════════════════════
   AgriHub — Fertilizer Calculator Logic
   Saves results to Supabase fertilizer_calculations
   ═══════════════════════════════════════════════ */

const cropDatabase = {
    wheat:       { urea: 65,  dap: 55, mop: 25, ssp: 150, zinc: 10, sulphur: 15, magnesium: 5,  organic: 2.5, name: 'Wheat' },
    rice:        { urea: 80,  dap: 45, mop: 30, ssp: 125, zinc: 12, sulphur: 10, magnesium: 4,  organic: 3.0, name: 'Rice/Paddy' },
    maize:       { urea: 75,  dap: 60, mop: 35, ssp: 165, zinc: 10, sulphur: 12, magnesium: 6,  organic: 2.0, name: 'Maize' },
    sorghum:     { urea: 55,  dap: 40, mop: 20, ssp: 110, zinc: 8,  sulphur: 10, magnesium: 4,  organic: 2.0, name: 'Sorghum/Jowar' },
    bajra:       { urea: 45,  dap: 35, mop: 20, ssp: 96,  zinc: 8,  sulphur: 10, magnesium: 3,  organic: 1.5, name: 'Bajra' },
    chickpea:    { urea: 20,  dap: 55, mop: 20, ssp: 150, zinc: 8,  sulphur: 20, magnesium: 5,  organic: 1.5, name: 'Chickpea/Chana' },
    lentil:      { urea: 18,  dap: 45, mop: 18, ssp: 125, zinc: 7,  sulphur: 15, magnesium: 4,  organic: 1.5, name: 'Lentil/Masoor' },
    moong:       { urea: 15,  dap: 40, mop: 15, ssp: 110, zinc: 6,  sulphur: 12, magnesium: 3,  organic: 1.0, name: 'Green Gram/Moong' },
    urad:        { urea: 15,  dap: 40, mop: 15, ssp: 110, zinc: 6,  sulphur: 12, magnesium: 3,  organic: 1.0, name: 'Black Gram/Urad' },
    soybean:     { urea: 18,  dap: 65, mop: 30, ssp: 180, zinc: 10, sulphur: 25, magnesium: 5,  organic: 2.0, name: 'Soybean' },
    tomato:      { urea: 90,  dap: 80, mop: 60, ssp: 220, zinc: 15, sulphur: 20, magnesium: 8,  organic: 4.0, name: 'Tomato' },
    onion:       { urea: 70,  dap: 60, mop: 50, ssp: 165, zinc: 12, sulphur: 25, magnesium: 6,  organic: 3.0, name: 'Onion' },
    potato:      { urea: 100, dap: 90, mop: 80, ssp: 250, zinc: 15, sulphur: 20, magnesium: 8,  organic: 5.0, name: 'Potato' },
    cabbage:     { urea: 80,  dap: 70, mop: 50, ssp: 195, zinc: 12, sulphur: 15, magnesium: 6,  organic: 3.5, name: 'Cabbage' },
    cauliflower: { urea: 85,  dap: 75, mop: 55, ssp: 210, zinc: 12, sulphur: 15, magnesium: 7,  organic: 3.5, name: 'Cauliflower' },
    sugarcane:   { urea: 150, dap: 80, mop: 60, ssp: 220, zinc: 15, sulphur: 20, magnesium: 8,  organic: 8.0, name: 'Sugarcane' },
    cotton:      { urea: 90,  dap: 70, mop: 50, ssp: 195, zinc: 12, sulphur: 30, magnesium: 6,  organic: 3.0, name: 'Cotton' },
    groundnut:   { urea: 15,  dap: 65, mop: 25, ssp: 180, zinc: 10, sulphur: 30, magnesium: 5,  organic: 2.0, name: 'Groundnut' },
    sunflower:   { urea: 55,  dap: 65, mop: 35, ssp: 180, zinc: 10, sulphur: 20, magnesium: 5,  organic: 2.5, name: 'Sunflower' },
    mustard:     { urea: 60,  dap: 50, mop: 20, ssp: 138, zinc: 8,  sulphur: 40, magnesium: 4,  organic: 2.0, name: 'Mustard' }
};

function calculateFertilizer(landSize, cropKey) {
    const crop = cropDatabase[cropKey];
    if (!crop) return null;
    return {
        urea:      Math.round(crop.urea * landSize),
        dap:       Math.round(crop.dap * landSize),
        mop:       Math.round(crop.mop * landSize),
        ssp:       Math.round(crop.ssp * landSize),
        zinc:      Math.round(crop.zinc * landSize),
        sulphur:   Math.round(crop.sulphur * landSize),
        magnesium: Math.round(crop.magnesium * landSize),
        organic:   (crop.organic * landSize).toFixed(1),
        cropName:  crop.name
    };
}

/* ── Save calculation to Supabase ── */
async function saveCalculationToSupabase(cropName, landSize, result) {
    try {
        if (!supabaseClient) return;
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session?.user) return; // Not logged in — skip silently

        const { error } = await supabaseClient.from('fertilizer_calculations').insert({
            user_id:    session.user.id,
            crop_name:  cropName,
            land_size:  landSize,
            land_unit:  'acres',
            nitrogen:   result.urea,      // Urea is the primary N source (kg)
            phosphorus: result.dap,       // DAP is the primary P source (kg)
            potassium:  result.mop,       // MOP is the primary K source (kg)
            notes:      `SSP: ${result.ssp}kg | Zinc: ${result.zinc}kg | Sulphur: ${result.sulphur}kg | Organic: ${result.organic}t`
        });

        if (error) {
            console.warn('[AgriHub] Could not save calculation:', error.message);
        } else {
            showToast('Calculation saved to your dashboard! 📊', 'success');
        }
    } catch (e) {
        console.warn('[AgriHub] Save calculation error:', e.message);
    }
}

const cropNames = {
    wheat:       { en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
    rice:        { en: 'Rice / Paddy', hi: 'धान / चावल', mr: 'भात / तांदूळ' },
    maize:       { en: 'Maize / Corn', hi: 'मक्का', mr: 'मका' },
    sorghum:     { en: 'Sorghum / Jowar', hi: 'ज्वार', mr: 'ज्वारी' },
    bajra:       { en: 'Pearl Millet / Bajra', hi: 'बाजरा', mr: 'बाजरी' },
    chickpea:    { en: 'Chickpea / Chana', hi: 'चना', mr: 'हरभरा' },
    lentil:      { en: 'Lentil / Masoor', hi: 'मसूर', mr: 'मसूर' },
    moong:       { en: 'Green Gram / Moong', hi: 'मूंग', mr: 'मूग' },
    urad:        { en: 'Black Gram / Urad', hi: 'उड़द', mr: 'उडीद' },
    soybean:     { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
    tomato:      { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' },
    onion:       { en: 'Onion', hi: 'प्याज', mr: 'कांदा' },
    potato:      { en: 'Potato', hi: 'आलू', mr: 'बटाटा' },
    cabbage:     { en: 'Cabbage', hi: 'पत्ता गोभी', mr: 'कोबी' },
    cauliflower: { en: 'Cauliflower', hi: 'फूल गोभी', mr: 'फ्लॉवर' },
    sugarcane:   { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
    cotton:      { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
    groundnut:   { en: 'Groundnut', hi: 'मूंगफली', mr: 'भुईमूग' },
    sunflower:   { en: 'Sunflower', hi: 'सूरजमुखी', mr: 'सूर्यफूल' },
    mustard:     { en: 'Mustard', hi: 'सरसों', mr: 'मोहरी' }
};

let activeFertilizerState = null;

function renderFertilizerResults(landSize, cropKey, result) {
    const lang = (window.AgriHubI18n ? window.AgriHubI18n.getLang() : (localStorage.getItem('agrihub_lang') || 'en'));
    const localizedCrop = (cropNames[cropKey] && cropNames[cropKey][lang]) || result.cropName;
    const kgUnit = lang === 'hi' ? 'किग्रा' : (lang === 'mr' ? 'कि.ग्रॅ.' : 'kg');
    const tonUnit = lang === 'hi' ? 'टन' : (lang === 'mr' ? 'टन' : 'tonnes');
    const acresUnit = lang === 'hi' ? 'एकड़' : (lang === 'mr' ? 'एकर' : 'acres');

    const landEl = document.getElementById('resultsLand');
    const cropEl = document.getElementById('resultsCrop');
    if (landEl) landEl.textContent = landSize;
    if (cropEl) cropEl.textContent = localizedCrop;

    const subEl = document.getElementById('resultsSubtitle');
    if (subEl) {
        if (lang === 'hi') {
            subEl.innerHTML = `<strong>${localizedCrop}</strong> के <strong>${landSize}</strong> ${acresUnit} के लिए`;
        } else if (lang === 'mr') {
            subEl.innerHTML = `<strong>${localizedCrop}</strong> च्या <strong>${landSize}</strong> ${acresUnit}साठी`;
        } else {
            subEl.innerHTML = `For <strong>${landSize}</strong> acres of <strong>${localizedCrop}</strong>`;
        }
    }

    document.getElementById('res-urea').textContent       = `${result.urea} ${kgUnit}`;
    document.getElementById('res-dap').textContent        = `${result.dap} ${kgUnit}`;
    document.getElementById('res-mop').textContent        = `${result.mop} ${kgUnit}`;
    document.getElementById('res-ssp').textContent        = `${result.ssp} ${kgUnit}`;
    document.getElementById('res-zinc').textContent       = `${result.zinc} ${kgUnit}`;
    document.getElementById('res-sulphur').textContent    = `${result.sulphur} ${kgUnit}`;
    document.getElementById('res-magnesium').textContent  = `${result.magnesium} ${kgUnit}`;
    document.getElementById('res-organic').textContent    = `${result.organic} ${tonUnit}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const form      = document.getElementById('fertilizerForm');
    const results   = document.getElementById('fertilizerResults');
    const resetBtn  = document.getElementById('resetCalculator');

    // Live update on language switch
    window.addEventListener('agrihub:languageChanged', () => {
        if (activeFertilizerState && results && !results.classList.contains('hidden')) {
            renderFertilizerResults(activeFertilizerState.landSize, activeFertilizerState.cropKey, activeFertilizerState.result);
        }
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const landSize = parseFloat(document.getElementById('landSize').value);
        const cropKey  = document.getElementById('cropSelect').value;

        if (!landSize || landSize <= 0) {
            showToast(typeof t === 'function' ? t('fert_err_land') : 'Please enter a valid land size.', 'error');
            return;
        }
        if (!cropKey) {
            showToast(typeof t === 'function' ? t('fert_err_crop') : 'Please select a crop.', 'error');
            return;
        }

        const result = calculateFertilizer(landSize, cropKey);
        if (!result) return;

        activeFertilizerState = { landSize, cropKey, result };
        renderFertilizerResults(landSize, cropKey, result);

        // Show results with animation
        results.classList.remove('hidden');
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(typeof t === 'function' ? t('fert_success_toast') : 'Calculation complete! 🧪', 'success');

        // Save to Supabase in background
        await saveCalculationToSupabase(result.cropName, landSize, result);
    });

    resetBtn?.addEventListener('click', () => {
        form.reset();
        activeFertilizerState = null;
        results.classList.add('hidden');
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    });
});
