const menuData = {
    "mestomtyckt-menu": [
        { name: "Testarossa", price: "140.00 kr" },
        { name: "Amed", price: "145.00 kr" }
    ],
    "pizza-menu": [
    { name: "1. MARGARETA", description: "Ost", price: "115:-" },
    { name: "2. AL FUNGI", description: "Champinjoner", price: "125:-" },
    { name: "3. VESUVIO", description: "Skinka", price: "125:-" },
    { name: "4. CAPRICCIOSA", description: "Skinka, champinjoner", price: "125:-" },
    { name: "5. HAWAII", description: "Skinka, ananas", price: "125:-" },
    { name: "6. ALTONNO", description: "Tonfisk", price: "125:-" },
    { name: "7. SALAMI", description: "Salami, lök, paprika", price: "125:-" },
    { name: "8. MAMMA MIA", description: "Köttfärs", price: "125:-" },
    { name: "9. ROMANA", description: "Bacon, lök", price: "125:-" },
    { name: "10. MILANESE", description: "Köttfärs, lök, paprika", price: "125:-" },
    { name: "11. OPERA", description: "Skinka, tonfisk", price: "130:-" },
    { name: "12. BAHAMAS", description: "Skinka, ananas, banan, curry", price: "130:-" },
    { name: "13. MEXIKANSK PIZZA (Stark)", description: "Köttfärs, lök, paprika, jalapeño, vitlök", price: "135:-" },
    { name: "14. AZTEKA", description: "Skinka, jalapeño, tacokryddmix, kebabsås", price: "130:-" },
    { name: "15. PICANTE", description: "Köttfärs, lök, piri piri, vitlöksås", price: "130:-" },
    { name: "16. CANNIBALE", description: "Köttfärs, skinka", price: "130:-" },
    { name: "17. TOMMASO", description: "Skinka, räkor", price: "130:-" },
    { name: "18. MARINARA", description: "Räkor, musslor", price: "130:-" },
    { name: "19. VEGETARIANA", description: "Champinjoner, lök, paprika, oliver, ananas", price: "130:-" },
    { name: "20. QUATTRO STAGIONI", description: "Skinka, champinjoner, räkor, musslor, oliver", price: "135:-" },
    { name: "21. TROPICANA", description: "Räkor, ananas, banan, curry", price: "130:-" },
    { name: "22. PALERMO", description: "Skinka, champinjoner, räkor", price: "130:-" },
    { name: "23. ORIENTALE", description: "Köttfärs, skinka, lök, vitlök", price: "130:-" },
    { name: "24. NAPOLI", description: "Köttfärs, skinka, champinjoner", price: "130:-" },
    { name: "25. ROBOT SPECIAL", description: "Skinka, champinjoner, salami, paprika", price: "130:-" },
    { name: "26. VÄRMLAND", description: "Salami, bacon, lök, bearnaisesås", price: "130:-" },
    { name: "27. FREDEN", description: "Skinka, salami, bacon, ägg", price: "130:-" },
    { name: "28. MATADOR", description: "Skinka, gorgonzola, lök, färska tomater, piri piri, vitlöksås", price: "135:-" },
    { name: "29. GORGONZOLA", description: "Köttfärs, champinjoner, lök, paprika, gorgonzola", price: "135:-" },
    { name: "30. AFRIKANA", description: "Fläskfilé, ananas, banan, jordnötter, curry", price: "135:-" },
    { name: "31. PIZZA OSCAR", description: "Fläskfilé, räkor, bearnaisesås", price: "135:-" },
    { name: "32. ESPAÑA", description: "Fläskfilé, bacon, champinjoner, lök, bearnaisesås", price: "135:-" },
    { name: "33. FRUTTI DI MARE", description: "Räkor, kräftstjärtar, ananas, banan, curry, kebabsås", price: "135:-" },
    { name: "34. HENÅN SPECIAL", description: "Räkor, kräftstjärtar, sparris, piri piri, vitlöksås", price: "135:-" },
    { name: "35. TORINO", description: "Köttfärs, salami, bacon, champinjoner, lök, paprika, bearnaisesås", price: "140:-" },
    { name: "36. CALZONE", description: "Skinka", price: "125:-" },
    { name: "37. CALZONE SPECIAL", description: "Skinka, ananas", price: "130:-" },
    { name: "38. CIAO CIAO", description: "Oxfilé, champinjoner, lök, vitlök", price: "150:-" },
    { name: "39. VIKING BÅT (Halvinbakad)", description: "Oxfilé, champinjoner, lök, färska tomater, bearnaisesås", price: "145:-" },
    { name: "40. SAN REMO (Halvinbakad)", description: "Kebabkött, champinjoner, ananas, färska tomater, kebabsås", price: "140:-" },
    { name: "41. DISCO (Dubbel deg som tefat)", description: "Skinka", price: "135:-" },
    { name: "42. TAXI SPECIAL (Halvinbakad)", description: "Vit ost, isbergssallad, färska tomater, lök, oliver, kebabsås", price: "135:-" },
    { name: "43. ACAPULCO (Stark)", description: "Oxfilé, champinjoner, lök, vitlök, tacokryddmix, jalapeño", price: "150:-" },
    { name: "44. AMADEUS", description: "Oxfilé, champinjoner, lök, vitlöksås", price: "150:-" },
    { name: "45. VAGABOND", description: "Oxfilé, köttfärs, lök, vitlök, piri piri", price: "150:-" },
    { name: "46. REALE", description: "Oxfilé, skinka, lök, bearnaisesås", price: "150:-" },
    { name: "47. MILANO", description: "Oxfilé, champinjoner, gorgonzola, färska tomater", price: "150:-" },
    { name: "48. GOURMÉ", description: "Oxfilé, champinjoner, lök, paprika, färska tomater, bearnaisesås", price: "150:-" },
    { name: "49. KEBABPIZZA", description: "Kebabkött, pepperoni, kebabsås", price: "135:-" },
    { name: "50. FAVORITEN", description: "Kebabkött, bacon, bearnaisesås", price: "140:-" },
    { name: "51. PROVENCIALE", description: "Kebabkött, champinjoner, vitlöksås", price: "140:-" },
    { name: "52. PIZZA SPECIAL", description: "Kebabkött, champinjoner, färska tomater, lök, pepperoni, stark kebabsås", price: "140:-" },
    { name: "53. TESTAROSSA", description: "Kebabkött, isbergssallad, gurka, färska tomater, lök, pepperoni, kebabsås", price: "140:-" },
    { name: "54. AMED", description: "Kebabkött, pommes, kebabsås", price: "145:-" },
    { name: "55. ORUST SPECIAL", description: "Kebabkött, isbergssallad, gurka, färska tomater, lök, pepperoni, pommes, kebabsås", price: "150:-" },
    { name: "56. HUSETS SPECIAL", description: "Kebabkött, skinka, champinjoner, pommes, kebabsås", price: "150:-" },
    { name: "57. BOMBAY SPECIAL", description: "Kyckling, ananas, banan, curry", price: "135:-" },
    { name: "58. LA MAFFIA", description: "Kyckling, champinjoner, lök, kebabsås", price: "135:-" },
    { name: "59. POLLO", description: "Kyckling, bacon, curry, kebabsås", price: "140:-" },
    { name: "60. KYCKLING SPECIAL", description: "Kyckling, isbergssallad, gurka, tomat, pepperoni, kebabsås", price: "140:-" },
    { name: "61. FLYGANDE JAKOB", description: "Kyckling, ananas, banan, jordnötter, curry", price: "135:-" },
    { name: "62. PRIMAVERA", description: "Parmaskinka, köttfärs, kräftstjärtar, färska tomater, sparris, piri piri, vitlöksås", price: "145:-" },
    { name: "63. PASQUALA", description: "Parmaskinka, champinjoner, mozzarellaost, ruccolasallad", price: "145:-" },
    { name: "64. VENEDIG", description: "Parmaskinka, köttfärs, mozzarellaost, ruccolasallad", price: "145:-" },
    { name: "65. LA BELLA", description: "Kyckling, parmaskinka, mozzarellaost, ruccolasallad", price: "145:-" },
    { name: "66. PARMA", description: "Parmaskinka, champinjoner, färska tomater, mozzarellaost, vitlök, ruccolasallad", price: "145:-" },
    { name: "LIFFNER SPECIAL", description: "Oxfilé, championer, ananas, banan, tomat, bearnaisesås", price: "160:-" }
],
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
