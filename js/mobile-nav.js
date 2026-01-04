/**
 * Handles active state for mobile bottom navigation
 */
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.mobile-bottom-nav__item');
    const sections = document.querySelectorAll('section');

    // Add click handlers
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('nav-active'));
            // Add to clicked
            item.classList.add('nav-active');
        });
    });

    // Intersection Observer for scroll spying
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Find corresponding nav item
                const activeLink = document.querySelector(`.mobile-bottom-nav__item[href="#${id}"]`);

                if (activeLink) {
                    navItems.forEach(nav => nav.classList.remove('nav-active'));
                    activeLink.classList.add('nav-active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
