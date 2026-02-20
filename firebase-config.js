/**
 * CONFIGURATION FIREBASE - STITCH 2026
 * 
 * Instructions pour le propriétaire :
 * 1. Allez sur https://console.firebase.google.com/
 * 2. Créez un projet nommé "Karaoke-2026"
 * 3. Ajoutez une application Web
 * 4. Activez "Realtime Database" dans le menu de gauche
 * 5. Dans les règles de la Realtime Database, mettez : 
 *    { "rules" : { ".read": true, ".write": true } }
 * 6. Copiez vos IDs ci-dessous :
 */

const firebaseConfig = {
    apiKey: "AIzaSyBVM3z6mRZXYp7LtEXy-maLVGhtLjuW4ts",
    authDomain: "quizzgame2026.firebaseapp.com",
    databaseURL: "https://quizzgame2026-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quizzgame2026",
    storageBucket: "quizzgame2026.firebasestorage.app",
    messagingSenderId: "747687791729",
    appId: "1:747687791729:web:0a829fdb6ffaeee7931fd0",
    measurementId: "G-WQ2XBQY49R"
};

// Initialisation globale si la config est remplie
if (firebaseConfig.apiKey !== "VOTRE_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Initialisé ! ✅");
} else {
    console.warn("Firebase non configuré. Le mode multi-joueurs ne fonctionnera pas localement.");
}
