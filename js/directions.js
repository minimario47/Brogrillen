/**
 * Brogrillen Pizzeria - Directions Module
 * Handles get directions button with iOS/Android detection
 */

document.addEventListener('DOMContentLoaded', function () {
    const getDirectionsBtn = document.getElementById('getDirections');

    if (getDirectionsBtn) {
        getDirectionsBtn.addEventListener('click', function () {
            const address = 'Norra strandvägen 7, 473 34 Henån';
            const encodedAddress = encodeURIComponent(address);
            let mapsUrl;

            const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isAndroid = /Android/i.test(navigator.userAgent);

            if (isApple) {
                // Use Apple Maps for iOS devices
                mapsUrl = `maps://maps.apple.com/?daddr=${encodedAddress}`;
            } else if (isAndroid) {
                // Use Google Maps directions for Android
                mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
            } else {
                // Use Google Maps search for desktop
                mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            }

            window.open(mapsUrl, '_blank');
        });
    }
});
