/**
 * Brogrillen Pizzeria - Opening Hours Module
 * Handles opening status display and admin click handler
 */

document.addEventListener('DOMContentLoaded', function () {
    // Update hero opening status indicator
    function updateOpenStatus() {
        const openBadge = document.getElementById('openBadge');
        const closedBadge = document.getElementById('closedBadge');

        if (!openBadge || !closedBadge) return;

        const now = new Date();
        const currentHour = now.getHours();

        // Check if currently open (11:00 - 21:00)
        if (currentHour >= 11 && currentHour < 21) {
            openBadge.innerHTML = '<i class="fas fa-check-circle me-1"></i> <span data-translate="currently_open">Öppet nu</span>';
            openBadge.classList.remove('d-none');
            closedBadge.classList.add('d-none');
        } else {
            closedBadge.innerHTML = '<i class="fas fa-clock me-1"></i> <span data-translate="currently_closed">Stängt</span>';
            openBadge.classList.add('d-none');
            closedBadge.classList.remove('d-none');
        }
    }

    // Update contact section opening status
    function updateContactOpenStatus() {
        const currentlyOpen = document.getElementById('currentlyOpen');
        if (!currentlyOpen) return;

        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour >= 11 && currentHour < 21) {
            currentlyOpen.innerHTML = '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i> Öppet nu</span>';
        } else {
            currentlyOpen.innerHTML = '<span class="badge bg-danger"><i class="fas fa-clock me-1"></i> Stängt</span>';
        }
    }

    // Load opening hours from backend
    async function loadOpeningHours() {
        try {
            if (typeof fetchSettings !== 'function') return;

            const data = await fetchSettings();
            if (data.settings && data.settings.openingHours) {
                const openingHoursText = document.getElementById('openingHoursText');
                if (openingHoursText) {
                    openingHoursText.textContent = data.settings.openingHours;
                }
                // Also update the data-translate attribute for translation
                const openingHoursSpan = document.querySelector('[data-translate="opening_hours"]');
                if (openingHoursSpan) {
                    openingHoursSpan.textContent = data.settings.openingHours;
                }
            }
        } catch (error) {
            console.error('Failed to load opening hours:', error);
        }
    }

    // Admin panel access: Click counter on opening hours
    let openingHoursClickCount = 0;
    let openingHoursClickTimeout = null;
    const openingHoursText = document.getElementById('openingHoursText');

    if (openingHoursText) {
        openingHoursText.addEventListener('click', function () {
            openingHoursClickCount++;

            // Reset counter after 3 seconds of no clicks
            clearTimeout(openingHoursClickTimeout);
            openingHoursClickTimeout = setTimeout(() => {
                openingHoursClickCount = 0;
            }, 3000);

            // Show admin login after 5 clicks
            if (openingHoursClickCount >= 5) {
                openingHoursClickCount = 0;
                if (typeof showAdminLogin === 'function') {
                    showAdminLogin();
                }
            }
        });
    }

    // Initialize
    updateOpenStatus();
    updateContactOpenStatus();
    loadOpeningHours();

    // Update opening status every minute
    setInterval(() => {
        updateOpenStatus();
        updateContactOpenStatus();
    }, 60000);

    // Make functions globally available
    window.updateOpenStatus = updateOpenStatus;
    window.updateContactOpenStatus = updateContactOpenStatus;
    window.loadOpeningHours = loadOpeningHours;
});
