/**
 * Brogrillen Pizzeria - News & Gallery Module
 * Handles loading news carousel and gallery with sequential loading
 */

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load news from backend
async function loadNews() {
    const currentLanguage = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'sv';

    try {
        if (typeof fetchNews !== 'function') {
            console.warn('fetchNews not available');
            document.dispatchEvent(new CustomEvent('newsLoaded', { detail: { success: false } }));
            return;
        }

        const data = await fetchNews();
        const newsArticles = data.newsArticles || [];
        const carousel = document.getElementById('nyhetCarousel');
        const carouselInner = carousel ? carousel.querySelector('.carousel-inner') : null;
        const carouselIndicators = carousel ? carousel.querySelector('.carousel-indicators') : null;

        // Remove loading skeleton
        const newsLoading = document.getElementById('news-loading');
        if (newsLoading) {
            newsLoading.remove();
        }

        if (carouselInner && newsArticles.length > 0) {
            carouselInner.innerHTML = '';

            // Update indicators
            if (carouselIndicators) {
                carouselIndicators.innerHTML = '';
                newsArticles.forEach((_, index) => {
                    const indicator = document.createElement('button');
                    indicator.type = 'button';
                    indicator.setAttribute('data-bs-target', '#nyhetCarousel');
                    indicator.setAttribute('data-bs-slide-to', index);
                    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                    if (index === 0) {
                        indicator.className = 'active';
                        indicator.setAttribute('aria-current', 'true');
                    }
                    carouselIndicators.appendChild(indicator);
                });
            }

            newsArticles.forEach((article, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');

                const title = currentLanguage === 'sv' ? article.titleSv : article.titleEn;
                const content = currentLanguage === 'sv' ? article.contentSv : article.contentEn;
                const imageUrl = article.imageUrl || '';

                carouselItem.innerHTML = `
                    <div class="row align-items-center">
                        <div class="col-md-6" data-aos="fade-right">
                            <div class="media-wrapper">
                                ${imageUrl ? `<img src="${imageUrl}" class="d-block w-100" alt="${escapeHtml(title)}" loading="lazy" width="600" height="400">` : ''}
                            </div>
                        </div>
                        <div class="col-md-6" data-aos="fade-left">
                            <h3>${escapeHtml(title)}</h3>
                            <p>${escapeHtml(content)}</p>
                        </div>
                    </div>
                `;

                carouselInner.appendChild(carouselItem);
            });

            // Reinitialize carousel if Bootstrap is available
            if (typeof bootstrap !== 'undefined' && bootstrap.Carousel && carousel) {
                // Dispose existing carousel if any
                const existingCarousel = bootstrap.Carousel.getInstance(carousel);
                if (existingCarousel) {
                    existingCarousel.dispose();
                }
                new bootstrap.Carousel(carousel, {
                    interval: 5000,
                    wrap: true
                });
            }
        } else if (carouselInner && newsArticles.length === 0) {
            carouselInner.innerHTML = '<div class="carousel-item active"><div class="text-center p-5"><p>Inga nyheter för tillfället</p></div></div>';
            if (carouselIndicators) {
                carouselIndicators.innerHTML = '<button type="button" data-bs-target="#nyhetCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';
            }
        }

        // Mark section as loaded
        const nyhetSection = document.getElementById('nyhet');
        if (nyhetSection) {
            nyhetSection.classList.add('loaded');
        }

        // Dispatch event for sequential loading
        document.dispatchEvent(new CustomEvent('newsLoaded', { detail: { success: true } }));
    } catch (error) {
        console.error('Failed to load news:', error);
        // Remove skeleton even on error
        const newsLoading = document.getElementById('news-loading');
        if (newsLoading) {
            newsLoading.remove();
        }
        // Still dispatch event so gallery can load
        document.dispatchEvent(new CustomEvent('newsLoaded', { detail: { success: false, error } }));
    }
}

// Load gallery from backend
async function loadGallery() {
    const currentLanguage = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'sv';

    try {
        if (typeof fetchGallery !== 'function') {
            console.warn('fetchGallery not available');
            document.dispatchEvent(new CustomEvent('galleryLoaded', { detail: { success: false } }));
            return;
        }

        const data = await fetchGallery();
        const galleryImages = data.galleryImages || [];
        const galleryContainer = document.getElementById('image-gallery');

        // Remove loading skeleton
        const galleryLoading = document.getElementById('gallery-loading');
        if (galleryLoading) {
            galleryLoading.remove();
        }

        if (galleryContainer && galleryImages.length > 0) {
            galleryContainer.innerHTML = '';

            galleryImages.forEach((image, index) => {
                const col = document.createElement('div');
                col.className = 'col-md-4 col-sm-6 gallery-item';
                col.setAttribute('data-aos', 'zoom-in');
                if (index % 3 === 1) col.setAttribute('data-aos-delay', '100');
                if (index % 3 === 2) col.setAttribute('data-aos-delay', '200');

                const link = document.createElement('a');
                link.href = image.url || image.thumbnailUrl || '';
                link.setAttribute('data-lightbox', 'gallery');
                link.setAttribute('data-title', escapeHtml(image.alt || 'Gallery Image'));

                const img = document.createElement('img');
                img.src = image.thumbnailUrl || image.url || '';
                img.alt = escapeHtml(image.alt || 'Gallery Image');
                img.className = 'img-fluid gallery-image';
                img.loading = 'lazy';
                img.width = 400;
                img.height = 300;

                link.appendChild(img);
                col.appendChild(link);
                galleryContainer.appendChild(col);
            });

            // Reinitialize lightbox if available
            if (typeof lightbox !== 'undefined') {
                lightbox.option({
                    'resizeDuration': 200,
                    'wrapAround': true,
                    'albumLabel': currentLanguage === 'sv' ? "Bild %1 av %2" : "Image %1 of %2"
                });
            }
        } else if (galleryContainer && galleryImages.length === 0) {
            galleryContainer.innerHTML = '<div class="col-12 text-center py-5"><p>Inga bilder i galleriet för tillfället</p></div>';
        }

        // Mark section as loaded
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            gallerySection.classList.add('loaded');
        }

        // Dispatch event for completion
        document.dispatchEvent(new CustomEvent('galleryLoaded', { detail: { success: true } }));
    } catch (error) {
        console.error('Failed to load gallery:', error);
        // Remove skeleton even on error
        const galleryLoading = document.getElementById('gallery-loading');
        if (galleryLoading) {
            galleryLoading.remove();
        }
        document.dispatchEvent(new CustomEvent('galleryLoaded', { detail: { success: false, error } }));
    }
}

// Sequential loading: Menu -> News -> Gallery
document.addEventListener('menuLoaded', () => {
    loadNews();
});

document.addEventListener('newsLoaded', () => {
    loadGallery();
});

// Make functions globally available
window.loadNews = loadNews;
window.loadGallery = loadGallery;
window.escapeHtml = escapeHtml;
