/**
 * User rating storage utilities
 * Manages user ID and ratings in localStorage
 */

const USER_ID_KEY = 'brogrillen_userId';
const USER_RATINGS_KEY = 'brogrillen_userRatings';

/**
 * Generate or retrieve unique user ID from localStorage
 * Creates a UUID on first visit and stores it permanently
 */
function getUserId() {
  // Check if user ID already exists
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Generate new UUID
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

/**
 * Get all user's ratings from localStorage
 * Returns an object mapping menuItemId -> rating
 */
function getUserRatings() {
  try {
    const ratingsStr = localStorage.getItem(USER_RATINGS_KEY);
    
    if (!ratingsStr) {
      console.log('[Storage] No ratings found in localStorage');
      return {};
    }
    
    const ratings = JSON.parse(ratingsStr);
    console.log('[Storage] Retrieved ratings from localStorage:', ratings);
    return ratings;
  } catch (error) {
    console.error('[Storage] Error reading user ratings from localStorage:', error);
    return {};
  }
}

/**
 * Save a user rating locally
 * Updates the ratings object in localStorage
 */
function saveUserRatingLocally(menuItemId, rating) {
  try {
    console.log('[Storage] Saving rating for item:', menuItemId, 'with rating:', rating);
    const ratings = getUserRatings();
    ratings[menuItemId] = rating;
    
    const ratingsStr = JSON.stringify(ratings);
    localStorage.setItem(USER_RATINGS_KEY, ratingsStr);
    console.log('[Storage] Saved to localStorage. New ratings object:', ratings);
    
    // Verify it was saved correctly
    const verification = localStorage.getItem(USER_RATINGS_KEY);
    if (verification !== ratingsStr) {
      console.error('[Storage] localStorage verification failed!');
      throw new Error('Failed to verify localStorage save');
    }
    console.log('[Storage] localStorage save verified successfully');
  } catch (error) {
    console.error('[Storage] Error saving user rating to localStorage:', error);
    throw error;
  }
}

/**
 * Get user's rating for a specific menu item
 * Returns the rating (1-5) or null if not rated
 */
function getUserRatingForItem(menuItemId) {
  const ratings = getUserRatings();
  return ratings[menuItemId] || null;
}

/**
 * Get all menu item IDs that the user has rated
 * Useful for filtering "mina betyg" category
 */
function getRatedMenuItemIds() {
  const ratings = getUserRatings();
  return Object.keys(ratings);
}

/**
 * Check if user has rated a specific item
 */
function hasRatedItem(menuItemId) {
  const ratings = getUserRatings();
  return menuItemId in ratings;
}

/**
 * Remove a rating (e.g., if user wants to delete their rating)
 */
function removeUserRating(menuItemId) {
  try {
    const ratings = getUserRatings();
    delete ratings[menuItemId];
    
    localStorage.setItem(USER_RATINGS_KEY, JSON.stringify(ratings));
  } catch (error) {
    console.error('Error removing user rating from localStorage:', error);
    throw error;
  }
}

