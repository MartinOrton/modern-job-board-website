document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-demo-path]').forEach((link) => {
        const path = link.getAttribute('data-demo-path') || '/jobs/';
        link.setAttribute('href', path.startsWith('/') ? path : `/${path}`);
    });
    // Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Subtle press feedback for interactive controls (adds a short CSS hook)
    document.querySelectorAll('.btn, .share-btn, .back-to-top, .mobile-toggle').forEach((el) => {
        el.addEventListener('pointerdown', () => el.classList.add('is-pressed'));
        const clearPress = () => el.classList.remove('is-pressed');
        el.addEventListener('pointerup', clearPress);
        el.addEventListener('pointerleave', clearPress);
        el.addEventListener('pointercancel', clearPress);
    });

    // Hero job rows: keyboard-friendly focus outline via class
    document.querySelectorAll('.job-item').forEach((item) => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.classList.toggle('is-active');
            }
        });
    });

    // Navbar scroll effect + layout offsets for sticky sidebar / content hero
    const navbar = document.getElementById('navbar');
    const root = document.documentElement;

    const isDemoNavbar = navbar && navbar.classList.contains('navbar--demo');

    const updateNavbarLayout = () => {
        if (!navbar) {
            return;
        }

        if (isDemoNavbar || window.scrollY > 10) {
            navbar.classList.add('scrolled');
            document.body.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('scrolled');
            document.body.classList.remove('navbar-scrolled');
        }

        const adminBar = document.getElementById('wpadminbar');
        const adminBarHeight = adminBar ? adminBar.offsetHeight : 0;

        root.style.setProperty('--mjb-admin-bar-height', `${adminBarHeight}px`);
        root.style.setProperty('--mjb-navbar-height', `${navbar.offsetHeight}px`);
        root.style.setProperty(
            '--mjb-header-offset',
            `${adminBarHeight + navbar.offsetHeight}px`
        );
    };

    updateNavbarLayout();
    window.addEventListener('scroll', updateNavbarLayout, { passive: true });
    window.addEventListener('resize', updateNavbarLayout);

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    const closeMobileMenu = () => {
        if (!mobileMenu || !mobileToggle) {
            return;
        }

        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');

        const iconMenu = mobileToggle.querySelector('.icon-menu');
        const iconClose = mobileToggle.querySelector('.icon-close');
        if (iconMenu) {
            iconMenu.classList.remove('hidden');
        }
        if (iconClose) {
            iconClose.classList.add('hidden');
        }
    };

    if (mobileToggle && mobileMenu) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-controls', 'mobile-menu');

        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            const iconMenu = mobileToggle.querySelector('.icon-menu');
            const iconClose = mobileToggle.querySelector('.icon-close');

            if (iconMenu && iconClose) {
                if (isOpen) {
                    iconMenu.classList.add('hidden');
                    iconClose.classList.remove('hidden');
                } else {
                    iconMenu.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                }
            }
        });

        // Close on any mobile drawer link (fallback + assigned menus).
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Social Share Button Interactions (Prevent bubbling if clicking share)
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
        });
    });

    // Back to Top functionality
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for header links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = parseFloat(
                    getComputedStyle(root).getPropertyValue('--mjb-header-offset')
                ) || (navbar ? navbar.offsetHeight : 80);
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
