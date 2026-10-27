/* ═══════════════════════════════════════════════
   AgriHub — Pesticide Safety Calculator & Guidelines
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Pesticide Data Dictionary
  const pesticideData = {
    cotton: {
      aphids: { chemical: "Imidacloprid 17.8% SL", dosagePerAcre: 60, unit: "ml", waterPerAcre: 150, phi: "21 days", label: "Yellow Label", nozzle: "Hollow Cone", ppe: ["N95 Respirator", "Rubber Gloves", "Goggles"] },
      bollworm: { chemical: "Chlorantraniliprole 18.5% SC", dosagePerAcre: 60, unit: "ml", waterPerAcre: 200, phi: "15 days", label: "Green Label", nozzle: "Hollow Cone", ppe: ["N95 Mask", "Gloves", "Goggles", "Apron"] },
      whitefly: { chemical: "Diafenthiuron 50% WP", dosagePerAcre: 250, unit: "g", waterPerAcre: 200, phi: "30 days", label: "Yellow Label", nozzle: "Hollow Cone", ppe: ["Respirator", "Nitrile Gloves", "Goggles"] }
    },
    paddy: {
      stem_borer: { chemical: "Cartap Hydrochloride 50% SP", dosagePerAcre: 400, unit: "g", waterPerAcre: 200, phi: "21 days", label: "Yellow Label", nozzle: "Hollow Cone", ppe: ["Respirator", "Gloves", "Boots"] },
      blast: { chemical: "Tricyclazole 75% WP", dosagePerAcre: 120, unit: "g", waterPerAcre: 200, phi: "30 days", label: "Blue Label", nozzle: "Flat Fan", ppe: ["Mask", "Gloves", "Goggles"] },
      weeds: { chemical: "Pretilachlor 50% EC", dosagePerAcre: 500, unit: "ml", waterPerAcre: 150, phi: "60 days", label: "Blue Label", nozzle: "Flat Fan", ppe: ["Gloves", "Gum Boots"] }
    },
    wheat: {
      rust: { chemical: "Propiconazole 25% EC", dosagePerAcre: 200, unit: "ml", waterPerAcre: 200, phi: "30 days", label: "Yellow Label", nozzle: "Flat Fan", ppe: ["Mask", "Gloves", "Goggles"] },
      aphids: { chemical: "Thiamethoxam 25% WG", dosagePerAcre: 40, unit: "g", waterPerAcre: 150, phi: "21 days", label: "Green Label", nozzle: "Hollow Cone", ppe: ["N95 Mask", "Gloves"] },
      weeds: { chemical: "Clodinafop-propargyl 15% WP", dosagePerAcre: 160, unit: "g", waterPerAcre: 150, phi: "45 days", label: "Green Label", nozzle: "Flat Fan", ppe: ["Gloves", "Boots"] }
    },
    sugarcane: {
      pyrilla: { chemical: "Chlorpyrifos 20% EC", dosagePerAcre: 600, unit: "ml", waterPerAcre: 250, phi: "30 days", label: "Red Label", nozzle: "Hollow Cone", ppe: ["Chemical Suit", "Full Face Shield", "Nitrile Gloves", "Gum Boots"] },
      borer: { chemical: "Fipronil 5% SC", dosagePerAcre: 600, unit: "ml", waterPerAcre: 250, phi: "45 days", label: "Yellow Label", nozzle: "Hollow Cone", ppe: ["Respirator", "Gloves", "Goggles"] }
    },
    tomato: {
      fruit_borer: { chemical: "Spinosad 45% SC", dosagePerAcre: 75, unit: "ml", waterPerAcre: 200, phi: "3 days", label: "Green Label", nozzle: "Hollow Cone", ppe: ["Mask", "Gloves", "Goggles"] },
      blight: { chemical: "Mancozeb 75% WP", dosagePerAcre: 600, unit: "g", waterPerAcre: 200, phi: "7 days", label: "Blue Label", nozzle: "Hollow Cone", ppe: ["Mask", "Gloves"] }
    },
    general: {
      sucking_pests: { chemical: "Dimethoate 30% EC", dosagePerAcre: 300, unit: "ml", waterPerAcre: 200, phi: "14 days", label: "Yellow Label", nozzle: "Hollow Cone", ppe: ["N95 Mask", "Gloves", "Goggles"] },
      fungal_diseases: { chemical: "Copper Oxychloride 50% WP", dosagePerAcre: 500, unit: "g", waterPerAcre: 200, phi: "10 days", label: "Blue Label", nozzle: "Hollow Cone", ppe: ["Mask", "Gloves"] },
      caterpillars: { chemical: "Emamectin Benzoate 5% SG", dosagePerAcre: 80, unit: "g", waterPerAcre: 200, phi: "7 days", label: "Green Label", nozzle: "Hollow Cone", ppe: ["Mask", "Gloves"] }
    }
  };

  const pestSelect = document.getElementById('pestType');
  const cropSelect = document.getElementById('pesticideCrop');
  const form = document.getElementById('pesticideForm');
  const resultsCard = document.getElementById('pesticideResultsCard');

  // Update pest options dynamically based on crop
  if (cropSelect && pestSelect) {
    cropSelect.addEventListener('change', updatePestOptions);
  }

  const pestOptionTranslations = {
    cotton: [
      { val: 'aphids', en: 'Aphids / Jassids / Thrips', hi: 'माहू (एफिड) / जैसिड / थ्रिप्स', mr: 'मावा / तुडतुडे / फुलकिडे' },
      { val: 'bollworm', en: 'American / Pink Bollworm', hi: 'गुलाबी / अमेरिकन सुंडी (इल्ली)', mr: 'अमेरिकन / गुलाबी बोंडअळी' },
      { val: 'whitefly', en: 'Whitefly', hi: 'सफ़ेद मक्खी (व्हाइटफ्लाई)', mr: 'पांढरी माशी' }
    ],
    paddy: [
      { val: 'stem_borer', en: 'Stem Borer / Leaf Folder', hi: 'तना छेदक (गोभ की सुंडी) / पत्ता लपेटक', mr: 'खोडकीड / पाने गुंडाळणारी अळी' },
      { val: 'blast', en: 'Paddy Blast / Sheath Blight', hi: 'धान का झुलसा (ब्लास्ट) व शीथ ब्लाइट', mr: 'भाताचा करपा व कडा करपा' },
      { val: 'weeds', en: 'Broadleaf Weeds / Grasses', hi: 'चौड़ी पत्ती वाले खरपतवार व घास', mr: 'रुंद पानांचे तण व गवत' }
    ],
    wheat: [
      { val: 'rust', en: 'Yellow / Brown Rust', hi: 'पीला / भूरा रतुआ (गेरुआ)', mr: 'पिवळा / तपकिरी तांबेरा' },
      { val: 'aphids', en: 'Wheat Aphids', hi: 'गेहूं का चेपा (माहू)', mr: 'गव्हावरील मावा' },
      { val: 'weeds', en: 'Narrow Leaf Weeds', hi: 'सकरी पत्ती खरपतवार (मंडूसी / गुल्ली डंडा)', mr: 'अरुंद पानांचे तण' }
    ],
    sugarcane: [
      { val: 'pyrilla', en: 'Pyrilla / Leafhopper', hi: 'पायरीला / फुदका कीट', mr: 'पायरीला / पाकोळी' },
      { val: 'borer', en: 'Early Shoot Borer', hi: 'कंसुआ (प्रारंभिक प्ररोह भेदक)', mr: 'कांडी कीड / शेंडा कीड' }
    ],
    tomato: [
      { val: 'fruit_borer', en: 'Fruit Borer', hi: 'फल छेदक इल्ली', mr: 'फळ पोखरणारी अळी' },
      { val: 'blight', en: 'Early / Late Blight', hi: 'अगेती व पछेती झुलसा', mr: 'लवकर व उशिरा येणारा करपा' }
    ],
    general: [
      { val: 'sucking_pests', en: 'Sucking Pests (General)', hi: 'रस चूसक कीट (सामान्य)', mr: 'रस शोषणारी कीड (सामान्य)' },
      { val: 'fungal_diseases', en: 'Fungal Spot & Blight', hi: 'फफूंद जनित धब्बा व झुलसा', mr: 'बुरशीजन्य ठिपके व करपा' },
      { val: 'caterpillars', en: 'Leaf Eating Caterpillars', hi: 'पत्ती खाने वाली इल्लियां', mr: 'पाने खाणारी अळी' }
    ]
  };

  const ppeItemTranslations = {
    'N95 Respirator': { hi: 'N95 मास्क', mr: 'N95 मास्क' },
    'Rubber Gloves': { hi: 'रबर के दस्ताने', mr: 'रबरी हातमोजे' },
    'Goggles': { hi: 'सुरक्षा चश्मा', mr: 'सुरक्षा चष्मा' },
    'N95 Mask': { hi: 'N95 मास्क', mr: 'N95 मास्क' },
    'Gloves': { hi: 'दस्ताने', mr: 'हातमोजे' },
    'Apron': { hi: 'सुरक्षा एप्रन', mr: 'सुरक्षा अ‍ॅप्रन' },
    'Respirator': { hi: 'रेस्पिरेटर मास्क', mr: 'रेस्पिरेटर मास्क' },
    'Nitrile Gloves': { hi: 'नाइट्राइल दस्ताने', mr: 'नायट्रिल हातमोजे' },
    'Boots': { hi: 'गम बूट', mr: 'गम बूट' },
    'Mask': { hi: 'सुरक्षा मास्क', mr: 'सुरक्षा मास्क' },
    'Gum Boots': { hi: 'रबर के लंबे जूते', mr: 'रबरी गम बूट' },
    'Chemical Suit': { hi: 'रासायनिक सूट (Hazmat)', mr: 'रासायनिक सूट' },
    'Full Face Shield': { hi: 'फेस शील्ड', mr: 'फेस शील्ड' }
  };

  const pestSelect = document.getElementById('pestType');
  const cropSelect = document.getElementById('pesticideCrop');
  const form = document.getElementById('pesticideForm');
  const resultsCard = document.getElementById('pesticideResultsCard');

  let activePesticideResult = null;

  function updatePestOptions() {
    if (!cropSelect || !pestSelect) return;
    const selectedCrop = cropSelect.value;
    const currentVal = pestSelect.value;
    const lang = (window.AgriHubI18n ? window.AgriHubI18n.getLang() : (localStorage.getItem('agrihub_lang') || 'en'));

    pestSelect.innerHTML = '';
    const options = pestOptionTranslations[selectedCrop] || pestOptionTranslations.general;

    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.val;
      el.textContent = opt[lang] || opt.en;
      if (opt.val === currentVal) el.selected = true;
      pestSelect.appendChild(el);
    });
  }

  if (cropSelect) {
    cropSelect.addEventListener('change', updatePestOptions);
  }

  function calculateDosage() {
    const crop = cropSelect ? cropSelect.value : 'general';
    const pest = pestSelect ? pestSelect.value : 'sucking_pests';
    const area = parseFloat(document.getElementById('pesticideLandArea').value) || 1;
    const tankSize = parseFloat(document.getElementById('pesticideTankCapacity').value) || 15;

    let dataGroup = pesticideData[crop] || pesticideData['general'];
    let spec = dataGroup[pest] || dataGroup[Object.keys(dataGroup)[0]] || pesticideData.general.sucking_pests;

    const totalChemical = Math.round(spec.dosagePerAcre * area * 10) / 10;
    const totalWater = Math.round(spec.waterPerAcre * area);
    const numberOfTanks = Math.ceil(totalWater / tankSize);
    const chemicalPerTank = Math.round((totalChemical / numberOfTanks) * 10) / 10;

    activePesticideResult = { spec, totalChemical, totalWater, numberOfTanks, chemicalPerTank, tankSize };
    renderPesticideResults(activePesticideResult);

    if (resultsCard) {
      resultsCard.style.display = 'block';
      resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function renderPesticideResults(data) {
    if (!data) return;
    const { spec, totalChemical, totalWater, numberOfTanks, chemicalPerTank, tankSize } = data;
    const lang = (window.AgriHubI18n ? window.AgriHubI18n.getLang() : (localStorage.getItem('agrihub_lang') || 'en'));

    document.getElementById('resChemicalName').textContent = spec.chemical;
    document.getElementById('resTotalChemical').textContent = `${totalChemical} ${spec.unit}`;

    const litresLabel = lang === 'hi' ? 'लीटर' : (lang === 'mr' ? 'लिटर' : 'Litres');
    document.getElementById('resTotalWater').textContent = `${totalWater} ${litresLabel}`;

    const tankText = lang === 'hi'
      ? `प्रति ${tankSize}L टैंक में ${chemicalPerTank} ${spec.unit} (${numberOfTanks} टैंक)`
      : (lang === 'mr'
        ? `प्रति ${tankSize}L पंपात ${chemicalPerTank} ${spec.unit} (${numberOfTanks} पंप)`
        : `${chemicalPerTank} ${spec.unit} per ${tankSize}L Tank (${numberOfTanks} Tanks)`);
    document.getElementById('resTankDose').textContent = tankText;

    const phiDays = parseInt(spec.phi);
    const phiText = lang === 'hi' ? `${phiDays} दिन` : (lang === 'mr' ? `${phiDays} दिवस` : spec.phi);
    document.getElementById('resPHI').textContent = phiText;

    const nozzleText = spec.nozzle === 'Hollow Cone'
      ? (lang === 'hi' ? 'खोखला शंकु (Hollow Cone)' : (lang === 'mr' ? 'हॉलो कोन नोजल' : 'Hollow Cone'))
      : (lang === 'hi' ? 'फ्लैट फैन (Flat Fan)' : (lang === 'mr' ? 'फ्लॅट फॅन नोजल' : 'Flat Fan'));
    document.getElementById('resNozzle').textContent = nozzleText;

    const badgeEl = document.getElementById('resToxicityBadge');
    if (badgeEl) {
      let badgeLabel = spec.label;
      if (lang === 'hi') {
        if (spec.label.includes('Red')) badgeLabel = 'लाल लेबल (अति विषैला)';
        else if (spec.label.includes('Yellow')) badgeLabel = 'पीला लेबल (अत्यधिक विषैला)';
        else if (spec.label.includes('Blue')) badgeLabel = 'नीला लेबल (मध्यम विषैला)';
        else badgeLabel = 'हरा लेबल (कम विषैला)';
      } else if (lang === 'mr') {
        if (spec.label.includes('Red')) badgeLabel = 'लाल लेबल (अतिविषारी)';
        else if (spec.label.includes('Yellow')) badgeLabel = 'पिवळा लेबल (अतिधोकादायक)';
        else if (spec.label.includes('Blue')) badgeLabel = 'निळा लेबल (मध्यम विषारी)';
        else badgeLabel = 'हिरवा लेबल (कमी विषारी)';
      }
      badgeEl.textContent = badgeLabel;
      badgeEl.className = 'toxicity-band-badge';
      if (spec.label.includes('Red')) badgeEl.style.background = '#DC2626';
      else if (spec.label.includes('Yellow')) badgeEl.style.background = '#D97706';
      else if (spec.label.includes('Blue')) badgeEl.style.background = '#2563EB';
      else badgeEl.style.background = '#16A34A';
    }

    const ppeList = document.getElementById('resPPEList');
    if (ppeList) {
      ppeList.innerHTML = spec.ppe.map(item => {
        const itemText = (ppeItemTranslations[item] && ppeItemTranslations[item][lang]) || item;
        return `<span class="tag" style="background:#E2E8F0;color:#1E293B;">🛡️ ${itemText}</span>`;
      }).join(' ');
    }
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateDosage();
    });
  }

  // Safety Checklist Validation
  const checklistInputs = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const statusAlert = document.getElementById('checklistStatusAlert');

  if (checklistInputs.length > 0) {
    checklistInputs.forEach(input => {
      input.addEventListener('change', checkSafetyStatus);
    });
  }

  function checkSafetyStatus() {
    const total = checklistInputs.length;
    const checked = Array.from(checklistInputs).filter(i => i.checked).length;
    const lang = (window.AgriHubI18n ? window.AgriHubI18n.getLang() : (localStorage.getItem('agrihub_lang') || 'en'));

    if (!statusAlert) return;

    if (checked === total) {
      statusAlert.style.background = '#D1FAE5';
      statusAlert.style.borderColor = '#10B981';
      statusAlert.style.color = '#065F46';
      if (lang === 'hi') {
        statusAlert.innerHTML = '<strong>✅ सुरक्षा मानक पूर्ण!</strong> सभी अनिवार्य सावधानियां सत्यापित। आप सुरक्षित रूप से छिड़काव कर सकते हैं।';
      } else if (lang === 'mr') {
        statusAlert.innerHTML = '<strong>✅ सर्व सुरक्षा निकष पूर्ण!</strong> सर्व अनिवार्य काळजी पडताळली गेली आहे. आपण सुरक्षितपणे फवारणी करू शकता.';
      } else {
        statusAlert.innerHTML = '<strong>✅ Safety Standard Met!</strong> All mandatory precautions verified. You may proceed with spraying safely.';
      }
    } else {
      statusAlert.style.background = '#FEF3C7';
      statusAlert.style.borderColor = '#F59E0B';
      statusAlert.style.color = '#92400E';
      const remaining = total - checked;
      if (lang === 'hi') {
        statusAlert.innerHTML = `<strong>⚠️ ${remaining} सावधानियां शेष हैं!</strong> कृपया रसायन का छिड़काव करने से पहले सभी सुरक्षा जांच पूरी करें।`;
      } else if (lang === 'mr') {
        statusAlert.innerHTML = `<strong>⚠️ ${remaining} सुरक्षा मुद्दे बाकी आहेत!</strong> कृपया फवारणी सुरू करण्यापूर्वी सर्व सुरक्षा काळजी पूर्ण करा.`;
      } else {
        statusAlert.innerHTML = `<strong>⚠️ ${remaining} Precaution(s) Remaining!</strong> Please complete all safety checks (PPE, weather, notice) before spraying chemicals.`;
      }
    }
  }

  // React to language switch
  window.addEventListener('agrihub:languageChanged', () => {
    updatePestOptions();
    if (activePesticideResult && resultsCard && resultsCard.style.display !== 'none') {
      renderPesticideResults(activePesticideResult);
    }
    checkSafetyStatus();
  });

  // Initial population call
  if (cropSelect && pestSelect) {
    updatePestOptions();
  }
});
