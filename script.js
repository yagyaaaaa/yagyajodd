/* ======================================================
   YAGYA JODD — MAIN SCRIPT
   ====================================================== */

/* --- ASSET REFS --- */
const startOverlay = document.getElementById('start-overlay');
const customModal = document.getElementById('custom-modal');
const loaderOverlay = document.getElementById('loader-overlay');
const bloodScreen = document.getElementById('blood-screen');
const mainContent = document.getElementById('main-content');
const terminal = document.getElementById('security-terminal');
const gatekeeperScreen = document.getElementById('gatekeeper-screen');
const rejectionScreen = document.getElementById('rejection-screen');
const mainNav = document.getElementById('main-nav');

const bgAudio = document.getElementById('bg-audio');
const laserSfx = document.getElementById('sfx-laser');

/* --- CUSTOM CURSOR --- */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => {
    cursorGlow.style.width = '30px';
    cursorGlow.style.height = '30px';
    cursorGlow.style.borderColor = 'var(--cyber-blue)';
});
document.addEventListener('mouseup', () => {
    cursorGlow.style.width = '20px';
    cursorGlow.style.height = '20px';
    cursorGlow.style.borderColor = 'var(--neon-pink)';
});

/* --- PARTICLE SYSTEM --- */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#ff3366' : '#00f3ff';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* --- LOADING MEME TEXTS --- */
const loadingMemes = [
    "// bhai ruk jaa ek second",
    "// initializing sigma protocols...",
    "// downloading rizz...",
    "// bhai kya kar raha hai tu",
    "// no cap loading fr fr",
    "// aur bata yaar...",
    "// villain arc commencing",
    "// touch grass? nah.",
    "// main character loading...",
];

/* --- 1. START --- */
startOverlay.addEventListener('click', () => {
    bgAudio.volume = 0.3;
    bgAudio.play().catch(e => console.log("Audio blocked", e));
    startOverlay.style.opacity = '0';
    startOverlay.style.transition = 'opacity 0.5s';
    setTimeout(() => {
        startOverlay.style.display = 'none';
        mainContent.style.opacity = '1';
        document.body.style.overflowY = 'auto';
        mainNav.classList.add('visible');
        initScrollAnimations();
        initSlider();
        initCounters();
        duplicateTickerTrack();
    }, 500);
});

/* --- 2. MODAL LOGIC --- */
function openModal() { customModal.style.display = 'flex'; }
function closeModal() { customModal.style.display = 'none'; }

/* --- 3. CRASH SEQUENCE --- */
function startCrash() {
    closeModal();
    mainContent.style.opacity = '0';
    setTimeout(() => { mainContent.style.display = 'none'; }, 800);
    document.body.style.overflowY = 'hidden';

    loaderOverlay.style.display = 'flex';

    let progress = 0;
    const batteryFill = document.getElementById('battery-fill');
    const loadingText = document.getElementById('loading-text');
    const loadingMeme = document.getElementById('loading-meme');

    let memeIdx = 0;
    const memeInterval = setInterval(() => {
        loadingMeme.textContent = loadingMemes[memeIdx % loadingMemes.length];
        memeIdx++;
    }, 600);

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 2;
        if (progress > 99) progress = 99;
        batteryFill.style.width = progress + '%';
        loadingText.innerText = 'CHARGING: ' + progress + '%';

        if (progress === 99) {
            clearInterval(interval);
            clearInterval(memeInterval);
            loadingText.innerText = 'CRITICAL ERROR';
            loadingText.style.color = 'red';
            loaderOverlay.classList.add('error-mode');

            setTimeout(() => {
                bgAudio.pause();
                bgAudio.currentTime = 0;
                laserSfx.volume = 1.0;
                laserSfx.play();
                loaderOverlay.style.display = 'none';
                bloodScreen.style.height = '100%';
                setTimeout(() => {
                    gatekeeperScreen.style.display = 'flex';
                }, 1000);
            }, 1500);
        }
    }, 50);
}

/* --- 4. GATEKEEPER --- */
function gatekeeperYes() {
    gatekeeperScreen.style.display = 'none';
    terminal.style.display = 'block';
    document.getElementById('input-pass').focus();
}
function gatekeeperNo() {
    gatekeeperScreen.style.display = 'none';
    rejectionScreen.style.display = 'flex';
}
function closeTerminal() {
    terminal.style.display = 'none';
    gatekeeperScreen.style.display = 'flex';
}

/* --- 5. PASSCODE --- */
function checkLogin() {
    const pass = document.getElementById('input-pass').value;
    if (pass === "jodd" || pass === "JODD") {
        window.location.href = "safehouse/";
    } else {
        const err = document.getElementById('term-error');
        err.style.display = 'block';
        terminal.style.animation = 'shake 0.3s';
        setTimeout(() => { terminal.style.animation = ''; }, 300);
    }
}
document.getElementById('input-pass').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLogin();
});

/* --- SOS MODAL --- */
const sosQuotes = [
    "// bhai scene kya hai, bata na",
    "// aur bata yaar, sab theek?",
    "// kya chal raha hai, sach mein",
    "// bas ek message maar",
    "// I'm here, no cap",
    "// haan bhai, bol",
];
function openSosModal() {
    const modal = document.getElementById('sos-modal');
    modal.style.display = 'flex';
    document.getElementById('sos-quote').textContent = sosQuotes[Math.floor(Math.random() * sosQuotes.length)];
}
function closeSosModal() {
    document.getElementById('sos-modal').style.display = 'none';
}

/* --- PLAY SOUND UTIL --- */
function playSound(id) {
    const el = document.getElementById(id);
    if (el) { el.currentTime = 0; el.play().catch(() => {}); }
}

/* --- NAV SCROLL EFFECT --- */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
});
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- SCROLL REVEAL ANIMATIONS --- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stagger child reveal-cards
                const cards = entry.target.querySelectorAll('.reveal-card');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('revealed'), i * 120);
                });
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
}

/* --- COUNTERS --- */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = parseInt(entry.target.dataset.target);
                let current = 0;
                const increment = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) { current = target; clearInterval(timer); }
                    entry.target.textContent = current;
                }, 30);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

/* --- IMAGE SLIDER --- */
let currentSlide = 0;
const totalSlides = 5;

function initSlider() {
    const dotsContainer = document.getElementById('slider-dots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function goToSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    dots[currentSlide]?.classList.add('active');
}

function slideChange(dir) {
    goToSlide(currentSlide + dir);
}

// Auto-advance slider every 4s
setInterval(() => {
    if (document.getElementById('image-slider')) {
        goToSlide(currentSlide + 1);
    }
}, 4000);

/* --- TICKER DUPLICATE (for seamless loop) --- */
function duplicateTickerTrack() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
}

/* --- ROBOT HOVER EASTER EGG --- */
const roboImg = document.getElementById('robo-img');
if (roboImg) {
    roboImg.addEventListener('click', () => {
        playSound('sfx-vine-boom');
        roboImg.style.transform = 'scale(1.2) rotate(360deg)';
        roboImg.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            roboImg.style.transform = '';
        }, 600);
    });
}

/* --- KONAMI CODE EASTER EGG --- */
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === konamiCode.length) {
            konamiIdx = 0;
            triggerKonami();
        }
    } else {
        konamiIdx = 0;
    }
});
function triggerKonami() {
    document.body.style.transition = 'filter 0.3s';
    document.body.style.filter = 'hue-rotate(180deg)';
    playSound('sfx-haan-bhai');
    setTimeout(() => {
        document.body.style.filter = '';
    }, 3000);
}

