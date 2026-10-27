/* ═══════════════════════════════════════════════
   AgriHub — AI Crop Advisor Decision Engine
   Complete 36-combination recommendation matrix
   Saves results to Supabase crop_advisor_history
   ═══════════════════════════════════════════════ */

const cropRecommendations = {
    kharif: {
        black: {
            low:    { crop: 'Soybean',           icon: '🫘', profit: '₹15,000-20,000/acre', duration: '90-120 days',        water: 'Moderate',   demand: 'High',       profitability: 5, reasoning: 'Black soil retains monsoon moisture perfectly for soybean. Low input cost with high market demand makes this ideal for budget-conscious farmers.' },
            medium: { crop: 'Cotton',             icon: '🌿', profit: '₹20,000-35,000/acre', duration: '150-180 days',       water: 'Moderate',   demand: 'Very High',  profitability: 5, reasoning: 'Cotton thrives in black soil with excellent water retention. Strong MSP support from government ensures price stability.' },
            high:   { crop: 'Sugarcane',          icon: '🎋', profit: '₹40,000-60,000/acre', duration: '12-18 months',       water: 'High',       demand: 'Stable',     profitability: 5, reasoning: 'High-investment sugarcane delivers the best returns in black soil. Contract farming with sugar mills guarantees offtake.' }
        },
        red: {
            low:    { crop: 'Groundnut',          icon: '🥜', profit: '₹12,000-18,000/acre', duration: '120-140 days',       water: 'Low-Moderate', demand: 'High',     profitability: 4, reasoning: 'Groundnut is naturally suited to red soil\'s excellent drainage. Oil mills provide assured market.' },
            medium: { crop: 'Maize',              icon: '🌽', profit: '₹18,000-25,000/acre', duration: '90-110 days',        water: 'Moderate',   demand: 'High',       profitability: 4, reasoning: 'Maize adapts well to red soil with modern hybrid varieties. Growing poultry and animal feed industry ensures demand.' },
            high:   { crop: 'Tomato',             icon: '🍅', profit: '₹35,000-70,000/acre', duration: '75-90 days',         water: 'High',       demand: 'Very High',  profitability: 5, reasoning: 'High-value vegetable crop. Red soil drainage prevents root diseases. With drip irrigation profits can exceed ₹70,000/acre.' }
        },
        alluvial: {
            low:    { crop: 'Paddy (Rice)',       icon: '🌾', profit: '₹12,000-16,000/acre', duration: '110-130 days',       water: 'Very High',  demand: 'Stable',     profitability: 3, reasoning: 'Traditional kharif crop perfectly matched with alluvial soil and monsoon rains. MSP guarantee ensures stable income.' },
            medium: { crop: 'Moong (Green Gram)', icon: '🫛', profit: '₹16,000-22,000/acre', duration: '60-70 days',         water: 'Low',        demand: 'High',       profitability: 4, reasoning: 'Short-duration pulse crop fits between two main crops. Fixes nitrogen improving soil for next crop.' },
            high:   { crop: 'Banana',             icon: '🍌', profit: '₹60,000-1,00,000/acre', duration: '12-14 months',    water: 'High',       demand: 'Very High',  profitability: 5, reasoning: 'Alluvial soil with high-investment inputs produces exceptional banana yields. Contract farming ensures market.' }
        },
        sandy: {
            low:    { crop: 'Bajra (Pearl Millet)', icon: '🌾', profit: '₹8,000-12,000/acre', duration: '65-75 days',       water: 'Very Low',   demand: 'Moderate',   profitability: 3, reasoning: 'Bajra is drought tolerant and low input. Ideal for rainfall-uncertain areas with growing health food demand.' },
            medium: { crop: 'Watermelon',         icon: '🍉', profit: '₹25,000-40,000/acre', duration: '80-100 days',        water: 'Moderate',   demand: 'High',       profitability: 4, reasoning: 'Sandy soil gives watermelon ideal drainage and temperature. Quick crop cycle allows second crop in same season.' },
            high:   { crop: 'Pomegranate',        icon: '🍎', profit: '₹80,000-1,50,000/acre', duration: '3-4 years (perennial)', water: 'Low', demand: 'Very High',  profitability: 5, reasoning: 'Pomegranate on sandy soil with drip irrigation commands premium export prices. Long-term high returns justify initial investment.' }
        }
    },
    rabi: {
        black: {
            low:    { crop: 'Chickpea (Chana)',   icon: '🫘', profit: '₹14,000-20,000/acre', duration: '90-110 days',        water: 'Very Low',   demand: 'Very High',  profitability: 5, reasoning: 'Uses residual moisture from kharif, zero irrigation needed. Consistent MSP with growing protein demand.' },
            medium: { crop: 'Wheat',              icon: '🌾', profit: '₹18,000-26,000/acre', duration: '110-120 days',       water: 'Moderate',   demand: 'Stable',     profitability: 4, reasoning: 'Black soil wheat with moderate investment consistently outperforms. Government MSP ensures price floor.' },
            high:   { crop: 'Safflower',          icon: '🌼', profit: '₹22,000-35,000/acre', duration: '150-165 days',       water: 'Very Low',   demand: 'Growing',    profitability: 4, reasoning: 'Deep tap roots mine subsoil moisture. Premium oil prices with growing nutraceutical demand.' }
        },
        red: {
            low:    { crop: 'Mustard',            icon: '🌼', profit: '₹10,000-15,000/acre', duration: '90-110 days',        water: 'Low',        demand: 'High',       profitability: 3, reasoning: 'Mustard suits red soil drainage. Government\'s import restrictions on edible oil boosted MSP significantly.' },
            medium: { crop: 'Sunflower',          icon: '🌻', profit: '₹16,000-24,000/acre', duration: '90-100 days',        water: 'Moderate',   demand: 'High',       profitability: 4, reasoning: 'High oil content sunflower performs excellently in red soil rabi season. Growing edible oil deficit ensures strong MSP.' },
            high:   { crop: 'Potato',             icon: '🥔', profit: '₹30,000-60,000/acre', duration: '90-110 days',        water: 'High',       demand: 'Very High',  profitability: 5, reasoning: 'Cold weather produces premium quality tubers. Processing industry offers contract farming. Cold storage access multiplies profits.' }
        },
        alluvial: {
            low:    { crop: 'Lentil (Masoor)',    icon: '🫘', profit: '₹12,000-16,000/acre', duration: '100-120 days',       water: 'Very Low',   demand: 'High',       profitability: 3, reasoning: 'Alluvial soil\'s natural fertility supports lentil with minimal inputs. Rising dal prices benefit farmers.' },
            medium: { crop: 'Wheat',              icon: '🌾', profit: '₹22,000-30,000/acre', duration: '110-120 days',       water: 'Moderate',   demand: 'Stable',     profitability: 4, reasoning: 'Alluvial soil is India\'s wheat heartland. Procurement by FCI at MSP guaranteed.' },
            high:   { crop: 'Strawberry',         icon: '🍓', profit: '₹1,20,000-2,00,000/acre', duration: '5-6 months',    water: 'Moderate',   demand: 'Premium',    profitability: 5, reasoning: 'High-tech cultivation with plastic mulch and drip generates extraordinary returns. Direct selling to supermarkets possible.' }
        },
        sandy: {
            low:    { crop: 'Barley',             icon: '🌾', profit: '₹8,000-12,000/acre',  duration: '90-100 days',        water: 'Very Low',   demand: 'Moderate',   profitability: 3, reasoning: 'Most drought-tolerant rabi cereal. Growing craft beer industry increasing prices. Sandy soil gives best grain quality.' },
            medium: { crop: 'Isabgol (Psyllium)', icon: '🌿', profit: '₹20,000-35,000/acre', duration: '100-110 days',       water: 'Low',        demand: 'Very High',  profitability: 5, reasoning: 'Perfectly adapted to sandy loam soils. 90% of world supply comes from India. Pharmaceutical export demand keeps prices high.' },
            high:   { crop: 'Cumin (Jeera)',      icon: '🌾', profit: '₹30,000-60,000/acre', duration: '100-120 days',       water: 'Very Low',   demand: 'Very High',  profitability: 5, reasoning: 'King of spices for sandy soil. India supplies 80% of world cumin. Export and domestic demand is perennially strong.' }
        }
    },
    zaid: {
        black: {
            low:    { crop: 'Urad (Black Gram)',  icon: '🫘', profit: '₹10,000-14,000/acre', duration: '65-75 days',         water: 'Low',        demand: 'High',       profitability: 3, reasoning: 'Short-season urad fits the summer gap perfectly. Black soil residual moisture reduces irrigation need.' },
            medium: { crop: 'Moong (Summer)',     icon: '🫛', profit: '₹14,000-20,000/acre', duration: '60-70 days',         water: 'Low',        demand: 'High',       profitability: 4, reasoning: 'Summer moong on black soil uses residual moisture efficiently. Premium green grain prices in summer.' },
            high:   { crop: 'Cucumber',           icon: '🥒', profit: '₹25,000-45,000/acre', duration: '55-70 days',         water: 'Moderate',   demand: 'High',       profitability: 4, reasoning: 'Warm weather cucumber with drip irrigation gives excellent yield. Hotel and restaurant demand is consistent.' }
        },
        red: {
            low:    { crop: 'Cowpea',             icon: '🫘', profit: '₹8,000-12,000/acre',  duration: '60-75 days',         water: 'Low',        demand: 'Moderate',   profitability: 3, reasoning: 'Cowpea excels on red soil in summer. Dual purpose (grain + fodder) adds value. Nitrogen fixation improves soil.' },
            medium: { crop: 'Bottle Gourd',       icon: '🥬', profit: '₹20,000-35,000/acre', duration: '55-65 days',         water: 'Moderate',   demand: 'High',       profitability: 4, reasoning: 'Summer vegetables have high demand when other crops are scarce. Short cycle + high price = excellent ROI.' },
            high:   { crop: 'Capsicum',           icon: '🫑', profit: '₹40,000-70,000/acre', duration: '70-90 days',         water: 'Moderate',   demand: 'High',       profitability: 5, reasoning: 'Protected cultivation capsicum on red soil gives premium returns. Export quality colored capsicum commands ₹60-100/kg.' }
        },
        alluvial: {
            low:    { crop: 'Sesame (Til)',       icon: '🌿', profit: '₹8,000-14,000/acre',  duration: '75-90 days',         water: 'Very Low',   demand: 'Growing',    profitability: 3, reasoning: 'Perfectly adapted to summer heat. Oil industry and sweets demand is growing. Low input requirements.' },
            medium: { crop: 'Bitter Gourd',       icon: '🥒', profit: '₹18,000-30,000/acre', duration: '60-75 days',         water: 'Moderate',   demand: 'High',       profitability: 4, reasoning: 'Medicinal vegetable with year-round demand. Urban health-conscious consumers drive premium pricing.' },
            high:   { crop: 'Muskmelon',          icon: '🍈', profit: '₹30,000-55,000/acre', duration: '80-100 days',        water: 'Moderate',   demand: 'High',       profitability: 4, reasoning: 'Summer melon on alluvial soil near water source gives exceptional quality. Direct sale to urban markets at premium prices.' }
        },
        sandy: {
            low:    { crop: 'Cluster Bean (Guar)', icon: '🌿', profit: '₹8,000-14,000/acre', duration: '70-90 days',         water: 'Very Low',   demand: 'Growing',    profitability: 3, reasoning: 'Drought warrior for sandy soil. Guar gum used in oil drilling, food, pharma. India exports ₹3,000+ crore guar gum annually.' },
            medium: { crop: 'Watermelon',         icon: '🍉', profit: '₹22,000-40,000/acre', duration: '70-90 days',         water: 'Moderate',   demand: 'Very High',  profitability: 4, reasoning: 'Sandy soil + hot summer = premium quality. Natural heat stress produces sweeter fruit. Rapid market clearance.' },
            high:   { crop: 'Mango (Grafted)',    icon: '🥭', profit: '₹80,000-2,00,000/acre', duration: '3-4 years to fruit', water: 'Low',     demand: 'Very High',  profitability: 5, reasoning: 'Transformational long-term investment. Alphonso, Kesar varieties command premium export prices. 30-40 year productive life.' }
        }
    }
};

function getAlternatives(season, soil, investment) {
    const investments = ['low', 'medium', 'high'];
    const alts = [];
    investments.forEach(inv => {
        if (inv !== investment && cropRecommendations[season]?.[soil]?.[inv]) {
            const r = cropRecommendations[season][soil][inv];
            alts.push({ crop: r.crop, icon: r.icon, profit: r.profit, investment: inv });
        }
    });
    return alts;
}

function getProfitabilityStars(level) {
    const stars = '⭐'.repeat(level);
    const labels = { 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return stars + ' ' + (labels[level] || 'Good');
}

/* ── Save crop advice to Supabase ── */
async function saveCropAdviceToSupabase(season, soil, investment, crop, profit) {
    try {
        if (!supabaseClient) return;
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session?.user) return; // Not logged in — skip silently

        const { error } = await supabaseClient.from('crop_advisor_history').insert({
            user_id:          session.user.id,
            season:           season,
            soil_type:        soil,
            investment:       investment,
            recommended_crop: crop,
            expected_profit:  profit
        });

        if (error) {
            console.warn('[AgriHub] Could not save crop advice:', error.message);
        } else {
            showToast('Crop advice saved to your dashboard! 🌱', 'success');
        }
    } catch (e) {
        console.warn('[AgriHub] Save crop advice error:', e.message);
    }
}

const cropAdvisorTranslations = {
    crops: {
        'Soybean': { hi: 'सोयाबीन', mr: 'सोयाबीन' },
        'Cotton': { hi: 'कपास', mr: 'कापूस' },
        'Sugarcane': { hi: 'गन्ना', mr: 'ऊस' },
        'Groundnut': { hi: 'मूंगफली', mr: 'भुईमूग' },
        'Maize': { hi: 'मक्का', mr: 'मका' },
        'Tomato': { hi: 'टमाटर', mr: 'टोमॅटो' },
        'Paddy (Rice)': { hi: 'धान / चावल', mr: 'भात / तांदूळ' },
        'Moong (Green Gram)': { hi: 'मूंग दाल', mr: 'मूग' },
        'Banana': { hi: 'केला', mr: 'केळी' },
        'Bajra (Pearl Millet)': { hi: 'बाजरा', mr: 'बाजरी' },
        'Watermelon': { hi: 'तरबूज', mr: 'कलिंगड' },
        'Pomegranate': { hi: 'अनार', mr: 'डाळिंब' },
        'Chickpea (Chana)': { hi: 'चना', mr: 'हरभरा' },
        'Wheat': { hi: 'गेहूं', mr: 'गहू' },
        'Safflower': { hi: 'कुसुम', mr: 'करडई' },
        'Mustard': { hi: 'सरसों', mr: 'मोहरी' },
        'Sunflower': { hi: 'सूरजमुखी', mr: 'सूर्यफूल' },
        'Potato': { hi: 'आलू', mr: 'बटाटा' },
        'Lentil (Masoor)': { hi: 'मसूर', mr: 'मसूर' },
        'Strawberry': { hi: 'स्ट्रॉबेरी', mr: 'स्ट्रॉबेरी' },
        'Barley': { hi: 'जौ', mr: 'जव' },
        'Isabgol (Psyllium)': { hi: 'इसबगोल', mr: 'इसबगोल' },
        'Cumin (Jeera)': { hi: 'जीरा', mr: 'जिरे' },
        'Urad (Black Gram)': { hi: 'उड़द दाल', mr: 'उडीद' },
        'Moong (Summer)': { hi: 'ग्रीष्मकालीन मूंग', mr: 'उन्हाळी मूग' },
        'Cucumber': { hi: 'खीरा / ककड़ी', mr: 'काकडी' },
        'Cowpea': { hi: 'लोबिया (चौलाई)', mr: 'चवळी' },
        'Bottle Gourd': { hi: 'लौकी', mr: 'दुधी भोपळा' },
        'Capsicum': { hi: 'शिमला मिर्च', mr: 'ढोबळी मिरची' },
        'Sesame (Til)': { hi: 'तिल', mr: 'तीळ' },
        'Bitter Gourd': { hi: 'करेला', mr: 'कारले' },
        'Muskmelon': { hi: 'खरबूजा', mr: 'खरबूज' },
        'Cluster Bean (Guar)': { hi: 'ग्वार फली', mr: 'गवार' },
        'Mango (Grafted)': { hi: 'कलमी आम', mr: 'कलमी आंबा' }
    },
    water: {
        'Very Low': { hi: 'बहुत कम', mr: 'अतिशय कमी' },
        'Low': { hi: 'कम', mr: 'कमी' },
        'Low-Moderate': { hi: 'कम से मध्यम', mr: 'कमी ते मध्यम' },
        'Moderate': { hi: 'मध्यम', mr: 'मध्यम' },
        'High': { hi: 'अधिक', mr: 'जास्त' },
        'Very High': { hi: 'अत्यधिक', mr: 'फार जास्त' }
    },
    demand: {
        'Stable': { hi: 'स्थिर मांग', mr: 'स्थिर मागणी' },
        'Moderate': { hi: 'मध्यम मांग', mr: 'मध्यम मागणी' },
        'High': { hi: 'उच्च मांग', mr: 'जास्त मागणी' },
        'Very High': { hi: 'अत्यधिक मांग', mr: 'फार मोठी मागणी' },
        'Growing': { hi: 'बढ़ती मांग', mr: 'वाढती मागणी' },
        'Premium': { hi: 'प्रीमियम (सर्वोच्च)', mr: 'प्रीमियम भाव' }
    },
    profitLevel: {
        3: { hi: 'अच्छा', mr: 'चांगले' },
        4: { hi: 'बहुत अच्छा', mr: 'उत्कृष्ट' },
        5: { hi: 'सर्वोत्तम लाभ', mr: 'सर्वाधिक नफा' }
    }
};

let activeAdvisorState = null;

function renderAdvisorResult(rec, selected) {
    const lang = (window.AgriHubI18n ? window.AgriHubI18n.getLang() : (localStorage.getItem('agrihub_lang') || 'en'));
    const localizedCrop = (cropAdvisorTranslations.crops[rec.crop] && cropAdvisorTranslations.crops[rec.crop][lang]) || rec.crop;
    const localizedWater = (cropAdvisorTranslations.water[rec.water] && cropAdvisorTranslations.water[rec.water][lang]) || rec.water;
    const localizedDemand = (cropAdvisorTranslations.demand[rec.demand] && cropAdvisorTranslations.demand[rec.demand][lang]) || rec.demand;
    
    const stars = '⭐'.repeat(rec.profitability);
    const starLabel = (cropAdvisorTranslations.profitLevel[rec.profitability] && cropAdvisorTranslations.profitLevel[rec.profitability][lang]) ||
                      (rec.profitability === 5 ? 'Excellent' : rec.profitability === 4 ? 'Very Good' : 'Good');

    document.getElementById('recCropIcon').textContent    = rec.icon;
    document.getElementById('recCropName').textContent    = localizedCrop;
    document.getElementById('recProfitability').textContent = `${stars} ${starLabel}`;
    document.getElementById('recDuration').textContent    = rec.duration;
    document.getElementById('recWater').textContent       = localizedWater;
    document.getElementById('recProfit').textContent      = rec.profit;
    document.getElementById('recDemand').textContent      = localizedDemand;
    document.getElementById('recReasoning').textContent   = rec.reasoning;

    const alts = getAlternatives(selected.season, selected.soil, selected.investment);
    const altContainer = document.getElementById('altCrops');
    altContainer.innerHTML = alts.map(a => {
        const altName = (cropAdvisorTranslations.crops[a.crop] && cropAdvisorTranslations.crops[a.crop][lang]) || a.crop;
        return `<div class="alt-crop-chip">${a.icon} ${altName} <small>(${a.investment}: ${a.profit})</small></div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const form      = document.getElementById('advisorForm');
    const submitBtn = document.getElementById('advisorSubmit');
    const resultDiv = document.getElementById('advisorResult');
    const resetBtn  = document.getElementById('resetAdvisor');
    let selected = { season: null, soil: null, investment: null };

    // Live update on language switch
    window.addEventListener('agrihub:languageChanged', () => {
        if (activeAdvisorState && resultDiv && !resultDiv.classList.contains('hidden')) {
            renderAdvisorResult(activeAdvisorState.rec, activeAdvisorState.selected);
        }
    });

    // Option card selection
    document.querySelectorAll('.option-cards').forEach(group => {
        group.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const value = card.dataset.value;
                if (group.id === 'seasonOptions')     { selected.season = value;     updateStep(1); }
                if (group.id === 'soilOptions')       { selected.soil = value;       updateStep(2); }
                if (group.id === 'investmentOptions') { selected.investment = value; updateStep(3); }
                submitBtn.disabled = !(selected.season && selected.soil && selected.investment);
            });
        });
    });

    function updateStep(completedStep) {
        document.querySelectorAll('.step').forEach(s => {
            const stepNum = parseInt(s.dataset.step);
            s.classList.toggle('active', stepNum <= completedStep);
        });
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selected.season || !selected.soil || !selected.investment) return;

        const rec = cropRecommendations[selected.season]?.[selected.soil]?.[selected.investment];
        if (!rec) { showToast('No recommendation found for this combination.', 'error'); return; }

        activeAdvisorState = { rec, selected: { ...selected } };
        renderAdvisorResult(rec, selected);

        resultDiv.classList.remove('hidden');
        form.classList.add('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Recommendation ready! 🤖', 'success');

        // Save to Supabase in background
        await saveCropAdviceToSupabase(
            selected.season, selected.soil, selected.investment,
            rec.crop, rec.profit
        );
    });

    resetBtn?.addEventListener('click', () => {
        form.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        activeAdvisorState = null;
        selected = { season: null, soil: null, investment: null };
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.querySelector('.step[data-step="1"]')?.classList.add('active');
        submitBtn.disabled = true;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
