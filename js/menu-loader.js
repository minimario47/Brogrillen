/**
 * Brogrillen Pizzeria - Menu Loader Module
 * Handles fetching menu data from Supabase and organizing by category
 */

// Global menu data
let menuData = {};
let userRatings = {};
let aggregateRatings = {};

// Menu display names (for category labels)
const menuDisplayNames = {
    "mestomtyckt-menu": "Mest omtyckt",
    "minabetyg-menu": "Mina betyg",
    "pizza-menu": "Pizza",
    "kebab-menu": "Kebab",
    "sallad-menu": "Sallad",
    "alacarte-menu": "À la carte",
    "pasta-menu": "Pasta",
    "gatukok-menu": "Gatukök",
    "tillbehor-menu": "Tillbehör"
};

// Load menu data from Supabase
async function loadMenuData() {
    try {
        // Fetch menu items from backend
        if (typeof fetchMenuItems !== 'function') {
            console.warn('fetchMenuItems not available');
            return {};
        }

        const data = await fetchMenuItems();
        const menuItems = data.menuItems || [];
        const mostLikedItemIds = data.mostLikedItemIds || [];

        // Load user ratings from localStorage
        userRatings = typeof getUserRatings === 'function' ? getUserRatings() : {};

        // Fetch aggregate ratings
        aggregateRatings = typeof fetchRatingsAggregate === 'function' ? await fetchRatingsAggregate() : {};

        // Organize menu items by category
        menuData = {
            'mestomtyckt-menu': [],
            'minabetyg-menu': [],
            'pizza-menu': [],
            'kebab-menu': [],
            'sallad-menu': [],
            'alacarte-menu': [],
            'pasta-menu': [],
            'gatukok-menu': [],
            'tillbehor-menu': []
        };

        // Categorize items
        menuItems.forEach(item => {
            // Add rating data to item
            const ratingData = aggregateRatings[item.id] || {
                avgRating: 0,
                totalRatings: 0,
                score: 0
            };

            item.avgRating = ratingData.avgRating;
            item.totalRatings = ratingData.totalRatings;
            item.ratingScore = ratingData.score;
            item.userRating = userRatings[item.id] || null;
            item.isMostLiked = mostLikedItemIds.includes(item.id);

            // Convert backend format to frontend format
            const frontendItem = {
                id: item.id,
                name: item.name,
                description: {
                    sv: item.descriptionSv || '',
                    en: item.descriptionEn || ''
                },
                price: item.price,
                category: item.category,
                avgRating: item.avgRating,
                totalRatings: item.totalRatings,
                ratingScore: item.ratingScore,
                userRating: item.userRating,
                isMostLiked: item.isMostLiked
            };

            // Add to appropriate category
            // Add to appropriate category
            if (item.category) {
                // Normalize category: lowercase and replace umlauts
                const normalizedCategory = item.category.toLowerCase()
                    .replace(/ö/g, 'o')
                    .replace(/ä/g, 'a')
                    .replace(/å/g, 'a')
                    .replace(/[^a-z0-9]/g, ''); // Remove any other special chars

                const categoryKey = `${normalizedCategory}-menu`;

                if (menuData[categoryKey]) {
                    menuData[categoryKey].push(frontendItem);
                } else if (categoryKey === 'gatukok-menu' || categoryKey.includes('gatuko')) {
                    // Fallback for variations
                    if (menuData['gatukok-menu']) menuData['gatukok-menu'].push(frontendItem);
                } else if (categoryKey === 'tillbehor-menu' || categoryKey.includes('tillbeho')) {
                    // Fallback for variations
                    if (menuData['tillbehor-menu']) menuData['tillbehor-menu'].push(frontendItem);
                }
            }

            // Add to mestomtyckt if qualified
            if (item.isMostLiked) {
                menuData['mestomtyckt-menu'].push(frontendItem);
            }

            // Add to minabetyg if user has rated it
            if (item.userRating) {
                menuData['minabetyg-menu'].push(frontendItem);
            }
        });

        // Sort pizza by number
        if (menuData['pizza-menu']) {
            menuData['pizza-menu'].sort((a, b) => {
                const numA = a.name.match(/^(\d+)\./) ? parseInt(a.name.match(/^(\d+)\./)[1], 10) : 999;
                const numB = b.name.match(/^(\d+)\./) ? parseInt(b.name.match(/^(\d+)\./)[1], 10) : 999;
                return numA - numB;
            });
        }

        // Sort mestomtyckt by rating score
        if (menuData['mestomtyckt-menu']) {
            menuData['mestomtyckt-menu'].sort((a, b) => {
                return (b.ratingScore || 0) - (a.ratingScore || 0);
            });
        }

        // Make menuData globally available
        window.menuData = menuData;
        window.userRatings = userRatings;
        window.aggregateRatings = aggregateRatings;

        // Trigger menu update
        if (typeof window.updateMenuAfterLoad === 'function') {
            window.updateMenuAfterLoad();
        }

        return menuData;
    } catch (error) {
        console.error('Failed to load menu data:', error);
        // Dispatch event even on failure (so sequential loading can continue)
        document.dispatchEvent(new CustomEvent('menuLoaded', { detail: { success: false, error } }));
        return {};
    }
}

// Make functions globally available
window.menuData = menuData;
window.menuDisplayNames = menuDisplayNames;
window.loadMenuData = loadMenuData;

// Start loading menu data when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    loadMenuData();
});
