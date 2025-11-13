/**
 * API functions for rating system
 * Handles communication with the backend rating endpoints
 */

const RATING_API_BASE = `https://evffhpojvwldwsvgnzxb.supabase.co/functions/v1/make-server-08ff8e2f`;

/**
 * Submit or update a rating for a menu item
 */
async function submitRating(menuItemId, userId, rating) {
  try {
    const response = await fetch(`${RATING_API_BASE}/ratings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuItemId,
        userId,
        rating
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to submit rating: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      aggregate: data.aggregate
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit rating'
    };
  }
}

/**
 * Fetch all aggregate ratings
 * Returns a map of menuItemId -> aggregate data
 */
async function fetchRatingsAggregate() {
  try {
    const response = await fetch(`${RATING_API_BASE}/ratings/aggregate`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch aggregate ratings: ${response.status}`);
    }
    
    const data = await response.json();
    return data.aggregates || {};
  } catch (error) {
    return {};
  }
}

/**
 * Fetch user's ratings (optional - for debugging)
 */
async function fetchUserRatings(userId) {
  try {
    const response = await fetch(`${RATING_API_BASE}/ratings/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Fetch user ratings error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to fetch user ratings: ${response.status}`);
    }
    
    const data = await response.json();
    return data.ratings || [];
  } catch (error) {
    console.error('Fetch user ratings exception:', error);
    return [];
  }
}

