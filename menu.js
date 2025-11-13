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
    console.log('[LoadMenu] Starting to load menu data...');
    
    // Fetch menu items from backend
    const data = await fetchMenuItems();
    menuItems = data.menuItems || [];
    mostLikedItemIds = data.mostLikedItemIds || [];
    console.log('[LoadMenu] Fetched', menuItems.length, 'menu items from backend');
    
    // Load user ratings from localStorage
    userRatings = getUserRatings();
    console.log('[LoadMenu] User ratings from localStorage:', userRatings);
    console.log('[LoadMenu] Number of rated items:', Object.keys(userRatings).length);
    
    // Fetch aggregate ratings
    aggregateRatings = await fetchRatingsAggregate();
    console.log('[LoadMenu] Fetched aggregate ratings');
    
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
        console.log('[LoadMenu] Adding item to minabetyg:', item.id, item.name, 'rating:', item.userRating);
        menuData['minabetyg-menu'].push(frontendItem);
      }
    });
    
    console.log('[LoadMenu] Final minabetyg count:', menuData['minabetyg-menu'].length);
    console.log('[LoadMenu] Items in minabetyg:', menuData['minabetyg-menu'].map(item => `${item.id}: ${item.name} (${item.userRating}⭐)`));
    
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
    console.log('[LoadMenu] Menu data loaded successfully');
    
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
    console.log(`[Rating] Starting to rate item ${menuItemId} with rating ${rating}`);
    
    // Update local state immediately for instant UI feedback
    userRatings[menuItemId] = rating;
    
    // Sync to server (this will also save to localStorage)
    console.log('[Rating] Syncing to server...');
    const result = await syncUserRatingToServer(menuItemId, rating);
    
    // Verify localStorage was updated by syncUserRatingToServer
    const savedRatings = getUserRatings();
    if (savedRatings[menuItemId] !== rating) {
      console.error('[Rating] Failed to save to localStorage');
      throw new Error('Failed to save rating locally');
    }
    console.log('[Rating] Successfully verified localStorage:', savedRatings[menuItemId]);
    
    if (result.success) {
      console.log('[Rating] Successfully synced to server');
      
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
      console.log('[Rating] Reloading menu data...');
      await loadMenuData();
      console.log('[Rating] Menu data reloaded');
      
      // Verify the rating is in the new menuData
      const updatedRatings = getUserRatings();
      console.log('[Rating] Current ratings after reload:', updatedRatings);
      console.log('[Rating] Looking for rating in minabetyg:', menuData['minabetyg-menu']?.map(item => item.id));
      
      // Update the displayed menu if needed
      if (typeof window.refreshCurrentMenu === 'function') {
        window.refreshCurrentMenu();
      }
      
      console.log('[Rating] Rating process completed successfully');
    } else {
      console.error('[Rating] Failed to sync rating:', result.error);
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
