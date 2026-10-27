/* ═══════════════════════════════════════════════
   AgriHub — Core JavaScript
   Navbar, Modals, Scroll, Animations, Toast, Utils
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initModals();
    initLanguageSelector();
    initScrollToTop();
    initPageProgress();
    initPasswordToggles();
    initActiveNavHighlight();
});

/* ── Page Progress Bar ── */
function initPageProgress() {
    const bar = document.getElementById('pageProgress');
    if (!bar) return;
    bar.style.width = '100%';
    setTimeout(() => { bar.style.opacity = '0'; setTimeout(() => bar.remove(), 300); }, 600);
}

/* ── Navbar Scroll ── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
    // Set initial state
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Hamburger toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
            if (navOverlay) navOverlay.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', closeNav);
    }

    // Close on nav link click
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }

    function closeNav() {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('open');
        navOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    }
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* ── Scroll Animations (Intersection Observer) ── */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach(el => observer.observe(el));

    // Number counter animation for hero stats
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statsObserver.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    if (isNaN(target)) return;
    const suffix = el.textContent.includes('+') ? '+' : '';
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

/* ── Modal System ── */
function initModals() {
    const openLogin = document.getElementById('openLogin');
    const openRegister = document.getElementById('openRegister');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    openLogin?.addEventListener('click', () => openModal('loginModal'));
    openRegister?.addEventListener('click', () => openModal('registerModal'));
    closeLogin?.addEventListener('click', () => closeModal('loginModal'));
    closeRegister?.addEventListener('click', () => closeModal('registerModal'));

    switchToRegister?.addEventListener('click', () => {
        closeModal('loginModal');
        setTimeout(() => openModal('registerModal'), 200);
    });
    switchToLogin?.addEventListener('click', () => {
        closeModal('registerModal');
        setTimeout(() => openModal('loginModal'), 200);
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Clear form errors
    modal.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    modal.querySelectorAll('.form-alert').forEach(a => { a.classList.add('hidden'); a.textContent = ''; });
    modal.querySelectorAll('input').forEach(i => { i.classList.remove('error', 'success'); });
}

/* ── Language Selector ── */
function initLanguageSelector() {
    const selectors = document.querySelectorAll('#languageSelector, .lang-select');
    if (!selectors.length) return;

    // Load saved language
    const savedLang = localStorage.getItem('agrihub_lang') || 'en';
    selectors.forEach(sel => sel.value = savedLang);
    applyTranslations(savedLang);

    selectors.forEach(sel => {
        sel.addEventListener('change', () => {
            const lang = sel.value;
            applyTranslations(lang);
        });
    });
}

/* ── Scroll to Top Button ── */
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 300);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ── Password Toggle ── */
function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.closest('.input-wrapper').querySelector('input');
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
                btn.textContent = input.type === 'password' ? '👁️' : '🙈';
            }
        });
    });
}

/* ── Active Nav Highlighting ── */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ── Form Validation Helpers ── */
function validateMobile(value) {
    return /^[6-9]\d{9}$/.test(value);
}

function validatePassword(value) {
    return value && value.length >= 6;
}

function validateName(value) {
    return /^[a-zA-Z\s]{3,}$/.test(value.trim());
}

function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const input = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (input) { input.classList.add('error'); input.classList.remove('success'); }
}

function clearFieldError(fieldId) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const input = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = '';
    if (input) { input.classList.remove('error'); input.classList.add('success'); }
}

function showFormAlert(containerId, message, type) {
    const alert = document.getElementById(containerId);
    if (!alert) return;
    alert.textContent = message;
    alert.className = `form-alert ${type}`;
    alert.classList.remove('hidden');
}

function setButtonLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    if (loading) {
        btn.disabled = true;
        if (text) text.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        if (text) text.classList.remove('hidden');
        if (spinner) spinner.classList.add('hidden');
    }
}

/* ── Toast Notifications ── */
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
    return container;
}
