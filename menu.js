const menuData = {
    "mestomtyckt-menu": [
        { name: "Testarossa", price: "140.00 kr" },
        { name: "Amed", price: "145.00 kr" }
    ],
    "pizza-menu": [
        { name: "1. Margareta", description: "Tomatsås, mozzarella, basilika", price: "115.00 kr" },
        { name: "2. Al Fungi", description: "Tomatsås, mozzarella, svamp", price: "125.00 kr" },
        { name: "3. Vesuvio", description: "Tomatsås, mozzarella, skinka", price: "125.00 kr" },
        { name: "4. Capricciosa", description: "Tomatsås, mozzarella, skinka, svamp", price: "125.00 kr" },
        { name: "5. Hawaii", description: "Tomatsås, mozzarella, skinka, ananas", price: "125.00 kr" },
        { name: "6. Altonno", description: "Tomatsås, mozzarella, tonfisk", price: "125.00 kr" },
        { name: "7. Salami", description: "Tomatsås, mozzarella, salami", price: "125.00 kr" },
        { name: "8. Mamma Mia", description: "Tomatsås, mozzarella, skinka, svamp, paprika", price: "125.00 kr" },
        { name: "9. Romana", description: "Tomatsås, mozzarella, sardeller, kapris", price: "125.00 kr" },
        { name: "10. Milanese", description: "Tomatsås, mozzarella, bacon, lök", price: "125.00 kr" },
        { name: "11. Opera", description: "Tomatsås, mozzarella, skinka, salami, lök", price: "130.00 kr" },
        { name: "12. Bahamas", description: "Tomatsås, mozzarella, skinka, banan, curry", price: "130.00 kr" },
        { name: "13. Mexikansk Pizza (Stark)", description: "Tomatsås, mozzarella, stark sås, jalapeno", price: "135.00 kr" },
        { name: "14. Azteka", description: "Tomatsås, mozzarella, skinka, paprika, oliver", price: "130.00 kr" },
        { name: "15. Picante", description: "Tomatsås, mozzarella, salami, jalapeno", price: "130.00 kr" },
        { name: "16. Cannibale", description: "Tomatsås, mozzarella, köttfärs, lök", price: "130.00 kr" },
        { name: "17. Tommaso", description: "Tomatsås, mozzarella, skinka, räkor", price: "130.00 kr" },
        { name: "18. Marinara", description: "Tomatsås, mozzarella, skaldjur", price: "130.00 kr" },
        { name: "19. Vegetariana", description: "Tomatsås, mozzarella, grillad paprika, zucchini, aubergine", price: "130.00 kr" },
        { name: "20. Quattro Stagioni", description: "Tomatsås, mozzarella, skinka, svamp, oliver, kronärtskocka", price: "135.00 kr" },
        { name: "21. Tropicana", description: "Tomatsås, mozzarella, skinka, ananas, banan", price: "130.00 kr" },
        { name: "22. Palermo", description: "Tomatsås, mozzarella, skinka, svamp, räkor", price: "130.00 kr" },
        { name: "23. Orientale", description: "Tomatsås, mozzarella, lök, köttfärs", price: "130.00 kr" },
        { name: "24. Napoli", description: "Tomatsås, mozzarella, sardeller, oliver", price: "130.00 kr" },
        { name: "25. Robot Special", description: "Tomatsås, mozzarella, skinka, köttfärs, lök", price: "130.00 kr" },
        { name: "26. Värmland", description: "Tomatsås, mozzarella, skinka, räkor, ananas", price: "130.00 kr" },
        { name: "27. Freden", description: "Tomatsås, mozzarella, bacon, ägg", price: "130.00 kr" },
        { name: "28. Matador", description: "Tomatsås, mozzarella, salami, paprika, oliver", price: "135.00 kr" },
        { name: "29. Gorgonzola", description: "Tomatsås, mozzarella, gorgonzola, päron", price: "135.00 kr" },
        { name: "30. Afrikana", description: "Tomatsås, mozzarella, kyckling, curry", price: "135.00 kr" },
        { name: "31. Pizza Oscar", description: "Tomatsås, mozzarella, oxfilé, bearnaisesås", price: "135.00 kr" },
        { name: "32. España", price: "135.00 kr" },
        { name: "33. Frutti Di Mare", price: "135.00 kr" },
        { name: "34. Henån Special", price: "135.00 kr" },
        { name: "35. Torino", price: "140.00 kr" },
        { name: "36. Calzone", price: "125.00 kr" },
        { name: "37. Calzone Special", price: "130.00 kr" },
        { name: "38. Ciao Ciao", price: "150.00 kr" },
        { name: "39. Viking Båt (Halvinbakad)", price: "150.00 kr" },
        { name: "40. San Remo (Halvinbakad)", price: "145.00 kr" },
        { name: "41. Disco (Dubbel deg som tefat)", price: "140.00 kr" },
        { name: "42. Taxi Special (Halvinbakad)", price: "140.00 kr" },
        { name: "43. Acapulco (Stark)", price: "150.00 kr" },
        { name: "44. Amadeus", price: "150.00 kr" },
        { name: "45. Vagabond", price: "150.00 kr" },
        { name: "46. Reale", price: "150.00 kr" },
        { name: "47. Milano", price: "150.00 kr" },
        { name: "48. Gourmé", price: "150.00 kr" },
        { name: "Liffner Special", price: "160.00 kr" },
        { name: "49. Kebabpizza", price: "135.00 kr" },
        { name: "50. Favoriten", price: "140.00 kr" },
        { name: "51. Provenciale", price: "140.00 kr" },
        { name: "52. Pizza Special", price: "140.00 kr" },
        { name: "53. Testarossa", price: "140.00 kr" },
        { name: "54. Amed", price: "145.00 kr" },
        { name: "55. Orust Special", price: "150.00 kr" },
        { name: "56. Husets Special", price: "150.00 kr" },
        { name: "57. Bombay Special", price: "135.00 kr" },
        { name: "58. La Maffia", price: "135.00 kr" },
        { name: "59. Pollo", price: "140.00 kr" },
        { name: "60. Kyckling Special", price: "140.00 kr" },
        { name: "61. Flygande Jakob", price: "135.00 kr" },
        { name: "62. Primavera", price: "145.00 kr" },
        { name: "63. Pasquala", price: "145.00 kr" },
        { name: "64. Venedig", price: "145.00 kr" },
        { name: "65. La Bella", price: "145.00 kr" },
        { name: "66. Parma", price: "145.00 kr" }
    ],
    "kebab-menu": [
        { name: "Standard Pita", price: "125.00 kr" },
        { name: "Grekisk Pita", price: "130.00 kr" },
        { name: "Mexikansk Pita", price: "130.00 kr" },
        { name: "Kebabtallrik", price: "130.00 kr" },
        { name: "Kebabrulle", price: "125.00 kr" },
        { name: "Kebabrulle Mix", price: "130.00 kr" }
    ],
    "sallad-menu": [
        { name: "Amerikansk sallad", price: "130.00 kr" },
        { name: "Tonfisksallad", price: "130.00 kr" },
        { name: "Kycklingsallad", price: "130.00 kr" },
        { name: "Kebabsallad", price: "130.00 kr" },
        { name: "Grekisk Sallad", price: "130.00 kr" },
        { name: "Du Chef", price: "130.00 kr" },
        { name: "Skaldjurssallad", price: "135.00 kr" },
        { name: "Räksallad", price: "130.00 kr" },
        { name: "Kebabsallad Mix", price: "135.00 kr" }
    ],
    "alacarte-menu": [
        { name: "Köttbullar 8st", price: "125.00 kr" },
        { name: "Ägg & Bacon", price: "145.00 kr" },
        { name: "Fish´n Chips", price: "145.00 kr" },
        { name: "Pytt I Panna", price: "145.00 kr" },
        { name: "Schnitzel", price: "145.00 kr" },
        { name: "Lövbiff", price: "145.00 kr" }
    ],
    "pasta-menu": [
        { name: "Pasta Alfredo", price: "145.00 kr" },
        { name: "Kycklingpasta", price: "145.00 kr" },
        { name: "Pasta Riviera", price: "145.00 kr" },
        { name: "Pasta Gorgonzola", price: "145.00 kr" },
        { name: "Lasagne", price: "145.00 kr" },
        { name: "Pasta Indiana", price: "145.00 kr" }
    ],
    "gatukök-menu": [
        { name: "Smal Kokt/Grillad", description: "bröd / mos(+35kr)/ pommes(+40kr)", price: "45.00 kr" },
        { name: "Tjock Korv", description: "bröd / mos(+35kr)/ pommes(+40kr)", price: "55.00 kr" },
        { name: "Halv Special", description: "Halv / Halv Tjock", price: "80.00 kr / 90.00 kr" },
        { name: "Hel Special", description: "Hel / Hel Tjock", price: "90.00 kr / 110.00 kr" },
        { name: "Hamburgare", description: "90g/ 150g(+10kr)", price: "85.00 kr" },
        { name: "Ostburgare", description: "90g/ 150g(+10kr)", price: "90.00 kr" },
        { name: "Baconburgare", description: "90g/ 150g(+10kr)", price: "95.00 kr" },
        { name: "Hawaiiburgare", description: "90g/ 150g(+10kr)", price: "90.00 kr" },
        { name: "Västkustburgare", description: "90g/ 150g(+10kr)", price: "100.00 kr" },
        { name: "Dubbelburgare", description: "90g/ 150g(+10kr)", price: "115.00 kr" },
        { name: "Dubbelburgare Lyx (Västkustsallad)", description: "90g/ 150g(+10kr)", price: "130.00 kr" },
        { name: "Hamburgare Meny (dricka + strips)", description: "90g/ 150g(+10kr)", price: "125.00 kr" },
        { name: "Crispy Kyckling Burgare", description: "Med pommes och dricka", price: "140.00 kr" },
        { name: "Chicken Nuggets (6st)", description: "Med Pommes", price: "135.00 kr" },
        { name: "Chicken Fingers (5st)", description: "Med Pommes", price: "135.00 kr" },
        { name: "Falafel", description: "pitabröd / rulle / tallrik(+5kr)", price: "115.00 kr" }
    ],
    "tillbehör-menu": [
        { name: "Barnpizza", price: "-10.00 kr" },
        { name: "Köttvaror", price: "25.00 kr" },
        { name: "Ost", price: "20.00 kr" },
        { name: "Skaldjur", price: "25.00 kr" },
        { name: "Grönsaker", price: "20.00 kr" },
        { name: "Sås", price: "15.00 kr" },
        { name: "Mosbricka", price: "60.00 kr" }
    ]
};


const menuDisplayNames = {
    "mestomtyckt-menu": "Mest omtyckt",
    "pizza-menu": "Pizza",
    "kebab-menu": "Kebab",
    "sallad-menu": "Sallad",
    "alacarte-menu": "À la carte",
    "pasta-menu": "Pasta",
    "gatukök-menu": "Gatukök",
    "tillbehör-menu": "Tillbehör"
};

function createMenuButtons() {
    const menuSelector = document.querySelector('.menu-selector');
    Object.keys(menuData).forEach((category, index) => {
        const button = document.createElement('button');
        button.textContent = menuDisplayNames[category] || category.replace('-menu', '').replace(/^\w/, c => c.toUpperCase());
        button.dataset.menu = category;
        if (index === 0) button.classList.add('active');
        menuSelector.appendChild(button);
    });
}

function createMenuCategories() {
    const menuCategories = document.getElementById('menu-categories');
    Object.entries(menuData).forEach(([category, items], index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.id = category;
        categoryDiv.classList.add('menu-category');
        if (index === 0) categoryDiv.classList.add('active');

        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            menuItem.innerHTML = `
                <div>
                    <h3>${item.name}</h3>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                </div>
                <span class="price">${item.price}</span>
            `;
            categoryDiv.appendChild(menuItem);
        });

        menuCategories.appendChild(categoryDiv);
    });
}

function initializeMenu() {
    createMenuButtons();
    createMenuCategories();

    const menuButtons = document.querySelectorAll('.menu-selector button');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const menu = button.getAttribute('data-menu');
            menuCategories.forEach(category => {
                if (category.id === menu) {
                    category.classList.add('active');
                } else {
                    category.classList.remove('active');
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeMenu);
