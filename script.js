// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        if (window.innerWidth < 768) {
            const link = dropdown.querySelector('a');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdownContent.style.display = 
                    dropdownContent.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
    
    // Image gallery hover effect
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    galleryImages.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s';
        });
        
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Apply page enter animation to all pages except home
    const isHome = currentPage === '' || currentPage === 'index.html';
    if (!isHome) {
        const mainOrContent = document.querySelector('main, .page-content, body');
        if (mainOrContent) {
            mainOrContent.classList.add('page-enter');
        }
    }

    // Parallax hero interactions (scroll + mouse move)
    const heroSection = document.querySelector('.parallax-hero');
    const heroImages = heroSection ? Array.from(heroSection.querySelectorAll('.hero-image')) : [];

    if (heroSection && heroImages.length > 0) {
        let targetY = 0;
        let targetX = 0;
        let currentY = 0;
        let currentX = 0;
        let animationFrameId = null;
        let active = 0;
        let rotateTimer = null;

        /**
         * Clamp helper to keep transforms within subtle bounds
         */
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        /**
         * Smoothly interpolate toward target offsets to avoid sudden jumps
         */
        const animate = () => {
            currentY += (targetY - currentY) * 0.08;
            currentX += (targetX - currentX) * 0.08;

            // Apply transform to all layers with slight depth multipliers
            heroImages.forEach(img => {
                const depth = parseFloat(img.getAttribute('data-depth') || '1');
                img.style.transform = `translate3d(calc(-50% + ${currentX * (depth - 0.9)}px), calc(-50% + ${currentY * (depth - 0.9)}px), 0) scale(1.02)`;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        /**
         * Update vertical parallax based on scroll depth relative to hero
         */
        const handleScroll = () => {
            const rect = heroSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const delta = viewportCenter - sectionCenter;

            targetY = clamp(delta * 0.04, -40, 40);
        };

        /**
         * Update subtle horizontal parallax based on pointer position
         */
        const handleMouseMove = (event) => {
            const bounds = heroSection.getBoundingClientRect();
            const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
            targetX = clamp(relativeX * 30, -30, 30);
        };

        /**
         * Reset horizontal motion when pointer leaves the hero
         */
        const resetMouse = () => {
            targetX = 0;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        heroSection.addEventListener('mousemove', handleMouseMove);
        heroSection.addEventListener('mouseleave', resetMouse);

        handleScroll();
        animate();

        // Initialize first image visible
        heroImages.forEach((img, i) => img.classList.toggle('is-active', i === 0));

        // Crossfade between hero images every 3 seconds
        const rotate = () => {
            const prev = active;
            active = (active + 1) % heroImages.length;
            heroImages[prev].classList.remove('is-active');
            heroImages[active].classList.add('is-active');
        };

        rotateTimer = setInterval(rotate, 3000);

        // Ensure animation frame is canceled if the page is hidden/unloaded
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                if (rotateTimer) {
                    clearInterval(rotateTimer);
                    rotateTimer = null;
                }
            } else if (!document.hidden && !animationFrameId) {
                animationFrameId = requestAnimationFrame(animate);
                if (!rotateTimer) rotateTimer = setInterval(rotate, 3000);
            }
        });
    }
});
