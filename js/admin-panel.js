/**
 * Admin Panel Management
 * Handles admin UI and CRUD operations for menu, news, gallery, and settings
 */

let adminPanelOpen = false;
let currentAdminTab = 'menu';
let multiSelectMode = false;
let selectedItems = new Set();
let actionHistory = [];
const MAX_HISTORY = 10;

const categories = ['pizza', 'kebab', 'sallad', 'alacarte', 'pasta', 'gatukok', 'tillbehor'];

/**
 * Admin panel translations
 */
const adminTranslations = {
  sv: {
    // General
    manage_menu: 'Hantera Meny',
    manage_news: 'Hantera Nyheter',
    manage_gallery: 'Hantera Galleri',
    manage_settings: 'Hantera Inställningar',
    add_item: 'Lägg till rätt',
    add_news: 'Lägg till nyhet',
    add_image: 'Lägg till bild',
    edit: 'Redigera',
    delete: 'Ta bort',
    save: 'Spara',
    cancel: 'Avbryt',
    search_placeholder: 'Sök...',
    // Draft/Publish
    draft: 'Utkast',
    published: 'Publicerad',
    publish_all: 'Publicera alla ändringar',
    drafts_pending: 'utkast ej publicerade',
    publish_direct: 'Publicera direkt (synlig för kunder)',
    save_as_draft: 'Avmarkera för att spara som utkast',
    // Form labels
    name: 'Namn',
    description_sv: 'Beskrivning (Svenska)',
    description_en: 'Beskrivning (English)',
    price: 'Pris',
    category: 'Kategori',
    order: 'Ordning',
    title_sv: 'Rubrik (Svenska)',
    title_en: 'Rubrik (English)',
    content_sv: 'Innehåll (Svenska)',
    content_en: 'Innehåll (English)',
    image: 'Bild',
    alt_text: 'Alternativ text',
    // Dialogs
    edit_item: 'Redigera rätt',
    add_item_title: 'Lägg till rätt',
    edit_news_title: 'Redigera nyhet',
    add_news_title: 'Lägg till nyhet',
    edit_image_title: 'Redigera bild',
    add_image_title: 'Lägg till bild',
    // Messages
    confirm_delete: 'Är du säker på att du vill ta bort',
    confirm_publish_all: 'Är du säker på att du vill publicera alla utkast? Detta gör dem synliga för kunder.',
    item_added: 'Rätt tillagd!',
    item_updated: 'Rätt uppdaterad!',
    draft_saved: 'Utkast sparat! Den publicerade versionen är fortfarande synlig för kunder.',
    item_deleted: 'Rätt borttagen!',
    news_added: 'Nyhet tillagd!',
    news_updated: 'Nyhet uppdaterad!',
    news_deleted: 'Nyhet borttagen!',
    image_added: 'Bild tillagd!',
    image_updated: 'Bild uppdaterad!',
    image_deleted: 'Bild borttagen!',
    settings_saved: 'Inställningar sparade!',
    error: 'Fel',
    fill_required: 'Vänligen fyll i alla obligatoriska fält',
    // Stats
    ratings: 'betyg'
  },
  en: {
    // General
    manage_menu: 'Manage Menu',
    manage_news: 'Manage News',
    manage_gallery: 'Manage Gallery',
    manage_settings: 'Manage Settings',
    add_item: 'Add Item',
    add_news: 'Add News',
    add_image: 'Add Image',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search_placeholder: 'Search...',
    // Draft/Publish
    draft: 'Draft',
    published: 'Published',
    publish_all: 'Publish All Changes',
    drafts_pending: 'unpublished drafts',
    publish_direct: 'Publish directly (visible to customers)',
    save_as_draft: 'Uncheck to save as draft',
    // Form labels
    name: 'Name',
    description_sv: 'Description (Swedish)',
    description_en: 'Description (English)',
    price: 'Price',
    category: 'Category',
    order: 'Order',
    title_sv: 'Title (Swedish)',
    title_en: 'Title (English)',
    content_sv: 'Content (Swedish)',
    content_en: 'Content (English)',
    image: 'Image',
    alt_text: 'Alternative text',
    // Dialogs
    edit_item: 'Edit Item',
    add_item_title: 'Add Item',
    edit_news_title: 'Edit News',
    add_news_title: 'Add News',
    edit_image_title: 'Edit Image',
    add_image_title: 'Add Image',
    // Messages
    confirm_delete: 'Are you sure you want to delete',
    confirm_publish_all: 'Are you sure you want to publish all drafts? This will make them visible to customers.',
    item_added: 'Item added!',
    item_updated: 'Item updated!',
    draft_saved: 'Draft saved! The published version is still visible to customers.',
    item_deleted: 'Item deleted!',
    news_added: 'News added!',
    news_updated: 'News updated!',
    news_deleted: 'News deleted!',
    image_added: 'Image added!',
    image_updated: 'Image updated!',
    image_deleted: 'Image deleted!',
    settings_saved: 'Settings saved!',
    error: 'Error',
    fill_required: 'Please fill in all required fields',
    // Stats
    ratings: 'ratings'
  }
};

/**
 * Get current admin language
 */
function getAdminLang() {
  return localStorage.getItem('language') || 'sv';
}

/**
 * Get translated text for admin panel
 */
function t(key) {
  const lang = getAdminLang();
  return adminTranslations[lang][key] || adminTranslations['sv'][key] || key;
}

/**
 * Initialize admin panel
 */
function initAdminPanel() {
  // Set up admin login form
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }
  
  // Set up tab buttons
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.textContent.toLowerCase();
      if (tab === 'menu') loadAdminContent('menu');
      else if (tab === 'news') loadAdminContent('news');
      else if (tab === 'gallery') loadAdminContent('gallery');
      else if (tab === 'settings') loadAdminContent('settings');
    });
  });
  
  // Set up keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Check if user is already logged in
  if (isAuthenticated()) {
    showAdminPanel();
  }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Only trigger in admin panel
    if (!adminPanelOpen) return;
    
    // Ctrl/Cmd + A: Select all (prevent default browser behavior)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a' && multiSelectMode) {
      e.preventDefault();
      selectAll();
    }
    
    // Ctrl/Cmd + D: Deselect all
    if ((e.ctrlKey || e.metaKey) && e.key === 'd' && multiSelectMode) {
      e.preventDefault();
      deselectAll();
    }
    
    // Ctrl/Cmd + S: Save (prevent default)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      // If a dialog is open, trigger save
      const saveBtn = document.querySelector('.modal button[onclick*="save"]');
      if (saveBtn) saveBtn.click();
    }
    
    // Delete key: Delete selected items
    if (e.key === 'Delete' && selectedItems.size > 0 && multiSelectMode) {
      e.preventDefault();
      bulkDelete();
    }
    
    // Escape: Close dialogs or exit multi-select
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal.show, .modal[style*="display: block"]');
      if (modal) {
        const closeBtn = modal.querySelector('.btn-close, [onclick*="close"]');
        if (closeBtn) closeBtn.click();
      } else if (multiSelectMode) {
        toggleMultiSelectMode();
      }
    }
    
    // Ctrl/Cmd + Z: Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undoLastAction();
    }
  });
}

/**
 * Show admin login modal
 */
function showAdminLogin() {
  const modal = document.getElementById('adminLoginModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

/**
 * Hide admin login modal
 */
function hideAdminLogin() {
  const modal = document.getElementById('adminLoginModal');
  if (modal) {
    modal.style.display = 'none';
    // Clear form
    const form = document.getElementById('adminLoginForm');
    if (form) form.reset();
  }
}

/**
 * Show admin panel (redirect to admin page)
 */
function showAdminPanel() {
  window.location.href = 'admin.html';
}

/**
 * Hide admin panel (redirect back to home)
 */
function hideAdminPanel() {
  window.location.href = 'index.html';
}

/**
 * Handle admin login
 */
async function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  const result = await login(email, password);
  
  if (result.error) {
    alert('Login failed: ' + result.error);
  } else {
    hideAdminLogin();
    showAdminPanel();
  }
}

/**
 * Load admin content based on active tab
 */
async function loadAdminContent(tab) {
  currentAdminTab = tab;
  const contentDiv = document.getElementById('adminContent');
  if (!contentDiv) return;
  
  // Update active tab button
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === tab) {
      btn.classList.add('active');
    }
  });
  
  switch(tab) {
    case 'menu':
      await loadAdminMenuContent();
      break;
    case 'news':
      await loadAdminNewsContent();
      break;
    case 'gallery':
      await loadAdminGalleryContent();
      break;
    case 'settings':
      await loadAdminSettingsContent();
      break;
  }
}

/**
 * Load admin menu content
 */
async function loadAdminMenuContent() {
  const contentDiv = document.getElementById('adminContent');
  if (!contentDiv) return;
  
  try {
    const data = await fetchMenuItems(true); // Use admin auth to see drafts
    const items = (data.menuItems || []).filter(
      item => item.category !== 'mestomtyckt' && item.category !== 'minabetyg'
    );
    
    // Count draft items
    const draftCount = items.filter(item => item.published === false).length;
    
    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>${t('manage_menu')}</h3>
          ${draftCount > 0 ? `<small class="text-warning"><i class="fas fa-exclamation-circle"></i> ${draftCount} ${t('drafts_pending')}</small>` : ''}
        </div>
        <div class="d-flex gap-2">
          ${draftCount > 0 ? `
            <button class="btn btn-success" onclick="publishAllChanges()">
              <i class="fas fa-upload"></i> ${t('publish_all')}
            </button>
          ` : ''}
          <button class="btn btn-outline-secondary" onclick="toggleMultiSelectMode()" id="multiSelectToggle">
            <i class="fas fa-check-square"></i> Multi-välj
          </button>
          <button class="btn btn-primary" onclick="openMenuDialog()">
            <i class="fas fa-plus"></i> ${t('add_item')}
          </button>
        </div>
      </div>
      
      <!-- Bulk Action Bar (hidden by default) -->
      <div id="bulkActionBar" style="display: none;" class="bulk-action-bar mb-3">
        <div class="bulk-action-header">
          <div class="bulk-action-info">
            <strong><span id="selectedCount">0</span> valda</strong>
            <div class="bulk-action-select-buttons">
              <button class="btn btn-sm btn-outline-primary" onclick="selectAll()">Välj alla</button>
              <button class="btn btn-sm btn-outline-secondary" onclick="deselectAll()">Avmarkera alla</button>
            </div>
          </div>
        </div>
        <div class="bulk-action-buttons">
          <button class="btn btn-sm btn-danger" onclick="bulkDelete()">
            <i class="fas fa-trash"></i> <span class="btn-text">Ta bort</span>
          </button>
          <button class="btn btn-sm btn-warning" onclick="bulkChangeCategory()">
            <i class="fas fa-tag"></i> <span class="btn-text">Ändra kategori</span>
          </button>
          <button class="btn btn-sm btn-info" onclick="bulkAdjustPrice()">
            <i class="fas fa-dollar-sign"></i> <span class="btn-text">Justera pris</span>
          </button>
          <button class="btn btn-sm btn-success" onclick="bulkPublish(true)">
            <i class="fas fa-check"></i> <span class="btn-text">Publicera</span>
          </button>
          <button class="btn btn-sm btn-secondary" onclick="bulkPublish(false)">
            <i class="fas fa-file"></i> <span class="btn-text">Utkast</span>
          </button>
        </div>
      </div>
      
      <div class="mb-3">
        <div class="row g-2">
          <div class="col-md-4">
            <input type="text" id="menuSearch" class="form-control" placeholder="${t('search_placeholder')}" oninput="applyFilters()">
          </div>
          <div class="col-md-2">
            <select id="filterCategory" class="form-select" onchange="applyFilters()">
              <option value="">Alla kategorier</option>
              ${categories.map(cat => `<option value="${cat}">${getCategoryName(cat)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-2">
            <select id="filterPublished" class="form-select" onchange="applyFilters()">
              <option value="">Alla status</option>
              <option value="published">Publicerade</option>
              <option value="draft">Utkast</option>
            </select>
          </div>
          <div class="col-md-2">
            <select id="filterRating" class="form-select" onchange="applyFilters()">
              <option value="">Alla betyg</option>
              <option value="4">≥ 4 stjärnor</option>
              <option value="3">≥ 3 stjärnor</option>
              <option value="2">≥ 2 stjärnor</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" onclick="clearFilters()">
              <i class="fas fa-times"></i> Rensa filter
            </button>
          </div>
        </div>
      </div>
      <div id="menuItemsList"></div>
    `;
    
    contentDiv.innerHTML = html;
    
    // Render menu items
    renderMenuItems(items);
    
    // Store items globally for filtering
    window.adminMenuItems = items;
  } catch (error) {
    contentDiv.innerHTML = '<div class="alert alert-danger">Kunde inte ladda meny: ' + error.message + '</div>';
  }
}

/**
 * Render menu items in admin panel (OLD - shows duplicates)
 */
function renderMenuItemsOld_Backup(items) {
  const container = document.getElementById('menuItemsList');
  if (!container) return;
  
  // Group by category
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  
  let html = '';
  categories.forEach(category => {
    if (!grouped[category] || grouped[category].length === 0) return;
    
    html += `<div class="mb-4">
      <h4 class="border-bottom pb-2 mb-3">${getCategoryName(category)}</h4>
      <div class="row g-3">`;
    
    grouped[category].forEach(item => {
      const isDraft = item.published === false;
      const isSelected = selectedItems.has(item.id);
      html += `
        <div class="col-md-6 col-lg-4 menu-item-card ${isSelected ? 'selected-item' : ''}" data-item-id="${item.id}" data-item-name="${escapeHtml(item.name)}" data-item-price="${escapeHtml(item.price)}" data-item-category="${item.category}" style="${isDraft ? 'opacity: 0.85;' : ''}">
          <div class="card h-100 ${isDraft ? 'border-warning' : ''} ${isSelected ? 'border-primary border-2' : ''}">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                ${multiSelectMode ? `
                  <div class="form-check me-2">
                    <input class="form-check-input item-checkbox" type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleItemSelection('${item.id}')" id="check-${item.id}">
                  </div>
                ` : ''}
                <h5 class="card-title flex-grow-1">${escapeHtml(item.name)}</h5>
                <div>
                  <button class="btn btn-sm btn-outline-primary" onclick="editMenuItem('${item.id}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="deleteMenuItemAdmin('${item.id}')">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-info" onclick="duplicateMenuItem('${item.id}')" title="Duplicera">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <p class="card-text text-muted small">${escapeHtml(item.descriptionSv || '')}</p>
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span class="badge bg-secondary">${getCategoryName(item.category)}</span>
                  ${isDraft ? `<span class="badge bg-warning text-dark ms-1"><i class="fas fa-file"></i> ${t('draft')}</span>` : `<span class="badge bg-success ms-1"><i class="fas fa-check"></i> ${t('published')}</span>`}
                  ${item.draftOf ? `<span class="badge bg-info text-dark ms-1"><i class="fas fa-arrow-up"></i> Ändringar av publicerad</span>` : ''}
                </div>
                <span class="fw-bold">${escapeHtml(item.price)}</span>
              </div>
              ${(item.avgRating > 0 || item.totalRatings > 0) ? `
                <div class="mt-2 text-muted small">
                  ⭐ ${(item.avgRating || 0).toFixed(1)} (${item.totalRatings || 0} ${t('ratings')})
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });
    
    html += `</div></div>`;
  });
  
  container.innerHTML = html || '<p class="text-muted">Inga menyalternativ hittades</p>';
}

/**
 * Render menu items in admin panel - Merges drafts with published items
 */
function renderMenuItems(items) {
  const container = document.getElementById('menuItemsList');
  if (!container) return;
  
  // Filter out items that have draftOf (old separate draft items)
  items = items.filter(item => !item.draftOf);
  
  // Group by category
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  
  let html = '';
  categories.forEach(category => {
    if (!grouped[category] || grouped[category].length === 0) return;
    
    html += `<div class="mb-4">
      <h4 class="border-bottom pb-2 mb-3">${getCategoryName(category)}</h4>
      <div class="row g-3">`;
    
    grouped[category].forEach(item => {
      const hasDraft = !!item.draftChanges;
      const isSelected = selectedItems.has(item.id);
      const draft = item.draftChanges;
      
      html += `
        <div class="col-md-6 col-lg-4 menu-item-card ${isSelected ? 'selected-item' : ''}" data-item-id="${item.id}" data-item-name="${escapeHtml(item.name)}" data-item-price="${escapeHtml(item.price)}" data-item-category="${item.category}">
          <div class="card h-100 ${hasDraft ? 'border-warning border-2' : ''} ${isSelected ? 'border-primary border-2' : ''}">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                ${multiSelectMode ? `
                  <div class="form-check me-2">
                    <input class="form-check-input item-checkbox" type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleItemSelection('${item.id}')" id="check-${item.id}">
                  </div>
                ` : ''}
                <h5 class="card-title flex-grow-1">${escapeHtml(item.name)}</h5>
                <div>
                  <button class="btn btn-sm btn-outline-primary" onclick="editMenuItem('${item.id}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="deleteMenuItemAdmin('${item.id}')">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-info" onclick="duplicateMenuItem('${item.id}')" title="Duplicera">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <p class="card-text text-muted small">${escapeHtml(item.descriptionSv || '')}</p>
              
              ${hasDraft ? `
                <div class="alert alert-warning p-2 mb-2 small">
                  <strong><i class="fas fa-exclamation-triangle"></i> ${t('draft')}:</strong><br>
                  <span class="text-muted">Nya ändringar väntar på publicering</span><br>
                  ${draft.name !== item.name ? `<span>Namn: <del>${escapeHtml(item.name)}</del> → <strong>${escapeHtml(draft.name)}</strong></span><br>` : ''}
                  ${draft.price !== item.price ? `<span>Pris: <del>${escapeHtml(item.price)}</del> → <strong>${escapeHtml(draft.price)}</strong></span><br>` : ''}
                  ${draft.descriptionSv !== item.descriptionSv ? `<span class="text-truncate d-block">Beskrivning ändrad</span>` : ''}
                </div>
              ` : ''}
              
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span class="badge bg-secondary">${getCategoryName(item.category)}</span>
                  ${hasDraft ? `<span class="badge bg-warning text-dark ms-1"><i class="fas fa-file"></i> Har utkast</span>` : (item.published !== false ? `<span class="badge bg-success ms-1"><i class="fas fa-check"></i> ${t('published')}</span>` : `<span class="badge bg-secondary ms-1"><i class="fas fa-file"></i> ${t('draft')}</span>`)}
                </div>
                <span class="fw-bold">${escapeHtml(item.price)}</span>
              </div>
              ${(item.avgRating > 0 || item.totalRatings > 0) ? `
                <div class="mt-2 text-muted small">
                  ⭐ ${(item.avgRating || 0).toFixed(1)} (${item.totalRatings || 0} ${t('ratings')})
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });
    
    html += `</div></div>`;
  });
  
  container.innerHTML = html || '<p class="text-muted">Inga menyalternativ hittades</p>';
}

/**
 * Get category name in Swedish
 */
function getCategoryName(category) {
  const names = {
    pizza: 'Pizza',
    kebab: 'Kebab',
    sallad: 'Sallad',
    alacarte: 'À la carte',
    pasta: 'Pasta',
    gatukok: 'Gatukök',
    tillbehor: 'Tillbehör'
  };
  return names[category] || category;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Open menu item dialog
 */
async function openMenuDialog(itemId) {
  let item = null;
  if (itemId) {
    const items = window.adminMenuItems || [];
    item = items.find(i => i.id === itemId);
  }
  
  // If editing an item with draft changes, use draft values for the form
  const displayData = item && item.draftChanges ? { ...item, ...item.draftChanges } : item;
  
  const isEdit = !!item;
  const title = isEdit ? t('edit_item') : t('add_item_title');
  
  const formHtml = `
    <div class="modal fade show" id="menuItemModal" style="display: block; z-index: 10500;" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" onclick="closeMenuDialog()"></button>
          </div>
          <div class="modal-body">
            ${item && item.draftChanges ? `
              <div class="alert alert-info mb-3">
                <i class="fas fa-info-circle"></i> Detta objekt har opublicerade ändringar. Formuläret visar utkastversionen.
              </div>
            ` : ''}
            <form id="menuItemForm" onsubmit="event.preventDefault(); saveMenuItem('${item ? item.id : ''}');">
              <div class="mb-3">
                <label class="form-label">${t('name')}</label>
                <input type="text" class="form-control" id="menuName" value="${displayData ? escapeHtml(displayData.name) : ''}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">${t('description_sv')}</label>
                <textarea class="form-control" id="menuDescSv" rows="3" required>${displayData ? escapeHtml(displayData.descriptionSv || '') : ''}</textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">${t('description_en')}</label>
                <textarea class="form-control" id="menuDescEn" rows="3">${displayData ? escapeHtml(displayData.descriptionEn || '') : ''}</textarea>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">${t('price')}</label>
                  <input type="text" class="form-control" id="menuPrice" value="${displayData ? escapeHtml(displayData.price) : ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">${t('order')}</label>
                  <input type="number" class="form-control" id="menuOrder" value="${displayData ? (displayData.order || 0) : 0}">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">${t('category')}</label>
                <select class="form-select" id="menuCategory" required>
                  ${categories.map(cat => `
                    <option value="${cat}" ${displayData && displayData.category === cat ? 'selected' : ''}>
                      ${getCategoryName(cat)}
                    </option>
                  `).join('')}
                </select>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="menuPublished" ${item && item.published !== false ? 'checked' : (!item ? 'checked' : '')}>
                <label class="form-check-label" for="menuPublished">
                  <i class="fas fa-check-circle"></i> ${t('publish_direct')}
                </label>
                <div class="form-text">${t('save_as_draft')}</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeMenuDialog()">${t('cancel')}</button>
            <button type="button" class="btn btn-primary" onclick="saveMenuItem('${item ? item.id : ''}')">${t('save')}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" onclick="closeMenuDialog()" style="z-index: 10400;"></div>
  `;
  
  // Remove existing modal if any
  const existing = document.getElementById('menuItemModal');
  if (existing) existing.remove();
  
  document.body.insertAdjacentHTML('beforeend', formHtml);
}

/**
 * Close menu dialog
 */
function closeMenuDialog() {
  const modal = document.getElementById('menuItemModal');
  const backdrop = document.querySelector('.modal-backdrop');
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
}

/**
 * Save menu item
 */
async function saveMenuItem(itemId) {
  const name = document.getElementById('menuName').value;
  const descriptionSv = document.getElementById('menuDescSv').value;
  const descriptionEn = document.getElementById('menuDescEn').value;
  const price = document.getElementById('menuPrice').value;
  const category = document.getElementById('menuCategory').value;
  const order = parseInt(document.getElementById('menuOrder').value) || 0;
  const published = document.getElementById('menuPublished').checked;
  
  if (!name || !descriptionSv || !price || !category) {
    alert(t('fill_required'));
    return;
  }
  
  try {
    const itemData = {
      name,
      descriptionSv,
      descriptionEn,
      price,
      category,
      order,
      published
    };
    
    if (itemId) {
      // Get existing item to check if it's currently published
      const existingItems = window.adminMenuItems || [];
      const existingItem = existingItems.find(item => item.id === itemId);
      
      // If saving as draft (published = false) and the item is currently published
      if (!published && existingItem && existingItem.published !== false) {
        // Store draft changes IN THE SAME ITEM, not as a separate entry
        await updateMenuItem(itemId, {
          draftChanges: {
            name,
            descriptionSv,
            descriptionEn,
            price,
            category,
            order
          }
        });
        alert(t('draft_saved'));
      } else if (published && existingItem && existingItem.draftChanges) {
        // Publishing: merge draft changes into main fields
        await updateMenuItem(itemId, {
          ...itemData,
          draftChanges: null // Clear draft changes
        });
        alert(t('item_updated'));
      } else {
        // Normal update
        await updateMenuItem(itemId, itemData);
        alert(t('item_updated'));
      }
    } else {
      await createMenuItem(itemData);
      alert(t('item_added'));
    }
    
    closeMenuDialog();
    await loadAdminMenuContent();
    
    // Reload menu on frontend
    if (typeof loadMenuData === 'function') {
      await loadMenuData();
      if (typeof window.updateMenuAfterLoad === 'function') {
        window.updateMenuAfterLoad();
      }
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Edit menu item
 */
function editMenuItem(itemId) {
  openMenuDialog(itemId);
}

/**
 * Delete menu item
 */
async function deleteMenuItemAdmin(itemId) {
  if (!confirm(`${t('confirm_delete')} ${t('add_item').toLowerCase()}?`)) {
    return;
  }
  
  try {
    await deleteMenuItem(itemId);
    alert(t('item_deleted'));
    await loadAdminMenuContent();
    
    // Reload menu on frontend
    if (typeof loadMenuData === 'function') {
      await loadMenuData();
      if (typeof window.updateMenuAfterLoad === 'function') {
        window.updateMenuAfterLoad();
      }
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Publish all pending changes (drafts)
 */

/**
 * Apply all filters combined
 */
function applyFilters() {
  const searchEl = document.getElementById('menuSearch');
  const categoryEl = document.getElementById('filterCategory');
  const publishedEl = document.getElementById('filterPublished');
  const ratingEl = document.getElementById('filterRating');
  
  if (!searchEl) return; // Not in menu tab
  
  const search = searchEl.value.toLowerCase();
  const category = categoryEl?.value || '';
  const published = publishedEl?.value || '';
  const minRating = parseFloat(ratingEl?.value || '0');
  
  const cards = document.querySelectorAll('.menu-item-card');
  
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const itemCategory = card.getAttribute('data-item-category');
    const cardElement = card.querySelector('.card');
    
    // Search filter
    const matchesSearch = text.includes(search);
    
    // Category filter
    const matchesCategory = !category || itemCategory === category;
    
    // Published filter
    let matchesPublished = true;
    if (published) {
      const isDraft = cardElement?.classList.contains('border-warning');
      matchesPublished = (published === 'draft' && isDraft) || (published === 'published' && !isDraft);
    }
    
    // Rating filter
    let matchesRating = true;
    if (minRating > 0) {
      const ratingText = card.textContent.match(/⭐\s*(\d+\.?\d*)/);
      const rating = ratingText ? parseFloat(ratingText[1]) : 0;
      matchesRating = rating >= minRating;
    }
    
    const visible = matchesSearch && matchesCategory && matchesPublished && matchesRating;
    card.style.display = visible ? '' : 'none';
    card.closest('.col-md-6, .col-lg-4').style.display = visible ? '' : 'none';
  });
}

/**
 * Clear all filters
 */
function clearFilters() {
  const searchEl = document.getElementById('menuSearch');
  const categoryEl = document.getElementById('filterCategory');
  const publishedEl = document.getElementById('filterPublished');
  const ratingEl = document.getElementById('filterRating');
  
  if (searchEl) searchEl.value = '';
  if (categoryEl) categoryEl.value = '';
  if (publishedEl) publishedEl.value = '';
  if (ratingEl) ratingEl.value = '';
  
  applyFilters();
}

/**
 * Legacy function for backward compatibility
 */
function filterMenuItems() {
  applyFilters();
}

/**
 * Toggle multi-select mode
 */
function toggleMultiSelectMode() {
  multiSelectMode = !multiSelectMode;
  const btn = document.getElementById('multiSelectToggle');
  if (btn) {
    btn.classList.toggle('active', multiSelectMode);
    btn.innerHTML = multiSelectMode 
      ? '<i class="fas fa-times"></i> Avsluta multi-välj' 
      : '<i class="fas fa-check-square"></i> Multi-välj';
  }
  
  // Re-render to show/hide checkboxes
  renderMenuItems(window.adminMenuItems || []);
  updateBulkActionBar();
}

/**
 * Toggle item selection
 */
function toggleItemSelection(itemId) {
  if (selectedItems.has(itemId)) {
    selectedItems.delete(itemId);
  } else {
    selectedItems.add(itemId);
  }
  updateBulkActionBar();
  
  // Update visual selection
  const card = document.querySelector(`[data-item-id="${itemId}"]`);
  if (card) {
    card.classList.toggle('selected-item', selectedItems.has(itemId));
    const cardElement = card.querySelector('.card');
    if (cardElement) {
      cardElement.classList.toggle('border-primary', selectedItems.has(itemId));
      cardElement.classList.toggle('border-2', selectedItems.has(itemId));
    }
  }
}

/**
 * Select all visible items
 */
function selectAll() {
  const visibleCards = Array.from(document.querySelectorAll('.menu-item-card'))
    .filter(card => card.style.display !== 'none');
  
  visibleCards.forEach(card => {
    const itemId = card.getAttribute('data-item-id');
    if (itemId) {
      selectedItems.add(itemId);
      const checkbox = card.querySelector('.item-checkbox');
      if (checkbox) checkbox.checked = true;
      card.classList.add('selected-item');
      const cardElement = card.querySelector('.card');
      if (cardElement) {
        cardElement.classList.add('border-primary', 'border-2');
      }
    }
  });
  
  updateBulkActionBar();
}

/**
 * Deselect all items
 */
function deselectAll() {
  selectedItems.clear();
  document.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = false);
  document.querySelectorAll('.selected-item').forEach(card => {
    card.classList.remove('selected-item');
    const cardElement = card.querySelector('.card');
    if (cardElement) {
      cardElement.classList.remove('border-primary', 'border-2');
    }
  });
  updateBulkActionBar();
}

/**
 * Update bulk action bar visibility and count
 */
function updateBulkActionBar() {
  const bar = document.getElementById('bulkActionBar');
  const countSpan = document.getElementById('selectedCount');
  
  if (bar && countSpan) {
    bar.style.display = selectedItems.size > 0 ? 'flex' : 'none';
    countSpan.textContent = selectedItems.size;
  }
}

/**
 * Bulk delete selected items
 */
async function bulkDelete() {
  if (selectedItems.size === 0) return;
  
  if (!confirm(`Ta bort ${selectedItems.size} valda objekt?`)) {
    return;
  }
  
  try {
    const deletePromises = Array.from(selectedItems).map(id => deleteMenuItem(id));
    await Promise.all(deletePromises);
    
    // Save to history
    addToHistory('delete', Array.from(selectedItems));
    
    alert(`${selectedItems.size} objekt borttagna!`);
    selectedItems.clear();
    await loadAdminMenuContent();
    
    // Reload frontend
    if (typeof loadMenuData === 'function') {
      await loadMenuData();
      if (typeof window.updateMenuAfterLoad === 'function') {
        window.updateMenuAfterLoad();
      }
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Bulk change category
 */
async function bulkChangeCategory() {
  if (selectedItems.size === 0) return;
  
  const categoryNames = categories.map(cat => getCategoryName(cat));
  const categoryMap = {};
  categories.forEach((cat, idx) => {
    categoryMap[categoryNames[idx]] = cat;
  });
  
  const choice = prompt(`Välj ny kategori för ${selectedItems.size} objekt:\n${categoryNames.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}\n\nAnge nummer:`);
  if (!choice) return;
  
  const index = parseInt(choice) - 1;
  if (index < 0 || index >= categories.length) {
    alert('Ogiltigt val');
    return;
  }
  
  const newCategory = categories[index];
  
  try {
    const updatePromises = Array.from(selectedItems).map(id => 
      updateMenuItem(id, { category: newCategory })
    );
    await Promise.all(updatePromises);
    
    // Save to history
    addToHistory('category', Array.from(selectedItems), { newCategory });
    
    alert(`${selectedItems.size} objekt uppdaterade!`);
    selectedItems.clear();
    await loadAdminMenuContent();
    
    // Reload frontend
    if (typeof loadMenuData === 'function') {
      await loadMenuData();
      if (typeof window.updateMenuAfterLoad === 'function') {
        window.updateMenuAfterLoad();
      }
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Bulk adjust price
 */
async function bulkAdjustPrice() {
  if (selectedItems.size === 0) return;
  
  // Create and show modal
  const modalId = 'priceAdjustModal';
  let existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal fade';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('aria-labelledby', 'priceAdjustModalLabel');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="priceAdjustModalLabel">Justera pris för ${selectedItems.size} objekt</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Välj justeringsläge:</label>
            <div class="btn-group w-100" role="group">
              <input type="radio" class="btn-check" name="adjustMode" id="modePercent" value="percent" checked>
              <label class="btn btn-outline-primary" for="modePercent">
                <i class="fas fa-percent"></i> Procent (%)
              </label>
              
              <input type="radio" class="btn-check" name="adjustMode" id="modeKr" value="kr">
              <label class="btn btn-outline-primary" for="modeKr">
                <i class="fas fa-coins"></i> Kronor (kr)
              </label>
            </div>
          </div>
          
          <div id="percentMode" class="adjustment-mode">
            <label class="form-label">Procentjustering:</label>
            <div class="input-group">
              <button class="btn btn-outline-secondary" type="button" id="percentDecrease">-</button>
              <input type="number" class="form-control" id="percentValue" placeholder="10" min="0" max="100" step="0.1" value="10">
              <span class="input-group-text">%</span>
              <button class="btn btn-outline-secondary" type="button" id="percentIncrease">+</button>
            </div>
            <small class="form-text text-muted">Ange procent för ökning (t.ex. 10 för 10% ökning)</small>
          </div>
          
          <div id="krMode" class="adjustment-mode" style="display: none;">
            <label class="form-label">Kronorjustering:</label>
            <div class="mb-2">
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="krDirection" id="krIncrease" value="increase" checked>
                <label class="btn btn-outline-success" for="krIncrease">
                  <i class="fas fa-plus"></i> Öka
                </label>
                
                <input type="radio" class="btn-check" name="krDirection" id="krDecrease" value="decrease">
                <label class="btn btn-outline-danger" for="krDecrease">
                  <i class="fas fa-minus"></i> Minska
                </label>
              </div>
            </div>
            <div class="input-group">
              <button class="btn btn-outline-secondary" type="button" id="krValueDecrease">-</button>
              <input type="number" class="form-control" id="krValue" placeholder="5" min="0" step="1" value="5">
              <span class="input-group-text">kr</span>
              <button class="btn btn-outline-secondary" type="button" id="krValueIncrease">+</button>
            </div>
            <small class="form-text text-muted">Ange belopp i kronor (t.ex. 5 för ±5 kr)</small>
          </div>
          
          <div class="mt-3 p-3 bg-light rounded">
            <strong>Förhandsvisning:</strong>
            <div id="pricePreview" class="mt-2">
              <small>Välj läge och värde för att se förhandsvisning</small>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Avbryt</button>
          <button type="button" class="btn btn-primary" id="applyPriceAdjustment">Tillämpa</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Initialize Bootstrap modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
  
  // Mode switching
  const modeInputs = modal.querySelectorAll('input[name="adjustMode"]');
  const percentMode = modal.querySelector('#percentMode');
  const krMode = modal.querySelector('#krMode');
  const percentValue = modal.querySelector('#percentValue');
  const krValue = modal.querySelector('#krValue');
  const preview = modal.querySelector('#pricePreview');
  
  modeInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (input.value === 'percent') {
        percentMode.style.display = 'block';
        krMode.style.display = 'none';
      } else {
        percentMode.style.display = 'none';
        krMode.style.display = 'block';
      }
      updatePreview();
    });
  });
  
  // Increment/decrement buttons
  modal.querySelector('#percentIncrease').addEventListener('click', () => {
    percentValue.value = (parseFloat(percentValue.value) || 0) + 1;
    updatePreview();
  });
  
  modal.querySelector('#percentDecrease').addEventListener('click', () => {
    const val = Math.max(0, (parseFloat(percentValue.value) || 0) - 1);
    percentValue.value = val;
    updatePreview();
  });
  
  modal.querySelector('#krValueIncrease').addEventListener('click', () => {
    krValue.value = (parseInt(krValue.value) || 0) + 1;
    updatePreview();
  });
  
  modal.querySelector('#krValueDecrease').addEventListener('click', () => {
    const val = Math.max(0, (parseInt(krValue.value) || 0) - 1);
    krValue.value = val;
    updatePreview();
  });
  
  // Kr direction toggle
  const krDirectionInputs = modal.querySelectorAll('input[name="krDirection"]');
  krDirectionInputs.forEach(input => {
    input.addEventListener('change', updatePreview);
  });
  
  // Update preview on input change
  percentValue.addEventListener('input', updatePreview);
  krValue.addEventListener('input', updatePreview);
  
  // Preview function
  function updatePreview() {
    const items = window.adminMenuItems || [];
    const selectedArray = Array.from(selectedItems).slice(0, 3); // Show max 3 examples
    const isPercent = modal.querySelector('#modePercent').checked;
    const value = isPercent ? parseFloat(percentValue.value) : parseFloat(krValue.value);
    
    if (!value || value <= 0) {
      preview.innerHTML = '<small class="text-muted">Ange ett värde för att se förhandsvisning</small>';
      return;
    }
    
    let previewHTML = '<div class="small">';
    selectedArray.forEach(id => {
      const item = items.find(i => i.id === id);
      if (!item) return;
      
      const currentPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
      let newPrice;
      let adjustmentText = '';
      
      if (isPercent) {
        newPrice = currentPrice * (1 + value / 100);
        adjustmentText = `+${value}%`;
      } else {
        const isIncrease = modal.querySelector('input[name="krDirection"]:checked').value === 'increase';
        if (isIncrease) {
          newPrice = currentPrice + value;
          adjustmentText = `+${value} kr`;
        } else {
          newPrice = Math.max(0, currentPrice - value);
          adjustmentText = `-${value} kr`;
        }
      }
      
      newPrice = Math.round(newPrice);
      previewHTML += `<div>${item.name}: ${currentPrice} kr ${adjustmentText} → <strong>${newPrice} kr</strong></div>`;
    });
    
    if (selectedItems.size > 3) {
      previewHTML += `<div class="text-muted">... och ${selectedItems.size - 3} fler objekt</div>`;
    }
    
    previewHTML += '</div>';
    preview.innerHTML = previewHTML;
  }
  
  // Apply button
  modal.querySelector('#applyPriceAdjustment').addEventListener('click', async () => {
    const isPercent = modal.querySelector('#modePercent').checked;
    const value = isPercent ? parseFloat(percentValue.value) : parseFloat(krValue.value);
    
    if (!value || value <= 0) {
      alert('Ange ett giltigt värde');
      return;
    }
    
    bsModal.hide();
    
    try {
      const items = window.adminMenuItems || [];
      const updatePromises = Array.from(selectedItems).map(id => {
        const item = items.find(i => i.id === id);
        if (!item) return null;
        
        const currentPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
        let newPrice;
        
        if (isPercent) {
          newPrice = currentPrice * (1 + value / 100);
        } else {
          const isIncrease = modal.querySelector('input[name="krDirection"]:checked').value === 'increase';
          if (isIncrease) {
            newPrice = currentPrice + value;
          } else {
            newPrice = Math.max(0, currentPrice - value);
          }
        }
        
        newPrice = Math.round(newPrice);
        return updateMenuItem(id, { price: `${newPrice} kr` });
      }).filter(p => p !== null);
      
      await Promise.all(updatePromises);
      
      // Save to history
      let adjustment;
      if (isPercent) {
        adjustment = `${value}%`;
      } else {
        const isIncrease = modal.querySelector('input[name="krDirection"]:checked').value === 'increase';
        adjustment = isIncrease ? `+${value} kr` : `-${value} kr`;
      }
      addToHistory('price', Array.from(selectedItems), { adjustment, mode: isPercent ? 'percent' : 'kr' });
      
      alert(`${selectedItems.size} priser uppdaterade!`);
      selectedItems.clear();
      await loadAdminMenuContent();
      
      // Reload frontend
      if (typeof loadMenuData === 'function') {
        await loadMenuData();
        if (typeof window.updateMenuAfterLoad === 'function') {
          window.updateMenuAfterLoad();
        }
      }
    } catch (error) {
      alert('Fel: ' + error.message);
    }
    
    // Clean up
    modal.remove();
  });
  
  // Clean up on close
  modal.addEventListener('hidden.bs.modal', () => {
    modal.remove();
  });
  
  // Initial preview
  updatePreview();
}

/**
 * Bulk publish/unpublish
 */

/**
 * Duplicate menu item
 */
async function duplicateMenuItem(itemId) {
  const items = window.adminMenuItems || [];
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  
  const newItem = {
    ...item,
    name: item.name + ' (Kopia)',
    published: false // Default to draft
  };
  delete newItem.id;
  delete newItem.avgRating;
  delete newItem.totalRatings;
  delete newItem.ratingScore;
  delete newItem.userRating;
  delete newItem.isMostLiked;
  
  try {
    await createMenuItem(newItem);
    alert('Objekt duplicerat!');
    await loadAdminMenuContent();
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Add action to history
 */
function addToHistory(action, itemIds, data = {}) {
  actionHistory.unshift({
    action,
    itemIds,
    data,
    timestamp: new Date().toISOString()
  });
  
  if (actionHistory.length > MAX_HISTORY) {
    actionHistory = actionHistory.slice(0, MAX_HISTORY);
  }
}

/**
 * Undo last action (basic implementation)
 */
async function undoLastAction() {
  if (actionHistory.length === 0) {
    alert('Ingen åtgärd att ångra');
    return;
  }
  
  const lastAction = actionHistory[0];
  alert(`Ångra-funktionen är under utveckling. Senaste åtgärd: ${lastAction.action} på ${lastAction.itemIds.length} objekt`);
  // Full undo implementation would require storing complete item state
}

/**
 * Load admin news content
 */
async function loadAdminNewsContent() {
  const contentDiv = document.getElementById('adminContent');
  if (!contentDiv) return;
  
  try {
    const data = await fetchNews();
    const articles = data.newsArticles || [];
    
    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Hantera Nyheter</h3>
        <button class="btn btn-primary" onclick="openNewsDialog()">
          <i class="fas fa-plus"></i> Lägg till nyhet
        </button>
      </div>
      <div id="newsList" class="row g-3"></div>
    `;
    
    contentDiv.innerHTML = html;
    
    // Render news articles
    const newsList = document.getElementById('newsList');
    if (articles.length === 0) {
      newsList.innerHTML = '<div class="col-12"><p class="text-muted">Inga nyheter</p></div>';
    } else {
      articles.forEach(article => {
        const title = article.titleSv || article.titleEn || 'Ingen titel';
        const content = (article.contentSv || article.contentEn || '').substring(0, 100) + '...';
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `
          <div class="card h-100">
            ${article.imageUrl ? `<img src="${article.imageUrl}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
            <div class="card-body">
              <h5 class="card-title">${escapeHtml(title)}</h5>
              <p class="card-text text-muted small">${escapeHtml(content)}</p>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="editNews('${article.id}')">
                  <i class="fas fa-edit"></i> Redigera
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteNewsItem('${article.id}')">
                  <i class="fas fa-trash"></i> Ta bort
                </button>
              </div>
            </div>
          </div>
        `;
        newsList.appendChild(col);
      });
    }
    
    window.adminNewsArticles = articles;
  } catch (error) {
    contentDiv.innerHTML = '<div class="alert alert-danger">Kunde inte ladda nyheter: ' + error.message + '</div>';
  }
}

/**
 * Open news dialog
 */
async function openNewsDialog(articleId) {
  let article = null;
  if (articleId) {
    const articles = window.adminNewsArticles || [];
    article = articles.find(a => a.id === articleId);
  }
  
  const isEdit = !!article;
  const title = isEdit ? 'Redigera nyhet' : 'Lägg till nyhet';
  
  const formHtml = `
    <div class="modal fade show" id="newsModal" style="display: block; z-index: 10500;" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" onclick="closeNewsDialog()"></button>
          </div>
          <div class="modal-body">
            <form id="newsForm" onsubmit="event.preventDefault(); saveNews('${article ? article.id : ''}');">
              <div class="mb-3">
                <label class="form-label">Titel (Svenska)</label>
                <input type="text" class="form-control" id="newsTitleSv" value="${article ? escapeHtml(article.titleSv || '') : ''}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Titel (English)</label>
                <input type="text" class="form-control" id="newsTitleEn" value="${article ? escapeHtml(article.titleEn || '') : ''}">
              </div>
              <div class="mb-3">
                <label class="form-label">Innehåll (Svenska)</label>
                <textarea class="form-control" id="newsContentSv" rows="5" required>${article ? escapeHtml(article.contentSv || '') : ''}</textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Innehåll (English)</label>
                <textarea class="form-control" id="newsContentEn" rows="5">${article ? escapeHtml(article.contentEn || '') : ''}</textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Bild URL</label>
                <input type="text" class="form-control" id="newsImageUrl" value="${article ? escapeHtml(article.imageUrl || '') : ''}" placeholder="https://...">
                <small class="form-text text-muted">Eller ladda upp en bild nedan</small>
              </div>
              <div class="mb-3">
                <label class="form-label">Ladda upp bild</label>
                <input type="file" class="form-control" id="newsImageFile" accept="image/*" onchange="previewNewsImage(this)">
                <div id="newsImagePreview" class="mt-2"></div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeNewsDialog()">Avbryt</button>
            <button type="button" class="btn btn-primary" onclick="saveNews('${article ? article.id : ''}')" id="saveNewsBtn">
              <span class="btn-text">Spara</span>
              <span class="spinner-border spinner-border-sm d-none" role="status"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" onclick="closeNewsDialog()" style="z-index: 10400;"></div>
  `;
  
  const existing = document.getElementById('newsModal');
  if (existing) existing.remove();
  
  document.body.insertAdjacentHTML('beforeend', formHtml);
  
  // Show existing image if editing
  if (article && article.imageUrl) {
    const preview = document.getElementById('newsImagePreview');
    if (preview) {
      preview.innerHTML = `<img src="${article.imageUrl}" class="img-thumbnail" style="max-height: 200px;">`;
    }
  }
}

/**
 * Preview news image when file is selected
 */
function previewNewsImage(input) {
  const file = input.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vänligen välj en giltig bildfil');
      input.value = '';
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Bilden är för stor. Maximal storlek är 10MB');
      input.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('newsImagePreview');
      if (preview) {
        preview.innerHTML = `
          <div class="position-relative d-inline-block">
            <img src="${e.target.result}" class="img-thumbnail" style="max-height: 200px;">
            <div class="mt-2 small text-muted">
              <i class="fas fa-file-image"></i> ${file.name} (${(file.size / 1024).toFixed(1)} KB)
            </div>
          </div>
        `;
      }
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Close news dialog
 */
function closeNewsDialog() {
  const modal = document.getElementById('newsModal');
  const backdrop = document.querySelector('.modal-backdrop');
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
}

/**
 * Save news article
 */
async function saveNews(articleId) {
  const titleSv = document.getElementById('newsTitleSv').value;
  const titleEn = document.getElementById('newsTitleEn').value;
  const contentSv = document.getElementById('newsContentSv').value;
  const contentEn = document.getElementById('newsContentEn').value;
  const imageUrlInput = document.getElementById('newsImageUrl');
  const imageFileInput = document.getElementById('newsImageFile');
  
  if (!titleSv || !contentSv) {
    alert('Vänligen fyll i titel och innehåll (svenska)');
    return;
  }
  
  try {
    let imageUrl = imageUrlInput.value;
    
    // Upload image if file selected
    if (imageFileInput.files.length > 0) {
      const file = imageFileInput.files[0];
      const uploadResult = await uploadImage(file, 'news');
      imageUrl = uploadResult.url;
    }
    
    const articleData = {
      titleSv,
      titleEn,
      contentSv,
      contentEn,
      imageUrl: imageUrl || ''
    };
    
    if (articleId) {
      await updateNews(articleId, articleData);
      alert('Nyhet uppdaterad!');
    } else {
      await createNews(articleData);
      alert('Nyhet tillagd!');
    }
    
    closeNewsDialog();
    await loadAdminNewsContent();
    
    // Reload news on frontend
    if (typeof loadNews === 'function') {
      await loadNews();
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Edit news
 */
function editNews(articleId) {
  openNewsDialog(articleId);
}

/**
 * Delete news item
 */
async function deleteNewsItem(articleId) {
  if (!confirm('Är du säker på att du vill ta bort denna nyhet?')) {
    return;
  }
  
  try {
    await deleteNews(articleId);
    alert('Nyhet borttagen!');
    await loadAdminNewsContent();
    
    // Reload news on frontend
    if (typeof loadNews === 'function') {
      await loadNews();
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Load admin gallery content
 */
async function loadAdminGalleryContent() {
  const contentDiv = document.getElementById('adminContent');
  if (!contentDiv) return;
  
  try {
    const data = await fetchGallery();
    const images = data.galleryImages || [];
    
    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Hantera Galleri</h3>
        <button class="btn btn-primary" onclick="openGalleryDialog()">
          <i class="fas fa-plus"></i> Lägg till bild
        </button>
      </div>
      <div id="galleryList" class="row g-3"></div>
    `;
    
    contentDiv.innerHTML = html;
    
    const galleryList = document.getElementById('galleryList');
    if (images.length === 0) {
      galleryList.innerHTML = '<div class="col-12"><p class="text-muted">Inga bilder i galleriet</p></div>';
    } else {
      images.forEach(image => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
          <div class="card">
            <img src="${image.thumbnailUrl || image.url || ''}" class="card-img-top" style="height: 200px; object-fit: cover;">
            <div class="card-body">
              <p class="card-text small">${escapeHtml(image.alt || 'Ingen beskrivning')}</p>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="editGalleryImage('${image.id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteGalleryImageItem('${image.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
        galleryList.appendChild(col);
      });
    }
    
    window.adminGalleryImages = images;
  } catch (error) {
    contentDiv.innerHTML = '<div class="alert alert-danger">Kunde inte ladda galleri: ' + error.message + '</div>';
  }
}

/**
 * Open gallery dialog
 */
async function openGalleryDialog(imageId) {
  let image = null;
  if (imageId) {
    const images = window.adminGalleryImages || [];
    image = images.find(img => img.id === imageId);
  }
  
  const isEdit = !!image;
  const title = isEdit ? 'Redigera bild' : 'Lägg till bild';
  
  const formHtml = `
    <div class="modal fade show" id="galleryModal" style="display: block; z-index: 10500;" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" onclick="closeGalleryDialog()"></button>
          </div>
          <div class="modal-body">
            <form id="galleryForm" onsubmit="event.preventDefault(); saveGalleryImage('${image ? image.id : ''}');">
              <div class="mb-3">
                <label class="form-label">Beskrivning</label>
                <input type="text" class="form-control" id="galleryAlt" value="${image ? escapeHtml(image.alt || '') : ''}">
              </div>
              <div class="mb-3">
                <label class="form-label">Bild URL</label>
                <input type="text" class="form-control" id="galleryUrl" value="${image ? escapeHtml(image.url || '') : ''}" placeholder="https://...">
                <small class="form-text text-muted">Eller ladda upp en bild nedan</small>
              </div>
              <div class="mb-3">
                <label class="form-label">Ladda upp bild</label>
                <input type="file" class="form-control" id="galleryFile" accept="image/*" onchange="previewGalleryImage(this)">
                <div id="galleryPreview" class="mt-2"></div>
              </div>
              ${image && !image.url ? '<div class="alert alert-warning">Ingen bild uppladdad ännu</div>' : ''}
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeGalleryDialog()">Avbryt</button>
            <button type="button" class="btn btn-primary" onclick="saveGalleryImage('${image ? image.id : ''}')" id="saveGalleryBtn">
              <span class="btn-text">Spara</span>
              <span class="spinner-border spinner-border-sm d-none" role="status"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" onclick="closeGalleryDialog()" style="z-index: 10400;"></div>
  `;
  
  const existing = document.getElementById('galleryModal');
  if (existing) existing.remove();
  
  document.body.insertAdjacentHTML('beforeend', formHtml);
  
  // Show existing image if editing
  if (image && image.url) {
    const preview = document.getElementById('galleryPreview');
    if (preview) {
      preview.innerHTML = `<img src="${image.thumbnailUrl || image.url}" class="img-thumbnail" style="max-height: 300px;">`;
    }
  }
}

/**
 * Preview gallery image when file is selected
 */
function previewGalleryImage(input) {
  const file = input.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vänligen välj en giltig bildfil');
      input.value = '';
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Bilden är för stor. Maximal storlek är 10MB');
      input.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('galleryPreview');
      if (preview) {
        preview.innerHTML = `
          <div class="position-relative d-inline-block">
            <img src="${e.target.result}" class="img-thumbnail" style="max-height: 300px;">
            <div class="mt-2 small text-muted">
              <i class="fas fa-file-image"></i> ${file.name} (${(file.size / 1024).toFixed(1)} KB)
            </div>
          </div>
        `;
      }
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Close gallery dialog
 */
function closeGalleryDialog() {
  const modal = document.getElementById('galleryModal');
  const backdrop = document.querySelector('.modal-backdrop');
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
}

/**
 * Save gallery image
 */
async function saveGalleryImage(imageId) {
  const alt = document.getElementById('galleryAlt').value;
  const urlInput = document.getElementById('galleryUrl');
  const fileInput = document.getElementById('galleryFile');
  const saveBtn = document.getElementById('saveGalleryBtn');
  const btnText = saveBtn?.querySelector('.btn-text');
  const spinner = saveBtn?.querySelector('.spinner-border');
  
  // Show loading state
  if (saveBtn) {
    saveBtn.disabled = true;
    if (btnText) btnText.classList.add('d-none');
    if (spinner) spinner.classList.remove('d-none');
  }
  
  try {
    let url = urlInput.value;
    let path = '';
    let thumbnailUrl = '';
    let thumbnailPath = '';
    
    // Upload image if file selected
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      console.log('Uploading image:', file.name, file.size, file.type);
      
      // Create thumbnail if function is available
      let thumbnail = null;
      if (typeof createThumbnail === 'function') {
        try {
          console.log('Creating thumbnail...');
          thumbnail = await createThumbnail(file);
          console.log('Thumbnail created successfully');
        } catch (error) {
          console.warn('Failed to create thumbnail, uploading without thumbnail:', error);
        }
      }
      
      console.log('Calling uploadImage...');
      const uploadResult = await uploadImage(file, 'gallery', thumbnail);
      console.log('Upload result:', uploadResult);
      
      url = uploadResult.url;
      path = uploadResult.path;
      thumbnailUrl = uploadResult.thumbnailUrl || uploadResult.url;
      thumbnailPath = uploadResult.thumbnailPath || uploadResult.path;
    }
    
    if (!url && (!fileInput || !fileInput.files.length)) {
      alert('Vänligen ange en bild-URL eller ladda upp en bild');
      // Reset button state
      if (saveBtn) {
        saveBtn.disabled = false;
        if (btnText) btnText.classList.remove('d-none');
        if (spinner) spinner.classList.add('d-none');
      }
      return;
    }
    
    const imageData = {
      alt: alt || '',
      url: url || '',
      path: path || '',
      thumbnailUrl: thumbnailUrl || url || '',
      thumbnailPath: thumbnailPath || path || ''
    };
    
    console.log('Saving image data:', imageData);
    
    if (imageId) {
      await updateGalleryImage(imageId, imageData);
      
      // Show success with Toastify if available
      if (typeof Toastify !== 'undefined') {
        Toastify({
          text: 'Bild uppdaterad!',
          duration: 3000,
          gravity: "top",
          position: "center",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
        }).showToast();
      } else {
        alert('Bild uppdaterad!');
      }
    } else {
      await createGalleryImage(imageData);
      
      // Show success with Toastify if available
      if (typeof Toastify !== 'undefined') {
        Toastify({
          text: 'Bild tillagd!',
          duration: 3000,
          gravity: "top",
          position: "center",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
        }).showToast();
      } else {
        alert('Bild tillagd!');
      }
    }
    
    closeGalleryDialog();
    await loadAdminGalleryContent();
    
    // Reload gallery on frontend
    if (typeof loadGallery === 'function') {
      await loadGallery();
    }
  } catch (error) {
    console.error('Gallery image save error:', error);
    
    // Show error with Toastify if available
    if (typeof Toastify !== 'undefined') {
      Toastify({
        text: 'Fel: ' + error.message,
        duration: 5000,
        gravity: "top",
        position: "center",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
      }).showToast();
    } else {
      alert('Fel: ' + error.message);
    }
    
    // Reset button state
    if (saveBtn) {
      saveBtn.disabled = false;
      if (btnText) btnText.classList.remove('d-none');
      if (spinner) spinner.classList.add('d-none');
    }
  }
}

/**
 * Edit gallery image
 */
function editGalleryImage(imageId) {
  openGalleryDialog(imageId);
}

/**
 * Delete gallery image
 */
async function deleteGalleryImageItem(imageId) {
  if (!confirm('Är du säker på att du vill ta bort denna bild?')) {
    return;
  }
  
  try {
    await deleteGalleryImage(imageId);
    alert('Bild borttagen!');
    await loadAdminGalleryContent();
    
    // Reload gallery on frontend
    if (typeof loadGallery === 'function') {
      await loadGallery();
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Load admin settings content
 */
async function loadAdminSettingsContent() {
  const contentDiv = document.getElementById('adminContent');
  if (!contentDiv) return;
  
  try {
    const data = await fetchSettings();
    const settings = data.settings || {};
    
    const html = `
      <div>
        <h3 class="mb-4">Restauranginställningar</h3>
        <form id="settingsForm" onsubmit="saveSettings(event)" class="row g-3">
          <div class="col-12">
            <label class="form-label">Restaurangnamn</label>
            <input type="text" class="form-control" id="settingName" value="${escapeHtml(settings.name || '')}" required>
          </div>
          <div class="col-12">
            <label class="form-label">Adress</label>
            <input type="text" class="form-control" id="settingAddress" value="${escapeHtml(settings.address || '')}">
          </div>
          <div class="col-md-6">
            <label class="form-label">Latitud</label>
            <input type="number" step="0.0001" class="form-control" id="settingLat" value="${settings.lat || 0}">
          </div>
          <div class="col-md-6">
            <label class="form-label">Longitud</label>
            <input type="number" step="0.0001" class="form-control" id="settingLng" value="${settings.lng || 0}">
          </div>
          <div class="col-md-6">
            <label class="form-label">Telefon</label>
            <input type="text" class="form-control" id="settingPhone" value="${escapeHtml(settings.phone || '')}">
          </div>
          <div class="col-md-6">
            <label class="form-label">E-post</label>
            <input type="email" class="form-control" id="settingEmail" value="${escapeHtml(settings.email || '')}">
          </div>
          <div class="col-12">
            <label class="form-label">Öppettider</label>
            <input type="text" class="form-control" id="settingOpeningHours" value="${escapeHtml(settings.openingHours || '')}" placeholder="Måndag - Söndag: 11:00 - 21:00">
          </div>
          <div class="col-md-6">
            <label class="form-label">Facebook URL</label>
            <input type="url" class="form-control" id="settingFacebook" value="${escapeHtml(settings.facebook || '')}">
          </div>
          <div class="col-md-6">
            <label class="form-label">Instagram URL</label>
            <input type="url" class="form-control" id="settingInstagram" value="${escapeHtml(settings.instagram || '')}">
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary w-100">Spara inställningar</button>
          </div>
        </form>
      </div>
    `;
    
    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = '<div class="alert alert-danger">Kunde inte ladda inställningar: ' + error.message + '</div>';
  }
}

/**
 * Save settings
 */
async function saveSettings(event) {
  event.preventDefault();
  
  const settings = {
    name: document.getElementById('settingName').value,
    address: document.getElementById('settingAddress').value,
    lat: parseFloat(document.getElementById('settingLat').value) || 0,
    lng: parseFloat(document.getElementById('settingLng').value) || 0,
    phone: document.getElementById('settingPhone').value,
    email: document.getElementById('settingEmail').value,
    openingHours: document.getElementById('settingOpeningHours').value,
    facebook: document.getElementById('settingFacebook').value,
    instagram: document.getElementById('settingInstagram').value
  };
  
  try {
    await updateSettings(settings);
    alert('Inställningar sparade!');
    
    // Reload opening hours on frontend
    if (typeof loadOpeningHours === 'function') {
      await loadOpeningHours();
    }
  } catch (error) {
    alert('Fel: ' + error.message);
  }
}

/**
 * Publish all draft changes
 */
async function publishAllChanges() {
  if (!confirm(t('confirm_publish_all'))) {
    return;
  }
  
  try {
    const items = window.adminMenuItems || [];
    const itemsWithDrafts = items.filter(item => item.draftChanges);
    const newDrafts = items.filter(item => item.published === false && !item.draftChanges);
    
    // Publish items with draft changes
    for (const item of itemsWithDrafts) {
      await updateMenuItem(item.id, {
        ...item.draftChanges,
        published: true,
        draftChanges: null
      });
    }
    
    // Publish new draft items
    for (const draft of newDrafts) {
      await updateMenuItem(draft.id, { published: true });
    }
    
    const totalPublished = itemsWithDrafts.length + newDrafts.length;
    alert(`${totalPublished} utkast publicerade!`);
    await loadAdminMenuContent();
    
    // Reload menu on frontend
    if (typeof loadMenuData === 'function') {
      await loadMenuData();
      if (typeof window.updateMenuAfterLoad === 'function') {
        window.updateMenuAfterLoad();
      }
    }
  } catch (error) {
    alert('Fel vid publicering: ' + error.message);
  }
}

/**
 * Bulk publish/unpublish selected items
 */
async function bulkPublish(shouldPublish) {
  if (selectedItems.size === 0) {
    alert('Inga objekt valda');
    return;
  }
  
  try {
    const items = Array.from(selectedItems).map(id => 
      (window.adminMenuItems || []).find(item => item.id === id)
    ).filter(Boolean);
    
    for (const item of items) {
      if (shouldPublish && item.draftChanges) {
        // Merge draftChanges into main fields
        await updateMenuItem(item.id, {
          ...item.draftChanges,
          published: true,
          draftChanges: null
        });
      } else {
        // Simple publish/unpublish
        await updateMenuItem(item.id, { published: shouldPublish });
      }
    }
    
    addToHistory({
      action: shouldPublish ? 'bulk_publish' : 'bulk_unpublish',
      items: items.map(item => ({ id: item.id, name: item.name }))
    });
    
    selectedItems.clear();
    await loadAdminMenuContent();
    applyFilters();
    
    // Reload menu on frontend
    if (typeof loadMenuData === 'function') {
      await loadMenuData();
    }
  } catch (error) {
    alert('Fel vid publicering: ' + error.message);
  }
}

/**
 * Update floating admin button visibility based on auth state
 */
function updateFloatingAdminButton(user) {
  const floatingBtn = document.getElementById('floatingAdminBtn');
  if (floatingBtn) {
    if (user) {
      floatingBtn.style.display = 'block';
      // Add hover effect
      floatingBtn.onmouseenter = function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
      };
      floatingBtn.onmouseleave = function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
      };
    } else {
      floatingBtn.style.display = 'none';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAdminPanel();
    
    // Set up auth state listener for floating button
    if (typeof onAuthStateChange === 'function') {
      onAuthStateChange(updateFloatingAdminButton);
    }
  });
} else {
  initAdminPanel();
  
  // Set up auth state listener for floating button
  if (typeof onAuthStateChange === 'function') {
    onAuthStateChange(updateFloatingAdminButton);
  }
}
