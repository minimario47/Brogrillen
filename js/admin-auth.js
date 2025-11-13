/**
 * Admin authentication utilities
 * Handles Supabase authentication for admin users
 */

let currentUser = null;
let authListeners = [];

/**
 * Check current session
 */
async function checkSession() {
  try {
    const supabase = window.supabaseClient;
    if (!supabase) {
      console.error('Supabase not initialized');
      return { user: null, error: 'Supabase not initialized' };
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      currentUser = null;
      notifyAuthListeners(null);
      return { user: null, error: error?.message || 'No session' };
    }
    
    currentUser = {
      id: session.user.id,
      email: session.user.email
    };
    
    notifyAuthListeners(currentUser);
    return { user: currentUser, error: null };
  } catch (error) {
    console.error('Session check error:', error);
    currentUser = null;
    notifyAuthListeners(null);
    return { user: null, error: error.message };
  }
}

/**
 * Login with email and password
 */
async function login(email, password) {
  try {
    const supabase = window.supabaseClient;
    if (!supabase) {
      return { error: 'Supabase not initialized', user: null };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { error: error.message, user: null };
    }
    
    if (data.user) {
      currentUser = {
        id: data.user.id,
        email: data.user.email
      };
      notifyAuthListeners(currentUser);
      return { error: null, user: currentUser };
    }
    
    return { error: 'Login failed', user: null };
  } catch (error) {
    console.error('Login error:', error);
    return { error: error.message || 'Login failed', user: null };
  }
}

/**
 * Logout current user
 */
async function logout() {
  try {
    const supabase = window.supabaseClient;
    if (!supabase) {
      return;
    }
    
    await supabase.auth.signOut();
    currentUser = null;
    notifyAuthListeners(null);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Get current user
 */
function getUser() {
  return currentUser;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return currentUser !== null;
}

/**
 * Add auth state change listener
 */
function onAuthStateChange(callback) {
  authListeners.push(callback);
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authListeners = authListeners.filter(listener => listener !== callback);
  };
}

/**
 * Notify all auth listeners
 */
function notifyAuthListeners(user) {
  authListeners.forEach(listener => {
    try {
      listener(user);
    } catch (error) {
      console.error('Error in auth listener:', error);
    }
  });
}

/**
 * Initialize Supabase auth state listener for persistent sessions
 */
function initAuthStateListener() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error('Supabase not initialized');
    return;
  }
  
  // Set up Supabase auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    
    if (session?.user) {
      currentUser = {
        id: session.user.id,
        email: session.user.email
      };
      notifyAuthListeners(currentUser);
    } else {
      currentUser = null;
      notifyAuthListeners(null);
    }
  });
  
  // Check current session on init
  checkSession();
}

// Initialize session check when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for supabase to be initialized
    setTimeout(() => {
      if (window.supabaseClient) {
        initAuthStateListener();
      } else {
        // Retry if not ready
        setTimeout(() => {
          if (window.supabaseClient) {
            initAuthStateListener();
          }
        }, 500);
      }
    }, 100);
  });
} else {
  setTimeout(() => {
    if (window.supabaseClient) {
      initAuthStateListener();
    } else {
      // Retry if not ready
      setTimeout(() => {
        if (window.supabaseClient) {
          initAuthStateListener();
        }
      }, 500);
    }
  }, 100);
}

