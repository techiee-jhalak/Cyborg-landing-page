// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                revealElements();
                setTimeout(typeWord, 500); // Start typing after preloader
            }, 500);
        }, 1500);
    }
});

// Custom Cursor
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let outlineX = window.innerWidth / 2;
let outlineY = window.innerHeight / 2;

// Check if touch device to disable custom cursor logic
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

if (!isTouchDevice() && cursorDot && cursorOutline) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    });

    const animateCursor = () => {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .feature-card, .tech-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// Mouse Light Background effect
const mouseLight = document.getElementById('mouseLight');
let lightX = window.innerWidth / 2;
let lightY = window.innerHeight / 2;

if (mouseLight && !isTouchDevice()) {
    const animateLight = () => {
        lightX += (cursorX - lightX) * 0.05;
        lightY += (cursorY - lightY) * 0.05;
        mouseLight.style.transform = `translate(${lightX}px, ${lightY}px)`;
        requestAnimationFrame(animateLight);
    };
    requestAnimationFrame(animateLight);
}

// Navbar Scroll & Mobile Menu
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, { passive: true });

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Advanced Typing Effect
const words = ["SUPERINTELLIGENCE", "EVOLUTION", "CYBERNETICS", "SINGULARITY"];
const typingText = document.getElementById("typingText");
let wordIndex = 0;
let isDeleting = false;
let currentText = "";
let typeSpeed = 100;

function typeWord() {
    if (!typingText) return;
    
    const targetWord = words[wordIndex];
    
    if (isDeleting) {
        currentText = targetWord.substring(0, currentText.length - 1);
        typeSpeed = 40;
    } else {
        currentText = targetWord.substring(0, currentText.length + 1);
        typeSpeed = 100 + Math.random() * 50;
    }
    
    typingText.textContent = currentText;
    
    if (!isDeleting && currentText === targetWord) {
        typeSpeed = 2500;
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeWord, typeSpeed);
}

// Scroll Reveal Animation
const reveals = document.querySelectorAll('.reveal');
function revealElements() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
            
            // Progress bar trigger
            const progressFills = reveal.querySelectorAll('.progress-fill');
            progressFills.forEach(fill => {
                const targetWidth = fill.getAttribute('data-width');
                if (targetWidth) {
                    fill.style.width = targetWidth + '%';
                }
            });
        }
    });
}
window.addEventListener('scroll', revealElements, { passive: true });

// Counter Animation
const counters = document.querySelectorAll('.stat-number');
const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = Number(counter.getAttribute('data-target'));
            const format = counter.getAttribute('data-format') || '';
            const duration = 2500;
            let startTime = null;

            const formatNumber = (num) => {
                if (format === 'M+') return (num / 1000000).toFixed(1) + 'M+';
                if (format === 'K') return Math.floor(num / 1000) + 'K';
                if (format === '%') return num.toFixed(2) + '%';
                if (format === '+') return num + '+';
                return num;
            };

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentVal = easeOutExpo(progress) * target;
                
                counter.innerText = formatNumber(currentVal);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.innerText = formatNumber(target);
                }
            };
            
            requestAnimationFrame(animate);
            observer.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => statObserver.observe(c));

// Contact Form Simulation
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('contactSubmit');
        const btnText = btn.querySelector('.btn-text');
        
        btnText.textContent = "TRANSMITTING...";
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            formSuccess.classList.add('active');
            contactForm.reset();
            
            setTimeout(() => {
                formSuccess.classList.remove('active');
                btnText.textContent = "TRANSMIT MESSAGE";
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';
            }, 4000);
        }, 1500);
    });
}
