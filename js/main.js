/* ============================================
   Helena Bourdillon — Main JavaScript
   ============================================ */

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// Scroll-based animations (fade-in)
const fadeElements = document.querySelectorAll('.fade-in');

if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

// Testimonials Carousel (infinite loop)
const carousel = document.querySelector('.carousel');

if (carousel) {
    const container = carousel.querySelector('.carousel-container');
    const track = carousel.querySelector('.carousel-track');
    const realCards = Array.from(track.querySelectorAll('.testimonial-card'));
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const total = realCards.length;
    let autoTimer = null;
    let isTransitioning = false;

    // Clone first and last cards for seamless loop
    const firstClone = realCards[0].cloneNode(true);
    const lastClone = realCards[total - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    // Track position includes the prepended clone, so real slide 0 = position 1
    let pos = 1;

    function setPos(p, animate) {
        if (animate) {
            track.style.transition = 'transform 0.45s ease';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = 'translateX(-' + (p * 100) + '%)';
        pos = p;
    }

    // Set container height to tallest card
    function updateHeight() {
        let maxH = 0;
        realCards.forEach(function(card) {
            if (card.offsetHeight > maxH) maxH = card.offsetHeight;
        });
        if (container && maxH > 0) {
            container.style.height = maxH + 'px';
        }
    }

    // Build dots
    realCards.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function() { goToSlide(i); });
        dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateDots() {
        var realIndex = ((pos - 1) % total + total) % total;
        dots.forEach(function(d, i) { d.classList.toggle('active', i === realIndex); });
    }

    // After a transition ends, silently snap if we're on a clone
    track.addEventListener('transitionend', function() {
        isTransitioning = false;
        if (pos === 0) {
            // On the last-clone (prepended), snap to real last
            setPos(total, false);
        } else if (pos === total + 1) {
            // On the first-clone (appended), snap to real first
            setPos(1, false);
        }
    });

    function goToSlide(realIndex) {
        if (isTransitioning) return;
        isTransitioning = true;
        setPos(realIndex + 1, true);
        updateDots();
        resetAuto();
    }

    function next() {
        if (isTransitioning) return;
        isTransitioning = true;
        setPos(pos + 1, true);
        updateDots();
        resetAuto();
    }

    function prev() {
        if (isTransitioning) return;
        isTransitioning = true;
        setPos(pos - 1, true);
        updateDots();
        resetAuto();
    }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Swipe support
    var touchStartX = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        pauseAuto();
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
        resetAuto();
    }, { passive: true });

    // Auto-advance
    function startAuto() {
        autoTimer = setInterval(next, 6000);
    }

    function pauseAuto() {
        clearInterval(autoTimer);
    }

    function resetAuto() {
        pauseAuto();
        startAuto();
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', pauseAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Keyboard
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // Initialise: show first real card (position 1, no animation)
    setPos(1, false);
    updateHeight();
    window.addEventListener('resize', updateHeight);

    startAuto();
}

// Contact form basic validation feedback
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
    });
}
