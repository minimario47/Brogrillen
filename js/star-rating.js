/**
 * Interactive star rating component
 * Creates a star rating UI for menu items
 */

/**
 * Create a star rating element
 * @param {Object} options - Configuration options
 * @param {string} options.menuItemId - ID of the menu item
 * @param {number|null} options.userRating - User's current rating (1-5 or null)
 * @param {number} options.avgRating - Average rating from all users
 * @param {number} options.totalRatings - Total number of ratings
 * @param {Function} options.onRate - Callback when user rates (rating: number) => void
 * @param {string} options.className - Additional CSS classes
 * @param {boolean} options.isAdmin - Whether current user is admin
 * @param {boolean} options.showStats - Whether to show avg rating and total ratings to all users
 * @param {string} options.language - Current language ('sv' or 'en')
 * @returns {HTMLElement} The star rating container element
 */
function createStarRating({
  menuItemId,
  userRating,
  avgRating,
  totalRatings,
  onRate,
  className = '',
  isAdmin = false,
  showStats = false,
  language = 'sv'
}) {
  const container = document.createElement('div');
  container.className = className;
  container.setAttribute('data-menu-item-id', menuItemId);

  let hoverRating = null;
  let currentUserRating = userRating; // Make it mutable for instant UI updates

  // Translations
  const translations = {
    sv: {
      yourRating: 'Ditt betyg',
      rateThisItem: 'Betygsätt denna rätt',
      ratingsCount: 'betyg'
    },
    en: {
      yourRating: 'Your rating',
      rateThisItem: 'Rate this item',
      ratingsCount: 'ratings'
    }
  };

  const t = translations[language] || translations.sv;

  // User's rating section
  const userRatingSection = document.createElement('div');

  const label = document.createElement('div');
  label.className = 'text-xs text-muted mb-1';
  label.style.fontSize = '0.75rem';
  label.style.color = '#6c757d';
  label.style.marginBottom = '0.25rem';
  label.textContent = currentUserRating ? t.yourRating : t.rateThisItem;
  userRatingSection.appendChild(label);

  const starsContainer = document.createElement('div');
  starsContainer.className = 'd-flex align-items-center';
  starsContainer.style.gap = '0.25rem';
  starsContainer.setAttribute('data-menu-item-id', menuItemId);

  // Use event delegation for more reliable click handling
  starsContainer.addEventListener('click', (e) => {
    console.log('[StarRating] Click event fired on starsContainer');
    console.log('[StarRating] Event target:', e.target);
    console.log('[StarRating] Event target tagName:', e.target.tagName);

    const starButton = e.target.closest('.star-btn');
    console.log('[StarRating] Found star button:', starButton);
    if (!starButton) {
      console.log('[StarRating] No star button found, returning');
      return;
    }

    const starValue = parseInt(starButton.getAttribute('data-star-value'), 10);
    console.log('[StarRating] Star value:', starValue);
    if (isNaN(starValue) || starValue < 1 || starValue > 5) {
      console.log('[StarRating] Invalid star value, returning');
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    console.log('[StarRating] onRate function type:', typeof onRate);
    if (typeof onRate === 'function') {
      console.log('[StarRating] Calling onRate with value:', starValue);
      // Update UI immediately for instant feedback
      currentUserRating = starValue;
      label.textContent = t.yourRating;
      updateStars();

      // Update or add rating number display
      let ratingText = starsContainer.querySelector('.rating-number');
      if (ratingText) {
        ratingText.textContent = `${starValue}/5`;
      } else {
        ratingText = document.createElement('span');
        ratingText.className = 'rating-number text-sm font-weight-medium ms-2';
        ratingText.style.fontSize = '0.875rem';
        ratingText.style.fontWeight = '500';
        ratingText.style.marginLeft = '0.5rem';
        ratingText.textContent = `${starValue}/5`;
        starsContainer.appendChild(ratingText);
      }

      // Call the callback
      onRate(starValue);
      console.log('[StarRating] onRate callback completed');
    } else {
      console.log('[StarRating] onRate is not a function!');
    }
  });

  // Use event delegation for hover effects
  starsContainer.addEventListener('mouseover', (e) => {
    const starButton = e.target.closest('.star-btn');
    if (starButton) {
      const starValue = parseInt(starButton.getAttribute('data-star-value'), 10);
      if (!isNaN(starValue) && starValue !== hoverRating) {
        hoverRating = starValue;
        updateStars();
      }
    }
  });

  starsContainer.addEventListener('mouseleave', () => {
    hoverRating = null;
    updateStars();
  });

  // Create 5 stars
  for (let i = 1; i <= 5; i++) {
    const starButton = document.createElement('button');
    starButton.type = 'button';
    starButton.className = 'star-btn border-0 bg-transparent p-0';
    starButton.style.cursor = 'pointer';
    starButton.style.outline = 'none';
    starButton.style.position = 'relative';
    starButton.style.zIndex = '10';
    starButton.style.pointerEvents = 'auto';
    starButton.setAttribute('data-star-value', i);
    starButton.setAttribute('tabindex', '0');
    starButton.setAttribute('aria-label', `${i} ${i === 1 ? 'stjärna' : 'stjärnor'}`);

    const starSvg = createStarSVG(i <= (hoverRating !== null ? hoverRating : (currentUserRating || 0)));
    starButton.appendChild(starSvg);

    starsContainer.appendChild(starButton);
  }

  // Rating number display
  if (currentUserRating) {
    const ratingText = document.createElement('span');
    ratingText.className = 'rating-number text-sm font-weight-medium ms-2';
    ratingText.style.fontSize = '0.875rem';
    ratingText.style.fontWeight = '500';
    ratingText.style.marginLeft = '0.5rem';
    ratingText.textContent = `${currentUserRating}/5`;
    starsContainer.appendChild(ratingText);
  }

  userRatingSection.appendChild(starsContainer);
  container.appendChild(userRatingSection);

  // Update stars function
  function updateStars() {
    const displayRating = hoverRating !== null ? hoverRating : (currentUserRating || 0);
    starsContainer.querySelectorAll('.star-btn').forEach((btn, index) => {
      const starValue = index + 1;
      const isActive = starValue <= displayRating;
      const starSvg = btn.querySelector('svg');
      if (starSvg) {
        btn.replaceChild(createStarSVG(isActive), starSvg);
      }
    });
  }

  // Stats view (shown to admins or when showStats is true)
  if (isAdmin || showStats) {
    const statsSection = document.createElement('div');
    statsSection.className = 'mt-2 pt-2';
    statsSection.style.marginTop = '0.5rem';
    statsSection.style.paddingTop = '0.5rem';
    statsSection.style.borderTop = '1px solid #dee2e6';

    const statsInfo = document.createElement('div');
    statsInfo.className = 'text-xs text-muted';
    statsInfo.style.fontSize = '0.75rem';
    statsInfo.style.color = '#6c757d';

    const avgText = document.createElement('div');
    // Show "Admin:" prefix only for actual admins, not for showStats
    const prefix = isAdmin && !showStats ? '<span class="font-weight-bold">Admin:</span> ' : '';
    avgText.innerHTML = `${prefix}Ø ${avgRating.toFixed(1)} ⭐`;
    avgText.style.fontWeight = '600';

    const countText = document.createElement('div');
    countText.textContent = `${totalRatings} ${t.ratingsCount}`;

    statsInfo.appendChild(avgText);
    statsInfo.appendChild(countText);
    statsSection.appendChild(statsInfo);
    container.appendChild(statsSection);
  }

  return container;
}

/**
 * Create SVG star element
 * @param {boolean} filled - Whether star should be filled
 * @returns {SVGElement} Star SVG element
 */
function createStarSVG(filled) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', filled ? '#facc15' : 'none');
  svg.setAttribute('stroke', filled ? '#000000' : 'currentColor');
  svg.setAttribute('stroke-width', filled ? '3' : '2');
  svg.style.width = '20px';
  svg.style.height = '20px';
  svg.style.transition = 'all 0.2s';
  svg.style.color = filled ? '#facc15' : '#d1d5db';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
  svg.appendChild(path);

  return svg;
}

