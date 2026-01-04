/**
 * Brogrillen Pizzeria - Menu Display Module
 * Handles displaying menu items, creating category buttons, and updating UI
 */

let currentCategory = 'mestomtyckt-menu';

// Display menu items for a category
function displayMenu(category) {
    currentCategory = category;
    // Make it globally available
    window.currentCategory = category;

    const menuSelector = document.getElementById('menu-selector-actual');
    const currentLanguage = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'sv';
    const menuDisplayNames = window.menuDisplayNames || {};
    const translations = window.translations || {};

    if (menuSelector) {
        const buttons = menuSelector.querySelectorAll('button');
        buttons.forEach(btn => btn.classList.remove('active'));

        const activeButton = menuSelector.querySelector(`[data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            // Scroll button into view (useful for mobile horizontal scroll)
            activeButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    const menuItemsContainer = document.getElementById('menu-items');
    if (!menuItemsContainer) return;

    menuItemsContainer.innerHTML = '';
    const menuInfo = document.getElementById('menu-info');
    if (menuInfo) {
        menuInfo.innerHTML = '';
        if (category === 'mestomtyckt-menu' || category === 'pizza-menu') {
            if (translations["menu_info"] && translations["menu_info"][currentLanguage]) {
                menuInfo.textContent = translations["menu_info"][currentLanguage];
            }
        }
    }

    // Get items to display
    let itemsToDisplay = [];
    const menuData = window.menuData || {};

    if (menuData[category]) {
        itemsToDisplay = menuData[category];
    }

    // Handle special categories
    if (category === 'minabetyg-menu' && typeof getRatedMenuItemIds === 'function') {
        // Filter items user has rated
        itemsToDisplay = menuData[category] || [];
    }

    // Render items
    if (itemsToDisplay.length > 0) {
        itemsToDisplay.forEach(item => {
            const col = document.createElement('div');
            col.classList.add('col-md-6', 'col-lg-4', 'mb-4');

            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item', 'p-4');
            menuItem.setAttribute('data-item-id', item.id || '');

            const title = document.createElement('h3');
            title.textContent = item.name;
            menuItem.appendChild(title);

            if (item.description) {
                const desc = document.createElement('p');
                if (typeof item.description === 'object') {
                    desc.textContent = item.description[currentLanguage] || item.description['sv'];
                } else {
                    desc.textContent = item.description;
                }
                menuItem.appendChild(desc);
            }

            const price = document.createElement('span');
            price.classList.add('price');
            price.textContent = item.price;
            menuItem.appendChild(price);

            // Add star rating if available - always show for all users
            if (typeof createStarRating === 'function' && item.id) {
                const ratingContainer = document.createElement('div');
                ratingContainer.className = 'mt-3';
                ratingContainer.style.marginTop = '1rem';

                // Safe check for admin authentication
                const isAdmin = typeof isAuthenticated === 'function' ? isAuthenticated() : false;

                // Show stats to everyone in "mest omtyckt" category
                const showStats = category === 'mestomtyckt-menu';

                const starRating = createStarRating({
                    menuItemId: item.id,
                    userRating: item.userRating || null,
                    avgRating: item.avgRating || 0,
                    totalRatings: item.totalRatings || 0,
                    onRate: (rating) => {
                        if (typeof handleMenuItemRating === 'function') {
                            handleMenuItemRating(item.id, rating);
                        }
                    },
                    className: '',
                    isAdmin: isAdmin,
                    showStats: showStats,
                    language: currentLanguage
                });

                ratingContainer.appendChild(starRating);
                menuItem.appendChild(ratingContainer);
            }

            col.appendChild(menuItem);
            menuItemsContainer.appendChild(col);
        });
    } else {
        // Show empty state
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'col-12 text-center py-5';
        emptyMsg.textContent = currentLanguage === 'sv'
            ? 'Inga rätter hittades i denna kategori'
            : 'No items found in this category';
        menuItemsContainer.appendChild(emptyMsg);
    }

    // Apply translations
    if (typeof translatePage === 'function') {
        translatePage();
    }
}

// Function to refresh current menu (called after rating)
function refreshCurrentMenu() {
    if (currentCategory) {
        displayMenu(currentCategory);
    }
}

// Function to update menu after backend load
function updateMenuAfterLoad() {
    const menuLoading = document.getElementById('menu-loading');
    const menuSelectorLoading = document.getElementById('menu-selector-loading');
    const actualMenuSelector = document.getElementById('menu-selector-actual');

    if (menuLoading) {
        menuLoading.remove();
    }
    if (menuSelectorLoading) {
        menuSelectorLoading.remove();
    }
    if (actualMenuSelector) {
        actualMenuSelector.style.display = '';
    }

    const menuSelector = document.getElementById('menu-selector-actual');
    if (menuSelector) {
        // Save current category if it exists
        const existingCategory = currentCategory;

        // Clear existing buttons
        menuSelector.innerHTML = '';
        // Recreate buttons
        createMenuButtons();

        // Only change category if no category was active before
        const menuData = window.menuData || {};
        if (existingCategory && menuData[existingCategory]) {
            // Restore the existing category
            displayMenu(existingCategory);
        } else if (Object.keys(menuData).length > 0) {
            // Only display first category if no category was active
            const firstCategory = Object.keys(menuData)[0];
            displayMenu(firstCategory);
        }
    }

    // Dispatch menuLoaded event for sequential loading
    document.dispatchEvent(new CustomEvent('menuLoaded', { detail: { success: true } }));
}

// Create menu category buttons
function createMenuButtons() {
    const menuSelector = document.getElementById('menu-selector-actual');
    const menuData = window.menuData || {};
    const menuDisplayNames = window.menuDisplayNames || {};

    if (menuSelector && Object.keys(menuData).length > 0) {
        Object.keys(menuData).forEach((category, index) => {
            const button = document.createElement('button');
            button.textContent = menuDisplayNames[category] || category.replace('-menu', '').replace(/^\w/, c => c.toUpperCase());
            button.dataset.category = category;
            if (index === 0) button.classList.add('active');
            button.addEventListener('click', () => displayMenu(category));
            menuSelector.appendChild(button);
        });
    }
}

// Make functions globally available
window.currentCategory = currentCategory;
window.displayMenu = displayMenu;
window.refreshCurrentMenu = refreshCurrentMenu;
window.updateMenuAfterLoad = updateMenuAfterLoad;
window.createMenuButtons = createMenuButtons;
