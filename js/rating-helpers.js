/**
 * Rating helper functions
 * Coordinates between local storage and server API
 */

/**
 * Sync a user rating to both localStorage and server
 * This is the main function to call when a user rates an item
 */
async function syncUserRatingToServer(menuItemId, rating) {
  try {
    console.log('[Sync] Starting sync for item:', menuItemId, 'rating:', rating);
    
    // First, save locally for immediate feedback
    saveUserRatingLocally(menuItemId, rating);
    console.log('[Sync] Saved to localStorage successfully');
    
    // Then sync to server
    const userId = getUserId();
    console.log('[Sync] User ID:', userId);
    console.log('[Sync] Submitting rating to server...');
    const result = await submitRating(menuItemId, userId, rating);
    
    if (!result.success) {
      console.error('[Sync] Server returned error:', result.error);
      return {
        success: false,
        error: result.error || 'Failed to sync rating to server'
      };
    }
    
    console.log('[Sync] Successfully synced to server');
    return { success: true };
  } catch (error) {
    console.error('[Sync] Exception during sync:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync rating'
    };
  }
}

/**
 * Merge ratings data with menu items
 * Adds rating information to each menu item
 */
function mergeRatingsWithMenuItems(menuItems, aggregates, userRatings) {
  return menuItems.map(item => {
    const aggregate = aggregates[item.id] || {
      avgRating: 0,
      totalRatings: 0,
      score: 0
    };
    
    const userRating = userRatings[item.id] || null;
    
    return {
      ...item,
      avgRating: aggregate.avgRating,
      totalRatings: aggregate.totalRatings,
      ratingScore: aggregate.score,
      userRating
    };
  });
}

/**
 * Render stars as a string (for debugging or simple display)
 * Returns a string like "★★★★☆" for 4 stars
 */
function renderStarsString(rating, maxStars = 5) {
  const fullStars = Math.floor(rating);
  const emptyStars = maxStars - fullStars;
  
  return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

/**
 * Get color based on rating value
 * Used for styling star displays
 */
function getRatingColor(rating) {
  if (rating >= 4.5) return 'text-green-500';
  if (rating >= 4.0) return 'text-lime-500';
  if (rating >= 3.5) return 'text-yellow-500';
  if (rating >= 3.0) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Format rating for display
 * e.g., 4.67 -> "4.7", 4.00 -> "4.0"
 */
function formatRating(rating) {
  return rating.toFixed(1);
}

/**
 * Get rating count text
 * e.g., 0 -> "No ratings", 1 -> "1 rating", 5 -> "5 ratings"
 */
function getRatingCountText(count, language = 'sv') {
  if (language === 'sv') {
    if (count === 0) return 'Inga betyg';
    if (count === 1) return '1 betyg';
    return `${count} betyg`;
  } else {
    if (count === 0) return 'No ratings';
    if (count === 1) return '1 rating';
    return `${count} ratings`;
  }
}

