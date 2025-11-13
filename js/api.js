const API_BASE = `https://evffhpojvwldwsvgnzxb.supabase.co/functions/v1/make-server-08ff8e2f`;

async function getAuthHeaders() {
  try {
    const supabase = window.supabaseClient;
    if (!supabase) {
      return {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      };
    }
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || publicAnonKey;
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    };
  }
}

// Menu Items
async function fetchMenuItems(useAuth = false) {
  try {
    const headers = useAuth ? await getAuthHeaders() : {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(`${API_BASE}/menu-items`, {
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Fetch menu items error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to fetch menu items: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch menu items exception:', error);
    throw error;
  }
}

async function createMenuItem(item) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/menu-items`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Create menu item error:', response.status, error);
      throw new Error(error.error || 'Failed to create menu item');
    }
    
    return response.json();
  } catch (error) {
    console.error('Create menu item exception:', error);
    throw error;
  }
}

async function updateMenuItem(id, updates) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/menu-items/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Update menu item error:', response.status, error);
      throw new Error(error.error || 'Failed to update menu item');
    }
    
    return response.json();
  } catch (error) {
    console.error('Update menu item exception:', error);
    throw error;
  }
}

async function deleteMenuItem(id) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/menu-items/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Delete menu item error:', response.status, error);
      throw new Error(error.error || 'Failed to delete menu item');
    }
    
    return response.json();
  } catch (error) {
    console.error('Delete menu item exception:', error);
    throw error;
  }
}

// News Articles
async function fetchNews(useAuth = false) {
  try {
    const headers = useAuth ? await getAuthHeaders() : {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(`${API_BASE}/news`, {
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Fetch news error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to fetch news: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch news exception:', error);
    throw error;
  }
}

async function createNews(article) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers,
      body: JSON.stringify(article),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Create news error:', response.status, error);
      throw new Error(error.error || 'Failed to create news article');
    }
    
    return response.json();
  } catch (error) {
    console.error('Create news exception:', error);
    throw error;
  }
}

async function updateNews(id, updates) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/news/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Update news error:', response.status, error);
      throw new Error(error.error || 'Failed to update news article');
    }
    
    return response.json();
  } catch (error) {
    console.error('Update news exception:', error);
    throw error;
  }
}

async function deleteNews(id) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/news/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Delete news error:', response.status, error);
      throw new Error(error.error || 'Failed to delete news article');
    }
    
    return response.json();
  } catch (error) {
    console.error('Delete news exception:', error);
    throw error;
  }
}

// Settings
async function fetchSettings() {
  try {
    const response = await fetch(`${API_BASE}/settings`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Fetch settings error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to fetch settings: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch settings exception:', error);
    throw error;
  }
}

async function updateSettings(settings) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Update settings error:', response.status, error);
      throw new Error(error.error || 'Failed to update settings');
    }
    
    return response.json();
  } catch (error) {
    console.error('Update settings exception:', error);
    throw error;
  }
}

// Image Upload
async function uploadImage(file, folder = 'images', thumbnail) {
  try {
    const headers = await getAuthHeaders();
    const formData = new FormData();
    formData.append('file', file);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    formData.append('folder', folder);
    
    // Remove Content-Type header to let browser set it with boundary
    const uploadHeaders = {
      'Authorization': headers['Authorization'],
    };
    
    const response = await fetch(`${API_BASE}/upload-image`, {
      method: 'POST',
      headers: uploadHeaders,
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Upload image error:', response.status, error);
      throw new Error(error.error || 'Failed to upload image');
    }
    
    return response.json();
  } catch (error) {
    console.error('Upload image exception:', error);
    throw error;
  }
}

async function deleteImage(path, thumbnailPath) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/delete-image`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ path, thumbnailPath }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Delete image error:', response.status, error);
      throw new Error(error.error || 'Failed to delete image');
    }
    
    return response.json();
  } catch (error) {
    console.error('Delete image exception:', error);
    throw error;
  }
}

// Gallery
async function fetchGallery(useAuth = false) {
  try {
    const headers = useAuth ? await getAuthHeaders() : {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(`${API_BASE}/gallery`, {
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Fetch gallery error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to fetch gallery: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch gallery exception:', error);
    throw error;
  }
}

async function createGalleryImage(image) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers,
      body: JSON.stringify(image),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Create gallery image error:', response.status, error);
      throw new Error(error.error || 'Failed to create gallery image');
    }
    
    return response.json();
  } catch (error) {
    console.error('Create gallery image exception:', error);
    throw error;
  }
}

async function updateGalleryImage(id, updates) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Update gallery image error:', response.status, error);
      throw new Error(error.error || 'Failed to update gallery image');
    }
    
    return response.json();
  } catch (error) {
    console.error('Update gallery image exception:', error);
    throw error;
  }
}

async function deleteGalleryImage(id) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Delete gallery image error:', response.status, error);
      throw new Error(error.error || 'Failed to delete gallery image');
    }
    
    return response.json();
  } catch (error) {
    console.error('Delete gallery image exception:', error);
    throw error;
  }
}

// Bulk Publish
async function bulkPublishChanges() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/publish-changes`, {
      method: 'POST',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error('Bulk publish error:', response.status, error);
      throw new Error(error.error || 'Failed to publish changes');
    }
    
    return response.json();
  } catch (error) {
    console.error('Bulk publish exception:', error);
    throw error;
  }
}

