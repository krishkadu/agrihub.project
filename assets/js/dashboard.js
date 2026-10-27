/* ═══════════════════════════════════════════════
   AgriHub — Dashboard Module
   Full Supabase integration: stats, history, schemes, profile
   Uses shared supabaseClient from supabase-client.js
   ═══════════════════════════════════════════════ */

/* ── Date formatter ── */
function formatDate(isoString) {
    if (!isoString) return 'Date not available';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

/* ── Tab Switching ── */
function initTabs() {
    document.querySelectorAll('.dash-nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;

            // Update active nav
            document.querySelectorAll('.dash-nav-link').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show correct section
            document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
            const target = document.getElementById('section-' + section);
            if (target) target.classList.add('active');
        });
    });
}

/* ── Load Stats ── */
async function loadStats(userId) {
    try {
        const [calcRes, cropRes, schemeRes] = await Promise.all([
            supabaseClient.from('fertilizer_calculations').select('*', { count: 'exact', head: true }).eq('user_id', userId),
            supabaseClient.from('crop_advisor_history').select('*', { count: 'exact', head: true }).eq('user_id', userId),
            supabaseClient.from('saved_schemes').select('*', { count: 'exact', head: true }).eq('user_id', userId)
        ]);

        const calcCount   = calcRes.count ?? 0;
        const cropCount   = cropRes.count ?? 0;
        const schemeCount = schemeRes.count ?? 0;

        animateCounter('stat-calculations', calcCount);
        animateCounter('stat-crops', cropCount);
        animateCounter('stat-schemes', schemeCount);
    } catch (e) {
        console.warn('[AgriHub] Could not load stats:', e.message);
    }
}

/* ── Animate counter from 0 to target ── */
function animateCounter(elId, target) {
    const el = document.getElementById(elId);
    if (!el) return;
    const duration = 600;
    const start = performance.now();
    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

/* ── Load Calculations ── */
async function loadCalculations(userId) {
    const container = document.getElementById('calculations-list');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('fertilizer_calculations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon">🧪</span>
                    <h4>${typeof t === 'function' ? t('dash_no_calcs') : 'No calculations yet'}</h4>
                    <p>${typeof t === 'function' ? t('dash_no_calcs_sub') : 'Use the Fertilizer Calculator to create your first recommendation.'}</p>
                    <a href="fertilizer.html" class="btn-empty-action">${typeof t === 'function' ? t('dash_first_calc_btn') : 'Make your first calculation →'}</a>
                </div>`;
            return;
        }

        container.innerHTML = `<div class="history-list">${data.map((rec, idx) => `
            <div class="history-card" style="animation-delay:${idx * 0.05}s">
                <div class="history-card-body">
                    <div class="history-card-title">🌱 ${escapeHtml(rec.crop_name)}</div>
                    <div class="history-card-date">🗓️ ${formatDate(rec.created_at)}</div>
                    <div class="history-card-details">
                        <span class="detail-chip">📐 ${rec.land_size} ${rec.land_unit || 'acres'}</span>
                        ${rec.nitrogen   != null ? `<span class="detail-chip">N: ${rec.nitrogen} kg (Urea)</span>`      : ''}
                        ${rec.phosphorus != null ? `<span class="detail-chip">P: ${rec.phosphorus} kg (DAP)</span>`     : ''}
                        ${rec.potassium  != null ? `<span class="detail-chip">K: ${rec.potassium} kg (MOP)</span>`      : ''}
                        ${rec.notes ? `<span class="detail-chip" style="max-width:100%; font-size:0.74rem; color:#6b7280;">📝 ${escapeHtml(rec.notes)}</span>` : ''}
                    </div>
                </div>
                <button class="btn-delete" data-id="${rec.id}" data-type="calculation" title="Delete this record">🗑️ Delete</button>
            </div>`).join('')}
        </div>`;

        // Attach delete listeners
        container.querySelectorAll('.btn-delete[data-type="calculation"]').forEach(btn => {
            btn.addEventListener('click', () => deleteRecord('fertilizer_calculations', btn.dataset.id, loadCalculationsWrapper.bind(null, userId), 'stat-calculations'));
        });

    } catch (e) {
        console.warn('[AgriHub] loadCalculations error:', e.message);
        container.innerHTML = errorState('Could not load calculations. Please check your connection.');
    }
}

async function loadCalculationsWrapper(userId) {
    await loadCalculations(userId);
    await loadStats(userId);
}

/* ── Load Crop History ── */
async function loadCropHistory(userId) {
    const container = document.getElementById('crops-list');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('crop_advisor_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon">🌱</span>
                    <h4>${typeof t === 'function' ? t('dash_no_crops') : 'No crop history yet'}</h4>
                    <p>${typeof t === 'function' ? t('dash_no_crops_sub') : 'Use the Crop Advisor to get AI-powered recommendations.'}</p>
                    <a href="crop-advisor.html" class="btn-empty-action">${typeof t === 'function' ? t('dash_get_advice_btn') : 'Get crop advice →'}</a>
                </div>`;
            return;
        }

        const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
        const seasonLabel = {
            kharif: currentLang === 'hi' ? '☔ खरीफ' : currentLang === 'mr' ? '☔ खरीप' : '☔ Kharif',
            rabi: currentLang === 'hi' ? '❄️ रबी' : currentLang === 'mr' ? '❄️ रब्बी' : '❄️ Rabi',
            zaid: currentLang === 'hi' ? '☀️ जायद' : currentLang === 'mr' ? '☀️ उन्हाळी (झायद)' : '☀️ Zaid'
        };
        const soilLabel = {
            black: currentLang === 'hi' ? 'काली मिट्टी' : currentLang === 'mr' ? 'काळी माती' : 'Black soil',
            red: currentLang === 'hi' ? 'लाल मिट्टी' : currentLang === 'mr' ? 'तांबडी माती' : 'Red soil',
            alluvial: currentLang === 'hi' ? 'जलोढ़ मिट्टी' : currentLang === 'mr' ? 'गाळाची माती' : 'Alluvial soil',
            sandy: currentLang === 'hi' ? 'बलुई मिट्टी' : currentLang === 'mr' ? 'रेताड माती' : 'Sandy soil'
        };
        const investLabel = {
            low: currentLang === 'hi' ? '💰 कम निवेश' : currentLang === 'mr' ? '💰 कमी खर्च' : '💰 Low',
            medium: currentLang === 'hi' ? '💰💰 मध्यम' : currentLang === 'mr' ? '💰💰 मध्यम' : '💰💰 Medium',
            high: currentLang === 'hi' ? '💰💰💰 अधिक' : currentLang === 'mr' ? '💰💰💰 जास्त' : '💰💰💰 High'
        };

        container.innerHTML = `<div class="history-list">${data.map((rec, idx) => `
            <div class="history-card" style="animation-delay:${idx * 0.05}s">
                <div class="history-card-body">
                    <div class="history-card-title">🌾 ${escapeHtml(rec.recommended_crop || 'Unknown crop')}</div>
                    <div class="history-card-date">🗓️ ${formatDate(rec.created_at)}</div>
                    <div class="history-card-details">
                        ${rec.season    ? `<span class="detail-chip season">${seasonLabel[rec.season] || rec.season}</span>` : ''}
                        ${rec.soil_type ? `<span class="detail-chip soil">🪨 ${soilLabel[rec.soil_type] || rec.soil_type}</span>` : ''}
                        ${rec.investment ? `<span class="detail-chip">${investLabel[rec.investment] || rec.investment}</span>` : ''}
                        ${rec.expected_profit ? `<span class="detail-chip profit">📈 ${escapeHtml(rec.expected_profit)}</span>` : ''}
                    </div>
                </div>
                <button class="btn-delete" data-id="${rec.id}" data-type="crop" title="Delete this record">🗑️ Delete</button>
            </div>`).join('')}
        </div>`;

        container.querySelectorAll('.btn-delete[data-type="crop"]').forEach(btn => {
            btn.addEventListener('click', () => deleteRecord('crop_advisor_history', btn.dataset.id, loadCropHistoryWrapper.bind(null, userId), 'stat-crops'));
        });

    } catch (e) {
        console.warn('[AgriHub] loadCropHistory error:', e.message);
        container.innerHTML = errorState('Could not load crop history. Please check your connection.');
    }
}

async function loadCropHistoryWrapper(userId) {
    await loadCropHistory(userId);
    await loadStats(userId);
}

/* ── Load Saved Schemes ── */
async function loadSavedSchemes(userId) {
    const container = document.getElementById('saved-list');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('saved_schemes')
            .select('*')
            .eq('user_id', userId)
            .order('saved_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon">🏛️</span>
                    <h4>${typeof t === 'function' ? t('dash_no_schemes') : 'No saved schemes yet'}</h4>
                    <p>${typeof t === 'function' ? t('dash_no_schemes_sub') : 'Browse government schemes and click Save to bookmark them here.'}</p>
                    <a href="schemes.html" class="btn-empty-action">${typeof t === 'function' ? t('dash_browse_schemes_btn') : 'Browse schemes →'}</a>
                </div>`;
            return;
        }

        container.innerHTML = `<div class="history-list">${data.map((rec, idx) => `
            <div class="saved-scheme-card" style="animation-delay:${idx * 0.05}s">
                <div>
                    <div class="saved-scheme-title">🏛️ ${escapeHtml(rec.scheme_name)}</div>
                    <div class="saved-scheme-date">🗓️ Saved ${formatDate(rec.saved_at)}</div>
                    ${rec.scheme_description ? `<p class="saved-scheme-desc">${escapeHtml(rec.scheme_description)}</p>` : ''}
                    <div class="saved-scheme-actions">
                        ${rec.apply_url ? `<a href="${rec.apply_url}" target="_blank" rel="noopener noreferrer" class="btn-apply-link">Apply Now →</a>` : ''}
                    </div>
                </div>
                <button class="btn-delete" data-id="${rec.id}" data-type="scheme" title="Remove this scheme">❌ Remove</button>
            </div>`).join('')}
        </div>`;

        container.querySelectorAll('.btn-delete[data-type="scheme"]').forEach(btn => {
            btn.addEventListener('click', () => deleteRecord('saved_schemes', btn.dataset.id, loadSavedSchemesWrapper.bind(null, userId), 'stat-schemes'));
        });

    } catch (e) {
        console.warn('[AgriHub] loadSavedSchemes error:', e.message);
        container.innerHTML = errorState('Could not load saved schemes. Please check your connection.');
    }
}

async function loadSavedSchemesWrapper(userId) {
    await loadSavedSchemes(userId);
    await loadStats(userId);
}

/* ── Delete a Record ── */
async function deleteRecord(table, id, refreshFn, statEl) {
    try {
        const { error } = await supabaseClient.from(table).delete().eq('id', id);
        if (error) throw error;
        showToast('Record removed successfully.', 'success');
        await refreshFn();
    } catch (e) {
        console.warn('[AgriHub] Delete error:', e.message);
        showToast('Could not delete record. Please try again.', 'error');
    }
}

/* ── Load Profile ── */
async function loadProfile(user) {
    // [PHOTO-REPLACED: static display replaced by buildProfileForm() from photo script]
    // Profile form is built by window.initPhotoSystem which is called after auth.
    // Nothing to do here — buildProfileForm handles the profile-card container.
    // This function is kept for backward compatibility.
}

/* ── Helper: escape HTML ── */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ── Helper: error state HTML ── */
function errorState(message) {
    return `<div class="error-state">⚠️ ${message}</div>`;
}

/* ── Show "last updated" indicator ── */
function showLastUpdated() {
    const el = document.getElementById('lastUpdated');
    if (el) el.style.display = 'flex';
    const text = document.getElementById('lastUpdatedText');
    if (text) text.textContent = 'Last updated: just now';
}

/* ── Main Init ── */
document.addEventListener('DOMContentLoaded', async () => {
    document.documentElement.style.visibility = 'visible';
    // Check auth
    if (!supabaseClient) {
        console.warn('[AgriHub] Supabase not available.');
        return;
    }

    let user = null;
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
            user = session.user;
        }
    } catch (e) {
        console.warn('[AgriHub] Auth session check failed:', e.message);
    }

    // Set user display name & info
    const localName = localStorage.getItem('agrihub_user_name');
    const displayName = user?.user_metadata?.full_name || localName || 'Kisan Guest';
    const isGuest = !user;

    const sidebarName = document.getElementById('sidebarName');
    if (sidebarName) sidebarName.textContent = displayName;

    const sidebarMobile = document.getElementById('sidebarMobile');
    if (sidebarMobile) {
        if (user?.user_metadata?.mobile_number) {
            const mob = String(user.user_metadata.mobile_number);
            sidebarMobile.textContent = '📱 ••••' + mob.slice(-4);
        } else {
            sidebarMobile.textContent = isGuest ? '📱 Guest Mode' : '📱 AgriHub Member';
        }
    }

    function updateGreeting() {
        const firstName = displayName.split(' ')[0];
        const greetText = typeof t === 'function' ? t('user_greeting_name', { name: firstName }) : `👋 Hello, ${firstName}`;
        const greetEl = document.getElementById('userGreeting');
        if (greetEl) {
            greetEl.innerHTML = `<span id="navAvatar" class="nav-avatar"></span> <i data-lucide="hand" class="ah-icon"></i> ${escapeHtml(greetText)}`;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    const navFirstName = document.getElementById('navFirstName');
    if (navFirstName) navFirstName.textContent = displayName.split(' ')[0];

    updateGreeting();

    // Init tab switching
    initTabs();

    // Show Demo Mode Banner if guest
    if (isGuest) {
        const main = document.querySelector('.dashboard-main');
        if (main && !document.getElementById('demoModeBanner')) {
            const banner = document.createElement('div');
            banner.id = 'demoModeBanner';
            banner.style.cssText = 'background:linear-gradient(135deg, #FEF3C7, #FDE68A);border:1px solid #F59E0B;border-radius:12px;padding:12px 18px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:0.88rem;color:#78350F;';
            banner.innerHTML = `
                <div>
                    <strong>💡 Demo Dashboard View:</strong> You are browsing as guest. Log in to save and sync your custom fertilizer calculations and schemes across devices.
                </div>
                <a href="index.html" class="btn-primary" style="padding:6px 14px;font-size:0.8rem;white-space:nowrap;">Log In / Register</a>
            `;
            main.insertBefore(banner, main.firstChild);
        }

        // Populate Demo Data
        renderDemoStats();
        renderDemoCalculations();
        renderDemoCropHistory();
        renderDemoSavedSchemes();
    } else {
        // Logged-in Supabase user
        try {
            await loadStats(user.id);
            loadCalculations(user.id);
            loadCropHistory(user.id);
            loadSavedSchemes(user.id);

            if (typeof window.initPhotoSystem === 'function') {
                window.initPhotoSystem(user);
            }
            showLastUpdated();
        } catch (e) {
            console.warn('[AgriHub] Dashboard data load error:', e.message);
        }
    }

    // Reactive Language Change Event
    window.addEventListener('agrihub:languageChanged', (e) => {
        updateGreeting();
        if (isGuest) {
            renderDemoCalculations();
            renderDemoCropHistory();
            renderDemoSavedSchemes();
        } else if (user) {
            loadCalculations(user.id);
            loadCropHistory(user.id);
            loadSavedSchemes(user.id);
        }
    });

    if (window.lucide) window.lucide.createIcons();

    // Logout button
    document.getElementById('dashLogout')?.addEventListener('click', async () => {
        try {
            if (supabaseClient) await supabaseClient.auth.signOut();
        } catch (e) { /* ignore */ }
        localStorage.removeItem('agrihub_user_name');
        showToast('Logged out successfully.', 'info');
        setTimeout(() => { window.location.href = 'index.html'; }, 800);
    });
});

/* ── Demo Mode Renderers ── */
function renderDemoStats() {
    animateCounter('stat-calculations', 3);
    animateCounter('stat-crops', 2);
    animateCounter('stat-schemes', 4);
}

function renderDemoCalculations() {
    const container = document.getElementById('calculations-list');
    if (!container) return;

    const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
    const demoData = [
        {
            crop_name: currentLang === 'hi' ? 'गेहूं (Wheat)' : currentLang === 'mr' ? 'गहू (Wheat)' : 'Wheat (गेहूं)',
            created_at: new Date().toISOString(),
            land_size: 2,
            land_unit: currentLang === 'hi' ? 'एकड़' : currentLang === 'mr' ? 'एकर' : 'acres',
            nitrogen: 90,
            phosphorus: 45,
            potassium: 30,
            notes: currentLang === 'hi' ? 'बुवाई के समय मूल खुराक दी गई' : currentLang === 'mr' ? 'पेरणी वेळी प्राथमिक मात्रा दिली' : 'Basal dose applied'
        },
        {
            crop_name: currentLang === 'hi' ? 'टमाटर (Tomato)' : currentLang === 'mr' ? 'टोमॅटो (Tomato)' : 'Tomato (टमाटर)',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            land_size: 1,
            land_unit: currentLang === 'hi' ? 'एकड़' : currentLang === 'mr' ? 'एकर' : 'acres',
            nitrogen: 60,
            phosphorus: 30,
            potassium: 40,
            notes: currentLang === 'hi' ? 'ड्रिप फर्टिगेशन योजना' : currentLang === 'mr' ? 'ठिबक खत व्यवस्थापन योजना' : 'Drip fertigation plan'
        },
        {
            crop_name: currentLang === 'hi' ? 'कपास (Cotton)' : currentLang === 'mr' ? 'कापूस (Cotton)' : 'Cotton (कापूस)',
            created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
            land_size: 3,
            land_unit: currentLang === 'hi' ? 'एकड़' : currentLang === 'mr' ? 'एकर' : 'acres',
            nitrogen: 120,
            phosphorus: 60,
            potassium: 60,
            notes: currentLang === 'hi' ? 'जिंक सल्फेट बूस्ट शामिल' : currentLang === 'mr' ? 'झिंक सल्फेट पोषण समाविष्ट' : 'Zinc Sulphate boost included'
        }
    ];

    container.innerHTML = `<div class="history-list">${demoData.map((rec, idx) => `
        <div class="history-card" style="animation-delay:${idx * 0.05}s">
            <div class="history-card-body">
                <div class="history-card-title">🌱 ${escapeHtml(rec.crop_name)} <span class="tag" style="background:#ECFDF5;color:#059669;font-size:0.7rem;">Demo</span></div>
                <div class="history-card-date">🗓️ ${formatDate(rec.created_at)}</div>
                <div class="history-card-details">
                    <span class="detail-chip">📐 ${rec.land_size} ${rec.land_unit}</span>
                    <span class="detail-chip">N: ${rec.nitrogen} kg</span>
                    <span class="detail-chip">P: ${rec.phosphorus} kg</span>
                    <span class="detail-chip">K: ${rec.potassium} kg</span>
                </div>
            </div>
        </div>`).join('')}
    </div>`;
}

function renderDemoCropHistory() {
    const container = document.getElementById('crops-list');
    if (!container) return;

    const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
    const demoData = [
        {
            recommended_crop: currentLang === 'hi' ? 'गेहूं (रबी सीजन)' : currentLang === 'mr' ? 'गहू (रब्बी हंगाम)' : 'Wheat (Rabi season)',
            created_at: new Date().toISOString(),
            season: 'rabi',
            soil_type: 'black',
            investment: 'medium',
            expected_profit: currentLang === 'hi' ? '₹45,000 / एकड़' : currentLang === 'mr' ? '₹45,000 / एकर' : '₹45,000 / acre'
        },
        {
            recommended_crop: currentLang === 'hi' ? 'सोयाबीन (खरीफ सीजन)' : currentLang === 'mr' ? 'सोयाबीन (खरीप हंगाम)' : 'Soybean (Kharif season)',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            season: 'kharif',
            soil_type: 'alluvial',
            investment: 'medium',
            expected_profit: currentLang === 'hi' ? '₹38,000 / एकड़' : currentLang === 'mr' ? '₹38,000 / एकर' : '₹38,000 / acre'
        }
    ];

    const seasonLabel = {
        kharif: currentLang === 'hi' ? '☔ खरीफ' : currentLang === 'mr' ? '☔ खरीप' : '☔ Kharif',
        rabi: currentLang === 'hi' ? '❄️ रबी' : currentLang === 'mr' ? '❄️ रब्बी' : '❄️ Rabi',
        zaid: currentLang === 'hi' ? '☀️ जायद' : currentLang === 'mr' ? '☀️ उन्हाळी (झायद)' : '☀️ Zaid'
    };
    const soilLabel = {
        black: currentLang === 'hi' ? 'काली मिट्टी' : currentLang === 'mr' ? 'काळी माती' : 'Black soil',
        alluvial: currentLang === 'hi' ? 'जलोढ़ मिट्टी' : currentLang === 'mr' ? 'गाळाची माती' : 'Alluvial soil'
    };

    container.innerHTML = `<div class="history-list">${demoData.map((rec, idx) => `
        <div class="history-card" style="animation-delay:${idx * 0.05}s">
            <div class="history-card-body">
                <div class="history-card-title">🌾 ${escapeHtml(rec.recommended_crop)}</div>
                <div class="history-card-date">🗓️ ${formatDate(rec.created_at)}</div>
                <div class="history-card-details">
                    <span class="detail-chip season">${seasonLabel[rec.season] || rec.season}</span>
                    <span class="detail-chip soil">🪨 ${soilLabel[rec.soil_type] || rec.soil_type}</span>
                    <span class="detail-chip profit">📈 ${rec.expected_profit}</span>
                </div>
            </div>
        </div>`).join('')}
    </div>`;
}

function renderDemoSavedSchemes() {
    const container = document.getElementById('saved-list');
    if (!container) return;

    const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
    const demoData = [
        {
            scheme_name: currentLang === 'hi' ? 'पीएम-किसान सम्मान निधि' : currentLang === 'mr' ? 'पीएम-किसान सन्मान निधी' : 'PM-Kisan Samman Nidhi',
            saved_at: new Date().toISOString(),
            scheme_description: currentLang === 'hi' ? 'प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से बैंक खाते में ₹6,000/वर्ष का वित्तीय लाभ।' : currentLang === 'mr' ? 'DBT द्वारे बँक खात्यात थेट ₹6,000/वर्ष आर्थिक सहाय्य.' : '₹6,000/year financial benefit directly into bank account via DBT.',
            apply_url: 'https://pmkisan.gov.in'
        },
        {
            scheme_name: currentLang === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY)' : currentLang === 'mr' ? 'प्रधानमंत्री पीक विमा योजना (PMFBY)' : 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
            saved_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            scheme_description: currentLang === 'hi' ? 'कम प्रीमियम पर मौसम व प्राकृतिक आपदाओं से फसलों का संपूर्ण सुरक्षा कवच।' : currentLang === 'mr' ? 'कमी हप्त्यात नैसर्गिक आपत्ती व हवामानातील बदलांपासून सर्वसमावेशक पीक विमा संरक्षण.' : 'Comprehensive crop insurance against weather calamities at low premium.',
            apply_url: 'https://pmfby.gov.in'
        }
    ];

    container.innerHTML = `<div class="history-list">${demoData.map((rec, idx) => `
        <div class="saved-scheme-card" style="animation-delay:${idx * 0.05}s">
            <div>
                <div class="saved-scheme-title">🏛️ ${escapeHtml(rec.scheme_name)}</div>
                <div class="saved-scheme-date">🗓️ Saved ${formatDate(rec.saved_at)}</div>
                <p class="saved-scheme-desc">${escapeHtml(rec.scheme_description)}</p>
                <div class="saved-scheme-actions">
                    <a href="${rec.apply_url}" target="_blank" rel="noopener noreferrer" class="btn-apply-link">${typeof t === 'function' ? t('btn_apply_now') : 'Apply Now →'}</a>
                </div>
            </div>
        </div>`).join('')}
    </div>`;
}
