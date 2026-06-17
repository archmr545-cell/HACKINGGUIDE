// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navbar links
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer untuk animasi saat scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card, .jenis-item, .teknik-card, .dampak-card, .etika-card, .perlindungan-item, .tool-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Mobile menu toggle (jika ada hamburger menu di masa depan)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Scroll to top functionality
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑ Top';
    button.id = 'scrollToTopBtn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 10px 15px;
        background: linear-gradient(135deg, #0066cc, #00a8ff);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: none;
        font-weight: bold;
        z-index: 999;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Home') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else if (e.key === 'End') {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
});

// Dark mode toggle (optional feature)
function initDarkModeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (savedTheme === 'dark') {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#fff';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initDarkModeToggle();
    
    // Add loading animation
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Performance: Lazy loading images (jika ada)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth animations for text reveal
function revealOnScroll() {
    const reveals = document.querySelectorAll('h2, h3, p');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('reveal');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on page load

// Add active navigation style
const style = document.createElement('style');
style.innerHTML = `
    .nav-links a.active {
        color: #ffd93d;
        border-bottom: 2px solid #ffd93d;
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c🔐 Selamat datang di Pengertian Hacking Guide!', 'color: #0066cc; font-size: 16px; font-weight: bold;');
console.log('%cWebsite edukatif tentang hacking - Gunakan pengetahuan dengan bijak!', 'color: #00a8ff; font-size: 12px;');

// Voice welcome (autoplay)
function speakWelcome() {

    const text = 'salam,selamat datang di hackingguide silahkan belajar pengertian hacking,terimakasih';

    try {
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
            console.warn('SpeechSynthesis API not supported.');
            return;
        }

        // Stop any previous speech to avoid overlap
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        // Pilih voice Indonesia kalau tersedia supaya terdengar lebih natural
        utterance.lang = 'id-ID';
        utterance.rate = 0.92;
        // cowo biasanya terdengar lebih “rendah” kalau pitch agak diturunkan
        utterance.pitch = 0.95;

        const voices = window.speechSynthesis.getVoices?.() || [];

        // Prioritas: cari voice Indonesia yang kira-kira "male" (nama voice sering mengandung kata/penanda gender)
        // fallback: tetap ambil voice Indonesia terdekat
        const lowerVoices = voices.map(v => ({ v, name: (v.name || '').toLowerCase(), lang: (v.lang || '').toLowerCase() }));

        const preferredMale = lowerVoices.find(x =>
            x.lang.includes('id') && (x.name.includes('male') || x.name.includes('pria') || x.name.includes('cow') || x.name.includes('laki'))
        )
        || lowerVoices.find(x =>
            x.lang.includes('id') && (x.name.includes('indones') || x.name.includes('indonesia')) && (x.name.includes('male') || x.name.includes('pria') || x.name.includes('laki'))
        )
        || null;

        const preferredId = lowerVoices.find(x => x.lang.includes('id') && !(preferredMale && x.v === preferredMale.v))
        || lowerVoices.find(x => x.name.includes('indones') || x.name.includes('indonesia'))
        || null;

        const preferred = preferredMale ? preferredMale.v : (preferredId ? preferredId.v : null);

        if (preferred) utterance.voice = preferred;


        window.speechSynthesis.speak(utterance);

    } catch (e) {
        console.warn('Failed to speak welcome:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Autoplay voice on load (Chrome sering butuh waktu untuk memuat daftar voices)
    speakWelcome();
    setTimeout(() => speakWelcome(), 500);
    setTimeout(() => speakWelcome(), 1500);
});



// Roadmap interactivity
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.roadmap-btn');
    const panels = document.querySelectorAll('.roadmap-panel');

    function hideAll() {
        panels.forEach(p => p.classList.add('hidden'));
        buttons.forEach(b => b.classList.remove('active'));
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            hideAll();
            const panel = document.getElementById(target);
            if (panel) panel.classList.remove('hidden');
            btn.classList.add('active');
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Removed auto-scroll on page load (avoid tiba-tiba ke bawah)
    // const defaultBtn = document.querySelector('.roadmap-btn[data-target="cyber"]');
    // if (defaultBtn) defaultBtn.click();
});
