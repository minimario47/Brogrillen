/**
 * Brogrillen Pizzeria - Menu Rating Module
 * Handles rating menu items with optimistic UI updates
 */

// Handle rating a menu item (optimistic UI update)
async function handleMenuItemRating(menuItemId, rating) {
    console.log('[handleMenuItemRating] Called with menuItemId:', menuItemId, 'rating:', rating);

    const currentLanguage = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'sv';

    try {
        // Update local state immediately for instant UI feedback
        if (typeof window.userRatings !== 'undefined') {
            window.userRatings[menuItemId] = rating;
        }
        console.log('[handleMenuItemRating] Updated local userRatings');

        // Sync to server (this will also save to localStorage)
        if (typeof syncUserRatingToServer !== 'function') {
            console.warn('syncUserRatingToServer not available');
            return;
        }

        console.log('[handleMenuItemRating] Calling syncUserRatingToServer...');
        const result = await syncUserRatingToServer(menuItemId, rating);
        console.log('[handleMenuItemRating] syncUserRatingToServer result:', result);

        if (result.success) {
            // Show success notification immediately
            if (typeof Toastify !== 'undefined') {
                const message = currentLanguage === 'sv' ? 'Ditt betyg har sparats!' : 'Your rating has been saved!';
                Toastify({
                    text: message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }

            // Update the aggregate rating display without full page refresh
            if (result.aggregate && typeof window.aggregateRatings !== 'undefined') {
                window.aggregateRatings[menuItemId] = result.aggregate;
            }
        } else {
            // Show error notification
            if (typeof Toastify !== 'undefined') {
                const message = currentLanguage === 'sv' ? 'Kunde inte spara betyget. Försök igen.' : 'Could not save rating. Please try again.';
                Toastify({
                    text: message,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }
                }).showToast();
            }
        }
    } catch (error) {
        console.error('[Rating] Error rating menu item:', error);
        // Show error notification
        if (typeof Toastify !== 'undefined') {
            const currentLanguage = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'sv';
            const message = currentLanguage === 'sv' ? 'Ett fel uppstod. Försök igen.' : 'An error occurred. Please try again.';
            Toastify({
                text: message,
                duration: 3000,
                gravity: "top",
                position: "center",
                style: {
                    background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }
            }).showToast();
        }
    }
}

// Make handleMenuItemRating globally available
window.handleMenuItemRating = handleMenuItemRating;
