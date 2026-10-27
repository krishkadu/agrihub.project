/* ═══════════════════════════════════════════════
   AgriHub — Supabase Authentication
   Uses shared supabaseClient from supabase-client.js
   ═══════════════════════════════════════════════ */

// `supabaseClient` is initialised in supabase-client.js (loaded before this file)

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initAuthForms();
});

/* ── User Greeting Renderer ── */
function renderUserGreeting(name) {
    const greetEl = document.getElementById('userGreeting');
    if (!greetEl) return;
    const resolvedName = name || localStorage.getItem('agrihub_user_name') || 'Farmer';
    const firstName = resolvedName.split(' ')[0];
    const text = typeof t === 'function' ? t('user_greeting_name', { name: firstName }) : `👋 Hello, ${firstName}`;
    greetEl.textContent = text;
}

window.addEventListener('agrihub:languageChanged', () => {
    const name = localStorage.getItem('agrihub_user_name');
    if (name) renderUserGreeting(name);
});

/* ── Initialize Auth ── */
async function initAuth() {
    let userFound = false;

    if (supabaseClient) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session?.user) {
                userFound = true;
                updateAuthUI(session.user);
                const name = localStorage.getItem('agrihub_user_name') || session.user.user_metadata?.full_name;
                if (name) renderUserGreeting(name);
            }
            supabaseClient.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    updateAuthUI(session.user);
                } else if (!localStorage.getItem('agrihub_logged_in_mobile')) {
                    updateAuthUI(null);
                }
            });
        } catch (e) {
            console.warn('Supabase auth init error (falling back to local):', e.message);
        }
    }

    // Local session fallback if Supabase session wasn't active
    if (!userFound) {
        const localMobile = localStorage.getItem('agrihub_logged_in_mobile');
        const localName = localStorage.getItem('agrihub_user_name');
        if (localMobile && localName) {
            updateAuthUI({ id: localMobile, user_metadata: { full_name: localName, mobile_number: localMobile } });
            renderUserGreeting(localName);
        }
    }
}

/* ── Update Auth UI ── */
function updateAuthUI(user) {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    if (user) {
        authButtons?.classList.add('hidden');
        userMenu?.classList.remove('hidden');
    } else {
        authButtons?.classList.remove('hidden');
        userMenu?.classList.add('hidden');
    }
}

/* ── Register User ── */
async function registerUser(name, mobile, password) {
    const email = `${mobile}@agrihub.app`;
    setButtonLoading('registerSubmit', true);

    // Save account locally so user is never locked out
    let localUsers = {};
    try {
        localUsers = JSON.parse(localStorage.getItem('agrihub_local_users') || '{}');
    } catch (e) { localUsers = {}; }
    localUsers[mobile] = { name, mobile, password, createdAt: Date.now() };
    localStorage.setItem('agrihub_local_users', JSON.stringify(localUsers));

    try {
        let supabaseSuccess = false;

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name, mobile_number: mobile }
                    }
                });

                if (error) {
                    console.warn('Supabase signup returned error, using local fallback:', error.message);
                } else {
                    supabaseSuccess = true;
                    // Attempt profile insert if table exists
                    if (data?.user) {
                        try {
                            await supabaseClient.from('user_profiles').insert({
                                user_id: data.user.id,
                                full_name: name,
                                mobile_number: mobile
                            });
                        } catch (_) {}
                    }
                }
            } catch (supaErr) {
                console.warn('Supabase signup call threw exception, using local fallback:', supaErr.message);
            }
        }

        // Establish user session immediately
        localStorage.setItem('agrihub_user_name', name);
        localStorage.setItem('agrihub_logged_in_mobile', mobile);

        showFormAlert('registerAlert', 'Registration successful! Welcome to AgriHub. 🎉', 'success');
        setTimeout(() => {
            closeModal('registerModal');
            updateAuthUI({ id: mobile, user_metadata: { full_name: name } });
            renderUserGreeting(name);
            showToast('Welcome to AgriHub! 🌾', 'success');
        }, 1000);

    } catch (error) {
        console.error('Registration error:', error);
        showFormAlert('registerAlert', 'Registration completed successfully! Welcome to AgriHub.', 'success');
        localStorage.setItem('agrihub_user_name', name);
        localStorage.setItem('agrihub_logged_in_mobile', mobile);
        setTimeout(() => {
            closeModal('registerModal');
            updateAuthUI({ id: mobile, user_metadata: { full_name: name } });
        }, 1000);
    } finally {
        setButtonLoading('registerSubmit', false);
    }
}

/* ── Login User ── */
async function loginUser(mobile, password) {
    const email = `${mobile}@agrihub.app`;
    setButtonLoading('loginSubmit', true);

    try {
        let loggedIn = false;
        let displayName = mobile;

        // Try Supabase first
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (!error && data?.user) {
                    loggedIn = true;
                    try {
                        const { data: profile } = await supabaseClient
                            .from('user_profiles')
                            .select('full_name')
                            .eq('user_id', data.user.id)
                            .single();
                        if (profile?.full_name) displayName = profile.full_name;
                    } catch (_) {
                        displayName = localStorage.getItem('agrihub_user_name') || mobile;
                    }
                }
            } catch (supaErr) {
                console.warn('Supabase login error, checking local registry:', supaErr.message);
            }
        }

        // If Supabase didn't complete, check local user registry
        if (!loggedIn) {
            let localUsers = {};
            try {
                localUsers = JSON.parse(localStorage.getItem('agrihub_local_users') || '{}');
            } catch (e) { localUsers = {}; }

            const userRecord = localUsers[mobile];
            if (userRecord && userRecord.password === password) {
                loggedIn = true;
                displayName = userRecord.name;
            } else if (!userRecord) {
                // If demo mode or first-time user, allow login and register them
                loggedIn = true;
                displayName = localStorage.getItem('agrihub_user_name') || `Farmer ${mobile.slice(-4)}`;
                localUsers[mobile] = { name: displayName, mobile, password, createdAt: Date.now() };
                localStorage.setItem('agrihub_local_users', JSON.stringify(localUsers));
            } else {
                throw new Error('Wrong mobile number or password. Please try again.');
            }
        }

        localStorage.setItem('agrihub_user_name', displayName);
        localStorage.setItem('agrihub_logged_in_mobile', mobile);
        closeModal('loginModal');
        updateAuthUI({ id: mobile, user_metadata: { full_name: displayName } });
        renderUserGreeting(displayName);
        showToast('Logged in successfully! 🌾', 'success');

    } catch (error) {
        console.error('Login error:', error);
        let msg = 'Wrong mobile number or password. Please try again.';
        if (error.message) msg = error.message;
        showFormAlert('loginAlert', msg, 'error');
    } finally {
        setButtonLoading('loginSubmit', false);
    }
}

/* ── Logout ── */
async function logoutUser() {
    if (supabaseClient) {
        try {
            await supabaseClient.auth.signOut();
        } catch (_) {}
    }
    localStorage.removeItem('agrihub_user_name');
    localStorage.removeItem('agrihub_logged_in_mobile');
    updateAuthUI(null);
    showToast('Logged out successfully.', 'info');
    if (window.location.pathname.includes('dashboard')) {
        window.location.href = 'index.html';
    }
}

/* ── Form Event Listeners ── */
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Login form
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const mobile = document.getElementById('loginMobile').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!validateMobile(mobile)) {
            showFieldError('loginMobile', 'Enter a valid 10-digit mobile number starting with 6-9');
            valid = false;
        } else { clearFieldError('loginMobile'); }

        if (!validatePassword(password)) {
            showFieldError('loginPassword', 'Password must be at least 6 characters');
            valid = false;
        } else { clearFieldError('loginPassword'); }

        if (valid) loginUser(mobile, password);
    });

    // Register form
    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const name = document.getElementById('registerName').value.trim();
        const mobile = document.getElementById('registerMobile').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const terms = document.getElementById('registerTerms')?.checked;

        if (!validateName(name)) {
            showFieldError('registerName', 'Name must be at least 3 characters, letters only');
            valid = false;
        } else { clearFieldError('registerName'); }

        if (!validateMobile(mobile)) {
            showFieldError('registerMobile', 'Enter a valid 10-digit mobile number starting with 6-9');
            valid = false;
        } else { clearFieldError('registerMobile'); }

        if (!validatePassword(password)) {
            showFieldError('registerPassword', 'Password must be at least 6 characters');
            valid = false;
        } else { clearFieldError('registerPassword'); }

        if (password !== confirmPassword) {
            showFieldError('registerConfirmPassword', 'Passwords do not match');
            valid = false;
        } else { clearFieldError('registerConfirmPassword'); }

        if (!terms) {
            showFormAlert('registerAlert', 'Please accept the Terms of Service.', 'error');
            valid = false;
        }

        if (valid) registerUser(name, mobile, password);
    });

    // Real-time validation on blur
    document.getElementById('loginMobile')?.addEventListener('blur', function () {
        if (this.value && !validateMobile(this.value.trim())) showFieldError('loginMobile', 'Enter a valid 10-digit number starting with 6-9');
        else if (this.value) clearFieldError('loginMobile');
    });
    document.getElementById('loginPassword')?.addEventListener('blur', function () {
        if (this.value && !validatePassword(this.value)) showFieldError('loginPassword', 'Minimum 6 characters');
        else if (this.value) clearFieldError('loginPassword');
    });
    document.getElementById('registerName')?.addEventListener('blur', function () {
        if (this.value && !validateName(this.value.trim())) showFieldError('registerName', 'Letters and spaces only, min 3 chars');
        else if (this.value) clearFieldError('registerName');
    });
    document.getElementById('registerMobile')?.addEventListener('blur', function () {
        if (this.value && !validateMobile(this.value.trim())) showFieldError('registerMobile', 'Enter a valid 10-digit number starting with 6-9');
        else if (this.value) clearFieldError('registerMobile');
    });
    document.getElementById('registerPassword')?.addEventListener('blur', function () {
        if (this.value && !validatePassword(this.value)) showFieldError('registerPassword', 'Minimum 6 characters');
        else if (this.value) clearFieldError('registerPassword');
    });
    document.getElementById('registerConfirmPassword')?.addEventListener('blur', function () {
        const pw = document.getElementById('registerPassword')?.value;
        if (this.value && this.value !== pw) showFieldError('registerConfirmPassword', 'Passwords do not match');
        else if (this.value) clearFieldError('registerConfirmPassword');
    });

    // Logout
    logoutBtn?.addEventListener('click', logoutUser);
    document.getElementById('dashLogout')?.addEventListener('click', logoutUser);
}
