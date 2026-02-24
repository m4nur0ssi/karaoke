/**
 * CONFIGURATION FIREBASE - STITCH 2026
 */

const firebaseConfig = {
    apiKey: "AIzaSyBVM3z6mRZXYp7LtEXy-maLVGhtLjuW4ts",
    authDomain: "quizzgame2026.firebaseapp.com",
    databaseURL: "https://quizzgame2026-default-rtdb.firebaseio.com",
    projectId: "quizzgame2026",
    storageBucket: "quizzgame2026.firebasestorage.app",
    messagingSenderId: "747687791729",
    appId: "1:747687791729:web:0a829fdb6ffaeee7931fd0",
    measurementId: "G-WQ2XBQY49R"
};

// Initialisation globale
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialisé ! ✅");
    }
} else {
    console.error("Firebase SDK non trouvé ! Le mode multi-joueurs ne fonctionnera pas.");
}
