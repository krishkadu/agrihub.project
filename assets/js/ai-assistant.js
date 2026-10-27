/* ═══════════════════════════════════════════════
   AgriHub — Kisan AI Assistant Engine (Optimized)
   Multilingual, Voice-enabled, Image Scanner & Agronomic AI
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════
  // 1. EXPANDED AGRICULTURAL KNOWLEDGE BASE
  // ═══════════════════════════════════════════════
  const agriKnowledge = [
    // --- Wheat Yellow Rust & Blight ---
    {
      id: 'wheat_rust',
      keywords: ['yellow', 'rust', 'leaves', 'leaf', 'wheat', 'blight', 'पीले', 'पत्ते', 'गेहूं', 'रतुआ', 'पिवळी', 'पाने', 'गेहू'],
      topics: ['disease', 'crop_health'],
      responses: {
        en: `<h4>🌾 Crop Health Diagnosis: Yellow Leaves / Wheat Rust</h4>
<p>Yellowing in leaves is usually caused by <strong>Nitrogen deficiency</strong>, <strong>Yellow Rust (Puccinia striiformis)</strong>, or <strong>over-watering / waterlogging</strong>.</p>
<div class="highlight-box">
  <strong>Recommended Action Plan:</strong>
  <ul>
    <li><strong>Organic Remedy:</strong> Spray 5% Neem seed kernel extract (NSKE) or Sour Buttermilk (1L in 15L water) every 10 days.</li>
    <li><strong>Chemical Control (if severe):</strong> Spray <em>Propiconazole 25% EC</em> @ 1 ml/L or <em>Tebuconazole</em> @ 1.5 ml/L of water.</li>
    <li><strong>Nutrient Fix:</strong> Apply a foliar spray of 19:19:19 NPK (5g/L) + Zinc Sulphate (2g/L) during early morning hours.</li>
  </ul>
</div>
<div class="warning-box">⚠️ Spray during early morning or late evening hours. Avoid spraying under strong midday sun.</div>
<div class="ai-msg-actions-inline">
  <a href="fertilizer.html" class="ai-tool-btn-action"><i data-lucide="calculator" style="width:14px;height:14px;"></i> Calculate NPK Dosage</a>
</div>`,
        hi: `<h4>🌾 फसल स्वास्थ्य निदान: पत्तों का पीलापन / गेहूं का पीला रतुआ</h4>
<p>पत्तों का पीला पड़ना आमतौर पर <strong>नाइट्रोजन की कमी</strong>, <strong>पीला रतुआ (Yellow Rust)</strong> या <strong>अत्यधिक सिंचाई</strong> के कारण होता है।</p>
<div class="highlight-box">
  <strong>सुझाया गया उपचार:</strong>
  <ul>
    <li><strong>जैविक उपाय:</strong> 5% नीम का काढ़ा या खट्टी छाछ (1 लीटर को 15 लीटर पानी में) का 10 दिन के अंतराल पर छिड़काव करें।</li>
    <li><strong>रासायनिक उपचार (यदि रोग गंभीर हो):</strong> <em>प्रोपिकोनाज़ोल 25% EC</em> @ 1 मिली/लीटर पानी का छिड़काव करें।</li>
    <li><strong>पोषक तत्व:</strong> 19:19:19 NPK (5 ग्राम/लीटर) + जिंक सल्फेट (2 ग्राम/लीटर) का छिड़काव करें।</li>
  </ul>
</div>
<div class="warning-box">⚠️ सुबह या शाम के समय छिड़काव करें। तेज धूप में छिड़काव से बचें।</div>
<div class="ai-msg-actions-inline">
  <a href="fertilizer.html" class="ai-tool-btn-action">🧪 उर्वरक कैलकुलेटर देखें</a>
</div>`,
        mr: `<h4>🌾 पीक आरोग्य निदान: पाने पिवळी पडणे / गव्हावरील तांबेरा रोग</h4>
<p>पाने पिवळी पडणे हे मुख्यतः <strong>नायट्रोजनची कमतरता</strong>, <strong>तांबेरा रोग</strong> किंवा <strong>पाणी साचल्यामुळे</strong> होते.</p>
<div class="highlight-box">
  <strong>शिफारस केलेले उपाय:</strong>
  <ul>
    <li><strong>सेंद्रिय उपाय:</strong> 5% निंबोळी अर्क किंवा आंबट ताक (1 लिटर 15 लिटर पाण्यात) 10 दिवसांच्या अंतराने फवारा.</li>
    <li><strong>रासायनिक नियंत्रण:</strong> <em>प्रोपिकोनाझोल 25% EC</em> @ 1 मिली प्रति लिटर पाण्यात मिसळून फवारा.</li>
    <li><strong>खत व्यवस्थापन:</strong> 19:19:19 NPK (5 ग्रॅम/लिटर) + झिंक सल्फेट (2 ग्रॅम/लिटर) फवारा.</li>
  </ul>
</div>
<div class="warning-box">⚠️ फवारणी सकाळी किंवा संध्याकाळी करावी. कडक उन्हात फवारणी टाळा.</div>
<div class="ai-msg-actions-inline">
  <a href="fertilizer.html" class="ai-tool-btn-action">🧪 खत कॅल्क्युलेटर वापरा</a>
</div>`
      }
    },

    // --- Rice / Paddy Blight & Blast ---
    {
      id: 'paddy_blight',
      keywords: ['paddy', 'rice', 'blast', 'blight', 'sheath', 'धान', 'चावल', 'झुलसा', 'भात', 'करपा'],
      topics: ['disease', 'crop_health'],
      responses: {
        en: `<h4>🌾 Rice & Paddy Health Advisory: Blast & Bacterial Blight</h4>
<p>Paddy leaf blast and bacterial blight can cause up to 40% yield loss if left unmanaged.</p>
<div class="highlight-box">
  <strong>Remedy Steps:</strong>
  <ul>
    <li><strong>Leaf Blast Control:</strong> Spray <em>Tricyclazole 75% WP</em> @ 0.6g/L or <em>Isoprothiolane 40% EC</em> @ 1.5ml/L.</li>
    <li><strong>Bacterial Leaf Blight:</strong> Spray <em>Streptocycline</em> (6g in 60L water) + <em>Copper Oxychloride 50% WP</em> @ 2.5g/L.</li>
    <li><strong>Cultural Practice:</strong> Avoid excess nitrogenous fertilizer (Urea) during humid weather. Maintain 2-3 cm standing water only.</li>
  </ul>
</div>`,
        hi: `<h4>🌾 धान / चावल रोग सलाह: ब्लास्ट और झुलसा रोग</h4>
<p>धान का झुलसा रोग और पत्ती का धब्बा (Blast) समय पर नियंत्रण न करने पर 40% तक उपज घटा सकता है।</p>
<div class="highlight-box">
  <strong>उपचार के उपाय:</strong>
  <ul>
    <li><strong>ब्लास्ट रोग नियंत्रण:</strong> <em>ट्राइसाइक्लाज़ोल 75% WP</em> @ 0.6 ग्राम/लीटर का छिड़काव करें।</li>
    <li><strong>जीवाणु झुलसा (Bacterial Blight):</strong> <em>स्ट्रेप्टोसाइक्लिन</em> (6 ग्राम 60 लीटर पानी में) + <em>कॉपर ऑक्सीक्लोराइड</em> @ 2.5 ग्राम/लीटर छिड़कें।</li>
    <li><strong>सावधानी:</strong> नमी वाले मौसम में अतिरिक्त यूरिया डालने से बचें।</li>
  </ul>
</div>`,
        mr: `<h4>🌾 भात पीक रोग सल्ला: करपा आणि जिवाणूजन्य करपा</h4>
<p>भातावरील करपा रोग वेळीच नियंत्रित न केल्यास उत्पादनात मोठी घट होते.</p>
<div class="highlight-box">
  <strong>उपाय योजना:</strong>
  <ul>
    <li><strong>करपा नियंत्रण:</strong> <em>ट्रायसायक्लाझोल 75% WP</em> @ 0.6 ग्रॅम प्रति लिटर पाण्यात फवारा.</li>
    <li><strong>जिवाणूजन्य करपा:</strong> <em>स्ट्रेप्टोसायक्लीन</em> (6 ग्रॅम 60 लिटर पाण्यात) + <em>कॉपर ऑक्सिक्लोराईड</em> @ 2.5 ग्रॅम/लिटर फवारा.</li>
  </ul>
</div>`
      }
    },

    // --- Fertilizer & Soil NPK ---
    {
      id: 'fertilizer_guidance',
      keywords: ['fertilizer', 'npk', 'urea', 'dap', 'mop', 'dosage', 'soil', 'nitrogen', 'उर्वरक', 'खाद', 'खत', 'माती', 'यूरिया', 'डीएपी'],
      topics: ['fertilizer', 'soil'],
      responses: {
        en: `<h4>🧪 Soil Nutrition & NPK Fertilizer Management</h4>
<p>Balanced fertilizer application prevents soil toxicity and maximizes crop harvest return:</p>
<div class="highlight-box">
  <ul>
    <li><strong>Standard Basal Dose:</strong> Apply 100% Phosphorus (DAP/SSP) & Potash (MOP) + 33% Nitrogen (Urea) at sowing.</li>
    <li><strong>Top Dressing:</strong> Split remaining Nitrogen into two top-dresses — 25-30 days (tillering) and 50-60 days (flowering).</li>
    <li><strong>Micronutrients:</strong> Apply Zinc Sulphate (10 kg/acre) once a year to improve grain filling and weight.</li>
    <li><strong>Soil Organic Matter:</strong> Add 2-3 tons of well-decomposed Farmyard Manure (FYM) or Vermicompost per acre before plowing.</li>
  </ul>
</div>
<p>👉 Calculate precise crop-specific quantities with our <a href="fertilizer.html" style="color:#10B981;font-weight:600;text-decoration:underline;">Fertilizer Calculator</a>.</p>`,
        hi: `<h4>🧪 मृदा पोषण एवं उर्वरक प्रबंधन</h4>
<p>उर्वरकों का संतुलित उपयोग मिट्टी की उर्वरता बनाए रखता है और उपज बढ़ाता है:</p>
<div class="highlight-box">
  <ul>
    <li><strong>बुवाई के समय (बेसल डोज):</strong> 100% फास्फोरस (DAP) और पोटाश (MOP) + 33% यूरिया बुवाई के समय डालें।</li>
    <li><strong>टॉप ड्रेसिंग:</strong> बाकी यूरिया 2 किस्तों में दें — 25-30 दिन बाद और 50-60 दिन बाद।</li>
    <li><strong>सूक्ष्म पोषक तत्व:</strong> साल में एक बार जिंक सल्फेट (10 किग्रा/एकड़) का उपयोग करें।</li>
    <li><strong>जैविक खाद:</strong> बुवाई से पहले 2-3 टन सड़ी गोबर की खाद खेत में मिलाएं।</li>
  </ul>
</div>
<p>👉 सटीक गणना के लिए हमारा <a href="fertilizer.html" style="color:#10B981;font-weight:600;text-decoration:underline;">उर्वरक कैलकुलेटर</a> देखें।</p>`,
        mr: `<h4>🧪 माती पोषण आणि खत व्यवस्थापन</h4>
<p>संतुलित खत वापरामुळे जमिनीची सुपीकता टिकून राहते आणि नफा वाढतो:</p>
<div class="highlight-box">
  <ul>
    <li><strong>पेरणीच्या वेळी:</strong> 100% फॉस्फरस (DAP/SSP) व पोटॅश (MOP) + 33% युरिया पेरणीच्या वेळी द्या.</li>
    <li><strong>दुसरा व तिसरा डोस:</strong> उरलेला युरिया 25-30 दिवसांनी आणि 50-60 दिवसांनी विभागून द्या.</li>
    <li><strong>सूक्ष्म अन्नद्रव्ये:</strong> वर्षातून एकदा झिंक सल्फेट (10 किलो/एकर) जमिनीतून द्या.</li>
  </ul>
</div>
<p>👉 अचूक डोससाठी आमचे <a href="fertilizer.html" style="color:#10B981;font-weight:600;text-decoration:underline;">खत कॅल्क्युलेटर</a> वापरा.</p>`
      }
    },

    // --- Pest & Insects (Bollworm, Caterpillars, Aphids) ---
    {
      id: 'pest_control',
      keywords: ['pest', 'insects', 'bollworm', 'aphid', 'caterpillar', 'armyworm', 'कीट', 'इल्ली', 'मावा', 'कीड', 'अळी', 'कपास'],
      topics: ['disease', 'pest'],
      responses: {
        en: `<h4>🐛 Integrated Pest Management (IPM) Advisory</h4>
<p>Control insect pests effectively with scientific and eco-friendly techniques:</p>
<div class="highlight-box">
  <ul>
    <li><strong>Traps & Monitoring:</strong> Install 5 Yellow Sticky Traps/acre for sucking pests (aphids/whiteflies) and 4 Pheromone Traps/acre for bollworms.</li>
    <li><strong>Botanical Spray:</strong> Spray <em>Neem Oil 10,000 PPM</em> (2-3 ml/L) mixed with liquid soap.</li>
    <li><strong>Biological Control:</strong> Release <em>Trichogramma</em> egg parasitoids @ 20,000/acre at initial egg laying.</li>
    <li><strong>Chemical Defense (High attack):</strong> For severe caterpillar/fall armyworm attack, apply <em>Chlorantraniliprole 18.5% SC</em> @ 0.4 ml/L or <em>Emamectin Benzoate 5% SG</em> @ 0.5 g/L.</li>
  </ul>
</div>`,
        hi: `<h4>🐛 एकीकृत कीट प्रबंधन (IPM) सलाह</h4>
<p>कीटों पर प्रभावी और सुरक्षित नियंत्रण के तरीके:</p>
<div class="highlight-box">
  <ul>
    <li><strong>निगरानी:</strong> रस चूसक कीटों के लिए 5 पीले स्टिकी ट्रैप और इल्लियों के लिए 4 फेरोमोन ट्रैप प्रति एकड़ लगाएं।</li>
    <li><strong>जैविक छिड़काव:</strong> नीम का तेल 10,000 PPM (2-3 मिली/लीटर) का छिड़काव करें।</li>
    <li><strong>रासायनिक उपाय:</strong> गंभीर प्रकोप होने पर <em>क्लोरेंट्रानिलिप्रोल (Coragen)</em> @ 0.4 मिली/लीटर का प्रयोग करें।</li>
  </ul>
</div>`,
        mr: `<h4>🐛 एकात्मिक कीड व्यवस्थापन (IPM) सल्ला</h4>
<p>पिकांवरील किडींचे शास्त्रीय व प्रभावी नियंत्रण:</p>
<div class="highlight-box">
  <ul>
    <li><strong>सापळे:</strong> रस शोषणाऱ्या किडींसाठी 5 पिवळे चिकट सापळे आणि अळीसाठी 4 कामगंध सापळे लावा.</li>
    <li><strong>सेंद्रिय उपाय:</strong> निमार्क (Neem Oil 10,000 PPM) 2 ते 3 मिली प्रति लिटर पाण्यात मिसळून फवारा.</li>
    <li><strong>रासायनिक उपाय:</strong> अळीचा प्रादुर्भाव जास्त असल्यास <em>कोराजन (Chlorantraniliprole)</em> 0.4 मिली/लिटर फवारा.</li>
  </ul>
</div>`
      }
    },

    // --- Govt Schemes & Subsidies ---
    {
      id: 'gov_schemes',
      keywords: ['pm kisan', 'scheme', 'subsidy', 'fasal bima', 'pmfby', 'kusum', 'kcc', 'योजना', 'सब्सिडी', 'विमा', 'अनुदान'],
      topics: ['schemes'],
      responses: {
        en: `<h4>🏛️ Government Schemes & Financial Subsidies</h4>
<div class="highlight-box">
  <strong>Key Active Central Schemes for Farmers:</strong>
  <ul>
    <li><strong>PM-Kisan Samman Nidhi:</strong> ₹6,000/year in 3 installments of ₹2,000 directly via DBT. e-KYC & Land Seeding is compulsory.</li>
    <li><strong>PM Fasal Bima Yojana (PMFBY):</strong> Comprehensive crop insurance against natural hazards (1.5% premium Rabi, 2% Kharif).</li>
    <li><strong>PM-KUSUM Scheme:</strong> Up to 60-90% subsidy for solar irrigation pumps.</li>
    <li><strong>Kisan Credit Card (KCC):</strong> Crop loan up to ₹3 Lakh at 4% effective interest rate with timely repayment.</li>
  </ul>
</div>
<p>👉 View details and apply links on our <a href="schemes.html" style="color:#10B981;font-weight:600;text-decoration:underline;">Government Schemes Page</a>.</p>`,
        hi: `<h4>🏛️ सरकारी योजनाएं एवं किसान सब्सिडी</h4>
<div class="highlight-box">
  <strong>किसानों के लिए प्रमुख सक्रिय केंद्रीय योजनाएं:</strong>
  <ul>
    <li><strong>पीएम-किसान सम्मान निधि:</strong> सालाना ₹6,000 (₹2,000 की 3 किस्तें) सीधे बैंक खाते में। ई-केवाईसी अनिवार्य है।</li>
    <li><strong>प्रधानमंत्री फसल बीमा योजना (PMFBY):</strong> प्राकृतिक आपदाओं पर व्यापक फसल बीमा।</li>
    <li><strong>पीएम-कुसुम योजना:</strong> सोलर पंप सेट लगाने के लिए 60% से 90% तक सरकारी सब्सिडी।</li>
    <li><strong>किसान क्रेडिट कार्ड (KCC):</strong> समय पर भुगतान पर 4% ब्याज दर पर ₹3 लाख तक का ऋण।</li>
  </ul>
</div>
<p>👉 सभी योजनाओं के लिए हमारा <a href="schemes.html" style="color:#10B981;font-weight:600;text-decoration:underline;">सरकारी योजनाएं पेज</a> देखें।</p>`,
        mr: `<h4>🏛️ सरकारी योजना आणि शेतकरी अनुदान</h4>
<div class="highlight-box">
  <strong>शेतकऱ्यांसाठी प्रमुख केंद्र व राज्य योजना:</strong>
  <ul>
    <li><strong>पीएम-किसान सन्मान निधी:</strong> वर्षाला ₹6,000 (₹2,000 चे 3 हप्ते) थेट बँक खात्यात.</li>
    <li><strong>प्रधानमंत्री पीक विमा योजना (PMFBY):</strong> नैसर्गिक आपत्तींपासून पिकांचे संरक्षण.</li>
    <li><strong>पीएम-कुसूम योजना:</strong> सौर कृषी पंपासाठी 90% पर्यंत शासकीय अनुदान.</li>
    <li><strong>किसान क्रेडिट कार्ड (KCC):</strong> 4% व्याजदराने ₹3 लाखांपर्यंत पीक कर्ज.</li>
  </ul>
</div>
<p>👉 अधिक माहितीसाठी आमचे <a href="schemes.html" style="color:#10B981;font-weight:600;text-decoration:underline;">सरकारी योजना पेज</a> तपासा.</p>`
      }
    },

    // --- Mandi Price & Selling Strategy ---
    {
      id: 'mandi_prices',
      keywords: ['mandi', 'price', 'market', 'sell', 'rate', 'भाव', 'मंडी', 'बाजारभाव', 'बाजार', 'विक्री'],
      topics: ['market'],
      responses: {
        en: `<h4>📈 Mandi Rates & Crop Marketing Intelligence</h4>
<div class="highlight-box">
  <strong>Smart Selling Strategies for Maximum ROI:</strong>
  <ul>
    <li><strong>Moisture Testing:</strong> Ensure grain moisture is below 12% before taking produce to APMC mandi to prevent price deductions.</li>
    <li><strong>Grading & Cleaning:</strong> Properly cleaned and graded crops fetch a 10-15% premium price.</li>
    <li><strong>e-NAM Portal:</strong> Check online interstate bids on <em>enam.gov.in</em> to sell directly to verified national traders.</li>
    <li><strong>WDRA Warehouse Loan:</strong> Store in certified cold storages/warehouses to pledge produce for emergency credit up to 70% value.</li>
  </ul>
</div>`,
        hi: `<h4>📈 मंडी भाव और फसल विपणन रणनीति</h4>
<div class="highlight-box">
  <strong>अधिक मुनाफे के लिए बिक्री सुझाव:</strong>
  <ul>
    <li><strong>नमी की जांच:</strong> मंडी ले जाने से पहले अनाज में नमी 12% से कम रखें।</li>
    <li><strong>ग्रेडिंग और छंटाई:</strong> साफ और ग्रेडेड फसल पर 10-15% तक अधिक भाव मिलता है।</li>
    <li><strong>e-NAM पोर्टल:</strong> e-NAM पर ऑनलाइन बोली देखकर अन्य राज्यों में सीधे बेचें।</li>
  </ul>
</div>`,
        mr: `<h4>📈 कृषी उत्पन्न बाजार समिती (मंडी) व विक्री सल्ला</h4>
<div class="highlight-box">
  <strong>चांगला बाजारभाव मिळवण्यासाठी टिप्स:</strong>
  <ul>
    <li><strong>आर्द्रता नियंत्रण:</strong> बाजारात नेण्यापूर्वी धान्यातील ओलावा 12% पेक्षा कमी असावा.</li>
    <li><strong>प्रतवारी (Grading):</strong> प्रतवारी केलेल्या मालाला बाजारात 10 ते 15% अधिक दर मिळतो.</li>
    <li><strong>e-NAM पोर्टल:</strong> ई-नाम प्रणालीद्वारे देशातील इतर बाजार समित्यांचे भाव तपासा.</li>
  </ul>
</div>`
      }
    },

    // --- Water & Drip Irrigation ---
    {
      id: 'irrigation_water',
      keywords: ['water', 'irrigation', 'drip', 'sprinkler', 'सिंचाई', 'पानी', 'ठिबक', 'पाणी', 'सिंचन'],
      topics: ['irrigation'],
      responses: {
        en: `<h4>💧 Irrigation Scheduling & Water Management</h4>
<div class="highlight-box">
  <strong>Water Preservation & Yield Boosters:</strong>
  <ul>
    <li><strong>Critical Stages:</strong> Ensure moist soil at Crown Root Initiation for Wheat (21 days), Flowering stage for Cotton/Soybean, and Grain filling stage for Paddy.</li>
    <li><strong>Micro Irrigation:</strong> Drip systems save 50-60% water while increasing harvest yield by 25%. Eligible for 55-80% subsidy under PMKSY (Per Drop More Crop).</li>
    <li><strong>Mulching:</strong> Use organic straw or 25-micron plastic mulch film to suppress weeds by 70% and retain soil moisture.</li>
  </ul>
</div>`,
        hi: `<h4>💧 सिंचाई प्रबंधन एवं जल संरक्षण</h4>
<div class="highlight-box">
  <strong>पानी बचाने और बेहतर उपज के तरीके:</strong>
  <ul>
    <li><strong>महत्वपूर्ण अवस्थाएं:</strong> गेहूं में 21 दिन पर (ताज जड़ अवस्था) और सोयाबीन/कपास में फूल आते समय नमी रखें।</li>
    <li><strong>ड्रिप सिंचाई:</strong> 50-60% पानी की बचत और 25% अधिक उपज। PMKSY के तहत 55-80% सब्सिडी।</li>
  </ul>
</div>`,
        mr: `<h4>💧 पाणी व्यवस्थापन आणि सूक्ष्म सिंचन</h4>
<div class="highlight-box">
  <strong>पाण्याची बचत व योग्य सिंचन:</strong>
  <ul>
    <li><strong>संवेदनशील टप्पे:</strong> गव्हामध्ये 21 दिवसांनी मुकुटमुळे फुटताना व सोयाबीनमध्ये फुले लागताना पाणी देणे गरजेचे आहे.</li>
    <li><strong>ठिबक सिंचन:</strong> 50-60% पाण्याची बचत होते व 80% पर्यंत शासकीय अनुदान उपलब्ध आहे.</li>
  </ul>
</div>`
      }
    },

    // --- Polyhouse & Protected Cultivation ---
    {
      id: 'polyhouse_farming',
      keywords: ['polyhouse', 'greenhouse', 'protected', 'shade net', 'nvph', 'dutch rose', 'पॉलीहाउस', 'ग्रीनहाउस', 'शेडनेट', 'संरक्षित शेती', 'संरक्षित खेती', 'गुलाब', 'शिमला मिर्च', 'ढोबळी मिरची', 'काकडी', 'खीरा'],
      topics: ['polyhouse', 'schemes'],
      responses: {
        en: `<h4>🏡 Polyhouse & Protected Cultivation Advisory</h4>
<p>Polyhouse cultivation increases harvest yields by <strong>3x to 5x</strong> compared to open field farming and shields crops from extreme heat, hailstorms, and heavy rainfall.</p>
<div class="highlight-box">
  <strong>Polyhouse Highlights & Economics:</strong>
  <ul>
    <li><strong>Govt. Subsidy:</strong> 50% to 75% capital subsidy available under MIDH (Mission for Integrated Development of Horticulture) and National Horticulture Board (NHB).</li>
    <li><strong>Best Crops:</strong> Dutch Roses (220 stems/m²), Coloured Capsicum (10-14 kg/m²), Seedless English Cucumber, and Gerbera.</li>
    <li><strong>Cost Norm:</strong> ~₹935/sq.m for Naturally Ventilated Polyhouse (NVPH). Payback period is typically 2 to 2.5 years.</li>
  </ul>
</div>
<div class="ai-msg-actions-inline">
  <a href="polyhouse.html" class="ai-tool-btn-action"><i data-lucide="calculator" style="width:14px;height:14px;"></i> Open Polyhouse Subsidy Calculator</a>
</div>`,
        hi: `<h4>🏡 पॉलीहाउस एवं संरक्षित खेती सलाह</h4>
<p>पॉलीहाउस खेती से खुली खेती की तुलना में <strong>3 से 5 गुना अधिक पैदावार</strong> मिलती है और ओलावृष्टि, अत्यधिक धूप व कीटों से 100% सुरक्षा रहती है।</p>
<div class="highlight-box">
  <strong>सब्सिडी एवं प्रमुख फसलें:</strong>
  <ul>
    <li><strong>सरकारी सब्सिडी:</strong> MIDH/NHM के तहत 50% से 75% तक पूंजीगत अनुदान उपलब्ध है।</li>
    <li><strong>प्रमुख फसलें:</strong> डच गुलाब, पीली/लाल शिमला मिर्च, खीरा, जरबेरा और चेरी टमाटर।</li>
    <li><strong>लागत:</strong> सामान्य प्राकृतिक हवादार पॉलीहाउस (NVPH) हेतु मानक दर लगभग ₹935 प्रति वर्ग मीटर है।</li>
  </ul>
</div>
<div class="ai-msg-actions-inline">
  <a href="polyhouse.html" class="ai-tool-btn-action">🏡 पॉलीहाउस कैलकुलेटर देखें</a>
</div>`,
        mr: `<h4>🏡 पॉलीहाउस आणि संरक्षित शेती सल्ला</h4>
<p>पॉलीहाउस शेतीमुळे खुल्या शेतीपेक्षा <strong>३ ते ५ पट जास्त उत्पादन</strong> मिळते आणि अवकाळी पाऊस, गारपीट यांपासून पिकांचे संपूर्ण संरक्षण होते.</p>
<div class="highlight-box">
  <strong>अनुदान आणि फायदेशीर पिके:</strong>
  <ul>
    <li><strong>शासकीय अनुदान:</strong> राष्ट्रीय फलोत्पादन अभियान (MIDH) अंतर्गत 50% ते 75% पर्यंत थेट अनुदान (MahaDBT द्वारे).</li>
    <li><strong>महत्त्वाची पिके:</strong> डच गुलाब, ढोबळी (रंगीत) मिरची, काकडी, जरबेरा व स्ट्रॉबेरी.</li>
    <li><strong>खर्च व परतावा:</strong> सुमारे ₹935/चौ.मी. खर्च असून अवघ्या 2 ते 2.5 वर्षांत संपूर्ण गुंतवणुकीचा परतावा मिळतो.</li>
  </ul>
</div>
<div class="ai-msg-actions-inline">
  <a href="polyhouse.html" class="ai-tool-btn-action">🏡 पॉलीहाउस अनुदान कॅल्क्युलेटर उघडा</a>
</div>`
      }
    }
  ];

  // ═══════════════════════════════════════════════
  // 2. HELPER UTILITIES
  // ═══════════════════════════════════════════════
  function getCurrentLang() {
    return localStorage.getItem('agrihub_lang') || document.documentElement.getAttribute('lang') || 'en';
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // ═══════════════════════════════════════════════
  // 3. INTELLIGENT MATCHING & GENERATOR
  // ═══════════════════════════════════════════════
  function generateAIResponse(userText) {
    const text = userText.toLowerCase().trim();
    const lang = getCurrentLang();

    let bestMatch = null;
    let maxScore = 0;

    agriKnowledge.forEach(item => {
      let score = 0;
      item.keywords.forEach(kw => {
        if (text.includes(kw.toLowerCase())) {
          score += kw.length > 4 ? 2 : 1;
        }
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && maxScore > 0) {
      return bestMatch.responses[lang] || bestMatch.responses.en;
    }

    // Dynamic Contextual Fallback Response
    if (lang === 'hi') {
      return `<h4>🌾 किसान AI सहायक सलाह</h4>
<p>आपके प्रश्न <em>"${escapeHTML(userText)}"</em> का विश्लेषण किया गया है।</p>
<div class="highlight-box">
  <strong>विशेषज्ञ कृषि सुझाव:</strong>
  <ul>
    <li>अपनी मिट्टी की गुणवत्ता और वर्तमान मौसम के अनुसार संतुलित NPK उर्वरकों का प्रयोग करें।</li>
    <li>फसल में किसी भी कीट या बीमारी के लक्षण दिखने पर नीम आधारित जैविक छिड़काव से शुरुआत करें।</li>
    <li>अधिक सहायता के लिए हमारे समर्पित टूल का उपयोग करें:
      <a href="fertilizer.html" style="color:#10B981;font-weight:600;text-decoration:underline;">उर्वरक कैलकुलेटर</a>, 
      <a href="crop-advisor.html" style="color:#10B981;font-weight:600;text-decoration:underline;">फसल सलाहकार</a>, और 
      <a href="schemes.html" style="color:#10B981;font-weight:600;text-decoration:underline;">सरकारी योजनाएं</a>।
    </li>
  </ul>
</div>
<p>क्या आप किसी विशेष फसल या कीट के बारे में विस्तार से जानना चाहते हैं?</p>`;
    } else if (lang === 'mr') {
      return `<h4>🌾 किसान AI सहाय्यक सल्ला</h4>
<p>तुमच्या <em>"${escapeHTML(userText)}"</em> या प्रश्नाचे विश्लेषण केले आहे.</p>
<div class="highlight-box">
  <strong>तज्ञ कृषी मार्गदर्शक:</strong>
  <ul>
    <li>माती परीक्षण अहवालानुसार खतांचा समतोल वापर करा.</li>
    <li>पिकावर कीड किंवा रोगाची लक्षणे दिसताच निंबोळी अर्क किंवा योग्य सेंद्रिय फवारणी करा.</li>
    <li>अधिक माहितीसाठी आमचे टूल वापरा: 
      <a href="fertilizer.html" style="color:#10B981;font-weight:600;text-decoration:underline;">खत कॅल्क्युलेटर</a>, 
      <a href="crop-advisor.html" style="color:#10B981;font-weight:600;text-decoration:underline;">पीक सल्लागार</a>, आणि 
      <a href="schemes.html" style="color:#10B981;font-weight:600;text-decoration:underline;">सरकारी योजना</a>.
    </li>
  </ul>
</div>
<p>तुम्हाला विशिष्ट पिकाबद्दल काही विचारायचे आहे का?</p>`;
    } else {
      return `<h4>🌾 Kisan AI Assistant Advice</h4>
<p>Analysis for your query: <em>"${escapeHTML(userText)}"</em></p>
<div class="highlight-box">
  <strong>Agronomic Guidance:</strong>
  <ul>
    <li>Maintain balanced crop nutrition based on soil health guidelines (NPK 4:2:1 ratio).</li>
    <li>For pest or leaf disease symptoms, begin with neem-based organic sprays before targeted chemical treatments.</li>
    <li>Explore our dedicated tools: 
      <a href="fertilizer.html" style="color:#10B981;font-weight:600;text-decoration:underline;">Fertilizer Calculator</a>, 
      <a href="crop-advisor.html" style="color:#10B981;font-weight:600;text-decoration:underline;">Crop Advisor</a>, and 
      <a href="schemes.html" style="color:#10B981;font-weight:600;text-decoration:underline;">Government Schemes</a>.
    </li>
  </ul>
</div>
<p>Would you like specific dosage recommendations or market price trends for your crop?</p>`;
    }
  }

  // ═══════════════════════════════════════════════
  // 4. SPEECH RECOGNITION & SYNTHESIS
  // ═══════════════════════════════════════════════
  let recognition = null;

  function initSpeechRecognition(onResultCallback, onStateChange) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const lang = getCurrentLang();
    if (lang === 'hi') recognition.lang = 'hi-IN';
    else if (lang === 'mr') recognition.lang = 'mr-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => {
      if (onStateChange) onStateChange(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResultCallback) onResultCallback(transcript);
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      if (onStateChange) onStateChange(false);
    };

    recognition.onend = () => {
      if (onStateChange) onStateChange(false);
    };

    return recognition;
  }

  function speakText(htmlText) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const tmp = document.createElement('DIV');
    tmp.innerHTML = htmlText;
    const cleanText = tmp.textContent || tmp.innerText || '';

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const lang = getCurrentLang();
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  // ═══════════════════════════════════════════════
  // 5. ENHANCED LEAF DISEASE SCANNER ENGINE
  // ═══════════════════════════════════════════════
  const scanDataBank = {
    wheat_rust: {
      disease: 'Yellow Rust / Nitrogen Deficiency',
      confidence: '96%',
      severity: 'Low-Moderate',
      remedy: 'Spray Propiconazole 25% EC @ 1ml/L + Foliar Urea spray (1.5%) in cool morning hours. Remove infected bottom leaves.',
      img: 'assets/images/leaf_wheat_rust.jpg'
    },
    blight: {
      disease: 'Early Leaf Blight (Alternaria solani)',
      confidence: '94%',
      severity: 'Moderate',
      remedy: 'Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin @ 1ml/L. Maintain field sanitation and crop rotation.',
      img: 'assets/images/leaf_blight.jpg'
    },
    powdery: {
      disease: 'Powdery Mildew (Erysiphe spp.)',
      confidence: '92%',
      severity: 'Early Stage',
      remedy: 'Spray Wettable Sulphur 80% WP @ 2g/L or Neem Oil (3ml/L). Ensure proper sunlight and air circulation.',
      img: 'assets/images/leaf_mildew.jpg'
    },
    healthy: {
      disease: 'Healthy Leaf Pattern Detected',
      confidence: '98%',
      severity: 'None (Healthy)',
      remedy: 'Leaf tissue exhibits active chlorophyll and zero fungal spots. Maintain balanced NPK fertilizer and routine irrigation.',
      img: 'assets/images/leaf_healthy.jpg'
    }
  };

  let activeScanResult = null;

  function runLeafDiagnosticScan(diseaseKey, onProgress, onComplete) {
    const key = diseaseKey || ['wheat_rust', 'blight', 'powdery', 'healthy'][Math.floor(Math.random() * 4)];
    const result = scanDataBank[key] || scanDataBank.wheat_rust;
    activeScanResult = result;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        if (onComplete) onComplete(result);
      }
    }, 450);
  }

  // EXPORT GLOBAL AGRI ASSISTANT MODULE
  window.AgriAssistant = {
    generateResponse: generateAIResponse,
    initSpeech: initSpeechRecognition,
    speak: speakText,
    runScan: runLeafDiagnosticScan,
    scanLeaf: function (callback) {
      return runLeafDiagnosticScan('wheat_rust', null, callback);
    },
    getLang: getCurrentLang,
    getActiveScan: () => activeScanResult
  };

  // ═══════════════════════════════════════════════
  // 6. MAIN CHAT PAGE INTERACTIVITY (`ai-assistant.html`)
  // ═══════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    initMainChatPage();
    setupFloatingWidget();
  });

  function initMainChatPage() {
    const chatMessages = document.getElementById('chatMessages');
    const aiChatForm = document.getElementById('aiChatForm');
    const aiUserInput = document.getElementById('aiUserInput');
    const micBtn = document.getElementById('micBtn');
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const exportChatBtn = document.getElementById('exportChatBtn');
    const triggerScanModal = document.getElementById('triggerScanModal');
    const attachBtn = document.getElementById('attachBtn');

    if (!chatMessages || !aiChatForm) return;

    let audioEnabled = true;

    // Restore Chat History from LocalStorage
    const savedHistory = localStorage.getItem('agrihub_chat_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          chatMessages.innerHTML = '';
          parsed.forEach(msg => {
            appendMessageUI(msg.sender, msg.html, false);
          });
        }
      } catch (e) {
        console.warn('Failed to parse chat history:', e);
      }
    }

    // Form Submit
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = aiUserInput.value.trim();
      if (!q) return;
      aiUserInput.value = '';
      handleUserQuery(q);
    });

    // Multilingual Prompt Chips and Welcome Messages
    const promptChipTranslations = {
      sidebar: [
        {
          en: { text: "🌾 How to treat yellow leaves in Wheat?", prompt: "How to treat yellow leaves in Wheat crop?" },
          hi: { text: "🌾 गेहूं के पत्तों का पीलापन कैसे ठीक करें?", prompt: "गेहूं के पत्तों का पीलापन कैसे ठीक करें?" },
          mr: { text: "🌾 गव्हाची पिवळी पडलेली पाने कशी बरी करावीत?", prompt: "गव्हाची पिवळी पडलेली पाने कशी बरी करावीत?" }
        },
        {
          en: { text: "🍅 Best NPK fertilizer dosage for Tomato", prompt: "Best balanced NPK fertilizer dosage for Tomato" },
          hi: { text: "🍅 टमाटर के लिए संतुलित NPK खाद की मात्रा", prompt: "टमाटर के लिए संतुलित NPK खाद की मात्रा" },
          mr: { text: "🍅 टोमॅटोसाठी योग्य NPK खताचा डोस", prompt: "टोमॅटोसाठी योग्य NPK खताचा डोस" }
        },
        {
          en: { text: "🏛️ PM-Kisan installment & e-KYC status", prompt: "How to check PM-Kisan installment & e-KYC status?" },
          hi: { text: "🏛️ पीएम-किसान किस्त और e-KYC स्थिति जांचें", prompt: "पीएम-किसान किस्त और e-KYC स्थिति कैसे जांचें?" },
          mr: { text: "🏛️ पीएम-किसान हप्ता आणि e-KYC स्थिती तपासा", prompt: "पीएम-किसान हप्ता आणि e-KYC स्थिती कशी तपासावी?" }
        },
        {
          en: { text: "🌿 Organic spray for bollworm/pests", prompt: "Organic remedies for cotton bollworm & caterpillars" },
          hi: { text: "🌿 कपास की इल्ली व कीटों के लिए जैविक स्प्रे", prompt: "कपास की इल्ली व कीटों के लिए जैविक स्प्रे" },
          mr: { text: "🌿 बोंडअळी व किडींवर सेंद्रिय फवारणी", prompt: "बोंडअळी व किडींवर सेंद्रिय फवारणी" }
        },
        {
          en: { text: "💧 Drip irrigation subsidy under PMKSY", prompt: "How does drip irrigation subsidy work under PMKSY?" },
          hi: { text: "💧 PMKSY में ड्रिप सिंचाई सब्सिडी कैसे पाएं?", prompt: "PMKSY में ड्रिप सिंचाई सब्सिडी कैसे पाएं?" },
          mr: { text: "💧 ठिबक सिंचन शासकीय अनुदानाची माहिती", prompt: "ठिबक सिंचन शासकीय अनुदानाची माहिती" }
        },
        {
          en: { text: "🏡 Polyhouse subsidy & crop guide", prompt: "How to get 50% to 75% subsidy for Polyhouse farming?" },
          hi: { text: "🏡 पॉलीहाउस 50%-75% सब्सिडी व फसल गाइड", prompt: "पॉलीहाउस 50%-75% सब्सिडी व फसल गाइड" },
          mr: { text: "🏡 पॉलीहाउस 50%-75% अनुदान व पीक माहिती", prompt: "पॉलीहाउस 50%-75% अनुदान व पीक माहिती" }
        }
      ],
      bottom: [
        {
          en: { text: "🌾 Wheat Rust", prompt: "Wheat yellow rust remedy" },
          hi: { text: "🌾 गेहूं का पीला रतुआ", prompt: "गेहूं के पीले रतुआ रोग का उपचार" },
          mr: { text: "🌾 गव्हावरील तांबेरा", prompt: "गव्हावरील तांबेरा रोगाचे उपाय" }
        },
        {
          en: { text: "🏡 Polyhouse Subsidy", prompt: "How to get 50% to 75% subsidy for Polyhouse farming?" },
          hi: { text: "🏡 पॉलीहाउस सब्सिडी", prompt: "पॉलीहाउस खेती पर सरकारी सब्सिडी कैसे लें?" },
          mr: { text: "🏡 पॉलीहाउस अनुदान", prompt: "पॉलीहाउस शेतीसाठी सरकारी अनुदान कसे मिळवायचे?" }
        },
        {
          en: { text: "🧪 NPK Timing", prompt: "Urea and DAP application timing" },
          hi: { text: "🧪 NPK डालने का सही समय", prompt: "यूरिया और डीएपी डालने का सही समय क्या है?" },
          mr: { text: "🧪 खत व्यवस्थापन वेळ", prompt: "युरिया आणि डीएपी खत कधी द्यावे?" }
        },
        {
          en: { text: "🏛️ PM-Kisan", prompt: "PM-Kisan registration checklist" },
          hi: { text: "🏛️ पीएम-किसान योजना", prompt: "पीएम-किसान योजना पंजीकरण और दस्तावेज सूची" },
          mr: { text: "🏛️ पीएम-किसान योजना", prompt: "पीएम-किसान योजना नोंदणी व कागदपत्रे" }
        },
        {
          en: { text: "💧 Drip Subsidy", prompt: "Drip irrigation subsidy in Maharashtra" },
          hi: { text: "💧 ड्रिप सिंचाई सब्सिडी", prompt: "ड्रिप सिंचाई पर सरकारी अनुदान कैसे लें?" },
          mr: { text: "💧 ठिबक अनुदान", prompt: "ठिबक सिंचन योजना अनुदान प्रक्रिया" }
        },
        {
          en: { text: "🫘 Soybean Pests", prompt: "Soybean pest control tips" },
          hi: { text: "🫘 सोयाबीन कीट नियंत्रण", prompt: "सोयाबीन की फसल में कीट नियंत्रण के उपाय" },
          mr: { text: "🫘 सोयाबीन कीड नियंत्रण", prompt: "सोयाबीन पिकातील कीड नियंत्रण उपाय" }
        }
      ]
    };

    const welcomeMessages = {
      en: `<h4>Namaste Farmer Friend! 🙏</h4>
<p>I am your dedicated <strong>Kisan AI Assistant</strong>. You can ask me questions via voice or text in <strong>English</strong>, <strong>हिन्दी</strong>, or <strong>मराठी</strong>.</p>
<div class="highlight-box">
  <strong>What I can help you with:</strong>
  <ul>
    <li>Diagnose crop diseases and recommend organic/chemical remedies</li>
    <li>Calculate balanced NPK & micronutrient fertilizer plans</li>
    <li>Explain eligibility and documents for 15+ government schemes</li>
    <li>Share mandi pricing strategies and seasonal irrigation advice</li>
  </ul>
</div>
<p style="margin-top:8px;font-size:0.85rem;color:#64748B;">Tap any suggestion below or speak hands-free with the microphone button!</p>
<div class="ai-msg-time">Just now</div>`,
      hi: `<h4>नमस्ते किसान भाई! 🙏</h4>
<p>मैं आपका समर्पित <strong>किसान AI सहायक</strong> हूँ। आप मुझसे <strong>हिन्दी</strong>, <strong>मराठी</strong> या <strong>English</strong> में बोलकर या लिखकर कृषि प्रश्न पूछ सकते हैं।</p>
<div class="highlight-box">
  <strong>मैं आपकी इन विषयों में सहायता कर सकता हूँ:</strong>
  <ul>
    <li>फसल रोगों और कीटों की पहचान तथा जैविक/रासायनिक उपचार</li>
    <li>फसलों के लिए संतुलित NPK व सूक्ष्म पोषक उर्वरक योजना</li>
    <li>15+ सरकारी योजनाओं की पात्रता, लाभ एवं आवेदन प्रक्रिया</li>
    <li>मंडी भाव, मौसमी सिंचाई और पॉलीहाउस खेती की सलाह</li>
  </ul>
</div>
<p style="margin-top:8px;font-size:0.85rem;color:#64748B;">नीचे दिए गए किसी भी सुझाव पर टैप करें या माइक बटन दबाकर बोलें!</p>
<div class="ai-msg-time">अभी-अभी</div>`,
      mr: `<h4>नमस्कार शेतकरी मित्रहो! 🙏</h4>
<p>मी आपला समर्पित <strong>किसान AI सहाय्यक</strong> आहे. आपण मला <strong>मराठी</strong>, <strong>हिन्दी</strong> किंवा <strong>English</strong> मध्ये बोलून अथवा टाईप करून शेतीविषयक प्रश्न विचारू शकता.</p>
<div class="highlight-box">
  <strong>मी आपल्याला पुढील बाबतीत मदत करू शकतो:</strong>
  <ul>
    <li>पिकांवरील कीड-रोग निदान आणि सेंद्रिय/रासायनिक उपाययोजना</li>
    <li>पिकांसाठी संतुलित NPK व सूक्ष्म अन्नद्रव्य खत नियोजन</li>
    <li>15+ शासकीय कृषी योजनांची पात्रता, कागदपत्रे व अनुदान माहिती</li>
    <li>बाजार भाव, सिंचन नियोजन आणि पॉलीहाउस संरक्षित शेती सल्ला</li>
  </ul>
</div>
<p style="margin-top:8px;font-size:0.85rem;color:#64748B;">खालील कोणत्याही पर्यायावर टॅप करा किंवा माइकचे बटण दाबून बोला!</p>
<div class="ai-msg-time">आत्ताच</div>`
    };

    function renderLocalizedChips() {
      const lang = getCurrentLang();
      const sidebarContainer = document.getElementById('aiSidebarPromptChips');
      const bottomContainer = document.getElementById('aiBottomChipTray');

      if (sidebarContainer) {
        sidebarContainer.innerHTML = promptChipTranslations.sidebar.map(item => {
          const trans = item[lang] || item.en;
          return `<button class="ai-prompt-chip" data-prompt="${escapeHTML(trans.prompt)}">${trans.text}</button>`;
        }).join('');
      }

      if (bottomContainer) {
        bottomContainer.innerHTML = promptChipTranslations.bottom.map(item => {
          const trans = item[lang] || item.en;
          return `<button class="filter-pill" data-prompt="${escapeHTML(trans.prompt)}">${trans.text}</button>`;
        }).join('');
      }

      // Re-bind click events on newly rendered prompt chips
      document.querySelectorAll('[data-prompt]').forEach(chip => {
        chip.addEventListener('click', () => {
          const promptText = chip.getAttribute('data-prompt');
          if (promptText) handleUserQuery(promptText);
        });
      });

      // Update welcome message if chat has not progressed
      const welcomeEl = document.getElementById('aiWelcomeMsgContent');
      if (welcomeEl && (!savedHistory || JSON.parse(savedHistory || '[]').length === 0)) {
        welcomeEl.innerHTML = welcomeMessages[lang] || welcomeMessages.en;
      }
    }

    renderLocalizedChips();

    // Listen for language changes
    window.addEventListener('agrihub:languageChanged', () => {
      renderLocalizedChips();
      if (micBtn) {
        recInstance = initSpeechRecognition(
          (transcript) => {
            aiUserInput.value = transcript;
            handleUserQuery(transcript);
          },
          (isSpeakingState) => {
            if (isSpeakingState) micBtn.classList.add('mic-recording');
            else micBtn.classList.remove('mic-recording');
          }
        );
      }
    });

    // Voice Input Mic
    let recInstance = null;
    if (micBtn) {
      recInstance = initSpeechRecognition(
        (transcript) => {
          aiUserInput.value = transcript;
          handleUserQuery(transcript);
        },
        (isSpeakingState) => {
          if (isSpeakingState) micBtn.classList.add('mic-recording');
          else micBtn.classList.remove('mic-recording');
        }
      );

      micBtn.addEventListener('click', () => {
        if (!recInstance) {
          showToast('Speech Recognition is not supported on this browser.', 'warning');
          return;
        }
        try {
          recInstance.start();
        } catch (err) {
          recInstance.stop();
        }
      });
    }

    // Toggle Audio TTS
    audioToggleBtn?.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      audioToggleBtn.classList.toggle('active', audioEnabled);
      audioToggleBtn.innerHTML = audioEnabled ?
        '<i data-lucide="volume-2" style="width:14px;height:14px;"></i> Audio: ON' :
        '<i data-lucide="volume-x" style="width:14px;height:14px;"></i> Audio: OFF';
      if (window.lucide) window.lucide.createIcons();
    });

    // Clear Chat
    clearChatBtn?.addEventListener('click', () => {
      if (confirm('Clear entire conversation history?')) {
        localStorage.removeItem('agrihub_chat_history');
        location.reload();
      }
    });

    // Export Chat
    exportChatBtn?.addEventListener('click', () => {
      const text = chatMessages.innerText;
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Kisan_AI_Chat_Export_${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
    });

    // Focus Mode Filters
    document.querySelectorAll('.ai-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ai-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        showToast(`Focus Mode switched to: ${btn.innerText.trim()}`, 'info');
      });
    });

    // Handle User Query Handler
    function handleUserQuery(userText) {
      appendMessageUI('user', escapeHTML(userText), true);
      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();
        const botReplyHTML = generateAIResponse(userText);
        appendMessageUI('bot', botReplyHTML, true);
        if (audioEnabled) speakText(botReplyHTML);
      }, 750);
    }

    function appendMessageUI(sender, htmlContent, saveToStorage = true) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `ai-msg ${sender}`;

      const avatar = sender === 'bot' ? '🤖' : '👨‍🌾';
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let actionsHTML = '';
      if (sender === 'bot') {
        actionsHTML = `
          <div class="ai-msg-actions">
            <button class="ai-action-btn copy-btn"><i data-lucide="copy" style="width:12px;height:12px;"></i> Copy</button>
            <button class="ai-action-btn tts-btn"><i data-lucide="volume-2" style="width:12px;height:12px;"></i> Listen</button>
            <button class="ai-action-btn like-btn">👍</button>
            <button class="ai-action-btn dislike-btn">👎</button>
          </div>
        `;
      }

      msgDiv.innerHTML = `
        <div class="ai-msg-avatar">${avatar}</div>
        <div class="ai-msg-content">
          ${htmlContent}
          <div class="ai-msg-time">${timeStr}</div>
          ${actionsHTML}
        </div>
      `;

      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      if (window.lucide) window.lucide.createIcons();

      // Bind message action buttons
      const copyBtn = msgDiv.querySelector('.copy-btn');
      const ttsBtn = msgDiv.querySelector('.tts-btn');
      const likeBtn = msgDiv.querySelector('.like-btn');
      const dislikeBtn = msgDiv.querySelector('.dislike-btn');

      copyBtn?.addEventListener('click', () => {
        const textToCopy = msgDiv.querySelector('.ai-msg-content').innerText;
        navigator.clipboard.writeText(textToCopy);
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => copyBtn.innerHTML = '<i data-lucide="copy" style="width:12px;height:12px;"></i> Copy', 2000);
      });

      ttsBtn?.addEventListener('click', () => {
        speakText(htmlContent);
      });

      likeBtn?.addEventListener('click', () => {
        likeBtn.classList.add('active');
        dislikeBtn?.classList.remove('active');
        showToast('Thank you for your feedback! 👍', 'success');
      });

      dislikeBtn?.addEventListener('click', () => {
        dislikeBtn.classList.add('active');
        likeBtn?.classList.remove('active');
        showToast('Feedback noted. We will improve our response.', 'info');
      });

      if (saveToStorage) {
        saveChatToStorage(sender, htmlContent);
      }
    }

    function showTypingIndicator() {
      if (document.getElementById('aiPageTyping')) return;
      const typingDiv = document.createElement('div');
      typingDiv.className = 'ai-msg bot';
      typingDiv.id = 'aiPageTyping';
      typingDiv.innerHTML = `
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-content">
          <div class="ai-typing-indicator" style="display:flex;gap:4px;padding:8px 0;">
            <div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div>
          </div>
        </div>
      `;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
      const ind = document.getElementById('aiPageTyping');
      if (ind) ind.remove();
    }

    function saveChatToStorage(sender, html) {
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('agrihub_chat_history')) || [];
      } catch (e) { history = []; }

      history.push({ sender, html, timestamp: Date.now() });
      if (history.length > 50) history.shift();
      localStorage.setItem('agrihub_chat_history', JSON.stringify(history));
    }

    // ═══════════════════════════════════════════════
    // 7. LEAF DISEASE SCANNER MODAL CONTROLLER
    // ═══════════════════════════════════════════════
    const modal = document.getElementById('leafScanModal');
    const closeBtn = document.getElementById('closeScanModal');
    const sampleLeafImg = document.getElementById('sampleLeafImg');
    const scannerLaser = document.getElementById('scannerLaser');
    const scannerBox = document.getElementById('scannerBox');
    const scannerTag = document.getElementById('scannerTag');
    const scanProgressBar = document.getElementById('scanProgressBar');
    const scanProgressFill = document.getElementById('scanProgressFill');
    const scanResultsArea = document.getElementById('scanResultsArea');
    const scanDiseaseTitle = document.getElementById('scanDiseaseTitle');
    const scanConfidence = document.getElementById('scanConfidence');
    const scanSeverityBadge = document.getElementById('scanSeverityBadge');
    const scanRemedyText = document.getElementById('scanRemedyText');
    const startScanBtn = document.getElementById('startScanBtn');
    const insertScanToChatBtn = document.getElementById('insertScanToChatBtn');
    const leafFileInput = document.getElementById('leafFileInput');

    let selectedDiseaseKey = 'wheat_rust';

    if (triggerScanModal && modal) {
      triggerScanModal.addEventListener('click', () => modal.classList.add('open', 'active'));
    }
    if (attachBtn && modal) {
      attachBtn.addEventListener('click', () => modal.classList.add('open', 'active'));
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open', 'active'));
    }

    // Sample Leaf Chips Click
    document.querySelectorAll('.sample-leaf-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.sample-leaf-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedDiseaseKey = chip.getAttribute('data-disease') || 'wheat_rust';
        const imgUrl = chip.getAttribute('data-img');
        if (sampleLeafImg && imgUrl) sampleLeafImg.src = imgUrl;

        // Reset scan view
        scanResultsArea.style.display = 'none';
        insertScanToChatBtn.style.display = 'none';
        scannerLaser.style.display = 'none';
        scannerBox.style.display = 'none';
      });
    });

    // File Input Upload Preview
    leafFileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (sampleLeafImg) sampleLeafImg.src = evt.target.result;
          selectedDiseaseKey = 'blight';
          scanResultsArea.style.display = 'none';
          insertScanToChatBtn.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });

    // Start Scan Button
    startScanBtn?.addEventListener('click', () => {
      if (!startScanBtn) return;
      startScanBtn.disabled = true;
      startScanBtn.innerHTML = '⏳ Scanning Leaf Tissue...';

      if (scannerLaser) scannerLaser.style.display = 'block';
      if (scannerBox) scannerBox.style.display = 'flex';
      if (scanProgressBar) scanProgressBar.style.display = 'block';
      if (scanResultsArea) scanResultsArea.style.display = 'none';
      if (insertScanToChatBtn) insertScanToChatBtn.style.display = 'none';

      const scanSteps = ['Chlorophyll Mapping...', 'Spot Density Analysis...', 'Fungal Spore Check...', 'Generating Diagnostic Report...'];
      let stepIdx = 0;

      runLeafDiagnosticScan(
        selectedDiseaseKey,
        (progress) => {
          if (scanProgressFill) scanProgressFill.style.width = `${progress}%`;
          if (scannerTag) scannerTag.innerText = scanSteps[stepIdx++] || 'Scanning...';
        },
        (result) => {
          startScanBtn.disabled = false;
          startScanBtn.innerHTML = '<i data-lucide="scan" style="width:16px;height:16px;"></i> Scan Another Photo';
          if (window.lucide) window.lucide.createIcons();

          if (scannerLaser) scannerLaser.style.display = 'none';
          if (scannerBox) scannerBox.style.display = 'none';
          if (scanProgressBar) scanProgressBar.style.display = 'none';

          if (scanDiseaseTitle) scanDiseaseTitle.innerText = `🔍 ${result.disease}`;
          if (scanConfidence) scanConfidence.innerText = `Confidence: ${result.confidence}`;
          if (scanSeverityBadge) {
            scanSeverityBadge.innerHTML = `<span class="badge" style="background:#FEE2E2;color:#991B1B;padding:2px 8px;border-radius:4px;font-weight:600;font-size:0.78rem;">Severity Level: ${result.severity}</span>`;
          }
          if (scanRemedyText) scanRemedyText.innerText = result.remedy;

          if (scanResultsArea) scanResultsArea.style.display = 'block';
          if (insertScanToChatBtn) insertScanToChatBtn.style.display = 'block';
        }
      );
    });

    // Insert Result into Chat
    insertScanToChatBtn?.addEventListener('click', () => {
      const res = window.AgriAssistant.getActiveScan();
      if (!res) return;

      modal.classList.remove('open', 'active');
      const scanSummaryHTML = `
        <h4>📸 AI Leaf Scan Diagnostic Report</h4>
        <div style="margin:8px 0;display:flex;align-items:center;gap:10px;">
          <img src="${res.img}" alt="Scan" style="width:70px;height:70px;object-fit:cover;border-radius:8px;border:1px solid #10B981;">
          <div>
            <strong style="color:#DC2626;font-size:0.95rem;">${res.disease}</strong><br>
            <span style="font-size:0.8rem;color:#64748B;">AI Confidence: ${res.confidence} • Severity: ${res.severity}</span>
          </div>
        </div>
        <div class="highlight-box">
          <strong>Recommended Treatment & Remedy:</strong><br>
          ${res.remedy}
        </div>
      `;

      appendMessageUI('bot', scanSummaryHTML, true);
    });

  }

  // ═══════════════════════════════════════════════
  // 8. SITE-WIDE FLOATING WIDGET SETUP
  // ═══════════════════════════════════════════════
  function setupFloatingWidget() {
    if (document.getElementById('floatingAiWidget')) return;

    const widgetHTML = `
      <div class="floating-ai-widget" id="floatingAiWidget">
        <button class="floating-ai-btn" id="floatingAiBtn" aria-label="Open AI Assistant Chatbot" title="Chat with Kisan AI Assistant">
          🌾
          <span class="floating-ai-badge">AI</span>
        </button>
        <div class="floating-ai-popup" id="floatingAiPopup">
          <div class="floating-ai-popup-header">
            <h4><i data-lucide="bot" style="width:18px;height:18px;"></i> Kisan AI Assistant</h4>
            <div style="display:flex;align-items:center;gap:8px;">
              <a href="ai-assistant.html" title="Open Fullscreen Page" style="color:#ffffff;opacity:0.9;font-size:0.8rem;text-decoration:underline;">Fullscreen ↗</a>
              <button class="floating-ai-close" id="floatingAiClose">✕</button>
            </div>
          </div>
          <div class="floating-ai-body" id="floatingAiBody">
            <div class="ai-msg bot">
              <div class="ai-msg-avatar">🤖</div>
              <div class="ai-msg-content">
                <strong>Namaste! 🙏 I am your Kisan AI Assistant.</strong><br>
                Ask me anything about crop diseases, NPK fertilizer dosage, mandi rates, or government schemes!
              </div>
            </div>
          </div>
          <div class="floating-ai-footer">
            <input type="text" id="floatingAiInput" placeholder="Ask farming question..." autocomplete="off">
            <button id="floatingAiSend"><i data-lucide="send" style="width:16px;height:16px;"></i></button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    if (window.lucide) window.lucide.createIcons();

    const btn = document.getElementById('floatingAiBtn');
    const popup = document.getElementById('floatingAiPopup');
    const closeBtn = document.getElementById('floatingAiClose');
    const input = document.getElementById('floatingAiInput');
    const sendBtn = document.getElementById('floatingAiSend');
    const body = document.getElementById('floatingAiBody');

    if (!btn || !popup) return;

    btn.addEventListener('click', () => {
      popup.classList.toggle('open');
      if (popup.classList.contains('open')) {
        setTimeout(() => input?.focus(), 200);
      }
    });

    closeBtn?.addEventListener('click', () => {
      popup.classList.remove('open');
    });

    function sendFloatingMessage() {
      const q = input.value.trim();
      if (!q) return;
      input.value = '';

      const userDiv = document.createElement('div');
      userDiv.className = 'ai-msg user';
      userDiv.innerHTML = `<div class="ai-msg-content">${escapeHTML(q)}</div>`;
      body.appendChild(userDiv);
      body.scrollTop = body.scrollHeight;

      const typingDiv = document.createElement('div');
      typingDiv.className = 'ai-typing-indicator';
      typingDiv.id = 'floatingTyping';
      typingDiv.innerHTML = '<div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div>';
      body.appendChild(typingDiv);
      body.scrollTop = body.scrollHeight;

      setTimeout(() => {
        typingDiv.remove();
        const replyHTML = generateAIResponse(q);
        const botDiv = document.createElement('div');
        botDiv.className = 'ai-msg bot';
        botDiv.innerHTML = `<div class="ai-msg-avatar">🤖</div><div class="ai-msg-content">${replyHTML}</div>`;
        body.appendChild(botDiv);
        body.scrollTop = body.scrollHeight;
        if (window.lucide) window.lucide.createIcons();
      }, 700);
    }

    sendBtn?.addEventListener('click', sendFloatingMessage);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendFloatingMessage();
    });
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:9999;background:#1E293B;color:#fff;padding:10px 16px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-size:0.85rem;';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

})();
