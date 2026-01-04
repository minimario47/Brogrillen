/**
 * Brogrillen Pizzeria - Menu Search Module
 * Handles menu search functionality with debounced filtering
 */

document.addEventListener('DOMContentLoaded', function () {
    const menuSearch = document.getElementById('menuSearch');
    const searchButton = document.getElementById('searchButton');
    const currentCategoryInfo = document.getElementById('currentCategoryInfo');
    const categoryNameDisplay = document.getElementById('categoryNameDisplay');

    function performSearch() {
        if (!menuSearch) return;

        const searchTerm = menuSearch.value.toLowerCase().trim();
        const menuItems = document.querySelectorAll('.menu-item');
        const menuDisplayNames = window.menuDisplayNames || {};
        const currentCategory = window.currentCategory || 'mestomtyckt-menu';
        let resultsFound = false;

        // Update the category info display
        if (currentCategoryInfo) {
            if (searchTerm === '') {
                currentCategoryInfo.classList.add('d-none');
            } else {
                currentCategoryInfo.classList.remove('d-none');
                // Show current category name
                if (categoryNameDisplay) {
                    const categoryName = menuDisplayNames[currentCategory] ||
                        currentCategory.replace('-menu', '').replace(/^\w/, c => c.toUpperCase());
                    categoryNameDisplay.textContent = categoryName;
                }
            }
        }

        // Simple debounce for better performance
        setTimeout(() => {
            menuItems.forEach(item => {
                const h3Element = item.querySelector('h3');
                if (!h3Element) return; // Skip if menu item not properly loaded

                const title = h3Element.textContent.toLowerCase();
                const description = item.querySelector('p') ?
                    item.querySelector('p').textContent.toLowerCase() : '';
                const itemContainer = item.closest('.col-md-6');

                if (itemContainer) {
                    if (searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm)) {
                        itemContainer.style.display = 'block';
                        // Highlight matched text if searching
                        if (searchTerm !== '') {
                            resultsFound = true;
                        }
                    } else {
                        itemContainer.style.display = 'none';
                    }
                }
            });

            // Show/hide categories based on search results
            const menuButtons = document.querySelectorAll('.menu-selector button');
            if (searchTerm === '') {
                menuButtons.forEach(btn => {
                    btn.style.display = 'block';
                    btn.style.opacity = '1';
                });
            } else {
                // Fade out but don't hide completely for context
                menuButtons.forEach(btn => {
                    btn.style.display = 'block';
                    btn.style.opacity = '0.5';
                });
                // Highlight the active category
                const activeButton = document.querySelector('.menu-selector button.active');
                if (activeButton) {
                    activeButton.style.opacity = '1';
                }
            }
        }, 50); // Small delay for better UI experience
    }

    if (menuSearch) {
        // Initialize with empty search
        performSearch();

        // Add event listeners
        menuSearch.addEventListener('input', performSearch);
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }

        // Clear search on Escape key
        menuSearch.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                menuSearch.value = '';
                performSearch();
                menuSearch.blur(); // Remove focus
            } else if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Update category info when category changes
        document.querySelectorAll('.menu-selector button').forEach(btn => {
            btn.addEventListener('click', function () {
                if (menuSearch.value.trim() !== '') {
                    // Update category info if we're in a search
                    setTimeout(performSearch, 100);
                }
            });
        });
    }

    // Make performSearch globally available
    window.performSearch = performSearch;
});
