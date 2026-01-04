/**
 * Brogrillen Pizzeria - Translations Module
 * Contains all Swedish/English translations and language switching logic
 */

// Translations object
const translations = {
    "nyhet_title": {
        "sv": "Nyhet!!",
        "en": "New!!"
    },
    "previous": {
        "sv": "Föregående",
        "en": "Previous"
    },
    "next": {
        "sv": "Nästa",
        "en": "Next"
    },
    "welcome_title": {
        "sv": "Brogrillen Pizzeria Henån",
        "en": "Brogrillen Pizzeria Henån"
    },
    "welcome_subtitle": {
        "sv": "Beställ din mat snabbt genom att trycka på 'Ring oss'. Vi är redo att hjälpa dig.",
        "en": "Order your food quickly by pressing 'Call Us'. We're ready to assist you."
    },
    "currently_open": {
        "sv": "Öppet nu",
        "en": "Open now"
    },
    "currently_closed": {
        "sv": "Stängt",
        "en": "Closed"
    },
    "opening_hours_label": {
        "sv": "Öppettider:",
        "en": "Opening hours:"
    },
    "opening_hours": {
        "sv": "Måndag - Söndag: 11:00 - 21:00",
        "en": "Monday - Sunday: 11:00 - 21:00"
    },
    "search_placeholder": {
        "sv": "Sök i menyn...",
        "en": "Search menu..."
    },
    "search_info": {
        "sv": "Du kan söka efter rätter eller ingredienser",
        "en": "You can search for dishes or ingredients"
    },
    "searching_in": {
        "sv": "Söker i:",
        "en": "Searching in:"
    },
    "see_menu": {
        "sv": "Se vår meny",
        "en": "View Our Menu"
    },
    "call_us": {
        "sv": "Ring oss",
        "en": "Call Us"
    },
    "menu_title": {
        "sv": "Vår Meny",
        "en": "Our Menu"
    },
    "menu_info": {
        "sv": "Tomatsås och ost ingår i alla pizzor",
        "en": "Tomato sauce and cheese are included in all pizzas"
    },
    "testimonials_title": {
        "sv": "Vad Våra Kunder Säger",
        "en": "What Our Customers Say"
    },
    "testimonial1": {
        "sv": "\"Fantastisk pizza! Den bästa jag har smakat i Henån. Personalen är också mycket vänlig.\"",
        "en": "\"Fantastic pizza! The best I've tasted in Henån. The staff is also very friendly.\""
    },
    "testimonial2": {
        "sv": "\"En riktig pärla i staden. Perfekt för familjemiddagar och stora sällskap.\"",
        "en": "\"A real gem in the city. Perfect for family dinners and large gatherings.\""
    },
    "testimonial3": {
        "sv": "\"Kebabpizzorna är oslagbara! Alltid färska ingredienser och god smak.\"",
        "en": "\"The kebab pizzas are unbeatable! Always fresh ingredients and great taste.\""
    },
    "gallery_title": {
        "sv": "Bildgalleri",
        "en": "Photo gallery"
    },
    "about_title": {
        "sv": "Om Brogrillen Pizzeria",
        "en": "About Brogrillen Pizzeria"
    },
    "about_paragraph1": {
        "sv": "Brogrillen Pizzeria drivs som ett familjeföretag där vi alla hjälps åt för att skapa en trivsam miljö och god mat. Tillsammans ser vi till att varje pizza görs med omsorg och kärlek.",
        "en": "Brogrillen Pizzeria is a family-run business where we all work together to create a welcoming environment and great food. Together, we make sure every pizza is made with care and love."
    },
    "about_paragraph2": {
        "sv": "Vi strävar efter att ge våra gäster en enkel och trevlig upplevelse varje gång de besöker oss.",
        "en": "We aim to provide our guests with a simple and enjoyable experience every time they visit."
    },
    "contact_title": {
        "sv": "Kontakta Oss",
        "en": "Contact Us"
    },
    "get_directions": {
        "sv": "Få vägbeskrivning",
        "en": "Get Directions"
    }
};

// Current language (will be set from localStorage or URL)
let currentLanguage = 'sv';

// Initialize language from URL or localStorage
function initLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && (urlLang === 'sv' || urlLang === 'en')) {
        currentLanguage = urlLang;
        localStorage.setItem('language', currentLanguage);
    } else {
        currentLanguage = localStorage.getItem('language') || 'sv';
    }

    return currentLanguage;
}

// Apply translations to all elements with data-translate attribute
function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][currentLanguage]) {
            element.textContent = translations[key][currentLanguage];
        }
    });

    const menuInfo = document.getElementById('menu-info');
    if (menuInfo && translations["menu_info"] && translations["menu_info"][currentLanguage]) {
        menuInfo.textContent = translations["menu_info"][currentLanguage];
    }

    // Set lightbox language
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'albumLabel': currentLanguage === 'sv' ? "Bild %1 av %2" : "Image %1 of %2"
        });
    }

    const currentLanguageSpan = document.getElementById('currentLanguage');
    if (currentLanguageSpan) {
        currentLanguageSpan.textContent = currentLanguage.toUpperCase();
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}

// Set current language
function setCurrentLanguage(lang) {
    if (lang === 'sv' || lang === 'en') {
        currentLanguage = lang;
        localStorage.setItem('language', currentLanguage);
        return true;
    }
    return false;
}

// Make functions globally available
window.translations = translations;
window.translatePage = translatePage;
window.getCurrentLanguage = getCurrentLanguage;
window.setCurrentLanguage = setCurrentLanguage;
window.initLanguage = initLanguage;
