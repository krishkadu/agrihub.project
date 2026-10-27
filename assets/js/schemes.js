/* ═══════════════════════════════════════════════
   AgriHub — Government Schemes Data & Logic
   Includes bookmark/save to Supabase saved_schemes
   ═══════════════════════════════════════════════ */

const governmentSchemes = [
    { id: 1,  title: "PM-Kisan Samman Nidhi",           category: "subsidy",    icon: "🌾", description: "₹6,000 per year income support to all landholding farmers' families, transferred in 3 installments of ₹2,000 directly to bank accounts.",                                                                              benefit: "₹6,000/year",                  eligibility: "All landholding farmers",                      ministry: "Ministry of Agriculture",                     link: "https://www.pmkisan.gov.in/",                                          badge: "Popular" },
    { id: 2,  title: "PM Fasal Bima Yojana",             category: "insurance",  icon: "🛡️", description: "Crop insurance providing financial support to farmers when crops fail due to unforeseen events like natural calamities, pests, and diseases.",                                                                         benefit: "Up to full sum insured",        eligibility: "All farmers growing notified crops",           ministry: "Ministry of Agriculture",                     link: "https://pmfby.gov.in/",                                                badge: "Important" },
    { id: 3,  title: "PM-KUSUM Scheme",                  category: "technology", icon: "☀️", description: "Solar pump installation with 60% central + state subsidy for irrigation. Helps farmers reduce electricity costs and earn extra income by selling solar power.",                                                        benefit: "60% subsidy on solar pumps",   eligibility: "Individual farmers, FPOs, Cooperatives",      ministry: "Ministry of New and Renewable Energy",        link: "https://mnre.gov.in/solar/schemes/",                                   badge: "New" },
    { id: 4,  title: "e-NAM (Electronic NAM)",           category: "market",     icon: "🏪", description: "Online national agricultural marketplace connecting farmers directly to buyers across India for transparent price discovery and better market access.",                                                                  benefit: "Better price discovery",       eligibility: "All farmers with registered produce",          ministry: "Ministry of Agriculture",                     link: "https://enam.gov.in/",                                                 badge: null },
    { id: 5,  title: "Kisan Credit Card (KCC)",          category: "credit",     icon: "💳", description: "Short-term credit for crop cultivation needs at subsidized interest rates of 4-7% per annum. Covers seeds, fertilizers, pesticides, and other farm expenses.",                                                       benefit: "Credit @ 4-7% interest",      eligibility: "All farmers, sharecroppers",                   ministry: "Ministry of Finance (via NABARD)",            link: "https://www.nabard.org/content1.aspx?id=593",                          badge: null },
    { id: 6,  title: "Soil Health Card Scheme",          category: "technology", icon: "🧪", description: "Free soil testing and customized fertilizer recommendations through Soil Health Cards (SHC) issued by state agriculture departments every 2 years.",                                                                   benefit: "Free soil testing",            eligibility: "All farmers",                                  ministry: "Ministry of Agriculture",                     link: "https://soilhealth.dac.gov.in/",                                       badge: null },
    { id: 7,  title: "National Agriculture Market",      category: "market",     icon: "🌐", description: "Integration of all state APMCs for single national market, enabling pan-India trade of agri-commodities with unified market fees and procedures.",                                                                     benefit: "Pan-India market access",      eligibility: "Licensed traders and farmers",                 ministry: "Ministry of Agriculture",                     link: "https://enam.gov.in/",                                                 badge: null },
    { id: 8,  title: "PMKSY (Irrigation)",               category: "subsidy",    icon: "💧", description: "Har Khet Ko Pani — extends irrigation coverage with subsidies on micro-irrigation (drip and sprinkler) at 55% (general) to 45% (large farmers).",                                                                   benefit: "55% subsidy on drip/sprinkler", eligibility: "Small & marginal farmers (55%), Others (45%)", ministry: "Ministry of Jal Shakti",                      link: "https://pmksy.gov.in/",                                                badge: null },
    { id: 9,  title: "RKVY (Rashtriya Krishi Vikas Yojana)", category: "subsidy", icon: "📋", description: "Agriculture Development Scheme for enhancing investments in Agriculture and Allied Sectors, ensuring holistic development through state-specific projects.",                                                            benefit: "Project-based grants",         eligibility: "State government-approved projects",           ministry: "Ministry of Agriculture",                     link: "https://rkvy.nic.in/",                                                 badge: null },
    { id: 10, title: "National Food Security Mission",   category: "subsidy",    icon: "🍚", description: "Area expansion and productivity enhancement of rice, wheat, pulses, coarse cereals and nutri-cereals. Provides quality seeds and modern farm implements.",                                                             benefit: "Subsidized seeds & implements", eligibility: "Farmers in targeted districts",                ministry: "Ministry of Agriculture",                     link: "https://nfsm.gov.in/",                                                 badge: null },
    { id: 11, title: "Agri Infrastructure Fund",         category: "credit",     icon: "🏗️", description: "₹1 lakh crore medium-long term financing facility for post-harvest management infrastructure including cold storage, warehouses, processing units.",                                                                  benefit: "Loans at 3% interest subsidy", eligibility: "FPOs, SHGs, Agri-entrepreneurs, Cooperatives", ministry: "Ministry of Agriculture",                     link: "https://agriinfra.dac.gov.in/",                                        badge: "New" },
    { id: 12, title: "Paramparagat Krishi Vikas Yojana", category: "subsidy",    icon: "🌿", description: "Organic farming promotion scheme — ₹50,000 per hectare over 3 years for transitioning to certified organic farming with market linkage support.",                                                                    benefit: "₹50,000/hectare over 3 years", eligibility: "Farmers willing to adopt organic farming",     ministry: "Ministry of Agriculture",                     link: "https://pgsindia-ncof.gov.in/PKVY/Index.aspx",                         badge: null },
    { id: 13, title: "PM Kisan Maandhan Yojana",         category: "subsidy",    icon: "👴", description: "Pension scheme for small and marginal farmers — ₹3,000/month pension after age 60 with equal contribution from government during working years.",                                                                    benefit: "₹3,000/month pension at 60",  eligibility: "Farmers aged 18-40, landholding <2 ha",        ministry: "Ministry of Agriculture",                     link: "https://maandhan.in/",                                                 badge: null },
    { id: 14, title: "National Horticulture Mission",    category: "subsidy",    icon: "🍎", description: "Holistic development of horticulture sector with subsidy on establishment of orchards, greenhouses, shade nets, and micro-irrigation for fruits and vegetables.",                                                     benefit: "25-50% subsidy on infrastructure", eligibility: "Horticulture farmers",                      ministry: "Ministry of Agriculture",                     link: "https://nhm.nic.in/",                                                  badge: null },
    { id: 15, title: "PMFME (Food Processing)",          category: "technology", icon: "🏭", description: "PM Formalization of Micro Food Processing Enterprises — credit-linked subsidy at 35% (max ₹10 lakh) for individual micro food processing units.",                                                                    benefit: "35% subsidy (max ₹10 lakh)",  eligibility: "Micro food processing enterprises",            ministry: "Ministry of Food Processing Industries",      link: "https://pmfme.mofpi.gov.in/",                                          badge: "New" }
];

/* ── Track saved scheme IDs for this session ── */
const savedSchemeIds = new Set();

/* ── Load already-saved schemes from Supabase on page load ── */
async function loadSavedSchemeIds() {
    try {
        if (!supabaseClient) return;
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabaseClient
            .from('saved_schemes')
            .select('scheme_name')
            .eq('user_id', session.user.id);

        if (!error && data) {
            data.forEach(row => savedSchemeIds.add(row.scheme_name));
            // Update button states for already-saved schemes
            document.querySelectorAll('.btn-save-scheme').forEach(btn => {
                if (savedSchemeIds.has(btn.dataset.schemeName)) {
                    btn.textContent = '✅ Saved';
                    btn.disabled = true;
                    btn.classList.add('saved');
                }
            });
        }
    } catch (e) {
        console.warn('[AgriHub] Could not load saved scheme IDs:', e.message);
    }
}

/* ── Save a scheme to Supabase ── */
async function saveScheme(scheme, btn) {
    try {
        if (!supabaseClient) {
            showToast('Please login to save schemes.', 'error');
            return;
        }
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session?.user) {
            showToast('Please login to save schemes. 🔐', 'error');
            return;
        }

        btn.textContent = '⏳ Saving...';
        btn.disabled = true;

        const { error } = await supabaseClient.from('saved_schemes').insert({
            user_id:          session.user.id,
            scheme_name:      scheme.title,
            scheme_description: scheme.description,
            apply_url:        scheme.link
        });

        if (error) {
            if (error.message?.includes('duplicate') || error.code === '23505') {
                btn.textContent = '✅ Saved';
                btn.classList.add('saved');
                showToast('Already saved!', 'info');
            } else {
                btn.textContent = '🔖 Save';
                btn.disabled = false;
                console.warn('[AgriHub] Could not save scheme:', error.message);
                showToast('Could not save scheme. Try again.', 'error');
            }
        } else {
            btn.textContent = '✅ Saved';
            btn.classList.add('saved');
            savedSchemeIds.add(scheme.title);
            showToast(`"${scheme.title}" saved to dashboard! 🏛️`, 'success');
        }
    } catch (e) {
        btn.textContent = '🔖 Save';
        btn.disabled = false;
        console.warn('[AgriHub] Save scheme error:', e.message);
        showToast('Could not save scheme. Please try again.', 'error');
    }
}

/* ── Multilingual Localization Map for Government Schemes ── */
const schemeTranslations = {
    1: {
        hi: { title: "पीएम-किसान सम्मान निधि", description: "सभी भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष आय सहायता, 3 किस्तों में ₹2,000 सीधे बैंक खातों में।", benefit: "₹6,000/वर्ष", eligibility: "सभी भूमिधारक किसान", ministry: "कृषि एवं किसान कल्याण मंत्रालय" },
        mr: { title: "पीएम-किसान सन्मान निधी", description: "सर्व खातेदार शेतकरी कुटुंबांना दरवर्षी ₹6,000 थेट बँक खात्यात 3 हप्त्यांमध्ये मिळतात.", benefit: "₹6,000/वर्ष", eligibility: "सर्व शेतजमीनधारक शेतकरी", ministry: "कृषी मंत्रालय" }
    },
    2: {
        hi: { title: "प्रधानमंत्री फसल बीमा योजना", description: "प्राकृतिक आपदाओं, कीटों और बीमारियों से फसल नष्ट होने पर किसानों को वित्तीय सुरक्षा एवं क्षतिपूर्ति।", benefit: "बीमित राशि तक पूरा क्लेम", eligibility: "अधिसूचित फसलें उगाने वाले किसान", ministry: "कृषि मंत्रालय" },
        mr: { title: "प्रधानमंत्री पीक विमा योजना", description: "नैसर्गिक आपत्ती, कीड व रोगांमुळे पिकाचे नुकसान झाल्यास आर्थिक भरपाई.", benefit: "विमा संरक्षित रक्कम", eligibility: "अधिसूचित पिके घेणारे शेतकरी", ministry: "कृषी मंत्रालय" }
    },
    3: {
        hi: { title: "पीएम-कुसुम सौर पंप योजना", description: "सिंचाई हेतु सौर पंप लगाने पर 60% तक सरकारी सब्सिडी। बिजली बिल में बचत और सौर ऊर्जा बेचकर अतिरिक्त आय।", benefit: "सौर पंप पर 60% सब्सिडी", eligibility: "व्यक्तिगत किसान, FPO, सहकारी समितियां", ministry: "नवीन और नवीकरणीय ऊर्जा मंत्रालय" },
        mr: { title: "पीएम-कुसुम सौर कृषी पंप योजना", description: "सिंचनासाठी सौर पंपावर 60% शासकीय अनुदान आणि वीज विक्रीतून अतिरिक्त उत्पन्न.", benefit: "सौर पंपावर 60% अनुदान", eligibility: "शेतकरी, शेतकरी उत्पादक कंपन्या (FPO)", ministry: "ऊर्जा मंत्रालय" }
    },
    4: {
        hi: { title: "ई-नाम (राष्ट्रीय कृषि बाजार)", description: "पारदर्शी मूल्य और बेहतर बाजार पहुंच के लिए पूरे भारत के खरीदारों से सीधे जोड़ने वाला राष्ट्रीय डिजिटल बाजार।", benefit: "पारदर्शी और बेहतर भाव", eligibility: "पंजीकृत उपज वाले सभी किसान", ministry: "कृषि मंत्रालय" },
        mr: { title: "ई-नाम (राष्ट्रीय कृषी बाजार)", description: "शेतमालाला चांगला भाव मिळण्यासाठी संपूर्ण देशभरातील खरेदीदारांशी थेट जोडणारे ऑनलाइन व्यासपीठ.", benefit: "पारदर्शक बाजारभाव", eligibility: "नोंदणीकृत शेतमाल उत्पादक", ministry: "कृषी मंत्रालय" }
    },
    5: {
        hi: { title: "किसान क्रेडिट कार्ड (KCC)", description: "4-7% की रियायती ब्याज दर पर फसल ऋण। बीज, उर्वरक, कीटनाशक और खेती के खर्चों के लिए तुरंत साख।", benefit: "4-7% ब्याज पर सस्ता ऋण", eligibility: "सभी किसान, बटाईदार व पशुपालक", ministry: "वित्त मंत्रालय (नाबार्ड)" },
        mr: { title: "किसान क्रेडिट कार्ड (केसीसी)", description: "4-7% सवलतीच्या व्याजदराने पीक कर्ज. बियाणे, खते व शेती खर्चासाठी तत्काळ पत.", benefit: "4-7% व्याजदराने कर्ज", eligibility: "सर्व शेतकरी व कुळ शेतकरी", ministry: "वित्त मंत्रालय / नाबार्ड" }
    },
    6: {
        hi: { title: "मृदा स्वास्थ्य कार्ड योजना", description: "हर 2 साल में मुफ्त मिट्टी परीक्षण और पोषक तत्वों के आधार पर उर्वरकों की वैज्ञानिक सिफारिश।", benefit: "मुफ्त मिट्टी परीक्षण", eligibility: "सभी किसान", ministry: "कृषि मंत्रालय" },
        mr: { title: "माती आरोग्य पत्रिका योजना", description: "दर 2 वर्षांनी मोफत माती परीक्षण आणि संतुलित खत व्यवस्थापनासाठी शिफारशी.", benefit: "मोफत माती परीक्षण", eligibility: "सर्व शेतकरी", ministry: "कृषी मंत्रालय" }
    },
    7: {
        hi: { title: "राष्ट्रीय कृषि बाजार (एकीकृत मंडी)", description: "एकीकृत बाजार शुल्क और प्रक्रियाओं के साथ कृषि जिंसों के अखिल भारतीय व्यापार की सुविधा।", benefit: "अखिल भारतीय बाजार पहुंच", eligibility: "लाइसेंस प्राप्त व्यापारी व किसान", ministry: "कृषि मंत्रालय" },
        mr: { title: "राष्ट्रीय कृषी बाजार एकात्मिक प्रणाली", description: "एकीकृत बाजार शुल्कासह देशपातळीवर कृषी मालाची थेट खरेदी-विक्री.", benefit: "देशव्यापी बाजारपेठ", eligibility: "परवानाधारक व्यापारी व शेतकरी", ministry: "कृषी मंत्रालय" }
    },
    8: {
        hi: { title: "पीएम कृषि सिंचाई योजना (हर खेत को पानी)", description: "ड्रिप और स्प्रिंकलर सूक्ष्म सिंचाई उपकरणों पर 45% से 55% तक भारी सरकारी सब्सिडी।", benefit: "ड्रिप/स्प्रिंकलर पर 55% तक सब्सिडी", eligibility: "लघु, सीमांत व अन्य किसान", ministry: "जल शक्ति मंत्रालय" },
        mr: { title: "पंतप्रधान कृषी सिंचन योजना", description: "ठिबक आणि तुषार सिंचन साधनांवर 55% पर्यंत थेट शासकीय अनुदान.", benefit: "ठिबक सिंचनावर 55% अनुदान", eligibility: "अल्प, अत्यल्प व सर्व शेतकरी", ministry: "जलशक्ती मंत्रालय" }
    },
    9: {
        hi: { title: "राष्ट्रीय कृषि विकास योजना (RKVY)", description: "कृषि और संबद्ध क्षेत्रों में समग्र विकास और बुनियादी ढांचे के विस्तार के लिए राज्य-विशिष्ट अनुदान।", benefit: "परियोजना आधारित अनुदान", eligibility: "राज्य स्वीकृत कृषि परियोजनाएं", ministry: "कृषि मंत्रालय" },
        mr: { title: "राष्ट्रीय कृषी विकास योजना", description: "कृषी व संलग्न क्षेत्रांच्या सर्वांगीण विकासासाठी आणि पायाभूत सुविधांसाठी प्रकल्प अनुदान.", benefit: "प्रकल्पनिहाय अनुदान", eligibility: "मान्यताप्राप्त कृषी प्रकल्प", ministry: "कृषी मंत्रालय" }
    },
    10: {
        hi: { title: "राष्ट्रीय खाद्य सुरक्षा मिशन (NFSM)", description: "चावल, गेहूं, दलहन और मोटे अनाजों की उत्पादकता वृद्धि हेतु गुणवत्तापूर्ण बीज और आधुनिक उपकरणों पर छूट।", benefit: "सब्सिडी वाले बीज और उपकरण", eligibility: "लक्षित जिलों के किसान", ministry: "कृषि मंत्रालय" },
        mr: { title: "राष्ट्रीय अन्न सुरक्षा अभियान", description: "भात, गहू, कडधान्ये व तृणधान्यांच्या उत्पादनासाठी सुधारित बियाणे व आधुनिक यंत्रांवर अनुदान.", benefit: "अनुदानित बियाणे व अवजारे", eligibility: "जिल्हास्तरीय शेतकरी गट", ministry: "कृषी मंत्रालय" }
    },
    11: {
        hi: { title: "कृषि अवसंरचना कोष (AIF)", description: "कोल्ड स्टोरेज, वेयरहाउस और प्रोसेसिंग यूनिट जैसी फसल कटाई उपरांत प्रबंधन सुविधाओं के लिए ₹1 लाख करोड़ का कोष।", benefit: "3% ब्याज छूट पर सुलभ ऋण", eligibility: "FPO, स्वयं सहायता समूह, उद्यमी", ministry: "कृषि मंत्रालय" },
        mr: { title: "कृषी पायाभूत सुविधा निधी", description: "शीतगृह, गोदामांची उभारणी व प्रक्रिया उद्योगांसाठी ₹1 लाख कोटींची पत सुविधा.", benefit: "3% व्याज सवलतीसह कर्ज", eligibility: "FPO, बचत गट, कृषी उद्योजक", ministry: "कृषी मंत्रालय" }
    },
    12: {
        hi: { title: "परम्परागत कृषि विकास योजना (PKVY)", description: "प्रमाणित जैविक खेती अपनाने हेतु ₹50,000 प्रति हेक्टेयर (3 वर्षों में) की वित्तीय सहायता और बाजार जुड़ाव।", benefit: "₹50,000/हेक्टेयर (3 वर्षों में)", eligibility: "जैविक खेती अपनाने वाले किसान", ministry: "कृषि मंत्रालय" },
        mr: { title: "परंपरागत कृषी विकास योजना (सेंद्रिय शेती)", description: "सेंद्रिय शेती प्रमाणीकरण व क्लस्टर विकासासाठी ₹50,000 प्रति हेक्टर (3 वर्षात) आर्थिक मदत.", benefit: "₹50,000/हेक्टर (3 वर्षात)", eligibility: "सेंद्रिय शेती करणारे शेतकरी", ministry: "कृषी मंत्रालय" }
    },
    13: {
        hi: { title: "पीएम किसान मानधन योजना", description: "छोटे और सीमांत किसानों के लिए वृद्धावस्था पेंशन योजना — 60 वर्ष की आयु के बाद ₹3,000 प्रति माह सुनिश्चित पेंशन।", benefit: "₹3,000/माह सुनिश्चित पेंशन", eligibility: "18-40 वर्ष के किसान (जमीन < 2 हे.)", ministry: "कृषि मंत्रालय" },
        mr: { title: "पीएम किसान मानधन पेन्शन योजना", description: "अल्पभूधारक शेतकऱ्यांना वयाच्या 60 नंतर ₹3,000 दरमहा हमी पेन्शन योजना.", benefit: "₹3,000/महिना हमी पेन्शन", eligibility: "वय 18-40, जमीन 2 हेक्टरपेक्षा कमी", ministry: "कृषी मंत्रालय" }
    },
    14: {
        hi: { title: "राष्ट्रीय बागवानी मिशन (MIDH)", description: "फलों-सब्जियों के बाग लगाने, ग्रीनहाउस, शेडनेट और कोल्ड चेन बुनियादी ढांचे पर 25-50% सब्सिडी।", benefit: "बुनियादी ढांचे पर 25-50% सब्सिडी", eligibility: "बागवानी उत्पादक किसान", ministry: "कृषि मंत्रालय" },
        mr: { title: "राष्ट्रीय फलोत्पादन अभियान (MIDH)", description: "फळबागा, हरितगृह, शेडनेट आणि पॅकहाऊस उभारणीवर 50% पर्यंत थेट शासकीय अनुदान.", benefit: "उभारणीवर 25-50% अनुदान", eligibility: "फलोत्पादक शेतकरी", ministry: "कृषी मंत्रालय" }
    },
    15: {
        hi: { title: "पीएम सूक्ष्म खाद्य प्रसंस्करण उद्यम (PMFME)", description: "व्यक्तिगत सूक्ष्म खाद्य प्रसंस्करण इकाइयों (आटा, तेल मिल, मसाला आदि) की स्थापना हेतु 35% क्रेडिट सब्सिडी।", benefit: "35% सब्सिडी (अधिकतम ₹10 लाख)", eligibility: "खाद्य प्रसंस्करण सूक्ष्म उद्यमी व किसान", ministry: "खाद्य प्रसंस्करण उद्योग मंत्रालय" },
        mr: { title: "पीएम सूक्ष्म अन्न प्रक्रिया उद्योग योजना", description: "अन्न प्रक्रिया युनिट (डाळ मिल, तेल घाणी, प्रक्रिया) उभारणीसाठी 35% (कमाल ₹10 लाख) अनुदान.", benefit: "35% अनुदान (कमाल ₹10 लाख)", eligibility: "अन्न प्रक्रिया उद्योजक व बचत गट", ministry: "अन्न प्रक्रिया उद्योग मंत्रालय" }
    }
};

const categoryLabels = {
    subsidy:    { en: 'Subsidy', hi: 'सब्सिडी', mr: 'अनुदान' },
    insurance:  { en: 'Insurance', hi: 'बीमा', mr: 'विमा' },
    credit:     { en: 'Credit', hi: 'ऋण', mr: 'कर्ज' },
    market:     { en: 'Market', hi: 'बाजार', mr: 'बाजारपेठ' },
    technology: { en: 'Technology', hi: 'तकनीक', mr: 'तंत्रज्ञान' }
};

const badgeLabels = {
    Popular:   { en: 'Popular', hi: 'लोकप्रिय', mr: 'लोकप्रिय' },
    Important: { en: 'Important', hi: 'महत्वपूर्ण', mr: 'महत्त्वाचे' },
    New:       { en: 'New', hi: 'नई', mr: 'नवीन' }
};

function getLocalizedScheme(scheme, lang) {
    const trans = schemeTranslations[scheme.id]?.[lang];
    return {
        ...scheme,
        title: trans?.title || scheme.title,
        description: trans?.description || scheme.description,
        benefit: trans?.benefit || scheme.benefit,
        eligibility: trans?.eligibility || scheme.eligibility,
        ministry: trans?.ministry || scheme.ministry
    };
}

let activeFilterCategory = 'all';

function renderSchemes(schemes) {
    const grid = document.getElementById('schemesGrid');
    if (!grid) return;

    const lang = (window.AgriHubI18n ? window.AgriHubI18n.getLang() : (localStorage.getItem('agrihub_lang') || 'en'));
    const metaBenefit = lang === 'hi' ? 'मुख्य लाभ: ' : (lang === 'mr' ? 'मुख्य लाभ: ' : 'Benefit: ');
    const metaEligibility = lang === 'hi' ? 'पात्रता: ' : (lang === 'mr' ? 'पात्रता: ' : 'Eligibility: ');
    const metaMinistry = lang === 'hi' ? 'मंत्रालय: ' : (lang === 'mr' ? 'मंत्रालय: ' : 'Ministry: ');
    const applyText = lang === 'hi' ? 'ऑनलाइन आवेदन करें →' : (lang === 'mr' ? 'ऑनलाइन अर्ज करा →' : 'Apply Now →');
    const saveText = lang === 'hi' ? '🔖 सहेजें' : (lang === 'mr' ? '🔖 जतन करा' : '🔖 Save');
    const savedText = lang === 'hi' ? '✅ सहेजा गया' : (lang === 'mr' ? '✅ जतन केले' : '✅ Saved');

    grid.innerHTML = schemes.map(baseScheme => {
        const s = getLocalizedScheme(baseScheme, lang);
        const catLabel = (categoryLabels[s.category] && categoryLabels[s.category][lang]) || s.category;
        const badgeLabel = s.badge ? ((badgeLabels[s.badge] && badgeLabels[s.badge][lang]) || s.badge) : '';

        return `
        <div class="scheme-card ${activeFilterCategory !== 'all' && s.category !== activeFilterCategory ? 'hide' : ''}" data-category="${s.category}" data-scheme-id="${s.id}">
          <div class="scheme-card-header">
            <span class="scheme-icon">${s.icon}</span>
            ${s.badge ? `<span class="scheme-badge scheme-badge--${s.badge}">${badgeLabel}</span>` : ''}
          </div>
          <div class="scheme-card-body">
            <h3 class="scheme-title">${s.title}</h3>
            <span class="scheme-category-tag">${catLabel}</span>
            <p class="scheme-desc">${s.description}</p>
            <div class="scheme-meta">
              <div class="scheme-meta-item"><span class="meta-label">${metaBenefit}</span><span class="meta-value">${s.benefit}</span></div>
              <div class="scheme-meta-item"><span class="meta-label">${metaEligibility}</span><span class="meta-value">${s.eligibility}</span></div>
              <div class="scheme-meta-item"><span class="meta-label">${metaMinistry}</span><span class="meta-value">${s.ministry}</span></div>
            </div>
          </div>
          <div class="scheme-card-footer">
            <a href="${s.link}" target="_blank" rel="noopener noreferrer" class="btn-apply-now">${applyText}</a>
            <button class="btn-save-scheme" data-scheme-id="${s.id}" data-scheme-name="${baseScheme.title}">${savedSchemeIds.has(baseScheme.title) ? savedText : saveText}</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach save button listeners
    grid.querySelectorAll('.btn-save-scheme').forEach(btn => {
        const schemeId = parseInt(btn.dataset.schemeId);
        const scheme   = governmentSchemes.find(s => s.id === schemeId);
        if (!scheme) return;

        if (savedSchemeIds.has(scheme.title)) {
            btn.disabled = true;
            btn.classList.add('saved');
        }

        btn.addEventListener('click', () => saveScheme(scheme, btn));
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilterCategory = btn.dataset.filter;
            document.querySelectorAll('.scheme-card').forEach(card => {
                if (activeFilterCategory === 'all' || card.dataset.category === activeFilterCategory) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('schemeSearch');
    searchInput?.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        document.querySelectorAll('.scheme-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.classList.toggle('hide', query && !text.includes(query));
        });
        if (query) document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderSchemes(governmentSchemes);
    initFilters();
    initSearch();
    loadSavedSchemeIds();

    // Re-render when language is switched
    window.addEventListener('agrihub:languageChanged', () => {
        renderSchemes(governmentSchemes);
    });
});
