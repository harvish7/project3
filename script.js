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

});
