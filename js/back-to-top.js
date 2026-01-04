/**
 * Brogrillen Pizzeria - Back to Top & Scroll Behavior Module
 */

document.addEventListener('DOMContentLoaded', function () {
    const backToTopBtn = document.getElementById('backToTop');
    let scrollThrottleTimer;

    function handleScroll() {
        clearTimeout(scrollThrottleTimer);
        scrollThrottleTimer = setTimeout(function () {
            // Back to top button visibility
            if (backToTopBtn) {
                if (window.scrollY > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            }

            // Navbar scroll behavior
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }, 100); // Throttle to improve performance
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
