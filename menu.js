/**
 * Menu Data Management
 * Loads menu items from backend and provides them to the frontend
 */

// Global variables for menu data
let menuData = {};
let menuItems = [];
let mostLikedItemIds = [];
let userRatings = {};
let aggregateRatings = {};
let menuLoaded = false;

/**
 * Load menu items from backend
 */
async function loadMenuData() {
  try {
    // Fetch menu items from backend
    const data = await fetchMenuItems();
    menuItems = data.menuItems || [];
    mostLikedItemIds = data.mostLikedItemIds || [];
    
    // Load user ratings from localStorage
    userRatings = getUserRatings();
    
    // Fetch aggregate ratings
    aggregateRatings = await fetchRatingsAggregate();
    
    // Organize menu items by category for backward compatibility
    // Order: Mest omtyckt first, then Mina betyg, then regular categories
    menuData = {
      'mestomtyckt-menu': [],
      'minabetyg-menu': [],
      'pizza-menu': [],
      'kebab-menu': [],
      'sallad-menu': [],
      'alacarte-menu': [],
      'pasta-menu': [],
      'gatukök-menu': [],
      'tillbehör-menu': []
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
      if (item.category && menuData[`${item.category}-menu`]) {
        menuData[`${item.category}-menu`].push(frontendItem);
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
    
    // Sort categories
    // Sort pizza by number
    if (menuData['pizza-menu']) {
      menuData['pizza-menu'] = sortMenuItemsByNumber(menuData['pizza-menu']);
    }
    
    // Sort mestomtyckt by rating score
    if (menuData['mestomtyckt-menu']) {
      menuData['mestomtyckt-menu'].sort((a, b) => {
        return (b.ratingScore || 0) - (a.ratingScore || 0);
      });
    }
    
    menuLoaded = true;
    
    // Make menuData globally available for HTML scripts
    window.menuData = menuData;
    
    // Trigger menu update if page is already loaded
    if (typeof window.updateMenuAfterLoad === 'function') {
      window.updateMenuAfterLoad();
    }
    
    return menuData;
  } catch (error) {
    console.error('[LoadMenu] Failed to load menu data:', error);
    menuLoaded = false;
    // Return empty data structure
    const emptyData = {
      'mestomtyckt-menu': [],
      'minabetyg-menu': [],
      'pizza-menu': [],
      'kebab-menu': [],
      'sallad-menu': [],
      'alacarte-menu': [],
      'pasta-menu': [],
      'gatukök-menu': [],
      'tillbehör-menu': []
    };
    window.menuData = emptyData;
    return emptyData;
  }
}

/**
 * Helper function to extract number from menu item name
 */
function extractNumberFromName(name) {
  const match = name.match(/^(\d+)\./);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Helper function to sort menu items by their leading number
 */
function sortMenuItemsByNumber(items) {
  return items.sort((a, b) => {
    const numA = extractNumberFromName(a.name);
    const numB = extractNumberFromName(b.name);
    
    // Both have numbers: sort numerically
    if (numA !== null && numB !== null) {
      return numA - numB;
    }
    
    // Only a has number: a comes first
    if (numA !== null) return -1;
    
    // Only b has number: b comes first
    if (numB !== null) return 1;
    
    // Neither has number: maintain original order
    return 0;
  });
}

/**
 * Handle rating a menu item
 */
async function handleMenuItemRating(menuItemId, rating) {
  try {
    // Update local state immediately for instant UI feedback
    userRatings[menuItemId] = rating;
    
    // Sync to server (this will also save to localStorage)
    const result = await syncUserRatingToServer(menuItemId, rating);
    
    // Verify localStorage was updated by syncUserRatingToServer
    const savedRatings = getUserRatings();
    if (savedRatings[menuItemId] !== rating) {
      throw new Error('Failed to save rating locally');
    }
    
    if (result.success) {
      // Save current category and scroll position before reload
      const savedCategory = typeof window.currentCategory !== 'undefined' ? window.currentCategory : null;
      const savedMenuItemId = menuItemId; // Save which item was rated to scroll back to it
      
      // Save scroll position relative to the menu section
      const menuSection = document.getElementById('menu');
      let savedScrollPosition = null;
      if (menuSection) {
        const menuRect = menuSection.getBoundingClientRect();
        savedScrollPosition = window.scrollY + menuRect.top;
      }
      
      // Show success notification
      if (typeof Toastify !== 'undefined') {
        const currentLang = localStorage.getItem('language') || 'sv';
        const message = currentLang === 'sv' ? 'Ditt betyg har sparats!' : 'Your rating has been saved!';
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
      
      // Wait a bit for localStorage to fully sync (browser quirk)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reload menu data to get updated aggregates
      await loadMenuData();
      
      // Restore category and scroll position
      if (savedCategory && typeof window.displayMenu === 'function') {
        window.displayMenu(savedCategory);
        
        // Wait for menu to render, then restore scroll position
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Try to scroll to the rated item first (best UX)
        const ratedMenuItem = document.querySelector(`[data-item-id="${savedMenuItemId}"]`);
        if (ratedMenuItem) {
          // Scroll to the item with some offset from top
          const itemRect = ratedMenuItem.getBoundingClientRect();
          const scrollOffset = window.scrollY + itemRect.top - 100; // 100px from top
          window.scrollTo({ top: scrollOffset, behavior: 'smooth' });
        } else if (savedScrollPosition !== null) {
          // Fallback: restore previous scroll position
          window.scrollTo({ top: savedScrollPosition, behavior: 'smooth' });
        }
      } else if (typeof window.refreshCurrentMenu === 'function') {
        // Fallback to refreshCurrentMenu if displayMenu is not available
        window.refreshCurrentMenu();
      }
    } else {
      // Show error notification
      if (typeof Toastify !== 'undefined') {
        const currentLang = localStorage.getItem('language') || 'sv';
        const message = currentLang === 'sv' ? 'Kunde inte spara betyget. Försök igen.' : 'Could not save rating. Please try again.';
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
      const currentLang = localStorage.getItem('language') || 'sv';
      const message = currentLang === 'sv' ? 'Ett fel uppstod. Försök igen.' : 'An error occurred. Please try again.';
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

/**
 * Get menu item by ID
 */
function getMenuItemById(id) {
  return menuItems.find(item => item.id === id);
}

// Make functions globally available
window.handleMenuItemRating = handleMenuItemRating;
window.getMenuItemById = getMenuItemById;
window.loadMenuData = loadMenuData;

// Initialize menu loading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
      loadMenuData();
    }, 500);
  });
} else {
  setTimeout(() => {
    loadMenuData();
  }, 500);
}
