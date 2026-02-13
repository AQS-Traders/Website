// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // =========================================
    // 1. Custom Cursor Logic
    // =========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows immediately
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with lag (using GSAP for smoothness)
            gsap.to(cursorOutline, {
                x: posX,
                y: posY,
                duration: 0.15,
                ease: "power2.out"
            });
        });

        // Add hover effect for interactable elements
        const interactables = document.querySelectorAll('a, button, .service-item, .industry-card, .feature-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // =========================================
    // 2. Preloader + Premium Hero Entrance
    // =========================================
    const preloader = document.querySelector('.preloader');
    const heroTimeline = gsap.timeline({ paused: true });

    // Build the hero entrance timeline (runs after preloader)
    heroTimeline
        // Subtitle tag slides up + accent line draws in
        .to('.hero-subtitle-tag', {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power3.out",
            onComplete: () => {
                document.querySelector('.hero-subtitle-tag')?.classList.add('active');
            }
        })
        // Title sweeps up
        .to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out"
        }, "-=0.2")
        // Activate shimmer on "Precision"
        .add(() => {
            const shimmer = document.querySelector('.text-shimmer');
            if (shimmer) shimmer.style.animationPlayState = 'running';
        }, "-=0.2")
        // Subtitle paragraph fades in
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out"
        }, "-=0.25")
        // Buttons slide up
        .to('.hero-buttons', {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        }, "-=0.2")
        // Floating particles drift in
        .fromTo('.hero-particles span', {
            opacity: 0,
            scale: 0
        }, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: { each: 0.08, from: "random" },
            ease: "elastic.out(1, 0.5)"
        }, "-=0.6");

    // Continuous floating animation for particles
    gsap.utils.toArray('.hero-particles span').forEach((dot, i) => {
        gsap.to(dot, {
            y: `random(-30, 30)`,
            x: `random(-20, 20)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2
        });
    });

    if (preloader) {
        const tlLoad = gsap.timeline();
        tlLoad.to('.preloader-text span', {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power4.out",
            delay: 0.05
        })
            .to(preloader, {
                y: "-100%",
                duration: 0.5,
                ease: "power4.inOut",
                delay: 0.1,
                onComplete: () => heroTimeline.play()
            });
    } else {
        // No preloader — play hero immediately
        heroTimeline.play();
    }

    // =========================================
    // 3. Scroll Animations (Fade Up Stagger)
    // =========================================
    // Select all sections or containers to trigger animations
    const revealContainers = document.querySelectorAll('.section-header, .features-grid, .stats-grid, .services-highlight, .clients-grid, .about-content, .about-image');

    revealContainers.forEach(container => {
        // Get children to animate
        const children = container.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .stat-item, .feature-card, .service-item, .client-logo, h2, p');

        if (children.length > 0) {
            gsap.from(children, {
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%", // Animates when top of container hits 80% viewport height
                    toggleActions: "play none none reverse"
                },
                y: 50,
                autoAlpha: 0, // Handles visibility
                duration: 0.8,
                stagger: 0.1, // Stagger effect for "premium" feel
                ease: "power2.out"
            });
        }
    });

    // =========================================
    // 4. Parallax Image Effect (Specific Images)
    // =========================================
    const parallaxImages = document.querySelectorAll('.parallax-img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            yPercent: 20, // Move image 20% vertically as we scroll
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // =========================================
    // 5. Sticky Header Shadow (CSS-based transition)
    // =========================================
    const header = document.querySelector('.site-header');
    if (header) {
        ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self) => {
                if (self.direction === 1) { // Scrolling down
                    header.classList.add('scrolled');
                } else if (self.direction === -1 && self.scroll() < 50) { // Top
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // =========================================
    // 7. Dark Mode Toggle
    // =========================================
    const themeToogles = document.querySelectorAll('.theme-toggle'); // In case multiple in DOM
    const html = document.documentElement;

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    themeToogles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    function updateThemeIcons(theme) {
        themeToogles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

    // =========================================
    // 8. Premium Text Transition (Blur & Scale)
    // =========================================
    const textContainer = document.getElementById('text-transition');
    if (textContainer) {
        const phrases = [
            "Precision & Quality",
            "Medical Instruments",
            "Electrical Switchgear",
            "Safety Equipment",
            "Industrial Supplies"
        ];

        // 1. Find longest phrase to set container width
        const longestPhrase = phrases.reduce((a, b) => a.length > b.length ? a : b);

        // 2. Create invisible spacer to prop open the container
        const spacer = document.createElement('span');
        spacer.textContent = longestPhrase;
        spacer.style.visibility = 'hidden';
        spacer.style.opacity = '0';
        spacer.style.position = 'static'; // Important: Static to take up space
        spacer.style.display = 'inline-block';
        spacer.style.height = '0'; // Don't add height, just width
        textContainer.appendChild(spacer);

        // 3. Create absolute spans for animation
        phrases.forEach((phrase, index) => {
            const span = document.createElement('span');
            span.classList.add('text-transition-word');
            // Apply gradient class if not handled by CSS selector
            // span.classList.add('text-shimmer'); // Already handled by CSS
            span.textContent = phrase;
            textContainer.appendChild(span);

            // Set initial state: ALL Hidden (we animate first one IN manually)
            gsap.set(span, { opacity: 0, y: 30, filter: "blur(10px)", scale: 1.1 });
        });

        let activeIndex = 0;
        let isAnimating = false;

        // 4. Trigger Instant Entrance for First Element
        // +1 because children[0] is the spacer
        if (textContainer.children.length > 1) {
            gsap.to(textContainer.children[1], {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.1 // Immediate start
            });
        }

        function nextPhrase() {
            if (isAnimating) return;
            isAnimating = true;

            // +1 to skip spacer
            const currentSpan = textContainer.children[activeIndex + 1];
            const nextIndex = (activeIndex + 1) % phrases.length;
            const nextSpan = textContainer.children[nextIndex + 1];

            // Create timeline for seamless transition
            const tl = gsap.timeline({
                onComplete: () => {
                    activeIndex = nextIndex;
                    isAnimating = false;
                }
            });

            // Animate current OUT (Up, Blur, Fade Out)
            tl.to(currentSpan, {
                y: -30,
                opacity: 0,
                filter: "blur(10px)",
                scale: 0.9,
                duration: 0.8,
                ease: "power2.inOut"
            })
                // Animate next IN (Up from bottom, Unblur, Fade In)
                .fromTo(nextSpan,
                    { y: 30, opacity: 0, filter: "blur(10px)", scale: 1.1 },
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        duration: 0.8,
                        ease: "power2.out"
                    },
                    "-=0.6" // Overlap for premium feel
                );

            // Reset the "old" currentSpan after it's gone so it's ready for next time
            gsap.set(currentSpan, { y: 30, scale: 1.1, delay: 0.8 });
        }

        // Start cycling loop after initial delay
        setTimeout(() => {
            setInterval(nextPhrase, 3500);
        }, 1200);
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');

            // Animate links on open
            if (mainNav.classList.contains('active')) {
                gsap.from('.main-nav li', {
                    x: -20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    delay: 0.2
                });
            }
        });
    }

    // =========================================
    // 6. Stats Counter Animation
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';

            ScrollTrigger.create({
                trigger: stat,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    let obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => {
                            stat.textContent = Math.round(obj.val) + suffix;
                        }
                    });
                }
            });
        });
    }

    // =========================================
    // 9. 3D Tilt Effect on Cards
    // =========================================
    const tiltCards = document.querySelectorAll('.testimonial-card, .service-item, .industry-card');

    if (tiltCards.length > 0) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate rotation based on cursor position
                const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    transformOrigin: "center",
                    ease: "power1.out",
                    duration: 0.4
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: "power2.out",
                    duration: 0.8
                });
            });
        });
    }

    // =========================================
    // 10. Magnetic Buttons
    // =========================================
    const magneticBtns = document.querySelectorAll('.btn');

    if (magneticBtns.length > 0) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Strength of magnet (lower is stronger pull distance)
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // =========================================
    // 12. Polish Pack (Scroll Progress & Back to Top)
    // =========================================

    // Inject HTML Elements
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'scroll-progress-container';
    progressBarContainer.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBarContainer);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to Top');
    document.body.appendChild(backToTopBtn);

    const progressBar = progressBarContainer.querySelector('.scroll-progress-bar');

    // Scroll Logic
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        // Update Progress Bar
        progressBar.style.width = scrollPercent + '%';

        // Show/Hide Back to Top Button
        if (scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Back to Top Click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
