// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.querySelector('nav').insertBefore(mobileMenuToggle, navMenu);
    
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
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

    // Hero slider autoplay
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let current = 0;
    const total = slides.length;

    function showSlide(index) {
        slides.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
        current = index;
    }

    function nextSlide() {
        const next = (current + 1) % total;
        showSlide(next);
    }

    if (slides.length > 0) {
        const intervalMs = 5000; // 5 seconds
        let timer = setInterval(nextSlide, intervalMs);

        // Allow manual navigation via dots
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                clearInterval(timer);
                timer = setInterval(nextSlide, intervalMs);
            });
        });

        // Resize slider to fill viewport below navbar
        function sizeHero() {
            const hero = document.querySelector('.hero-slider');
            if (!hero) return;
            // Compute the hero's top relative to the viewport and fill to bottom
            const top = hero.getBoundingClientRect().top; // px from viewport top
            const available = Math.max(300, Math.ceil(window.innerHeight - top));
            hero.style.height = available + 'px';
            document.querySelectorAll('.slide-img').forEach(img => {
                img.style.height = available + 'px';
            });
        }

        // Ensure we size after image load to avoid gaps
        sizeHero();
        document.querySelectorAll('.slide-img').forEach(img => {
            if (img.complete) return;
            img.addEventListener('load', sizeHero);
        });
        window.addEventListener('resize', sizeHero);
    }
});