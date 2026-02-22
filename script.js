const logDebug = (msg) => {
    console.log(msg);
    const logEl = document.getElementById('debug-log');
    if (logEl) {
        logEl.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}<br>` + logEl.innerHTML;
    }
};

const checkFirebase = () => {
    if (typeof firebase === 'undefined') return { ok: false, msg: 'Firebase Script non chargé' };
    if (!firebase.apps || firebase.apps.length === 0) return { ok: false, msg: 'Firebase non initialisé' };
    return { ok: true, msg: 'Firebase OK' };
};

logDebug('Script loaded v2026_v41.0');
logDebug('Diagnostic: ' + checkFirebase().msg);
logDebug('User Agent: ' + navigator.userAgent);

// Firebase Connection Monitor v33 (ROBUST)
if (typeof firebase !== 'undefined') {
    firebase.database().ref('.info/connected').on('value', (snap) => {
        const connected = snap.val();
        state.dbConnected = connected;
        const statusEl = document.getElementById('firebase-status');
        if (statusEl) {
            statusEl.innerText = connected ? "DB CONNECTÉE ✅" : "DB DÉCONNECTÉE ❌ (Auto-Secours...)";
            statusEl.style.color = connected ? "#00ff88" : "#ff3366";
            statusEl.style.cursor = "pointer";
            statusEl.title = "Cliquez pour tenter une reconnexion";
            statusEl.onclick = () => {
                logDebug("Tentative de reconnexion manuelle...");
                firebase.database().goOnline();
            };
        }
        logDebug("Firebase Status: " + (connected ? "Connected" : "Disconnected"));
    });
}

// Global Error Handler for remote debugging
window.onerror = function (msg, url, lineNo, columnNo, error) {
    logDebug(`ERROR: ${msg} line:${lineNo} col:${columnNo}`);
    return false;
};

logDebug('Script initialized (v2026_v41.0)');
const state = {
    screen: 'home',
    teams: [
        { name: 'Équipe 1', score: 0 },
        { name: 'Équipe 2', score: 0 },
        { name: 'Équipe 3', score: 0 },
        { name: 'Équipe 4', score: 0 }
    ],
    teamCount: 2,
    currentTheme: null,
    timer: 30,
    interval: null,
    isPlaying: false,
    currentSong: null,
    round: 0,
    maxRounds: 50,
    playedSongs: [],
    failedSongs: [], // Track broken links to avoid them
    streakTeam: null,
    streakCount: 0,
    currentModifier: null,
    mysteryRate: 1.0,
    speedBonusActive: false,
    winningTeam: null,
    jokers: [true, true, true, true],
    activeJoker: null,

    // Multiplayer State
    role: null, // 'host' or 'player'
    roomId: null,
    gameMode: 'oral', // 'oral' or 'buttons'
    myTeamIdx: null,
    roomRef: null,
    songsUntilWheel: 0, // Initialize to trigger first round wheel or soon

    songs: {

                '80s': [
          {
                    "artist": "Michael Jackson",
                    "title": "Billie Jean",
                    "hints": [
                              "Michael Jackson",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Michael Jackson",
                    "title": "Beat It",
                    "hints": [
                              "Michael Jackson",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Michael Jackson",
                    "title": "Thriller",
                    "hints": [
                              "Michael Jackson",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Madonna",
                    "title": "Like a Virgin",
                    "hints": [
                              "Madonna",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Madonna",
                    "title": "Into the Groove",
                    "hints": [
                              "Madonna",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Cyndi Lauper",
                    "title": "Girls Just Want to Have Fun",
                    "hints": [
                              "Cyndi Lauper",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Cyndi Lauper",
                    "title": "Time After Time",
                    "hints": [
                              "Cyndi Lauper",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "a-ha",
                    "title": "Take On Me",
                    "hints": [
                              "a-ha",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "a-ha",
                    "title": "The Sun Always Shines on T.V.",
                    "hints": [
                              "a-ha",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Eurythmics",
                    "title": "Sweet Dreams (Are Made of This)",
                    "hints": [
                              "Eurythmics",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Eurythmics",
                    "title": "Here Comes the Rain Again",
                    "hints": [
                              "Eurythmics",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "U2",
                    "title": "With or Without You",
                    "hints": [
                              "U2",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "U2",
                    "title": "Where the Streets Have No Name",
                    "hints": [
                              "U2",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "The Police",
                    "title": "Every Breath You Take",
                    "hints": [
                              "The Police",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "The Police",
                    "title": "Message in a Bottle",
                    "hints": [
                              "The Police",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Toto",
                    "title": "Africa",
                    "hints": [
                              "Toto",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Toto",
                    "title": "Rosanna",
                    "hints": [
                              "Toto",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Survivor",
                    "title": "Eye of the Tiger",
                    "hints": [
                              "Survivor",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "U2",
                    "title": "I Still Haven’t Found What I’m Looking For",
                    "hints": [
                              "U2",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Soft Cell",
                    "title": "Tainted Love",
                    "hints": [
                              "Soft Cell",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "The Human League",
                    "title": "Don’t You Want Me",
                    "hints": [
                              "The Human League",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Frankie Goes to Hollywood",
                    "title": "Relax",
                    "hints": [
                              "Frankie Goes to Hollywood",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "George Michael",
                    "title": "Careless Whisper",
                    "hints": [
                              "George Michael",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Wham!",
                    "title": "Wake Me Up Before You Go-Go",
                    "hints": [
                              "Wham!",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "George Michael",
                    "title": "Faith",
                    "hints": [
                              "George Michael",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Phil Collins",
                    "title": "In the Air Tonight",
                    "hints": [
                              "Phil Collins",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Phil Collins",
                    "title": "Against All Odds",
                    "hints": [
                              "Phil Collins",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Queen",
                    "title": "Another One Bites the Dust",
                    "hints": [
                              "Queen",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Queen",
                    "title": "Radio Ga Ga",
                    "hints": [
                              "Queen",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Queen & David Bowie",
                    "title": "Under Pressure",
                    "hints": [
                              "Queen & David Bowie",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "David Bowie",
                    "title": "Let’s Dance",
                    "hints": [
                              "David Bowie",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "David Bowie",
                    "title": "Modern Love",
                    "hints": [
                              "David Bowie",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Bryan Adams",
                    "title": "Summer of ’69",
                    "hints": [
                              "Bryan Adams",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Bryan Adams",
                    "title": "Heaven",
                    "hints": [
                              "Bryan Adams",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Bon Jovi",
                    "title": "Livin’ on a Prayer",
                    "hints": [
                              "Bon Jovi",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Bon Jovi",
                    "title": "You Give Love a Bad Name",
                    "hints": [
                              "Bon Jovi",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Bruce Springsteen",
                    "title": "Born in the U.S.A.",
                    "hints": [
                              "Bruce Springsteen",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Bruce Springsteen",
                    "title": "Dancing in the Dark",
                    "hints": [
                              "Bruce Springsteen",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "John Lennon",
                    "title": "(Just Like) Starting Over",
                    "hints": [
                              "John Lennon",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Prince",
                    "title": "Purple Rain",
                    "hints": [
                              "Prince",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Prince",
                    "title": "When Doves Cry",
                    "hints": [
                              "Prince",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Prince",
                    "title": "Kiss",
                    "hints": [
                              "Prince",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Prince",
                    "title": "1999",
                    "hints": [
                              "Prince",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Whitney Houston",
                    "title": "I Wanna Dance with Somebody",
                    "hints": [
                              "Whitney Houston",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Whitney Houston",
                    "title": "How Will I Know",
                    "hints": [
                              "Whitney Houston",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Whitney Houston",
                    "title": "Saving All My Love for You",
                    "hints": [
                              "Whitney Houston",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Irene Cara",
                    "title": "Flashdance… What a Feeling",
                    "hints": [
                              "Irene Cara",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Irene Cara",
                    "title": "Fame",
                    "hints": [
                              "Irene Cara",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Blondie",
                    "title": "Call Me",
                    "hints": [
                              "Blondie",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Blondie",
                    "title": "The Tide Is High",
                    "hints": [
                              "Blondie",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Duran Duran",
                    "title": "Girls on Film",
                    "hints": [
                              "Duran Duran",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Duran Duran",
                    "title": "Hungry Like the Wolf",
                    "hints": [
                              "Duran Duran",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Duran Duran",
                    "title": "The Reflex",
                    "hints": [
                              "Duran Duran",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Spandau Ballet",
                    "title": "True",
                    "hints": [
                              "Spandau Ballet",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Simple Minds",
                    "title": "Don’t You (Forget About Me)",
                    "hints": [
                              "Simple Minds",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Simple Minds",
                    "title": "Alive and Kicking",
                    "hints": [
                              "Simple Minds",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Tears for Fears",
                    "title": "Everybody Wants to Rule the World",
                    "hints": [
                              "Tears for Fears",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Tears for Fears",
                    "title": "Shout",
                    "hints": [
                              "Tears for Fears",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "The Cars",
                    "title": "Drive",
                    "hints": [
                              "The Cars",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Berlin",
                    "title": "Take My Breath Away",
                    "hints": [
                              "Berlin",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Rick Astley",
                    "title": "Never Gonna Give You Up",
                    "hints": [
                              "Rick Astley",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Rick Astley",
                    "title": "Together Forever",
                    "hints": [
                              "Rick Astley",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Berlin",
                    "title": "Take My Breath Away",
                    "hints": [
                              "Berlin",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Kenny Loggins",
                    "title": "Footloose",
                    "hints": [
                              "Kenny Loggins",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Kenny Loggins",
                    "title": "Danger Zone",
                    "hints": [
                              "Kenny Loggins",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Michael Sembello",
                    "title": "Maniac",
                    "hints": [
                              "Michael Sembello",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Starship",
                    "title": "Nothing’s Gonna Stop Us Now",
                    "hints": [
                              "Starship",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Starship",
                    "title": "We Built This City",
                    "hints": [
                              "Starship",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Guns N’ Roses",
                    "title": "Sweet Child O’ Mine",
                    "hints": [
                              "Guns N’ Roses",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Guns N’ Roses",
                    "title": "Paradise City",
                    "hints": [
                              "Guns N’ Roses",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Van Halen",
                    "title": "Jump",
                    "hints": [
                              "Van Halen",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "The Clash",
                    "title": "Should I Stay or Should I Go",
                    "hints": [
                              "The Clash",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "The Clash",
                    "title": "London Calling",
                    "hints": [
                              "The Clash",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Public Enemy",
                    "title": "Fight the Power",
                    "hints": [
                              "Public Enemy",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Run",
                    "title": "It’s Tricky",
                    "hints": [
                              "Run",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Run",
                    "title": "Walk This Way",
                    "hints": [
                              "Run",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Desireless",
                    "title": "Voyage, voyage",
                    "hints": [
                              "Desireless",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Images",
                    "title": "Les Démons de minuit",
                    "hints": [
                              "Images",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Début de Soirée",
                    "title": "Nuit de folie",
                    "hints": [
                              "Début de Soirée",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Gold",
                    "title": "Capitaine abandonné",
                    "hints": [
                              "Gold",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Gold",
                    "title": "Plus près des étoiles",
                    "hints": [
                              "Gold",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jeanne Mas",
                    "title": "En rouge et noir",
                    "hints": [
                              "Jeanne Mas",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jeanne Mas",
                    "title": "Toute première fois",
                    "hints": [
                              "Jeanne Mas",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "France Gall",
                    "title": "Ella, elle l’a",
                    "hints": [
                              "France Gall",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "France Gall",
                    "title": "Il jouait du piano debout",
                    "hints": [
                              "France Gall",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "France Gall",
                    "title": "Babacar",
                    "hints": [
                              "France Gall",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Vanessa Paradis",
                    "title": "Joe le taxi",
                    "hints": [
                              "Vanessa Paradis",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Vanessa Paradis",
                    "title": "Marilyn & John",
                    "hints": [
                              "Vanessa Paradis",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Caroline Loeb",
                    "title": "C’est la ouate",
                    "hints": [
                              "Caroline Loeb",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "À Cause des Garçons",
                    "title": "À cause des garçons",
                    "hints": [
                              "À Cause des Garçons",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Partenaire Particulier",
                    "title": "Partenaire particulier",
                    "hints": [
                              "Partenaire Particulier",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Stéphanie",
                    "title": "Ouragan",
                    "hints": [
                              "Stéphanie",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Indochine",
                    "title": "L’aventurier",
                    "hints": [
                              "Indochine",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Indochine",
                    "title": "Troisième sexe",
                    "hints": [
                              "Indochine",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Axel Bauer",
                    "title": "Cargo",
                    "hints": [
                              "Axel Bauer",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jean Schultheis",
                    "title": "Confidence pour confidence",
                    "hints": [
                              "Jean Schultheis",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jean-Jacques Goldman",
                    "title": "Quand la musique est bonne",
                    "hints": [
                              "Jean-Jacques Goldman",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jean-Jacques Goldman & Michael Jones",
                    "title": "Je te donne",
                    "hints": [
                              "Jean-Jacques Goldman & Michael Jones",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jean-Jacques Goldman",
                    "title": "Je marche seul",
                    "hints": [
                              "Jean-Jacques Goldman",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jean-Jacques Goldman",
                    "title": "Envole-moi",
                    "hints": [
                              "Jean-Jacques Goldman",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jean-Jacques Goldman",
                    "title": "Comme toi",
                    "hints": [
                              "Jean-Jacques Goldman",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Jean-Jacques Goldman",
                    "title": "Au bout de mes rêves",
                    "hints": [
                              "Jean-Jacques Goldman",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Daniel Balavoine",
                    "title": "Sauver l’amour",
                    "hints": [
                              "Daniel Balavoine",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Daniel Balavoine",
                    "title": "Mon fils ma bataille",
                    "hints": [
                              "Daniel Balavoine",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Daniel Balavoine",
                    "title": "L’Aziza",
                    "hints": [
                              "Daniel Balavoine",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Alain Bashung",
                    "title": "Vertige de l’amour",
                    "hints": [
                              "Alain Bashung",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Cookie Dingler",
                    "title": "Femme libérée",
                    "hints": [
                              "Cookie Dingler",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Gilbert Montagné",
                    "title": "On va s’aimer",
                    "hints": [
                              "Gilbert Montagné",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Rose Laurens",
                    "title": "Africa",
                    "hints": [
                              "Rose Laurens",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Philippe Lavil",
                    "title": "Il tape sur des bambous",
                    "hints": [
                              "Philippe Lavil",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Début de Soirée",
                    "title": "La vie la nuit",
                    "hints": [
                              "Début de Soirée",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Herbert Léonard",
                    "title": "Pour le plaisir",
                    "hints": [
                              "Herbert Léonard",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "François Feldman",
                    "title": "Les valses de Vienne",
                    "hints": [
                              "François Feldman",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "François Feldman & Joniece Jamison",
                    "title": "Joue pas",
                    "hints": [
                              "François Feldman & Joniece Jamison",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Roch Voisine",
                    "title": "Hélène",
                    "hints": [
                              "Roch Voisine",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Johnny Hallyday",
                    "title": "Je te promets",
                    "hints": [
                              "Johnny Hallyday",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Trust",
                    "title": "Antisocial",
                    "hints": [
                              "Trust",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Téléphone",
                    "title": "Ça c’est vraiment toi",
                    "hints": [
                              "Téléphone",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          },
          {
                    "artist": "Téléphone",
                    "title": "Argent trop cher",
                    "hints": [
                              "Téléphone",
                              "Années 80",
                              "Hit",
                              "Culte"
                    ]
          }
],
        'grungerock': [
            { artist: 'Nirvana', title: 'Smells Like Teen Spirit', hints: ['Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains'] },
            { artist: 'Red Hot Chili Peppers', title: 'Californication', hints: ['RHCP', 'Foo Fighters', 'Incubus', 'Audioslave'] },
            { artist: 'The Offspring', title: 'Self Esteem', hints: ['The Offspring', 'Green Day', 'Blink-182', 'Sum 41'] },
            { artist: 'The Smashing Pumpkins', title: 'Bullet with Butterfly Wings', hints: ['Smashing Pumpkins', 'Nirvana', 'Foo Fighters', 'Weezer'] },
            { artist: 'Muse', title: 'Uprising', hints: ['Muse', 'Radiohead', 'Placebo', 'Royal Blood'] },
            { artist: 'Queen', title: 'Bohemian Rhapsody', hints: ['Queen', 'The Rolling Stones', 'Led Zeppelin', 'Pink Floyd'] },
            { artist: 'No Doubt', title: 'Don\'t Speak', hints: ['No Doubt', 'Gwen Stefani', 'Garbage', 'The Cardigans'] },
            { artist: 'Foo Fighters', title: 'Everlong', hints: ['Foo Fighters', 'Nirvana', 'Pearl Jam', 'The Smashing Pumpkins'] },
            { artist: 'Pearl Jam', title: 'Alive', hints: ['Pearl Jam', 'Nirvana', 'Soundgarden', 'Alice in Chains'] },
            { artist: 'Alice in Chains', title: 'Man in the Box', hints: ['Alice in Chains', 'Soundgarden', 'Pearl Jam', 'Stone Temple Pilots'] },
            { artist: 'Soundgarden', title: 'Black Hole Sun', hints: ['Soundgarden', 'Audioslave', 'Pearl Jam', 'Alice in Chains'] },
            { artist: 'Stone Temple Pilots', title: 'Plush', hints: ['Stone Temple Pilots', 'Pearl Jam', 'Soundgarden', 'Alice in Chains'] },
            { artist: 'Green Day', title: 'Basket Case', hints: ['Green Day', 'The Offspring', 'Blink-182', 'Sum 41'] },
            { artist: 'Blink-182', title: 'All the Small Things', hints: ['Blink-182', 'Sum 41', 'Green Day', 'Good Charlotte'] },
            { artist: 'Radiohead', title: 'Creep', hints: ['Radiohead', 'Muse', 'Blur', 'Oasis'] },
            { artist: 'The Killers', title: 'Mr. Brightside', hints: ['The Killers', 'The Strokes', 'Franz Ferdinand', 'Interpol'] },
            { artist: 'Linkin Park', title: 'In the End', hints: ['Linkin Park', 'Evanescence', 'Papa Roach', 'Limp Bizkit'] },
            { artist: 'Evanescence', title: 'Bring Me to Life', hints: ['Evanescence', 'Within Temptation', 'Nightwish', 'Linkin Park'] },
            { artist: 'My Chemical Romance', title: 'Welcome to the Black Parade', hints: ['MCR', 'Fall Out Boy', 'Panic! At The Disco', 'Paramore'] },
            { artist: 'Paramore', title: 'Misery Business', hints: ['Paramore', 'Avril Lavigne', 'Fall Out Boy', 'Panic!'] },
            { artist: 'Fall Out Boy', title: 'Sugar, We\'re Goin Down', hints: ['Fall Out Boy', 'Panic! At The Disco', 'My Chemical Romance', 'Paramore'] },
            { artist: 'System of a Down', title: 'Chop Suey!', hints: ['System of a Down', 'Korn', 'Slipknot', 'Deftones'] },
            { artist: 'Korn', title: 'Freak on a Leash', hints: ['Korn', 'Limp Bizkit', 'Slipknot', 'System of a Down'] },
            { artist: 'Slipknot', title: 'Duality', hints: ['Slipknot', 'Korn', 'System of a Down', 'Stone Sour'] },
            { artist: 'Rammstein', title: 'Du Hast', hints: ['Rammstein', 'Slipknot', 'Korn', 'Nine Inch Nails'] },
            { artist: 'Audioslave', title: 'Like a Stone', hints: ['Audioslave', 'Soundgarden', 'Rage Against the Machine', 'Foo Fighters'] },
            { artist: 'Incubus', title: 'Drive', hints: ['Incubus', 'Red Hot Chili Peppers', 'Foo Fighters', 'Sublime'] },
            { artist: 'Thirty Seconds to Mars', title: 'The Kill', hints: ['30STM', 'Muse', 'Linkin Park', 'My Chemical Romance'] },
            { artist: 'Papa Roach', title: 'Last Resort', hints: ['Papa Roach', 'Linkin Park', 'Limp Bizkit', 'Korn'] },
            { artist: 'The White Stripes', title: 'Seven Nation Army', hints: ['The White Stripes', 'The Black Keys', 'The Strokes', 'Arctic Monkeys'] },
            { artist: 'Arctic Monkeys', title: 'Do I Wanna Know?', hints: ['Arctic Monkeys', 'The Strokes', 'The Black Keys', 'Franz Ferdinand'] },
            { artist: 'The Strokes', title: 'Last Nite', hints: ['The Strokes', 'Arctic Monkeys', 'The Killers', 'Interpol'] },
            { artist: 'The Black Keys', title: 'Lonely Boy', hints: ['The Black Keys', 'The White Stripes', 'Arctic Monkeys', 'Cage the Elephant'] },
            { artist: 'Gorillaz', title: 'Feel Good Inc.', hints: ['Gorillaz', 'Blur', 'Daft Punk', 'MGMT'] },
            { artist: 'Blur', title: 'Song 2', hints: ['Blur', 'Oasis', 'Gorillaz', 'Pulp'] },
            { artist: 'Oasis', title: 'Wonderwall', hints: ['Oasis', 'Blur', 'The Verve', 'Coldplay'] },
            { artist: 'Weezer', title: 'Buddy Holly', hints: ['Weezer', 'Jimmy Eat World', 'Green Day', 'Smashing Pumpkins'] },
            { artist: 'Kings of Leon', title: 'Use Somebody', hints: ['Kings of Leon', 'The Killers', 'Coldplay', 'Arctic Monkeys'] },
            { artist: 'Sum 41', title: 'Fat Lip', hints: ['Sum 41', 'Blink-182', 'Green Day', 'Good Charlotte'] },
            { artist: 'Good Charlotte', title: 'The Anthem', hints: ['Good Charlotte', 'Simple Plan', 'Sum 41', 'Blink-182'] },
            { artist: 'Simple Plan', title: 'Welcome to My Life', hints: ['Simple Plan', 'Good Charlotte', 'Avril Lavigne', 'Sum 41'] },
            { artist: 'Avril Lavigne', title: 'Sk8er Boi', hints: ['Avril Lavigne', 'Paramore', 'Simple Plan', 'Kelly Clarkson'] },
            { artist: 'Garbage', title: 'Stupid Girl', hints: ['Garbage', 'No Doubt', 'Hole', 'The Smashing Pumpkins'] },
            { artist: 'Hole', title: 'Celebrity Skin', hints: ['Hole', 'Nirvana', 'Garbage', 'No Doubt'] },
            { artist: 'The Cranberries', title: 'Zombie', hints: ['The Cranberries', 'U2', 'R.E.M.', 'Alanis Morissette'] },
            { artist: 'R.E.M.', title: 'Losing My Religion', hints: ['R.E.M.', 'U2', 'The Cure', 'Nirvana'] },
            { artist: 'AC/DC', title: 'Thunderstruck', hints: ['AC/DC', 'Guns N\' Roses', 'Aerosmith', 'Led Zeppelin'] },
            { artist: 'Guns N\' Roses', title: 'Sweet Child O\' Mine', hints: ['Guns N\' Roses', 'AC/DC', 'Aerosmith', 'Bon Jovi'] },
            { artist: 'Aerosmith', title: 'Dream On', hints: ['Aerosmith', 'Guns N\' Roses', 'Bon Jovi', 'Queen'] },
            { artist: 'Bon Jovi', title: 'Livin\' on a Prayer', hints: ['Bon Jovi', 'Aerosmith', 'Guns N\' Roses', 'Def Leppard'] }
        ],
        'disney': [
            { artist: 'Debbie Davis', title: 'L\'histoire de la vie', hints: ['Le Roi Lion', 'Aladdin', 'Tarzan', 'Mulan'] },
            { artist: 'Karine Costa', title: 'Ce rêve bleu', hints: ['Aladdin', 'Cendrillon', 'La Belle au bois dormant', 'Hercule'] },
            { artist: 'Henri Salvador', title: 'Sous l\'océan', hints: ['La Petite Sirène', 'Pinocchio', 'Peter Pan', 'Dumbo'] },
            { artist: 'Laura Mayne', title: 'L\'air du vent', hints: ['Pocahontas', 'Mulan', 'La Princesse et la Grenouille', 'Vaiana'] },
            { artist: 'Lucie Dolène', title: 'Histoire éternelle', hints: ['La Belle et la Bête', 'Blanche-Neige', 'Cendrillon', 'Bambi'] },
            { artist: 'Richard Darbois', title: 'Prince Ali', hints: ['Aladdin', 'Hercule', 'Le Génie', 'Mulan'] },
            { artist: 'Anthony Kavanagh', title: 'Je suis ton meilleur ami', hints: ['Aladdin', 'Toy Story', 'Hercule', 'Tarzan'] },
            { artist: 'Dimitri Rougeul', title: 'Je voudrais déjà être roi', hints: ['Le Roi Lion', 'Bambi', 'Pinocchio', 'Peter Pan'] },
            { artist: 'Phil Collins', title: 'Je m\'en vais', hints: ['Frère des Ours', 'Tarzan', 'Le Roi Lion', 'Atlantide'] },
            { artist: 'Anaïs Delva', title: 'Libérée, délivrée', hints: ['La Reine des Neiges', 'Raiponce', 'Vaiana', 'Rebelle'] },
            { artist: 'Maeva Méline', title: 'Où est la vraie vie ?', hints: ['Raiponce', 'La Reine des Neiges', 'Cendrillon', 'Mulan'] },
            { artist: 'Cerise Calixte', title: 'Le Bleu lumière', hints: ['Vaiana', 'Pocahontas', 'Mulan', 'Tarzan'] },
            { artist: 'Hercule Cast', title: 'De zéro en héros', hints: ['Hercule', 'Mulan', 'Tarzan', 'Aladdin'] },
            { artist: 'Jean-Philippe Puymartin', title: 'Je suis ton ami', hints: ['Toy Story', 'Monstres & Cie', 'Cars', 'Ratatouille'] },
            { artist: 'Lauri Mayne', title: 'Comme un homme', hints: ['Mulan', 'Pocahontas', 'Hercule', 'Tarzan'] },
            { artist: 'Emmanuel Dahl', title: 'Je n\'ai pas d\'amour', hints: ['Hercule', 'Aladdin', 'Le Roi Lion', 'La Belle et la Bête'] },
            { artist: 'Hakuna Matata', title: 'Hakuna Matata', hints: ['Le Roi Lion', 'Bambi', 'Peter Pan', 'Aladdin'] },
            { artist: 'Francis Lalanne', title: 'Rien qu\'un jour', hints: ['Le Bossu de Notre-Dame', 'Hercule', 'Tarzan', 'Mulan'] },
            { artist: 'Mimi Félixine', title: 'Jamais je n\'avouerai', hints: ['Hercule', 'Mulan', 'La Belle et la Bête', 'Aladdin'] },
            { artist: 'Jean Stout', title: 'Il en faut peu pour être heureux', hints: ['Le Livre de la Jungle', 'Le Roi Lion', 'Robin des Bois', 'Dumbo'] },
            { artist: 'Claude Bertrand', title: 'Petit-papa Noël', hints: ['Disney Noël', 'Mickey', 'Donald', 'Dingo'] },
            { artist: 'José Bartel', title: 'Tout le monde veut devenir un cat', hints: ['Les Aristochats', 'Le Livre de la Jungle', 'Les 101 Dalmatiens', 'Dumbo'] },
            { artist: 'Rachel Pignot', title: 'Un jour mon prince viendra', hints: ['Blanche-Neige', 'Cendrillon', 'La Belle au bois dormant', 'Bambi'] },
            { artist: 'Dominique Poulain', title: 'Au pays d\'Alice', hints: ['Alice au pays des merveilles', 'Cendrillon', 'Pinocchio', 'Bambi'] },
            { artist: 'Christiane Legrand', title: 'Quand on prie la bonne étoile', hints: ['Pinocchio', 'Peter Pan', 'Alice', 'Dumbo'] },
            { artist: 'Michel Roux', title: 'Supercalifragilistic', hints: ['Mary Poppins', 'Le Livre de la Jungle', 'Alice', 'Peter Pan'] },
            { artist: 'Roger Carel', title: 'Cruella d\'enfer', hints: ['Les 101 Dalmatiens', 'Les Aristochats', 'Robin des Bois', 'Bambi'] },
            { artist: 'Gérard Rinaldi', title: 'Des gammes et des arpèges', hints: ['Les Aristochats', 'La Belle au bois dormant', 'Cendrillon', 'Bambi'] },
            { artist: 'China Moses', title: 'Au bout du rêve', hints: ['La Princesse et la Grenouille', 'Vaiana', 'Mulan', 'Vaïana'] },
            { artist: 'Anthony Kavanagh', title: 'Bling-Bling', hints: ['Vaiana', 'Zootopie', 'Cars', 'Volt'] },
            { artist: 'Charlotte Hervieux', title: 'Dans un autre monde', hints: ['La Reine des Neiges 2', 'Vaiana', 'Rebelle', 'Coco'] },
            { artist: 'Dany Boon', title: 'En été', hints: ['La Reine des Neiges', 'Toy Story', 'Cars', 'Zootopie'] },
            { artist: 'Michel Prudhomme', title: 'L\'amour brille sous les étoiles', hints: ['Le Roi Lion', 'Bambi', 'La Belle au bois dormant', 'Cendrillon'] },
            { artist: 'Sébastien Cast', title: 'Embrasse-la', hints: ['La Petite Sirène', 'Aladdin', 'Hercule', 'Tarzan'] },
            { artist: 'Patrick Fiori', title: 'L\'air du vent (Duo)', hints: ['Pocahontas', 'Mulan', 'Vaiana', 'Kuzco'] },
            { artist: 'Hocine', title: 'Être un homme comme vous', hints: ['Le Livre de la Jungle 2', 'Le Roi Lion', 'Tarzan', 'Hercule'] },
            { artist: 'Prisca Demarez', title: 'Où t\'en vas-tu ?', hints: ['La Reine des Neiges 2', 'Vaiana', 'Mulan', 'Pocahontas'] },
            { artist: 'Camille Lou', title: 'L\'empire des ombres', hints: ['Raiponce la série', 'La Reine des Neiges', 'Mulan', 'Brave'] },
            { artist: 'Olaf Cast', title: 'Quand je serai plus grand', hints: ['La Reine des Neiges 2', 'Zootopie', 'Toy Story', 'Cars'] },
            { artist: 'Hercule Muse', title: 'Le monde qui est le mien', hints: ['Hercule', 'Mulan', 'Aladdin', 'Tarzan'] },
            { artist: 'Tarzan Cast', title: 'Entre deux mondes', hints: ['Tarzan', 'Le Roi Lion', 'Frère des ours', 'Dinausore'] },
            { artist: 'Phil Collins', title: 'Enfant de l\'homme', hints: ['Tarzan', 'Kuzco', 'Atlantide', 'Treasure Planet'] },
            { artist: 'Kuzco Cast', title: 'Un monde parfait', hints: ['Kuzco', 'Hercule', 'Aladdin', 'Mulan'] },
            { artist: 'Megara Cast', title: 'Jamais je n\'avouerai (Solo)', hints: ['Hercule', 'Aladdin', 'Mulan', 'Tarzan'] },
            { artist: 'Nala Cast', title: 'Soyez prêtes', hints: ['Le Roi Lion', 'Hercule', 'Aladdin', 'Pinocchio'] },
            { artist: 'Ursula Cast', title: 'Pauvres âmes en perdition', hints: ['La Petite Sirène', 'Blanche-Neige', 'Cendrillon', 'Bambi'] },
            { artist: 'Gaston Cast', title: 'Gaston', hints: ['La Belle et la Bête', 'Hercule', 'Tarzan', 'Aladdin'] },
            { artist: 'Vaiana Choers', title: 'Logo Te Pate', hints: ['Vaiana', 'Lilo & Stitch', 'Le Roi Lion', 'Tarzan'] },
            { artist: 'Maui Cast', title: 'Pour les hommes', hints: ['Vaiana', 'Hercule', 'Tarzan', 'Zootopie'] },
            { artist: 'Coco Cast', title: 'Un poco loco', hints: ['Coco', 'Encanto', 'Ratatouille', 'Luca'] }
        ],
        'rapfr': [
          {
                    "artist": "Suprême NTM",
                    "title": "La fièvre",
                    "hints": [
                              "Suprême NTM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Fonky Family",
                    "title": "Mystère et suspense",
                    "hints": [
                              "Fonky Family",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Assassin",
                    "title": "L'odyssée suit son cours",
                    "hints": [
                              "Assassin",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Oxmo Puccino ft. Dany Dan",
                    "title": "A ton enterrement",
                    "hints": [
                              "Oxmo Puccino ft. Dany Dan",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Fabe ft. Dany Dan",
                    "title": "Rien ne change à part les saisons",
                    "hints": [
                              "Fabe ft. Dany Dan",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Suprême NTM",
                    "title": "Seine Saint Denis Style",
                    "hints": [
                              "Suprême NTM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Assassin",
                    "title": "Shoota Babylone",
                    "hints": [
                              "Assassin",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Tandem",
                    "title": "Les maux",
                    "hints": [
                              "Tandem",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Daddy Lord C",
                    "title": "Freaky flow",
                    "hints": [
                              "Daddy Lord C",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Akhenaton",
                    "title": "Au fin fond d'une contrée",
                    "hints": [
                              "Akhenaton",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Kery James",
                    "title": "28 décembre 1977",
                    "hints": [
                              "Kery James",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Zoxea",
                    "title": "Rap musique que j'aime",
                    "hints": [
                              "Zoxea",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "La Brigade ft. Lunatic",
                    "title": "16 rimes",
                    "hints": [
                              "La Brigade ft. Lunatic",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Fabe",
                    "title": "Aujourd'hui",
                    "hints": [
                              "Fabe",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Akhenaton ft. Fonky Family",
                    "title": "Bad Boys de Marseille",
                    "hints": [
                              "Akhenaton ft. Fonky Family",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "La Rumeur",
                    "title": "La cuir usé d'une valise",
                    "hints": [
                              "La Rumeur",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Ideal J",
                    "title": "Le ghetto français",
                    "hints": [
                              "Ideal J",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Akhenaton",
                    "title": "Mon texte le savon",
                    "hints": [
                              "Akhenaton",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Lunatic ft. Jockey",
                    "title": "Le silence n'est pas un oubli",
                    "hints": [
                              "Lunatic ft. Jockey",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Doc Gynéco",
                    "title": "L'homme qui ne valait pas dix centimes",
                    "hints": [
                              "Doc Gynéco",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Shurik'N",
                    "title": "Lettre",
                    "hints": [
                              "Shurik'N",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Casey",
                    "title": "Chez moi",
                    "hints": [
                              "Casey",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Les Sages Poètes de la Rue",
                    "title": "Qu'est-ce qui fait marcher les sages",
                    "hints": [
                              "Les Sages Poètes de la Rue",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "La Rumeur",
                    "title": "L'ombre sur la mesure",
                    "hints": [
                              "La Rumeur",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Booba",
                    "title": "Le bitume avec une plume",
                    "hints": [
                              "Booba",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Fonky Family",
                    "title": "Sans rémission",
                    "hints": [
                              "Fonky Family",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Kery James",
                    "title": "2 issues",
                    "hints": [
                              "Kery James",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "La Cliqua",
                    "title": "Un dernier jour sur Terre",
                    "hints": [
                              "La Cliqua",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Fabe",
                    "title": "Des durs, des boss... des dombis !",
                    "hints": [
                              "Fabe",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Time Bomb",
                    "title": "Les bidons veulent le guidon",
                    "hints": [
                              "Time Bomb",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Suprême NTM",
                    "title": "Tout n'est pas si facile",
                    "hints": [
                              "Suprême NTM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Rocé",
                    "title": "On s'habitue",
                    "hints": [
                              "Rocé",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Doc Gynéco",
                    "title": "Nirvana",
                    "hints": [
                              "Doc Gynéco",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Rocca",
                    "title": "Les jeunes de l'univers",
                    "hints": [
                              "Rocca",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Shurik'N ft. Akhenaton",
                    "title": "Manifeste",
                    "hints": [
                              "Shurik'N ft. Akhenaton",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Ärsenik",
                    "title": "Boxe avec les mots",
                    "hints": [
                              "Ärsenik",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Shurik'N",
                    "title": "Samouraï",
                    "hints": [
                              "Shurik'N",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Chiens de Paille",
                    "title": "Comme un aimant",
                    "hints": [
                              "Chiens de Paille",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "IAM",
                    "title": "La fin de leur monde",
                    "hints": [
                              "IAM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Lunatic",
                    "title": "Civilisé",
                    "hints": [
                              "Lunatic",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "IAM",
                    "title": "Nés sous la même étoile",
                    "hints": [
                              "IAM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "X-Men",
                    "title": "Pendez-les, bandez-les, descendez-les",
                    "hints": [
                              "X-Men",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Suprême NTM",
                    "title": "Qu'est-ce qu'on attend ?",
                    "hints": [
                              "Suprême NTM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Fabe",
                    "title": "L'impertinent",
                    "hints": [
                              "Fabe",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Booba",
                    "title": "Ma définition",
                    "hints": [
                              "Booba",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Suprême NTM",
                    "title": "Laisse pas traîner ton fils",
                    "hints": [
                              "Suprême NTM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Booba",
                    "title": "Repose en paix",
                    "hints": [
                              "Booba",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Ékoué",
                    "title": "Blessé dans mon égo",
                    "hints": [
                              "Ékoué",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "Lunatic",
                    "title": "la lettre",
                    "hints": [
                              "Lunatic",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          },
          {
                    "artist": "IAM",
                    "title": "Petit frère",
                    "hints": [
                              "IAM",
                              "Rap FR",
                              "Classique",
                              "Années 90/00"
                    ]
          }
],
        'rapus': [
          {
                    "artist": "2Pac",
                    "title": "California Love",
                    "hints": [
                              "2Pac",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "The Notorious B.I.G.",
                    "title": "Hypnotize",
                    "hints": [
                              "The Notorious B.I.G.",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Dr. Dre",
                    "title": "Still D.R.E.",
                    "hints": [
                              "Dr. Dre",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Snoop Dogg",
                    "title": "Drop It Like It’s Hot",
                    "hints": [
                              "Snoop Dogg",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Jay-Z",
                    "title": "Empire State of Mind",
                    "hints": [
                              "Jay-Z",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Nas",
                    "title": "If I Ruled the World (Imagine That)",
                    "hints": [
                              "Nas",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Eminem",
                    "title": "Lose Yourself",
                    "hints": [
                              "Eminem",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "50 Cent",
                    "title": "In da Club",
                    "hints": [
                              "50 Cent",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Kanye West",
                    "title": "Gold Digger",
                    "hints": [
                              "Kanye West",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Nelly",
                    "title": "Hot in Herre",
                    "hints": [
                              "Nelly",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ludacris",
                    "title": "Stand Up",
                    "hints": [
                              "Ludacris",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "DMX",
                    "title": "Party Up (Up in Here)",
                    "hints": [
                              "DMX",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "OutKast",
                    "title": "Hey Ya!",
                    "hints": [
                              "OutKast",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Missy Elliott",
                    "title": "Work It",
                    "hints": [
                              "Missy Elliott",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Lauryn Hill",
                    "title": "Doo Wop (That Thing)",
                    "hints": [
                              "Lauryn Hill",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Warren G",
                    "title": "Regulate",
                    "hints": [
                              "Warren G",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Coolio",
                    "title": "Gangsta’s Paradise",
                    "hints": [
                              "Coolio",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Bone Thugs-N-Harmony",
                    "title": "Tha Crossroads",
                    "hints": [
                              "Bone Thugs-N-Harmony",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ice Cube",
                    "title": "It Was a Good Day",
                    "hints": [
                              "Ice Cube",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "LL Cool J",
                    "title": "Mama Said Knock You Out",
                    "hints": [
                              "LL Cool J",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Vanilla Ice",
                    "title": "Ice Ice Baby",
                    "hints": [
                              "Vanilla Ice",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "MC Hammer",
                    "title": "U Can’t Touch This",
                    "hints": [
                              "MC Hammer",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Bell Biv DeVoe",
                    "title": "Poison",
                    "hints": [
                              "Bell Biv DeVoe",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Salt-N-Pepa",
                    "title": "Shoop",
                    "hints": [
                              "Salt-N-Pepa",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "TLC",
                    "title": "No Scrubs",
                    "hints": [
                              "TLC",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Destiny’s Child",
                    "title": "Say My Name",
                    "hints": [
                              "Destiny’s Child",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Mary J. Blige",
                    "title": "Family Affair",
                    "hints": [
                              "Mary J. Blige",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Aaliyah",
                    "title": "Try Again",
                    "hints": [
                              "Aaliyah",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Usher",
                    "title": "Yeah!",
                    "hints": [
                              "Usher",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "R. Kelly",
                    "title": "Ignition (Remix)",
                    "hints": [
                              "R. Kelly",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Alicia Keys",
                    "title": "Fallin’",
                    "hints": [
                              "Alicia Keys",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Brandy & Monica",
                    "title": "The Boy Is Mine",
                    "hints": [
                              "Brandy & Monica",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ginuwine",
                    "title": "Pony",
                    "hints": [
                              "Ginuwine",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Jagged Edge",
                    "title": "Where the Party At",
                    "hints": [
                              "Jagged Edge",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ja Rule",
                    "title": "Always on Time",
                    "hints": [
                              "Ja Rule",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ashanti",
                    "title": "Foolish",
                    "hints": [
                              "Ashanti",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ciara",
                    "title": "Goodies",
                    "hints": [
                              "Ciara",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "OutKast",
                    "title": "Ms. Jackson",
                    "hints": [
                              "OutKast",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Fugees",
                    "title": "Killing Me Softly",
                    "hints": [
                              "Fugees",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Wyclef Jean",
                    "title": "Gone Till November",
                    "hints": [
                              "Wyclef Jean",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Busta Rhymes",
                    "title": "Touch It",
                    "hints": [
                              "Busta Rhymes",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ja Rule",
                    "title": "Livin’ It Up",
                    "hints": [
                              "Ja Rule",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "T.I.",
                    "title": "Whatever You Like",
                    "hints": [
                              "T.I.",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Lil Wayne",
                    "title": "Lollipop",
                    "hints": [
                              "Lil Wayne",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Rick Ross",
                    "title": "Hustlin’",
                    "hints": [
                              "Rick Ross",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "The Game",
                    "title": "How We Do",
                    "hints": [
                              "The Game",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Young Jeezy",
                    "title": "Soul Survivor",
                    "hints": [
                              "Young Jeezy",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Soulja Boy Tell’em",
                    "title": "Crank That (Soulja Boy)",
                    "hints": [
                              "Soulja Boy Tell’em",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Flo Rida",
                    "title": "Low",
                    "hints": [
                              "Flo Rida",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "T-Pain",
                    "title": "Buy U a Drank",
                    "hints": [
                              "T-Pain",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Akon",
                    "title": "Smack That",
                    "hints": [
                              "Akon",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ne-Yo",
                    "title": "So Sick",
                    "hints": [
                              "Ne-Yo",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Chris Brown",
                    "title": "Run It!",
                    "hints": [
                              "Chris Brown",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Rihanna",
                    "title": "Umbrella",
                    "hints": [
                              "Rihanna",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Beyoncé",
                    "title": "Crazy in Love",
                    "hints": [
                              "Beyoncé",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "The Weeknd",
                    "title": "Blinding Lights",
                    "hints": [
                              "The Weeknd",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Drake",
                    "title": "God’s Plan",
                    "hints": [
                              "Drake",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Kendrick Lamar",
                    "title": "HUMBLE.",
                    "hints": [
                              "Kendrick Lamar",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Travis Scott",
                    "title": "Sicko Mode",
                    "hints": [
                              "Travis Scott",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Post Malone",
                    "title": "Rockstar",
                    "hints": [
                              "Post Malone",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Future",
                    "title": "Mask Off",
                    "hints": [
                              "Future",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Migos",
                    "title": "Bad and Boujee",
                    "hints": [
                              "Migos",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Cardi B",
                    "title": "Bodak Yellow",
                    "hints": [
                              "Cardi B",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Lizzo",
                    "title": "Truth Hurts",
                    "hints": [
                              "Lizzo",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Doja Cat",
                    "title": "Say So",
                    "hints": [
                              "Doja Cat",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Tyler, The Creator",
                    "title": "Earfquake",
                    "hints": [
                              "Tyler, The Creator",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "J. Cole",
                    "title": "No Role Modelz",
                    "hints": [
                              "J. Cole",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Nicki Minaj",
                    "title": "Super Bass",
                    "hints": [
                              "Nicki Minaj",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Macklemore & Ryan Lewis",
                    "title": "Thrift Shop",
                    "hints": [
                              "Macklemore & Ryan Lewis",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Black Eyed Peas",
                    "title": "Boom Boom Pow",
                    "hints": [
                              "Black Eyed Peas",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "OutKast",
                    "title": "Roses",
                    "hints": [
                              "OutKast",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Pharrell Williams",
                    "title": "Frontin’",
                    "hints": [
                              "Pharrell Williams",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Jaheim",
                    "title": "Put That Woman First",
                    "hints": [
                              "Jaheim",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Miguel",
                    "title": "Adorn",
                    "hints": [
                              "Miguel",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Frank Ocean",
                    "title": "Thinkin Bout You",
                    "hints": [
                              "Frank Ocean",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "SZA",
                    "title": "The Weekend",
                    "hints": [
                              "SZA",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Bryson Tiller",
                    "title": "Don’t",
                    "hints": [
                              "Bryson Tiller",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Trey Songz",
                    "title": "Can’t Help But Wait",
                    "hints": [
                              "Trey Songz",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Timbaland",
                    "title": "The Way I Are",
                    "hints": [
                              "Timbaland",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Fabolous",
                    "title": "Into You",
                    "hints": [
                              "Fabolous",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Sean Paul",
                    "title": "Get Busy",
                    "hints": [
                              "Sean Paul",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Jason Derulo",
                    "title": "Whatcha Say",
                    "hints": [
                              "Jason Derulo",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Bruno Mars",
                    "title": "That’s What I Like",
                    "hints": [
                              "Bruno Mars",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Childish Gambino",
                    "title": "Redbone",
                    "hints": [
                              "Childish Gambino",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "Ty Dolla $ign",
                    "title": "Or Nah",
                    "hints": [
                              "Ty Dolla $ign",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          },
          {
                    "artist": "DJ Khaled",
                    "title": "I’m the One",
                    "hints": [
                              "DJ Khaled",
                              "Rap US / RNB",
                              "Hit",
                              "Classique"
                    ]
          }
],
        'cartoons': [
          {
                    "artist": "Générique",
                    "title": "Les Mystérieuses Cités d'Or",
                    "brand": "Les Mystérieuses Cités d'Or",
                    "hints": [
                              "Les Mystérieuses Cités d'Or",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Ulysse 31",
                    "brand": "Ulysse 31",
                    "hints": [
                              "Ulysse 31",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Cobra",
                    "brand": "Cobra",
                    "hints": [
                              "Cobra",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Jayce et les Conquérants de la Lumière",
                    "brand": "Jayce et les Conquérants de la Lumière",
                    "hints": [
                              "Jayce et les Conquérants de la Lumière",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Cat's Eye",
                    "brand": "Cat's Eye",
                    "hints": [
                              "Cat's Eye",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Tom Sawyer",
                    "brand": "Tom Sawyer",
                    "hints": [
                              "Tom Sawyer",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Inspecteur Gadget",
                    "brand": "Inspecteur Gadget",
                    "hints": [
                              "Inspecteur Gadget",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Chevaliers du Zodiaque",
                    "brand": "Les Chevaliers du Zodiaque",
                    "hints": [
                              "Les Chevaliers du Zodiaque",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Nicky Larson",
                    "brand": "Nicky Larson",
                    "hints": [
                              "Nicky Larson",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Dragon Ball",
                    "brand": "Dragon Ball",
                    "hints": [
                              "Dragon Ball",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Dragon Ball Z",
                    "brand": "Dragon Ball Z",
                    "hints": [
                              "Dragon Ball Z",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Lucille, Amour et Rock'n'roll",
                    "brand": "Lucille, Amour et Rock'n'roll",
                    "hints": [
                              "Lucille, Amour et Rock'n'roll",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Jeanne et Serge",
                    "brand": "Jeanne et Serge",
                    "hints": [
                              "Jeanne et Serge",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Olive et Tom",
                    "brand": "Olive et Tom",
                    "hints": [
                              "Olive et Tom",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Princesse Sarah",
                    "brand": "Princesse Sarah",
                    "hints": [
                              "Princesse Sarah",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Clémentine",
                    "brand": "Clémentine",
                    "hints": [
                              "Clémentine",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Cynthia ou le Rythme de la Vie",
                    "brand": "Cynthia ou le Rythme de la Vie",
                    "hints": [
                              "Cynthia ou le Rythme de la Vie",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Emi Magique",
                    "brand": "Emi Magique",
                    "hints": [
                              "Emi Magique",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Maîtres de l'Univers",
                    "brand": "Les Maîtres de l'Univers",
                    "hints": [
                              "Les Maîtres de l'Univers",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "She-Ra",
                    "brand": "She-Ra",
                    "hints": [
                              "She-Ra",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Cosmocats",
                    "brand": "Cosmocats",
                    "hints": [
                              "Cosmocats",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Ranma 1/2",
                    "brand": "Ranma 1/2",
                    "hints": [
                              "Ranma 1/2",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Mondes engloutis",
                    "brand": "Les Mondes engloutis",
                    "hints": [
                              "Les Mondes engloutis",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Ken le Survivant",
                    "brand": "Ken le Survivant",
                    "hints": [
                              "Ken le Survivant",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Le Collège fou fou fou",
                    "brand": "Le Collège fou fou fou",
                    "hints": [
                              "Le Collège fou fou fou",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Juliette je t'aime",
                    "brand": "Juliette je t'aime",
                    "hints": [
                              "Juliette je t'aime",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Lamu",
                    "brand": "Lamu",
                    "hints": [
                              "Lamu",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Denver, le dernier dinosaure",
                    "brand": "Denver, le dernier dinosaure",
                    "hints": [
                              "Denver, le dernier dinosaure",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "MASK",
                    "brand": "MASK",
                    "hints": [
                              "MASK",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Capitaine Flam",
                    "brand": "Capitaine Flam",
                    "hints": [
                              "Capitaine Flam",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Albator 78",
                    "brand": "Albator 78",
                    "hints": [
                              "Albator 78",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Albator 84",
                    "brand": "Albator 84",
                    "hints": [
                              "Albator 84",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Goldorak",
                    "brand": "Goldorak",
                    "hints": [
                              "Goldorak",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Minipouss",
                    "brand": "Les Minipouss",
                    "hints": [
                              "Les Minipouss",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Candy",
                    "brand": "Candy",
                    "hints": [
                              "Candy",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Bouba",
                    "brand": "Bouba",
                    "hints": [
                              "Bouba",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Snorky",
                    "brand": "Les Snorky",
                    "hints": [
                              "Les Snorky",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Gummi",
                    "brand": "Les Gummi",
                    "hints": [
                              "Les Gummi",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Tortues Ninja",
                    "brand": "Les Tortues Ninja",
                    "hints": [
                              "Les Tortues Ninja",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Lucky Luke",
                    "brand": "Lucky Luke",
                    "hints": [
                              "Lucky Luke",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Simpsons",
                    "brand": "Les Simpsons",
                    "hints": [
                              "Les Simpsons",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Pingu",
                    "brand": "Pingu",
                    "hints": [
                              "Pingu",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Le Merveilleux Voyage de Nils Holgersson",
                    "brand": "Le Merveilleux Voyage de Nils Holgersson",
                    "hints": [
                              "Le Merveilleux Voyage de Nils Holgersson",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Aventures de Galaxy Rangers",
                    "brand": "Les Aventures de Galaxy Rangers",
                    "hints": [
                              "Les Aventures de Galaxy Rangers",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "G.I. Joe : Héros sans frontières",
                    "brand": "G.I. Joe : Héros sans frontières",
                    "hints": [
                              "G.I. Joe : Héros sans frontières",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Yakari",
                    "brand": "Yakari",
                    "hints": [
                              "Yakari",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Diplodo",
                    "brand": "Diplodo",
                    "hints": [
                              "Diplodo",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Boumbo",
                    "brand": "Boumbo",
                    "hints": [
                              "Boumbo",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Quatre Filles du Docteur March",
                    "brand": "Les Quatre Filles du Docteur March",
                    "hints": [
                              "Les Quatre Filles du Docteur March",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Nils Holgersson",
                    "brand": "Nils Holgersson",
                    "hints": [
                              "Nils Holgersson",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Bouli",
                    "brand": "Bouli",
                    "hints": [
                              "Bouli",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Sailor Moon",
                    "brand": "Sailor Moon",
                    "hints": [
                              "Sailor Moon",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Mondes Engloutis",
                    "brand": "Les Mondes Engloutis",
                    "hints": [
                              "Les Mondes Engloutis",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Dare Dare Motus",
                    "brand": "Dare Dare Motus",
                    "hints": [
                              "Dare Dare Motus",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Moi Renart",
                    "brand": "Moi Renart",
                    "hints": [
                              "Moi Renart",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Super Durand",
                    "brand": "Super Durand",
                    "hints": [
                              "Super Durand",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "SOS Fantômes",
                    "brand": "SOS Fantômes",
                    "hints": [
                              "SOS Fantômes",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Cités d'Or (autre générique version Club Dorothée)",
                    "brand": "Les Cités d'Or (autre générique version Club Dorothée)",
                    "hints": [
                              "Les Cités d'Or (autre générique version Club Dorothée)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Minikeums (générique)",
                    "brand": "Les Minikeums (générique)",
                    "hints": [
                              "Les Minikeums (générique)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Club Dorothée (générique)",
                    "brand": "Club Dorothée (générique)",
                    "hints": [
                              "Club Dorothée (générique)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Récré A2 (générique)",
                    "brand": "Récré A2 (générique)",
                    "hints": [
                              "Récré A2 (générique)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Animaniacs",
                    "brand": "Les Animaniacs",
                    "hints": [
                              "Les Animaniacs",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Tiny Toons",
                    "brand": "Les Tiny Toons",
                    "hints": [
                              "Les Tiny Toons",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Batman la série animée",
                    "brand": "Batman la série animée",
                    "hints": [
                              "Batman la série animée",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "X-Men (série animée 90s)",
                    "brand": "X-Men (série animée 90s)",
                    "hints": [
                              "X-Men (série animée 90s)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Tortues Ninja (version 90s)",
                    "brand": "Les Tortues Ninja (version 90s)",
                    "hints": [
                              "Les Tortues Ninja (version 90s)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Razmoket",
                    "brand": "Les Razmoket",
                    "hints": [
                              "Les Razmoket",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Doug",
                    "brand": "Doug",
                    "hints": [
                              "Doug",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "La Bande à Picsou",
                    "brand": "La Bande à Picsou",
                    "hints": [
                              "La Bande à Picsou",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Mighty Max",
                    "brand": "Mighty Max",
                    "hints": [
                              "Mighty Max",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Gargoyles",
                    "brand": "Les Gargoyles",
                    "hints": [
                              "Les Gargoyles",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Schtroumpfs",
                    "brand": "Les Schtroumpfs",
                    "hints": [
                              "Les Schtroumpfs",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Bisounours",
                    "brand": "Les Bisounours",
                    "hints": [
                              "Les Bisounours",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Il était une fois... la Vie",
                    "brand": "Il était une fois... la Vie",
                    "hints": [
                              "Il était une fois... la Vie",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Il était une fois... l'Homme",
                    "brand": "Il était une fois... l'Homme",
                    "hints": [
                              "Il était une fois... l'Homme",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Il était une fois... l'Espace",
                    "brand": "Il était une fois... l'Espace",
                    "hints": [
                              "Il était une fois... l'Espace",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Il était une fois... les Découvreurs",
                    "brand": "Il était une fois... les Découvreurs",
                    "hints": [
                              "Il était une fois... les Découvreurs",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Il était une fois... les Explorateurs",
                    "brand": "Il était une fois... les Explorateurs",
                    "hints": [
                              "Il était une fois... les Explorateurs",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Le Bus Magique",
                    "brand": "Le Bus Magique",
                    "hints": [
                              "Le Bus Magique",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Zinzins de l'Espace",
                    "brand": "Les Zinzins de l'Espace",
                    "hints": [
                              "Les Zinzins de l'Espace",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Oggy et les Cafards",
                    "brand": "Oggy et les Cafards",
                    "hints": [
                              "Oggy et les Cafards",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Freaky Stories",
                    "brand": "Les Freaky Stories",
                    "hints": [
                              "Les Freaky Stories",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "La Famille Delajungle",
                    "brand": "La Famille Delajungle",
                    "hints": [
                              "La Famille Delajungle",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Hé Arnold !",
                    "brand": "Hé Arnold !",
                    "hints": [
                              "Hé Arnold !",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Rocket Power",
                    "brand": "Rocket Power",
                    "hints": [
                              "Rocket Power",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Titeuf",
                    "brand": "Titeuf",
                    "hints": [
                              "Titeuf",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Totally Spies",
                    "brand": "Totally Spies",
                    "hints": [
                              "Totally Spies",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Code Lyoko",
                    "brand": "Code Lyoko",
                    "hints": [
                              "Code Lyoko",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Foot 2 Rue",
                    "brand": "Foot 2 Rue",
                    "hints": [
                              "Foot 2 Rue",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Kim Possible",
                    "brand": "Kim Possible",
                    "hints": [
                              "Kim Possible",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Digimon",
                    "brand": "Digimon",
                    "hints": [
                              "Digimon",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Yu-Gi-Oh!",
                    "brand": "Yu-Gi-Oh!",
                    "hints": [
                              "Yu-Gi-Oh!",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Pokémon",
                    "brand": "Pokémon",
                    "hints": [
                              "Pokémon",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Card Captor Sakura",
                    "brand": "Card Captor Sakura",
                    "hints": [
                              "Card Captor Sakura",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Sakura, chasseuse de cartes (VF)",
                    "brand": "Sakura, chasseuse de cartes (VF)",
                    "hints": [
                              "Sakura, chasseuse de cartes (VF)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Malheurs de Sophie (dessin animé)",
                    "brand": "Les Malheurs de Sophie (dessin animé)",
                    "hints": [
                              "Les Malheurs de Sophie (dessin animé)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Heidi (version 80s)",
                    "brand": "Heidi (version 80s)",
                    "hints": [
                              "Heidi (version 80s)",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Belle et Sébastien",
                    "brand": "Belle et Sébastien",
                    "hints": [
                              "Belle et Sébastien",
                              "Cartoons",
                              "Années 80/90",
                              "Nostalgie"
                    ]
          }
],
        'movies': [
          {
                    "artist": "Soundtrack",
                    "title": "Goodfellas",
                    "brand": "Goodfellas",
                    "hints": [
                              "Goodfellas",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Les Affranchis",
                    "brand": "Les Affranchis",
                    "hints": [
                              "Les Affranchis",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Pulp Fiction",
                    "brand": "Pulp Fiction",
                    "hints": [
                              "Pulp Fiction",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Reservoir Dogs",
                    "brand": "Reservoir Dogs",
                    "hints": [
                              "Reservoir Dogs",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Fight Club",
                    "brand": "Fight Club",
                    "hints": [
                              "Fight Club",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Seven",
                    "brand": "Seven",
                    "hints": [
                              "Seven",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Usual Suspects",
                    "brand": "Usual Suspects",
                    "hints": [
                              "Usual Suspects",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Matrix",
                    "brand": "Matrix",
                    "hints": [
                              "Matrix",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Terminator 2: Le Jugement dernier",
                    "brand": "Terminator 2: Le Jugement dernier",
                    "hints": [
                              "Terminator 2: Le Jugement dernier",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Jurassic Park",
                    "brand": "Jurassic Park",
                    "hints": [
                              "Jurassic Park",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Titanic",
                    "brand": "Titanic",
                    "hints": [
                              "Titanic",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Forrest Gump",
                    "brand": "Forrest Gump",
                    "hints": [
                              "Forrest Gump",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Big Lebowski",
                    "brand": "The Big Lebowski",
                    "hints": [
                              "The Big Lebowski",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Silence des agneaux",
                    "brand": "Le Silence des agneaux",
                    "hints": [
                              "Le Silence des agneaux",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Heat",
                    "brand": "Heat",
                    "hints": [
                              "Heat",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "L.A. Confidential",
                    "brand": "L.A. Confidential",
                    "hints": [
                              "L.A. Confidential",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Braveheart",
                    "brand": "Braveheart",
                    "hints": [
                              "Braveheart",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Roi Lion",
                    "brand": "Le Roi Lion",
                    "hints": [
                              "Le Roi Lion",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Toy Story",
                    "brand": "Toy Story",
                    "hints": [
                              "Toy Story",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Toy Story 2",
                    "brand": "Toy Story 2",
                    "hints": [
                              "Toy Story 2",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Aladdin",
                    "brand": "Aladdin",
                    "hints": [
                              "Aladdin",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Monde de Nemo",
                    "brand": "Le Monde de Nemo",
                    "hints": [
                              "Le Monde de Nemo",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Monstres & Cie",
                    "brand": "Monstres & Cie",
                    "hints": [
                              "Monstres & Cie",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Shrek",
                    "brand": "Shrek",
                    "hints": [
                              "Shrek",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Shrek 2",
                    "brand": "Shrek 2",
                    "hints": [
                              "Shrek 2",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "La Cité de la peur",
                    "brand": "La Cité de la peur",
                    "hints": [
                              "La Cité de la peur",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Dîner de cons",
                    "brand": "Le Dîner de cons",
                    "hints": [
                              "Le Dîner de cons",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Les Visiteurs",
                    "brand": "Les Visiteurs",
                    "hints": [
                              "Les Visiteurs",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Les Trois Frères",
                    "brand": "Les Trois Frères",
                    "hints": [
                              "Les Trois Frères",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Astérix et Obélix : Mission Cléopâtre",
                    "brand": "Astérix et Obélix : Mission Cléopâtre",
                    "hints": [
                              "Astérix et Obélix : Mission Cléopâtre",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Fabuleux Destin d’Amélie Poulain",
                    "brand": "Le Fabuleux Destin d’Amélie Poulain",
                    "hints": [
                              "Le Fabuleux Destin d’Amélie Poulain",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "La Haine",
                    "brand": "La Haine",
                    "hints": [
                              "La Haine",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Leon",
                    "brand": "Leon",
                    "hints": [
                              "Leon",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Trainspotting",
                    "brand": "Trainspotting",
                    "hints": [
                              "Trainspotting",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "American Beauty",
                    "brand": "American Beauty",
                    "hints": [
                              "American Beauty",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Truman Show",
                    "brand": "The Truman Show",
                    "hints": [
                              "The Truman Show",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Groundhog Day (Un jour sans fin)",
                    "brand": "Groundhog Day (Un jour sans fin)",
                    "hints": [
                              "Groundhog Day (Un jour sans fin)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Edward aux mains d’argent",
                    "brand": "Edward aux mains d’argent",
                    "hints": [
                              "Edward aux mains d’argent",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Green Mile (La Ligne verte)",
                    "brand": "The Green Mile (La Ligne verte)",
                    "hints": [
                              "The Green Mile (La Ligne verte)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Shawshank Redemption (Les Évadés)",
                    "brand": "The Shawshank Redemption (Les Évadés)",
                    "hints": [
                              "The Shawshank Redemption (Les Évadés)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Gladiator",
                    "brand": "Gladiator",
                    "hints": [
                              "Gladiator",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Memento",
                    "brand": "Memento",
                    "hints": [
                              "Memento",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Requiem for a Dream",
                    "brand": "Requiem for a Dream",
                    "hints": [
                              "Requiem for a Dream",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Mulholland Drive",
                    "brand": "Mulholland Drive",
                    "hints": [
                              "Mulholland Drive",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Donnie Darko",
                    "brand": "Donnie Darko",
                    "hints": [
                              "Donnie Darko",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Oldboy",
                    "brand": "Oldboy",
                    "hints": [
                              "Oldboy",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Ring (Ringu)",
                    "brand": "Ring (Ringu)",
                    "hints": [
                              "Ring (Ringu)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Cercle (The Ring)",
                    "brand": "Le Cercle (The Ring)",
                    "hints": [
                              "Le Cercle (The Ring)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Projet Blair Witch",
                    "brand": "Le Projet Blair Witch",
                    "hints": [
                              "Le Projet Blair Witch",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Scream",
                    "brand": "Scream",
                    "hints": [
                              "Scream",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Alien 3",
                    "brand": "Alien 3",
                    "hints": [
                              "Alien 3",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Alien: Resurrection",
                    "brand": "Alien: Resurrection",
                    "hints": [
                              "Alien: Resurrection",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Mission: Impossible",
                    "brand": "Mission: Impossible",
                    "hints": [
                              "Mission: Impossible",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Die Hard 3",
                    "brand": "Die Hard 3",
                    "hints": [
                              "Die Hard 3",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Speed",
                    "brand": "Speed",
                    "hints": [
                              "Speed",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Point Break",
                    "brand": "Point Break",
                    "hints": [
                              "Point Break",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Heat",
                    "brand": "Heat",
                    "hints": [
                              "Heat",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Saving Private Ryan (Il faut sauver le soldat Ryan)",
                    "brand": "Saving Private Ryan (Il faut sauver le soldat Ryan)",
                    "hints": [
                              "Saving Private Ryan (Il faut sauver le soldat Ryan)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "La Ligne rouge",
                    "brand": "La Ligne rouge",
                    "hints": [
                              "La Ligne rouge",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Thin Red Line",
                    "brand": "The Thin Red Line",
                    "hints": [
                              "The Thin Red Line",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Full Metal Jacket",
                    "brand": "Full Metal Jacket",
                    "hints": [
                              "Full Metal Jacket",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Big Short",
                    "brand": "The Big Short",
                    "hints": [
                              "The Big Short",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Social Network",
                    "brand": "The Social Network",
                    "hints": [
                              "The Social Network",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "No Country for Old Men",
                    "brand": "No Country for Old Men",
                    "hints": [
                              "No Country for Old Men",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "There Will Be Blood",
                    "brand": "There Will Be Blood",
                    "hints": [
                              "There Will Be Blood",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Kill Bill: Volume 1",
                    "brand": "Kill Bill: Volume 1",
                    "hints": [
                              "Kill Bill: Volume 1",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Kill Bill: Volume 2",
                    "brand": "Kill Bill: Volume 2",
                    "hints": [
                              "Kill Bill: Volume 2",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Inglourious Basterds",
                    "brand": "Inglourious Basterds",
                    "hints": [
                              "Inglourious Basterds",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Jackie Brown",
                    "brand": "Jackie Brown",
                    "hints": [
                              "Jackie Brown",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Snatch",
                    "brand": "Snatch",
                    "hints": [
                              "Snatch",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Lock, Stock and Two Smoking Barrels",
                    "brand": "Lock, Stock and Two Smoking Barrels",
                    "hints": [
                              "Lock, Stock and Two Smoking Barrels",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Wolf of Wall Street",
                    "brand": "The Wolf of Wall Street",
                    "hints": [
                              "The Wolf of Wall Street",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Inception",
                    "brand": "Inception",
                    "hints": [
                              "Inception",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Interstellar",
                    "brand": "Interstellar",
                    "hints": [
                              "Interstellar",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Dark Knight",
                    "brand": "The Dark Knight",
                    "hints": [
                              "The Dark Knight",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Batman Begins",
                    "brand": "Batman Begins",
                    "hints": [
                              "Batman Begins",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Dark Knight Rises",
                    "brand": "The Dark Knight Rises",
                    "hints": [
                              "The Dark Knight Rises",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Spider-Man (Raimi)",
                    "brand": "Spider-Man (Raimi)",
                    "hints": [
                              "Spider-Man (Raimi)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Spider-Man 2",
                    "brand": "Spider-Man 2",
                    "hints": [
                              "Spider-Man 2",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Spider-Man: No Way Home",
                    "brand": "Spider-Man: No Way Home",
                    "hints": [
                              "Spider-Man: No Way Home",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Iron Man",
                    "brand": "Iron Man",
                    "hints": [
                              "Iron Man",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Avengers",
                    "brand": "Avengers",
                    "hints": [
                              "Avengers",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Avengers: Infinity War",
                    "brand": "Avengers: Infinity War",
                    "hints": [
                              "Avengers: Infinity War",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Avengers: Endgame",
                    "brand": "Avengers: Endgame",
                    "hints": [
                              "Avengers: Endgame",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Guardians of the Galaxy",
                    "brand": "Guardians of the Galaxy",
                    "hints": [
                              "Guardians of the Galaxy",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Black Panther",
                    "brand": "Black Panther",
                    "hints": [
                              "Black Panther",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Joker",
                    "brand": "Joker",
                    "hints": [
                              "Joker",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Mad Max: Fury Road",
                    "brand": "Mad Max: Fury Road",
                    "hints": [
                              "Mad Max: Fury Road",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "John Wick",
                    "brand": "John Wick",
                    "hints": [
                              "John Wick",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "John Wick 2",
                    "brand": "John Wick 2",
                    "hints": [
                              "John Wick 2",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Baby Driver",
                    "brand": "Baby Driver",
                    "hints": [
                              "Baby Driver",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Whiplash",
                    "brand": "Whiplash",
                    "hints": [
                              "Whiplash",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "La La Land",
                    "brand": "La La Land",
                    "hints": [
                              "La La Land",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Drive",
                    "brand": "Drive",
                    "hints": [
                              "Drive",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Her",
                    "brand": "Her",
                    "hints": [
                              "Her",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Lost in Translation",
                    "brand": "Lost in Translation",
                    "hints": [
                              "Lost in Translation",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Eternal Sunshine of the Spotless Mind",
                    "brand": "Eternal Sunshine of the Spotless Mind",
                    "hints": [
                              "Eternal Sunshine of the Spotless Mind",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Seigneur des anneaux : La Communauté de l’anneau",
                    "brand": "Le Seigneur des anneaux : La Communauté de l’anneau",
                    "hints": [
                              "Le Seigneur des anneaux : La Communauté de l’anneau",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Seigneur des anneaux : Les Deux Tours",
                    "brand": "Le Seigneur des anneaux : Les Deux Tours",
                    "hints": [
                              "Le Seigneur des anneaux : Les Deux Tours",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Le Seigneur des anneaux : Le Retour du roi",
                    "brand": "Le Seigneur des anneaux : Le Retour du roi",
                    "hints": [
                              "Le Seigneur des anneaux : Le Retour du roi",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Harry Potter à l’école des sorciers",
                    "brand": "Harry Potter à l’école des sorciers",
                    "hints": [
                              "Harry Potter à l’école des sorciers",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Harry Potter et la Chambre des secrets",
                    "brand": "Harry Potter et la Chambre des secrets",
                    "hints": [
                              "Harry Potter et la Chambre des secrets",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Harry Potter et le Prisonnier d’Azkaban",
                    "brand": "Harry Potter et le Prisonnier d’Azkaban",
                    "hints": [
                              "Harry Potter et le Prisonnier d’Azkaban",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Matrix Reloaded",
                    "brand": "Matrix Reloaded",
                    "hints": [
                              "Matrix Reloaded",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Matrix Revolutions",
                    "brand": "Matrix Revolutions",
                    "hints": [
                              "Matrix Revolutions",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Gravity",
                    "brand": "Gravity",
                    "hints": [
                              "Gravity",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Avatar",
                    "brand": "Avatar",
                    "hints": [
                              "Avatar",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Avatar: La Voie de l’eau",
                    "brand": "Avatar: La Voie de l’eau",
                    "hints": [
                              "Avatar: La Voie de l’eau",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Dune (2021)",
                    "brand": "Dune (2021)",
                    "hints": [
                              "Dune (2021)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Dune: Part Two",
                    "brand": "Dune: Part Two",
                    "hints": [
                              "Dune: Part Two",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Everything Everywhere All at Once",
                    "brand": "Everything Everywhere All at Once",
                    "hints": [
                              "Everything Everywhere All at Once",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Parasite",
                    "brand": "Parasite",
                    "hints": [
                              "Parasite",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Oldboy",
                    "brand": "Oldboy",
                    "hints": [
                              "Oldboy",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Memories of Murder",
                    "brand": "Memories of Murder",
                    "hints": [
                              "Memories of Murder",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Host",
                    "brand": "The Host",
                    "hints": [
                              "The Host",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Spirited Away (Le Voyage de Chihiro)",
                    "brand": "Spirited Away (Le Voyage de Chihiro)",
                    "hints": [
                              "Spirited Away (Le Voyage de Chihiro)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Princesse Mononoké",
                    "brand": "Princesse Mononoké",
                    "hints": [
                              "Princesse Mononoké",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Your Name",
                    "brand": "Your Name",
                    "hints": [
                              "Your Name",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Perfect Blue",
                    "brand": "Perfect Blue",
                    "hints": [
                              "Perfect Blue",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Ghost in the Shell",
                    "brand": "Ghost in the Shell",
                    "hints": [
                              "Ghost in the Shell",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "City of God (La Cité de Dieu)",
                    "brand": "City of God (La Cité de Dieu)",
                    "hints": [
                              "City of God (La Cité de Dieu)",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Slumdog Millionaire",
                    "brand": "Slumdog Millionaire",
                    "hints": [
                              "Slumdog Millionaire",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Million Dollar Baby",
                    "brand": "Million Dollar Baby",
                    "hints": [
                              "Million Dollar Baby",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Gran Torino",
                    "brand": "Gran Torino",
                    "hints": [
                              "Gran Torino",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Mystic River",
                    "brand": "Mystic River",
                    "hints": [
                              "Mystic River",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Revenant",
                    "brand": "The Revenant",
                    "hints": [
                              "The Revenant",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Birdman",
                    "brand": "Birdman",
                    "hints": [
                              "Birdman",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "12 Years a Slave",
                    "brand": "12 Years a Slave",
                    "hints": [
                              "12 Years a Slave",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Pianist",
                    "brand": "The Pianist",
                    "hints": [
                              "The Pianist",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Requiem for a Dream",
                    "brand": "Requiem for a Dream",
                    "hints": [
                              "Requiem for a Dream",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Black Swan",
                    "brand": "Black Swan",
                    "hints": [
                              "Black Swan",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Get Out",
                    "brand": "Get Out",
                    "hints": [
                              "Get Out",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Us",
                    "brand": "Us",
                    "hints": [
                              "Us",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Conjuring",
                    "brand": "The Conjuring",
                    "hints": [
                              "The Conjuring",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Insidious",
                    "brand": "Insidious",
                    "hints": [
                              "Insidious",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Saw",
                    "brand": "Saw",
                    "hints": [
                              "Saw",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Fast and Furious",
                    "brand": "Fast and Furious",
                    "hints": [
                              "Fast and Furious",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Fast Five",
                    "brand": "Fast Five",
                    "hints": [
                              "Fast Five",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Bourne Identity",
                    "brand": "The Bourne Identity",
                    "hints": [
                              "The Bourne Identity",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Bourne Supremacy",
                    "brand": "The Bourne Supremacy",
                    "hints": [
                              "The Bourne Supremacy",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "The Bourne Ultimatum",
                    "brand": "The Bourne Ultimatum",
                    "hints": [
                              "The Bourne Ultimatum",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Casino Royale",
                    "brand": "Casino Royale",
                    "hints": [
                              "Casino Royale",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Skyfall",
                    "brand": "Skyfall",
                    "hints": [
                              "Skyfall",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Mission: Impossible – Fallout",
                    "brand": "Mission: Impossible – Fallout",
                    "hints": [
                              "Mission: Impossible – Fallout",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Top Gun: Maverick",
                    "brand": "Top Gun: Maverick",
                    "hints": [
                              "Top Gun: Maverick",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Barbie",
                    "brand": "Barbie",
                    "hints": [
                              "Barbie",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          },
          {
                    "artist": "Soundtrack",
                    "title": "Oppenheimer",
                    "brand": "Oppenheimer",
                    "hints": [
                              "Oppenheimer",
                              "Film Culte",
                              "Cinéma",
                              "Bande Originale"
                    ]
          }
],
        'series': [
          {
                    "artist": "Générique",
                    "title": "Friends",
                    "brand": "Friends",
                    "hints": [
                              "Friends",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Urgences",
                    "brand": "Urgences",
                    "hints": [
                              "Urgences",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "X-Files",
                    "brand": "X-Files",
                    "hints": [
                              "X-Files",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Buffy contre les vampires",
                    "brand": "Buffy contre les vampires",
                    "hints": [
                              "Buffy contre les vampires",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Dawson",
                    "brand": "Dawson",
                    "hints": [
                              "Dawson",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Beverly Hills 90210",
                    "brand": "Beverly Hills 90210",
                    "hints": [
                              "Beverly Hills 90210",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Melrose Place",
                    "brand": "Melrose Place",
                    "hints": [
                              "Melrose Place",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Loïs et Clark",
                    "brand": "Loïs et Clark",
                    "hints": [
                              "Loïs et Clark",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Charmed",
                    "brand": "Charmed",
                    "hints": [
                              "Charmed",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Walker Texas Ranger",
                    "brand": "Walker Texas Ranger",
                    "hints": [
                              "Walker Texas Ranger",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Le Rebelle (Renegade)",
                    "brand": "Le Rebelle (Renegade)",
                    "hints": [
                              "Le Rebelle (Renegade)",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Sydney Fox, l’aventurière (Relic Hunter)",
                    "brand": "Sydney Fox, l’aventurière (Relic Hunter)",
                    "hints": [
                              "Sydney Fox, l’aventurière (Relic Hunter)",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Alerte Cobra",
                    "brand": "Alerte Cobra",
                    "hints": [
                              "Alerte Cobra",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Navarro",
                    "brand": "Navarro",
                    "hints": [
                              "Navarro",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Julie Lescaut",
                    "brand": "Julie Lescaut",
                    "hints": [
                              "Julie Lescaut",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Cordier, juge et flic",
                    "brand": "Les Cordier, juge et flic",
                    "hints": [
                              "Les Cordier, juge et flic",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Sous le soleil",
                    "brand": "Sous le soleil",
                    "hints": [
                              "Sous le soleil",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Stargate SG-1",
                    "brand": "Stargate SG-1",
                    "hints": [
                              "Stargate SG-1",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Hercule Poirot",
                    "brand": "Hercule Poirot",
                    "hints": [
                              "Hercule Poirot",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Une nounou d’enfer",
                    "brand": "Une nounou d’enfer",
                    "hints": [
                              "Une nounou d’enfer",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Docteur Quinn, femme médecin",
                    "brand": "Docteur Quinn, femme médecin",
                    "hints": [
                              "Docteur Quinn, femme médecin",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Star Trek: The Next Generation",
                    "brand": "Star Trek: The Next Generation",
                    "hints": [
                              "Star Trek: The Next Generation",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Star Trek: Deep Space Nine",
                    "brand": "Star Trek: Deep Space Nine",
                    "hints": [
                              "Star Trek: Deep Space Nine",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Star Trek: Voyager",
                    "brand": "Star Trek: Voyager",
                    "hints": [
                              "Star Trek: Voyager",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Babylon 5",
                    "brand": "Babylon 5",
                    "hints": [
                              "Babylon 5",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Sliders, les mondes parallèles",
                    "brand": "Sliders, les mondes parallèles",
                    "hints": [
                              "Sliders, les mondes parallèles",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "La Fête à la maison",
                    "brand": "La Fête à la maison",
                    "hints": [
                              "La Fête à la maison",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Le Prince de Bel-Air",
                    "brand": "Le Prince de Bel-Air",
                    "hints": [
                              "Le Prince de Bel-Air",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Seinfeld",
                    "brand": "Seinfeld",
                    "hints": [
                              "Seinfeld",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Frasier",
                    "brand": "Frasier",
                    "hints": [
                              "Frasier",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Ally McBeal",
                    "brand": "Ally McBeal",
                    "hints": [
                              "Ally McBeal",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Xena, la guerrière",
                    "brand": "Xena, la guerrière",
                    "hints": [
                              "Xena, la guerrière",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Hercule",
                    "brand": "Hercule",
                    "hints": [
                              "Hercule",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Highlander",
                    "brand": "Highlander",
                    "hints": [
                              "Highlander",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Code Quantum",
                    "brand": "Code Quantum",
                    "hints": [
                              "Code Quantum",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "MacGyver",
                    "brand": "MacGyver",
                    "hints": [
                              "MacGyver",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "L’Agence tous risques",
                    "brand": "L’Agence tous risques",
                    "hints": [
                              "L’Agence tous risques",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Alerte à Malibu",
                    "brand": "Alerte à Malibu",
                    "hints": [
                              "Alerte à Malibu",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Hélène et les Garçons",
                    "brand": "Hélène et les Garçons",
                    "hints": [
                              "Hélène et les Garçons",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Le Miel et les Abeilles",
                    "brand": "Le Miel et les Abeilles",
                    "hints": [
                              "Le Miel et les Abeilles",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Premiers Baisers",
                    "brand": "Premiers Baisers",
                    "hints": [
                              "Premiers Baisers",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Le Collège des Coeurs Brisés (Heartbreak High)",
                    "brand": "Le Collège des Coeurs Brisés (Heartbreak High)",
                    "hints": [
                              "Le Collège des Coeurs Brisés (Heartbreak High)",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Hartley, coeurs à vif",
                    "brand": "Hartley, coeurs à vif",
                    "hints": [
                              "Hartley, coeurs à vif",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "7 à la maison",
                    "brand": "7 à la maison",
                    "hints": [
                              "7 à la maison",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "7 jours pour agir",
                    "brand": "7 jours pour agir",
                    "hints": [
                              "7 jours pour agir",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Les Soprano",
                    "brand": "Les Soprano",
                    "hints": [
                              "Les Soprano",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Six Feet Under",
                    "brand": "Six Feet Under",
                    "hints": [
                              "Six Feet Under",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The West Wing (À la Maison Blanche)",
                    "brand": "The West Wing (À la Maison Blanche)",
                    "hints": [
                              "The West Wing (À la Maison Blanche)",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Alias",
                    "brand": "Alias",
                    "hints": [
                              "Alias",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "24 heures chrono",
                    "brand": "24 heures chrono",
                    "hints": [
                              "24 heures chrono",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Lost: Les Disparus",
                    "brand": "Lost: Les Disparus",
                    "hints": [
                              "Lost: Les Disparus",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Desperate Housewives",
                    "brand": "Desperate Housewives",
                    "hints": [
                              "Desperate Housewives",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Grey’s Anatomy",
                    "brand": "Grey’s Anatomy",
                    "hints": [
                              "Grey’s Anatomy",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Prison Break",
                    "brand": "Prison Break",
                    "hints": [
                              "Prison Break",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "How I Met Your Mother",
                    "brand": "How I Met Your Mother",
                    "hints": [
                              "How I Met Your Mother",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Big Bang Theory",
                    "brand": "The Big Bang Theory",
                    "hints": [
                              "The Big Bang Theory",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Dexter",
                    "brand": "Dexter",
                    "hints": [
                              "Dexter",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Breaking Bad",
                    "brand": "Breaking Bad",
                    "hints": [
                              "Breaking Bad",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Mad Men",
                    "brand": "Mad Men",
                    "hints": [
                              "Mad Men",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Game of Thrones",
                    "brand": "Game of Thrones",
                    "hints": [
                              "Game of Thrones",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "True Blood",
                    "brand": "True Blood",
                    "hints": [
                              "True Blood",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "True Detective",
                    "brand": "True Detective",
                    "hints": [
                              "True Detective",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "House of Cards",
                    "brand": "House of Cards",
                    "hints": [
                              "House of Cards",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Vikings",
                    "brand": "Vikings",
                    "hints": [
                              "Vikings",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Sherlock",
                    "brand": "Sherlock",
                    "hints": [
                              "Sherlock",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Doctor Who (nouvelle série 2005)",
                    "brand": "Doctor Who (nouvelle série 2005)",
                    "hints": [
                              "Doctor Who (nouvelle série 2005)",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Skins",
                    "brand": "Skins",
                    "hints": [
                              "Skins",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Misfits",
                    "brand": "Misfits",
                    "hints": [
                              "Misfits",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Glee",
                    "brand": "Glee",
                    "hints": [
                              "Glee",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Walking Dead",
                    "brand": "The Walking Dead",
                    "hints": [
                              "The Walking Dead",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Homeland",
                    "brand": "Homeland",
                    "hints": [
                              "Homeland",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Sons of Anarchy",
                    "brand": "Sons of Anarchy",
                    "hints": [
                              "Sons of Anarchy",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Hannibal",
                    "brand": "Hannibal",
                    "hints": [
                              "Hannibal",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Fargo",
                    "brand": "Fargo",
                    "hints": [
                              "Fargo",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Mindhunter",
                    "brand": "Mindhunter",
                    "hints": [
                              "Mindhunter",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Stranger Things",
                    "brand": "Stranger Things",
                    "hints": [
                              "Stranger Things",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Narcos",
                    "brand": "Narcos",
                    "hints": [
                              "Narcos",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Westworld",
                    "brand": "Westworld",
                    "hints": [
                              "Westworld",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Crown",
                    "brand": "The Crown",
                    "hints": [
                              "The Crown",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "La Casa de Papel",
                    "brand": "La Casa de Papel",
                    "hints": [
                              "La Casa de Papel",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Peaky Blinders",
                    "brand": "Peaky Blinders",
                    "hints": [
                              "Peaky Blinders",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Better Call Saul",
                    "brand": "Better Call Saul",
                    "hints": [
                              "Better Call Saul",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Mr. Robot",
                    "brand": "Mr. Robot",
                    "hints": [
                              "Mr. Robot",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Black Mirror",
                    "brand": "Black Mirror",
                    "hints": [
                              "Black Mirror",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Mandalorian",
                    "brand": "The Mandalorian",
                    "hints": [
                              "The Mandalorian",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Witcher",
                    "brand": "The Witcher",
                    "hints": [
                              "The Witcher",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Dark",
                    "brand": "Dark",
                    "hints": [
                              "Dark",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Umbrella Academy",
                    "brand": "Umbrella Academy",
                    "hints": [
                              "Umbrella Academy",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Lupin",
                    "brand": "Lupin",
                    "hints": [
                              "Lupin",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Emily in Paris",
                    "brand": "Emily in Paris",
                    "hints": [
                              "Emily in Paris",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Squid Game",
                    "brand": "Squid Game",
                    "hints": [
                              "Squid Game",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Last of Us",
                    "brand": "The Last of Us",
                    "hints": [
                              "The Last of Us",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Wednesday",
                    "brand": "Wednesday",
                    "hints": [
                              "Wednesday",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Boys",
                    "brand": "The Boys",
                    "hints": [
                              "The Boys",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Chernobyl",
                    "brand": "Chernobyl",
                    "hints": [
                              "Chernobyl",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Euphoria",
                    "brand": "Euphoria",
                    "hints": [
                              "Euphoria",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "The Handmaid’s Tale",
                    "brand": "The Handmaid’s Tale",
                    "hints": [
                              "The Handmaid’s Tale",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Succession",
                    "brand": "Succession",
                    "hints": [
                              "Succession",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Ted Lasso",
                    "brand": "Ted Lasso",
                    "hints": [
                              "Ted Lasso",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Only Murders in the Building",
                    "brand": "Only Murders in the Building",
                    "hints": [
                              "Only Murders in the Building",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          },
          {
                    "artist": "Générique",
                    "title": "Severance",
                    "brand": "Severance",
                    "hints": [
                              "Severance",
                              "Série TV",
                              "Générique Série",
                              "Culte"
                    ]
          }
]
    }
};

// UI Elements
const screens = {
    home: document.getElementById('screen-home'),
    themes: document.getElementById('screen-themes'),
    game: document.getElementById('screen-game'),
    results: document.getElementById('screen-results'),
    role: document.getElementById('screen-role'),
    player: document.getElementById('screen-player')
};

// Multiplayer Elements
const btnRoleHost = document.getElementById('btn-role-host');
const btnRolePlayer = document.getElementById('btn-role-player');
const btnJoinRoom = document.getElementById('btn-join-room');
const inputRoomCode = document.getElementById('input-room-code');
const selectTeamJoin = document.getElementById('select-team-join');
const roomCodeDisplay = document.getElementById('room-code-display');
const currentRoomIdSpan = document.getElementById('current-room-id');
const playerLobby = document.getElementById('player-lobby');
const playerGame = document.getElementById('player-game');
const waitingMsg = document.getElementById('waiting-msg');
const btnPlayerBuzz = document.getElementById('btn-player-buzz');
const btnPlayerJoker = document.getElementById('btn-player-joker');
const playerChoices = document.getElementById('player-choices');
const modeButtons = document.querySelectorAll('.mode-btn');


const navHome = document.getElementById('nav-home');
const btnCreateTeams = document.getElementById('btn-create-teams');
const modalTeams = document.getElementById('modal-teams');
const btnStartGame = document.getElementById('btn-start-game');
const themeCards = document.querySelectorAll('.theme-card');
const countdownEl = document.getElementById('countdown');
const hintsEl = document.getElementById('hints');
const revealCard = document.getElementById('reveal-card');
const revealArtist = document.getElementById('reveal-artist');
const revealTitle = document.getElementById('reveal-title');
const btnNext = document.getElementById('btn-next');
const teamButtons = document.querySelectorAll('.team-btn');
const btnCorrect = document.getElementById('btn-correct');
const btnWrong = document.getElementById('btn-wrong');
const validationControls = document.getElementById('validation-controls');
const bravoContainer = document.getElementById('bravo-container');
const modifierBadge = document.getElementById('modifier-badge');

let lastBuzzedTeam = null;





btnRoleHost.addEventListener('click', () => {
    state.role = 'host';
    // Generateur de code robuste (4 lettres sans O/0/I/1)
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    state.roomId = "";
    for (let i = 0; i < 4; i++) state.roomId += charset.charAt(Math.floor(Math.random() * charset.length));

    currentRoomIdSpan.innerText = state.roomId;
    roomCodeDisplay.classList.remove('hidden');

    if (window.firebase && firebase.apps.length) {
        state.roomRef = firebase.database().ref('rooms/' + state.roomId);
        logDebug("Creating Room: " + state.roomId);

        // v29 : On s'assure que le code est BIEN affiché partout
        document.getElementById('current-room-id').innerText = state.roomId;
        document.getElementById('room-code-display').classList.remove('hidden');

        // Initialisation ROBUSTE v38 (WebSocket + REST)
        const initData = {
            status: 'initiating',
            timestamp: Date.now(),
            hostActive: true,
            version: 'v38.0',
            teams: state.teams.slice(0, state.teamCount).map(t => t.name)
        };

        // 1. WebSocket
        state.roomRef.set(initData).catch(e => logDebug("WS Init failed"));

        // 2. REST Force (Si WS bloqué)
        const forceREST = (data = initData) => {
            const dbUrl = (typeof firebaseConfig !== 'undefined') ? firebaseConfig.databaseURL : "https://quizzgame2026-default-rtdb.firebaseio.com";
            const restUrl = `${dbUrl}/rooms/${state.roomId}.json`;
            fetch(restUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(() => {
                    const el = document.getElementById('rest-push-status');
                    if (el) { el.innerText = "REST PUSH: OK ✅"; el.style.color = "#00ff88"; }
                }).catch(err => {
                    logDebug("REST Push Error: " + err.message);
                });
        };

        forceREST(); // Envoi immédiat
        setTimeout(syncHostTeams, 500); // Forçage v39 : sync des noms par défaut après 0.5s

        // Heartbeat + REST Sync si déconnecté
        setInterval(() => {
            if (state.role === 'host' && state.roomId) {
                const heartbeatData = { hostHeartbeat: Date.now(), lastHeartbeat: new Date().toLocaleTimeString() };
                // Update WS si possible
                if (state.roomRef) state.roomRef.update(heartbeatData);
                // Force REST si DB DÉCONNECTÉE ou périodiquement (sans écraser le status !)
                if (!state.dbConnected || Math.random() < 0.1) {
                    forceREST(heartbeatData);
                    syncHostTeams(); // Force teams aussi
                }
            }
            if (state.role === 'player' && state.roomId && !state.dbConnected) {

                // Poller de secours pour le joueur si déconnecté
                const restUrl = `https://quizzgame2026-default-rtdb.firebaseio.com/rooms/${state.roomId}.json`;
                fetch(restUrl).then(r => r.json()).then(data => {
                    if (data) updatePlayerInterface(data);
                }).catch(e => { });
            }
        }, 3000);

        state.roomRef.child('buzz').on('value', (snapshot) => {
            const Val = snapshot.val();
            if (Val && state.isPlaying) handleRemoteBuzz(Val.teamIdx);
        });

        state.roomRef.child('answer').on('value', (snapshot) => {
            const Val = snapshot.val();
            if (Val) handleRemoteAnswer(Val);
        });

        state.roomRef.child('vocalAnswer').on('value', (snapshot) => {
            const Val = snapshot.val();
            if (Val) handleRemoteVocal(Val);
        });

        state.roomRef.child('activeJoker').on('value', (snapshot) => {
            state.activeJoker = snapshot.val();
        });
    }


    showScreen('home');
    roomCodeDisplay.classList.remove('hidden');
});

btnRoleHost.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnRoleHost.click();
}, { passive: false });

btnRolePlayer.addEventListener('click', () => {
    state.role = 'player';
    showScreen('player');
});

btnRolePlayer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnRolePlayer.click();
}, { passive: false });

// Helper Global pour remplir les équipes v35
window.populateTeams = (teams) => {
    if (!teams) return;
    const teamArray = Array.isArray(teams) ? teams : Object.values(teams);

    // Mémoriser le choix actuel de l'utilisateur pour éviter qu'il ne se réinitialise si on recharge les équipes
    const prevSelection = selectTeamJoin.value;

    selectTeamJoin.innerHTML = '';
    if (teamArray.length === 0) {
        selectTeamJoin.innerHTML = '<option value="">Salon vide (Ajustez hôte)</option>';
        return;
    }

    teamArray.forEach((name, idx) => {
        if (name) {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.innerText = name.toString().toUpperCase();
            selectTeamJoin.appendChild(opt);
        }
    });

    // v40 : Sélection automatique intelligente
    if (selectTeamJoin.options.length > 0) {
        if (prevSelection !== "" && Array.from(selectTeamJoin.options).some(o => o.value === prevSelection)) {
            // Remettre le choix précédent
            selectTeamJoin.value = prevSelection;
        } else {
            // Sinon forcer le premier par défaut
            selectTeamJoin.selectedIndex = 0;
        }
        logDebug(`Affichage de ${selectTeamJoin.options.length} équipes`);
    }

    btnJoinRoom.disabled = false;
    btnJoinRoom.classList.add('primary'); // On le fait briller

    const statusEl = document.getElementById('firebase-status');
    if (statusEl) {
        if (!state.dbConnected) {
            statusEl.innerText = "DB SECOURS (REST) 🔌";
            statusEl.style.color = "#ff9900";
        } else {
            statusEl.innerText = "DB CONNECTÉE ✅";
            statusEl.style.color = "#00ff88";
        }
    }
};

// Improved Team Fetching for Player
let lastFetchedCode = "";
function fetchTeams(code) {
    const rawCode = code || "";
    let cleaned = "";
    const allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < rawCode.length; i++) {
        const char = rawCode[i].toUpperCase();
        if (allowed.indexOf(char) !== -1) cleaned += char;
    }

    const finalCode = (cleaned.length > 4) ? cleaned.substring(0, 4) : cleaned;

    if (finalCode.length !== 4) {
        lastFetchedCode = "";
        const msg = finalCode.length === 0 ? "ENTREZ LE CODE..." : `[${finalCode}] (${finalCode.length}/4)...`;
        selectTeamJoin.innerHTML = `<option value="">${msg}</option>`;
        btnJoinRoom.disabled = true;
        return;
    }

    // Nouveauté v35 : On affiche IMMÉDIATEMENT qu'on cherche
    const searchMsg = `RECHERCHE DU SALON [${finalCode}]...`;
    if (finalCode !== lastFetchedCode) {
        selectTeamJoin.innerHTML = `<option value="">${searchMsg}</option>`;
        btnJoinRoom.disabled = true;
    }

    code = finalCode;
    if (code === lastFetchedCode) return;
    lastFetchedCode = code;

    logDebug("Recherche Salon: " + code);

    // REST Fallback v39 (Multi-Path)
    const dbUrl = (typeof firebaseConfig !== 'undefined') ? firebaseConfig.databaseURL : "https://quizzgame2026-default-rtdb.firebaseio.com";

    const tryREST = () => {
        if (lastFetchedCode !== code) return;
        logDebug("Mode SECOURS (v39)...");

        fetch(`${dbUrl}/rooms/${code}.json`)
            .then(r => {
                if (!r.ok) throw new Error(r.status === 404 ? "404" : "Erreur HTTP " + r.status);
                return r.json();
            })
            .then(data => {
                if (data && data.teams) {
                    logDebug("REST : Équipes OK");
                    window.populateTeams(data.teams);
                } else {
                    logDebug("REST : Salon vide, attente...");
                }
            })
            .catch(e => {
                if (e.message.includes('404')) logDebug("REST : DB Introuvable (404)");
                else logDebug("REST Error: " + e.message);
            });
    };

    // v37 : On tente REST après seulement 300ms
    setTimeout(tryREST, 300);

    if (window.teamListener) window.teamListener.off();
    window.teamListener = firebase.database().ref('rooms/' + code);
    window.teamListener.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.teams) {
            logDebug("WS : Équipes reçues !");
            window.populateTeams(data.teams);
        } else if (data) {
            if (selectTeamJoin.innerHTML.includes('RECHERCHE')) {
                selectTeamJoin.innerHTML = '<option value="">Attente configuration hôte...</option>';
            }
        }
    });
}

// Poller for iPad (force capture even if no events fire)
setInterval(() => {
    if (state.role === 'player' && inputRoomCode && inputRoomCode.value) {
        fetchTeams(inputRoomCode.value);
    }
}, 300);

// Listeners plus agressifs pour iPad
inputRoomCode.addEventListener('input', () => fetchTeams(inputRoomCode.value));
inputRoomCode.addEventListener('keydown', () => fetchTeams(inputRoomCode.value));
inputRoomCode.addEventListener('keyup', () => fetchTeams(inputRoomCode.value));
inputRoomCode.addEventListener('blur', () => fetchTeams(inputRoomCode.value));
inputRoomCode.addEventListener('compositionend', () => fetchTeams(inputRoomCode.value));


const handleJoinRoom = () => {
    const code = inputRoomCode.value.trim().toUpperCase();
    if (code.length !== 4) return alert("Code invalide");

    state.roomId = code;

    // v41: Initialisation critique de state.roomRef pour le joueur
    if (window.firebase && firebase.apps && firebase.apps.length) {
        state.roomRef = firebase.database().ref('rooms/' + state.roomId);
    }

    if (selectTeamJoin.value === "") return alert("Veuillez choisir une équipe");
    state.myTeamIdx = parseInt(selectTeamJoin.value);

    logDebug(`Tentative Connexion: ${code}`);

    const diag = checkFirebase();
    if (!diag.ok) return alert(diag.msg);

    btnJoinRoom.innerText = "CONNEXION EN COURS...";
    btnJoinRoom.disabled = true;

    // v41 : On n'attend plus WS si on est en mode Secours REST
    const proceedToLobby = () => {
        logDebug("Entrée Salon " + code);
        playerLobby.classList.add('hidden');
        playerGame.classList.remove('hidden');
        const badge = document.getElementById('player-room-badge');
        if (badge) badge.innerText = "ROOM: " + code;
        const myName = (state.teams[state.myTeamIdx] && state.teams[state.myTeamIdx].name) ? state.teams[state.myTeamIdx].name : `Équipe ${state.myTeamIdx + 1}`;
        waitingMsg.innerText = myName.toUpperCase() + " PRÊT !";

        // On branche quand même l'écouteur WS au cas où il se réveille plus tard
        if (state.roomRef) {
            state.roomRef.on('value', (snap) => {
                const data = snap.val();
                if (data) updatePlayerInterface(data);
            });
        }

        // Poller REST de secours pour les changements d'état du jeu (buzz, score)
        setInterval(() => {
            if (!state.dbConnected) {
                const dbUrl = (typeof firebaseConfig !== 'undefined') ? firebaseConfig.databaseURL : "https://quizzgame2026-default-rtdb.firebaseio.com";
                fetch(`${dbUrl}/rooms/${code}.json`).then(r => r.json()).then(d => {
                    if (d) updatePlayerInterface(d);
                });
            }
        }, 1200);

        playTone(880, 'sine', 0.2);
    };

    // Si on est déjà en mode secours, on y va !
    if (!state.dbConnected || checkFirebase().ok === false) {
        logDebug("FORCE JOIN (Mode Secours)");
        proceedToLobby();
        return;
    }

    if (state.roomRef) {
        state.roomRef.once('value').then(snapshot => {
            if (!snapshot.val()) {
                logDebug("Salon introuvable via WS");
                alert("Erreur: Le salon n'est pas encore prêt.");
                btnJoinRoom.innerText = "REJOINDRE LE JEU";
                btnJoinRoom.disabled = false;
                return;
            }
            proceedToLobby();
        }).catch(err => {
            logDebug("WS Timeout: Force Secours");
            proceedToLobby();
        });
    } else {
        proceedToLobby();
    }
};

btnJoinRoom.addEventListener('click', handleJoinRoom);
btnJoinRoom.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleJoinRoom();
}, { passive: false });

function updatePlayerInterface(roomData) {
    if (!roomData) return;

    // v43: Sécurisation maximale : si le chrono vocal est là, on ne TOUCHE à RIEN
    // cela évite que Firebase ne réinitialise les 5s du joueur
    if (document.getElementById('voice-countdown-timer')) return;

    // Sync state for players
    if (roomData.activeJoker !== undefined) state.activeJoker = roomData.activeJoker;
    if (roomData.jokers) state.jokers = roomData.jokers;

    // Manage Player Joker Button
    if (btnPlayerJoker && state.myTeamIdx !== null) {
        const isMyJokerUsed = !state.jokers[state.myTeamIdx];
        const isJokerActive = (state.activeJoker === state.myTeamIdx);

        if (isMyJokerUsed) {
            btnPlayerJoker.classList.add('used');
            btnPlayerJoker.classList.remove('active', 'hidden');
            btnPlayerJoker.disabled = true;
            btnPlayerJoker.innerText = "JOKER UTILISÉ 🃏";
        } else {
            btnPlayerJoker.classList.remove('used');
            btnPlayerJoker.disabled = false;
            btnPlayerJoker.innerText = isJokerActive ? "JOKER ACTIVÉ ! 🔥" : "QUITTE OU DOUBLE 🃏";
            if (isJokerActive) btnPlayerJoker.classList.add('active');
            else btnPlayerJoker.classList.remove('active');
        }

        // Show ONLY when buzzed and it's our team
        if (roomData.status === 'buzzed' && roomData.buzzerTeam === state.myTeamIdx) {
            btnPlayerJoker.classList.remove('hidden');
        } else {
            btnPlayerJoker.classList.add('hidden');
        }
    }

    // Reset base styles without wiping everything
    waitingMsg.className = 'waiting-msg player-status-indicator';

    // Refresh names from Firebase snapshot
    if (roomData.teams && Array.isArray(roomData.teams)) {
        roomData.teams.forEach((name, idx) => {
            if (state.teams[idx]) state.teams[idx].name = name;
        });
    }

    const myName = (state.teams[state.myTeamIdx] && state.teams[state.myTeamIdx].name)
        ? state.teams[state.myTeamIdx].name
        : `Équipe ${state.myTeamIdx + 1}`;

    if (roomData.status === 'initiating') {
        waitingMsg.innerText = "ATTENTE CONFIGURATION...";
        waitingMsg.classList.add('status-waiting');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    } else if (roomData.status === 'lobby') {
        waitingMsg.innerText = myName.toUpperCase() + " PRÊT !";
        waitingMsg.classList.add('status-active');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    } else if (roomData.status === 'playing') {
        if (!document.getElementById('voice-countdown-timer')) {
            const timeText = (roomData.timer !== undefined && roomData.timer !== null) ? `⏱️ ${roomData.timer}s` : "À L'ÉCOUTE...";
            waitingMsg.innerText = timeText;
            waitingMsg.classList.add('status-active');
            btnPlayerBuzz.classList.remove('hidden');
            btnPlayerBuzz.disabled = false;

            // v45: Mode direct 4 boutons : On peut cliquer directement
            if (roomData.mode === 'buttons' && roomData.choices) {
                showPlayerChoices(roomData.choices, true); // Direct interaction
                btnPlayerBuzz.classList.add('hidden'); // On cache le buzz traditionnel
            } else if (roomData.mode === 'oral' && roomData.showHintsToPlayer && roomData.choices) {
                // v48: En mode voix haute, on affiche les 4 boutons sur le mobile après 15s
                showPlayerChoices(roomData.choices, true);
                btnPlayerBuzz.classList.add('hidden');
            } else {
                playerChoices.classList.add('hidden');
                btnPlayerBuzz.classList.remove('hidden');
                btnPlayerBuzz.classList.remove('mini-buzz');
            }
        }

    } else if (roomData.status === 'loading') {
        waitingMsg.innerText = "CHARGEMENT DU TITRE...";
        waitingMsg.classList.add('status-waiting');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    } else if (roomData.status === 'buzzed') {
        if (roomData.buzzerTeam === state.myTeamIdx) {
            btnPlayerBuzz.disabled = true;

            if (roomData.mode === 'buttons') {
                btnPlayerBuzz.classList.add('hidden'); // v45: Caché en mode direct
                waitingMsg.innerText = "C'EST À VOUS " + myName.toUpperCase() + " !";
                waitingMsg.classList.add('status-active');
                showPlayerChoices(roomData.choices, true);
            } else {
                btnPlayerBuzz.classList.remove('hidden');
                btnPlayerBuzz.classList.add('mini-buzz');
                // En mode oral, le mode startVoiceRecognition a déjà lancé son UI et son compte à rebours
                playerChoices.classList.add('hidden');
            }

        } else {
            waitingMsg.innerText = (roomData.buzzerName || "Quelqu'un") + " a buzzé !";
            waitingMsg.classList.add('status-buzzed');
            btnPlayerBuzz.classList.add('hidden');
            playerChoices.classList.add('hidden');
        }
    } else if (roomData.status === 'finished_song') {
        const winMsg = roomData.winnerName ? `<br><span style="color:var(--success)">Gagné par ${roomData.winnerName} !</span>` : `<br><span style="color:var(--error)">Personne n'a trouvé !</span>`;
        waitingMsg.innerHTML = `<span style="color:var(--secondary)">RÉVÉLATION :</span><br>${roomData.revealedArtist || ''} - ${roomData.revealedTitle || ''}${winMsg}`;
        waitingMsg.classList.add('status-active');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    } else if (roomData.status === 'finished') {
        waitingMsg.innerText = "PARTIE TERMINÉE !";
        if (roomData.scores && roomData.scores[state.myTeamIdx]) {
            waitingMsg.innerText += `\nSCORE : ${roomData.scores[state.myTeamIdx].score} PTS`;
        }
        waitingMsg.classList.add('status-waiting');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    } else if (roomData.status === 'feedback') {
        waitingMsg.innerText = roomData.feedbackMsg || "...";
        waitingMsg.classList.add('status-active');
        btnPlayerBuzz.classList.add('hidden');
    } else {
        // Here we use the synchronized team name
        waitingMsg.innerText = myName.toUpperCase() + " PRÊT !";
        if (roomData.theme) {
            waitingMsg.innerHTML += `<br><span style="font-size:0.8em; opacity:0.7">Thème : ${roomData.theme.toUpperCase()}</span>`;
        }
        waitingMsg.classList.add('status-waiting');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    }

    // Round info overlay
    if (roomData.round) {
        let roundInfo = document.getElementById('player-round-info');
        if (!roundInfo) {
            roundInfo = document.createElement('div');
            roundInfo.id = 'player-round-info';
            roundInfo.className = 'round-info';
            playerGame.prepend(roundInfo);
        }
        roundInfo.innerText = `Round ${roomData.round}`;
    }
}

let voiceRecognition = null;
let voiceAnswerTimeout = null;
let voiceCountdownInterval = null;

function startVoiceRecognition() {
    if (voiceRecognition) {
        try { voiceRecognition.abort(); } catch (e) { }
    }
    if (voiceAnswerTimeout) clearTimeout(voiceAnswerTimeout);
    if (voiceCountdownInterval) clearInterval(voiceCountdownInterval);

    let finalTranscript = "";
    let timeLeft = 5;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let isSupported = !!SpeechRecognition;

    logDebug("Démarrage décompte vocal : " + timeLeft + "s");

    // Create the HTML structure once to avoid resetting the CSS animation
    waitingMsg.innerHTML = `
        <div class='stylish-countdown-container'>
            <div class='stylish-countdown-text'>RÉPONDEZ MAINTENANT !</div>
            <div class='stylish-countdown-circle' id='voice-countdown-timer'>${timeLeft}</div>
            <div class='stylish-transcript' id='voice-countdown-transcript'></div>
            ${!isSupported ? "<div style='font-size:0.7rem; opacity:0.5; margin-top:10px;'>Hôte à l'écoute (Transcription indisponible)</div>" : ""}
        </div>
    `;

    const timerSpan = document.getElementById('voice-countdown-timer');
    const transcriptSpan = document.getElementById('voice-countdown-transcript');

    const updateDisplay = () => {
        if (timerSpan) timerSpan.innerText = timeLeft;
        if (transcriptSpan) {
            transcriptSpan.innerText = finalTranscript ? `« ${finalTranscript} »` : "";
        }
    };

    if (isSupported) {
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.lang = 'fr-FR';
        voiceRecognition.interimResults = true;
        voiceRecognition.maxAlternatives = 1;

        voiceRecognition.onresult = (event) => {
            if (!event.results) return;
            finalTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join(' ');
            updateDisplay();
        };

        voiceRecognition.onerror = (e) => {
            if (e.error !== 'aborted') logDebug("Erreur micro: " + e.error);
        };

        try {
            voiceRecognition.start();
            logDebug("Micro activé");
        } catch (e) {
            logDebug("Impossible de lancer le micro: " + e);
            isSupported = false;
        }
    }

    voiceCountdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            updateDisplay();
        } else {
            clearInterval(voiceCountdownInterval);
        }
    }, 1000);

    voiceAnswerTimeout = setTimeout(() => {
        if (voiceRecognition) {
            try { voiceRecognition.stop(); } catch (e) { }
        }

        let textToSend = finalTranscript.trim();
        if (textToSend === "") {
            textToSend = isSupported ? "(Silence / Incompris)" : "(Réponse vocale transmise)";
        }

        if (state.roomRef) {
            state.roomRef.child('vocalAnswer').set({
                teamIdx: state.myTeamIdx,
                text: textToSend,
                timestamp: Date.now()
            });
        }

        waitingMsg.innerHTML = "✅<br><span style='font-size:1.5rem; color:var(--text-dim);'>PRÉSENTATION DU TITRE...</span>";
    }, 5000);
}

const handleBuzzClick = () => {
    if (!state.roomRef || btnPlayerBuzz.disabled) return;
    const myName = state.teams && state.teams[state.myTeamIdx] ? state.teams[state.myTeamIdx].name : `Équipe ${state.myTeamIdx + 1}`;
    logDebug("Buzz sent by " + myName);
    state.roomRef.child('buzz').set({
        teamIdx: state.myTeamIdx,
        name: myName,
        time: Date.now()
    });

    // v42: Démarrage micro instantané sur le clic (requis par Safari/Chrome)
    if (state.gameMode === 'oral' || !state.gameMode) {
        btnPlayerBuzz.classList.add('hidden');
        waitingMsg.classList.add('status-active');
        startVoiceRecognition();
    }
};

btnPlayerBuzz.addEventListener('click', handleBuzzClick);
btnPlayerBuzz.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleBuzzClick();
}, { passive: false });

function showPlayerChoices(choices, canSelect = true) {
    playerChoices.classList.remove('hidden');
    // btnPlayerBuzz handle is now in updatePlayerInterface for better control

    const bts = playerChoices.querySelectorAll('.choice-btn');

    // Hide all first
    bts.forEach(b => b.classList.add('hidden'));

    choices.forEach((c, i) => {
        if (bts[i]) {
            bts[i].innerText = c;
            bts[i].classList.remove('hidden');
            bts[i].disabled = !canSelect;
            bts[i].style.opacity = canSelect ? "1" : "0.5";

            const handleChoice = () => {
                if (!canSelect) return;
                logDebug("Choice sent: " + c);
                state.roomRef.child('answer').set({
                    teamIdx: state.myTeamIdx,
                    choice: c,
                    timestamp: Date.now()
                });
                playerChoices.classList.add('hidden');
                waitingMsg.innerText = "RÉPONSE ENVOYÉE...";
            };
            bts[i].onclick = handleChoice;
            bts[i].ontouchstart = (e) => {
                if (!canSelect) return;
                e.preventDefault();
                handleChoice();
            };
        }
    });
}

// Mode Selector
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gameMode = btn.getAttribute('data-mode');
        console.log("Mode sélectionné:", state.gameMode);
        if (state.roomRef) {
            state.roomRef.update({ mode: state.gameMode });
        }
    });
});

// Navigation
function showScreen(name) {
    if (!screens[name]) {
        console.error("Écran inconnu :", name);
        return;
    }
    Object.values(screens).forEach(s => {
        if (s) s.classList.remove('active');
    });
    screens[name].classList.add('active');
    state.screen = name;
    logDebug("Screen change: " + name);
}

// --- INITIALISATION DES LISTENERS (AU CHARGEMENT) ---

// Team Setup
btnCreateTeams.addEventListener('click', () => {
    logDebug("Config teams clicked");
    modalTeams.classList.add('active');
    syncHostTeams(); // v27 : Synchro immédiate à l'ouverture du menu
});

btnCreateTeams.addEventListener('touchstart', (e) => {
    e.preventDefault();
    modalTeams.classList.add('active');
    syncHostTeams(); // v27
}, { passive: false });

// Team Sync for Host
function syncHostTeams() {
    if (state.role !== 'host' || !state.roomId) return;
    const teamNames = [];
    for (let i = 1; i <= state.teamCount; i++) {
        const input = document.getElementById(`input-team-${i}`);
        if (input) teamNames.push(input.value || `Équipe ${i}`);
    }

    // WS
    if (state.roomRef) state.roomRef.update({ teams: teamNames });

    // REST (Crucial si iPad en DB DÉCONNECTÉE)
    const dbUrl = (typeof firebaseConfig !== 'undefined') ? firebaseConfig.databaseURL : "https://quizzgame2026-default-rtdb.firebaseio.com";
    const restUrl = `${dbUrl}/rooms/${state.roomId}/teams.json`;
    fetch(restUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamNames)
    }).catch(e => console.warn("REST Sync failed", e));

    logDebug(`Teams synced (REST+WS): ${teamNames.length}`);
}

// Team Count Selector (Improved with delegation for iPad)
const countContainer = document.querySelector('.count-btns');
if (countContainer) {
    const handleCountSelection = (btn) => {
        document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.teamCount = parseInt(btn.getAttribute('data-count'));
        console.log("Team count selected:", state.teamCount);

        // Show/Hide inputs
        for (let i = 1; i <= 4; i++) {
            const input = document.getElementById(`input-team-${i}`);
            if (input) {
                if (i <= state.teamCount) input.classList.remove('hidden');
                else input.classList.add('hidden');
            }
        }
        syncHostTeams(); // Sync dès le changement de nombre
    };

    countContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.count-btn');
        if (btn) handleCountSelection(btn);
    });

    // Touch support for iPad
    countContainer.addEventListener('touchstart', (e) => {
        const btn = e.target.closest('.count-btn');
        if (btn) {
            e.preventDefault();
            handleCountSelection(btn);
        }
    }, { passive: false });
}

// Auto-clear default names and SYNC on input
document.querySelectorAll('.team-inputs input').forEach(input => {
    input.addEventListener('focus', function () {
        if (this.value.includes('Équipe')) this.value = '';
    });
    input.addEventListener('input', syncHostTeams); // Sync à chaque lettre tapee
});


const startGame = () => {
    console.log("Démarrage avec", state.teamCount, "équipes");

    const teamNames = [];
    for (let i = 0; i < 4; i++) {
        const val = document.getElementById(`input-team-${i + 1}`).value;
        state.teams[i].name = val || `Équipe ${i + 1}`;
        if (i < state.teamCount) teamNames.push(state.teams[i].name);

        const scoreChip = document.getElementById(`score-team-${i + 1}`);
        const teamBlock = document.getElementById(`block-team-${i + 1}`);

        if (i < state.teamCount) {
            if (scoreChip) scoreChip.classList.remove('hidden');
            if (teamBlock) teamBlock.classList.remove('hidden');
            const btn = teamBlock ? teamBlock.querySelector('.team-btn') : null;
            if (btn) {
                btn.innerText = state.teams[i].name;
            }
        } else {
            if (scoreChip) scoreChip.classList.add('hidden');
            if (teamBlock) teamBlock.classList.add('hidden');
        }
    }

    // Sync team names with Firebase so players can see them
    if (state.roomRef) {
        state.roomRef.update({
            teams: teamNames,
            status: 'lobby',
            timestamp: Date.now()
        });
    }

    updateScores();
    modalTeams.classList.remove('active');
    initAudio();
    if (audioContext) audioContext.resume();
    showScreen('themes');
};

btnStartGame.addEventListener('click', startGame);
btnStartGame.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startGame();
}, { passive: false });




function updateScores() {
    for (let i = 0; i < state.teamCount; i++) {
        const chip = document.getElementById(`score-team-${i + 1}`);
        if (chip) chip.innerText = `${state.teams[i].name}: ${state.teams[i].score}`;
    }
    // Sync scores to Firebase for player displays
    if (state.roomRef) {
        state.roomRef.update({
            scores: state.teams.slice(0, state.teamCount).map(t => ({ name: t.name, score: t.score }))
        });
    }
}


// Game Logic
const handleThemeSelection = (card) => {
    const theme = card.getAttribute('data-theme');
    startTheme(theme);
};

themeCards.forEach(card => {
    card.addEventListener('click', () => handleThemeSelection(card));
    card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleThemeSelection(card);
    }, { passive: false });
});

function startTheme(theme) {
    state.currentTheme = theme;
    showScreen('game');
    nextSong();
}

// Audio Management
const audioPlayer = new Audio();
// STITCH 2026: Anti-reset speed protection
audioPlayer.addEventListener('play', () => {
    audioPlayer.playbackRate = state.mysteryRate;
});
audioPlayer.addEventListener('playing', () => {
    audioPlayer.playbackRate = state.mysteryRate;
});
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

async function fetchPreview(artist, title, theme, brand) {
    let controller = null;
    let timeoutId = null;

    if (window.AbortController) {
        controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 4000);
    }

    try {
        let queryStr = brand ? brand : `${artist} ${title}`;
        if (theme === 'disney') queryStr += " French";
        if (brand && (theme === 'movies' || theme === 'series')) queryStr += " soundtrack";
        const query = queryStr.replace(/['"]/g, "");

        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1${theme === 'disney' ? '&country=FR' : ''}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return {
                audio: data.results[0].previewUrl,
                cover: data.results[0].artworkUrl100.replace('100x100bb', '600x600bb')
            };
        }
    } catch (e) {
        console.error("Erreur iTunes API:", e);
    } finally {
        clearTimeout(timeoutId);
    }
    return null;
}



async function nextSong() {
    // Check if game is over
    if (state.round >= state.maxRounds) {
        showResults();
        return;
    }
    state.round++;

    initAudio();
    if (audioContext) audioContext.resume();

    try {


        state.isPlaying = false;
        audioPlayer.pause();
        if (state.interval) clearInterval(state.interval);

        // UI states - CACHE TOUT AU DÉBUT
        countdownEl.innerText = "Chargement...";
        countdownEl.classList.remove('hidden');
        hintsEl.classList.add('hidden');
        revealCard.classList.add('hidden');
        btnNext.classList.add('hidden'); // Caché par défaut au début du chargement
        validationControls.classList.add('hidden');

        // Sync loading status to players
        if (state.roomRef) {
            state.roomRef.update({
                status: 'loading',
                buzzerTeam: null,
                vocalAnswer: null,
                showHintsToPlayer: false
            });
        }


        // Sécurité : Si le chargement prend trop de temps (timeout réseau), on affiche un moyen de passer
        const loadingSafetyTimeout = setTimeout(() => {
            if (countdownEl.innerText === "Chargement...") {
                countdownEl.innerText = "Connexion lente...";
                btnNext.innerText = "PASSER CE TITRE";
                btnNext.classList.remove('hidden');
            }
        }, 6000);

        // Clear bravo UI and vocal UI
        bravoContainer.innerHTML = '';
        const vocalDisplay = document.getElementById('vocal-answer-display');
        if (vocalDisplay) {
            vocalDisplay.innerHTML = '';
            vocalDisplay.classList.add('hidden');
        }


        // Reset Modifier for the new song (Challenges only last 1 song)
        state.currentModifier = 'normal';
        state.speedBonusActive = false;
        state.activeJoker = null;
        state.mysteryRate = 1.0;
        audioPlayer.defaultPlaybackRate = 1.0;
        audioPlayer.playbackRate = 1.0;

        // Wheel Logic: Trigger every 3 to 5 songs
        state.songsUntilWheel--;

        if (state.songsUntilWheel <= 0) {
            const mods = ['double', 'mystery', 'bonus1', 'bonus3', 'fast', 'steal', 'bomb'];
            // Avoid same mod twice if possible
            let newMod = mods[Math.floor(Math.random() * mods.length)];
            while (newMod === state.currentModifier) {
                newMod = mods[Math.floor(Math.random() * mods.length)];
            }
            state.currentModifier = newMod;

            // Suspension : Lancer la roue
            await launchWheelOfFate(state.currentModifier);

            modifierBadge.classList.remove('hidden');
            modifierBadge.className = 'modifier-badge';

            if (state.currentModifier === 'double') {
                modifierBadge.innerText = "🔥 POINTS DOUBLES";
                modifierBadge.classList.add('modifier-double');
            } else if (state.currentModifier === 'mystery') {
                const rates = [0.7, 1.7, 2.0];
                state.mysteryRate = rates[Math.floor(Math.random() * rates.length)];
                audioPlayer.defaultPlaybackRate = state.mysteryRate;
                modifierBadge.innerText = state.mysteryRate < 1 ? "🌀 AUDIO RALENTI" : "🌀 AUDIO ACCÉLÉRÉ";
                modifierBadge.classList.add('modifier-mystery');
            } else if (state.currentModifier === 'bonus1') {
                modifierBadge.innerText = "✨ BONUS +1 PT";
                modifierBadge.classList.add('modifier-bonus1');
            } else if (state.currentModifier === 'bonus3') {
                modifierBadge.innerText = "💎 ULTRA BONUS +3 PTS";
                modifierBadge.classList.add('modifier-bonus3');
            } else if (state.currentModifier === 'fast') {
                modifierBadge.innerText = "⏱️ CHRONO (10 SECONDES)";
                modifierBadge.classList.add('modifier-fast');
            } else if (state.currentModifier === 'steal') {
                modifierBadge.innerText = "🏴‍☠️ PIRATE (VOL DE POINTS)";
                modifierBadge.classList.add('modifier-steal');
            } else if (state.currentModifier === 'bomb') {
                modifierBadge.innerText = "💣 BOMBE (-3 SI ERREUR)";
                modifierBadge.classList.add('modifier-fast'); // Reuse red style
            }

            // Set next countdown for the wheel (3, 4 or 5 songs)
            state.songsUntilWheel = Math.floor(Math.random() * 3) + 3;
        } else {
            // Modifiers last 1 song
            state.currentModifier = 'normal';
            modifierBadge.classList.add('hidden');
        }

        // Randomize Joker availability (50% chance)
        const isJokerAvailable = Math.random() > 0.5;
        document.querySelectorAll('.joker-btn').forEach((btn) => {
            btn.classList.remove('active');
            if (isJokerAvailable) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        });


        let activeTheme = state.currentTheme;
        let themeSongs = state.songs[activeTheme];

        // Safety check
        if (!themeSongs && activeTheme !== 'random') {
            countdownEl.innerText = "Thème Inconnu";
            btnNext.classList.remove('hidden');
            return;
        }

        // If Random is selected, pick a random theme for this specific song
        if (activeTheme === 'random') {
            const themes = Object.keys(state.songs).filter(t => t !== 'random');
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];
            themeSongs = state.songs[randomTheme];
            activeTheme = randomTheme;
        }


        let result = null;
        let attempts = 0;
        const maxAttempts = 5;

        // Filter out already played OR blacklisted songs
        let availableSongs = themeSongs.filter(s => !state.playedSongs.includes(s.title) && !state.failedSongs.includes(s.title));

        // If no songs left, reset history but keep blacklist
        if (availableSongs.length === 0) {
            state.playedSongs = [];
            availableSongs = themeSongs.filter(s => !state.failedSongs.includes(s.title));
            // If even after reset nothing is left, we must clear blacklist (emergency)
            if (availableSongs.length === 0) {
                state.failedSongs = [];
                availableSongs = themeSongs;
            }
        }

        while (!result && attempts < 10) { // Increased to 10 attempts
            let candidate = availableSongs[Math.floor(Math.random() * availableSongs.length)];
            state.currentSong = candidate;

            result = await fetchPreview(state.currentSong.artist, state.currentSong.title, activeTheme, state.currentSong.brand);

            if (!result || !result.audio) {
                attempts++;
                console.warn(`Song unavailable: ${state.currentSong.title}. Retrying...`);
                // Blacklist this song for this session
                if (!state.failedSongs.includes(state.currentSong.title)) {
                    state.failedSongs.push(state.currentSong.title);
                }
                // Update available list for the next attempt in the loop
                availableSongs = availableSongs.filter(s => s.title !== candidate.title);
                if (availableSongs.length === 0) break;
                result = null;
            }
        }


        if (result && result.audio) {
            state.playedSongs.push(state.currentSong.title);
            // ... (rest of the logic stays same)
            audioPlayer.src = result.audio;
            audioPlayer.load();

            // Update Firebase status now that we have a song
            if (state.roomRef) {
                state.roomRef.update({
                    status: 'playing',
                    buzzerTeam: null,
                    buzzerName: null,
                    answer: null,
                    buzz: null,
                    mode: state.gameMode,
                    round: state.round,
                    theme: activeTheme,
                    timer: (state.currentModifier === 'fast') ? 10 : 30,
                    choices: state.gameMode === 'buttons' ? shuffle([...state.currentSong.hints]) : [],
                    jokers: state.jokers,
                    activeJoker: null
                });
            }


            // Apply mystery rate AFTER loading, otherwise some browsers reset it to 1.0
            audioPlayer.defaultPlaybackRate = state.mysteryRate;
            audioPlayer.playbackRate = state.mysteryRate;

            audioPlayer.play().then(() => {
                clearTimeout(loadingSafetyTimeout);
                // Double check rate on actual playback start (Crucial for mobile Safari)
                audioPlayer.playbackRate = state.mysteryRate;
                state.isPlaying = true;

                state.timer = (state.currentModifier === 'fast') ? 10 : 30;
                countdownEl.innerText = state.timer;
                startTimer();


            }).catch(e => {
                console.warn("Auto-play blocked:", e);
                // Safari iPad fallback
                countdownEl.innerText = "CLIQUEZ POUR JOUER";
                btnNext.innerText = "LANCER LE SON";
                btnNext.classList.remove('hidden');
                state.isPlaying = false;
            });

            const miniCover = revealCard.querySelector('.mini-cover');
            if (miniCover && result.cover) {
                miniCover.style.backgroundImage = `url(${result.cover})`;
            }
        } else {
            clearTimeout(loadingSafetyTimeout);
            countdownEl.innerText = "Indisponible (Suivant)";
            btnNext.innerText = "TITRE SUIVANT";
            btnNext.classList.remove('hidden');
        }

        const hintButtons = hintsEl.querySelectorAll('.hint-btn');
        state.currentSong.hints.forEach((hint, i) => {
            hintButtons[i].innerText = hint;
            hintButtons[i].onclick = () => selectArtist(hint);
        });
    } catch (err) {
        console.error("Critical error in nextSong:", err);
        countdownEl.innerText = "Erreur - Passez au suivant";
        btnNext.classList.remove('hidden');
    }
}



function startTimer() {
    if (state.interval) clearInterval(state.interval);
    state.interval = setInterval(() => {
        state.timer--;
        countdownEl.innerText = state.timer;

        // Sync timer with Firebase for clients
        if (state.roomRef) {
            state.roomRef.update({ timer: state.timer });
        }

        if (state.timer === 15) {
            showHints();
        }

        if (state.timer <= 0) {
            clearInterval(state.interval);
            handleTimeout();
        }
    }, 1000);

}

function handleRemoteBuzz(teamIdx) {
    if (!state.isPlaying) return;

    // Local buzz handling logic
    audioPlayer.pause();
    state.isPlaying = false;
    clearInterval(state.interval);

    const vocalDisplay = document.getElementById('vocal-answer-display');
    if (vocalDisplay) {
        vocalDisplay.innerHTML = '';
        vocalDisplay.classList.add('hidden');
    }

    lastBuzzedTeam = teamIdx;

    if (state.roomRef) {
        state.roomRef.update({
            status: 'buzzed',
            buzzerTeam: teamIdx,
            buzzerName: state.teams[teamIdx].name
        });
    }

    playTone(440, 'triangle', 0.3);

    // In Oral mode, we wait the 5s before showing validation and card
    if (state.gameMode === 'oral' || !state.gameMode) {
        // Hide the card, hints and countdown while listening
        revealCard.classList.add('hidden');
        revealCard.classList.remove('stitch-reveal-anim'); // Reset anim
        hintsEl.classList.add('hidden');
        countdownEl.classList.add('hidden');
        validationControls.classList.add('hidden');
        btnNext.classList.add('hidden');

        displayFeedback("ÉCOUTE EN COURS...", "feedback-bravo");
    } else {
        // In Buttons mode, we wait for handleRemoteAnswer
        displayFeedback("ATTENTE DE LA RÉPONSE...", "feedback-bravo");
    }
}

function isCorrectAnswer(choice, song) {
    if (choice === song.artist) return true;
    if (song.brand && choice === song.brand) return true;

    // Pour les cas où l'artiste et le brand font défaut dans hints (ex: séries, disney, cartoons)
    // On valide hints[0] si ni l'artiste ni le brand ne font partie des hints d'origine
    const artistInHints = song.hints.includes(song.artist);
    const brandInHints = song.brand && song.hints.includes(song.brand);

    if (!artistInHints && !brandInHints) {
        if (choice === song.hints[0]) return true;
    }
    return false;
}

function handleRemoteAnswer(answerData) {
    if (state.role !== 'host') return;

    // Prise de main automatique ou sélection directe par hint (Mode Oral)
    if (state.gameMode === 'oral' && state.isPlaying) {
        // En mode oral, si on clique sur un hint, c'est une victoire directe (ou défaite)
        if (isCorrectAnswer(answerData.choice, state.currentSong)) {
            lastBuzzedTeam = answerData.teamIdx;
            state.roomRef.child('answer').set(null);
            victory();
            return;
        } else {
            // Mauvaise réponse via hint en mode oral
            state.roomRef.child('answer').set(null);
            applyWrongPenalty(answerData.teamIdx);
            displayFeedback("MAUVAISE RÉPONSE !", "feedback-dommage");
            playTone(110, 'sawtooth', 0.2);
            return;
        }
    }

    if (lastBuzzedTeam === null) {
        handleRemoteBuzz(answerData.teamIdx);
    } else if (lastBuzzedTeam !== answerData.teamIdx) {
        // Ignorer les clics des autres équipes pendant que quelqu'un a la main
        return;
    }

    // Clear the answer in Firebase to avoid loops
    state.roomRef.child('answer').set(null);

    if (isCorrectAnswer(answerData.choice, state.currentSong)) {
        lastBuzzedTeam = answerData.teamIdx;

        // v46: On déclenche le bouton "Correct" (qui gère points + feedback + victory)
        btnCorrect.click();
    } else {

        logDebug("Mauvaise réponse de l'équipe " + (answerData.teamIdx + 1));
        // On déclenche le bouton "Wrong" pour la pénalité
        // NOTE: On ne veut pas appeler victory() ici, car on veut REPRENDRE le jeu
        applyWrongPenalty(answerData.teamIdx);

        displayFeedback("MAUVAISE RÉPONSE ! ON CONTINUE...", "feedback-dommage");
        playTone(220, 'sawtooth', 0.2);

        // Reprendre après un petit délai de 1.5s
        setTimeout(() => {
            if (state.roomRef) {
                state.roomRef.update({
                    status: 'playing',
                    buzzerTeam: null,
                    buzzerName: null,
                    answer: null,
                    buzz: null
                });
            }
            lastBuzzedTeam = null; // Important : Permet à nouveau de prendre la main
            audioPlayer.play().then(() => {
                state.isPlaying = true;
                startTimer();
            });
        }, 1500);
    }
}


function applyWrongPenalty(teamIdx) {
    state.streakTeam = null;
    state.streakCount = 0;

    if (state.activeJoker === teamIdx) {
        state.teams[teamIdx].score = Math.max(0, state.teams[teamIdx].score - 2);
        launchBonusParticles("-2 PTS 💀");
        const jokerBtn = document.getElementById(`joker-${teamIdx + 1}`);
        if (jokerBtn) jokerBtn.classList.add('used');
        state.activeJoker = null;
    } else if (state.currentModifier === 'bomb') {
        state.teams[teamIdx].score = Math.max(0, state.teams[teamIdx].score - 3);
        launchBonusParticles("-3 PTS 💣");
    } else {
        if (Math.random() > 0.5) {
            state.teams[teamIdx].score = Math.max(0, state.teams[teamIdx].score - 1);
            launchBonusParticles("-1 PT ❌");
        }
    }
    updateScores();
}


function handleRemoteVocal(data) {
    if (state.role !== 'host') return;

    const vocalDisplay = document.getElementById('vocal-answer-display');
    if (vocalDisplay) {
        vocalDisplay.innerText = `L'équipe dit : "${data.text}"`;
        vocalDisplay.classList.remove('hidden');
    }

    if (!state.currentSong || !data.text) return;

    const transcript = data.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let targets = [];
    if (state.currentSong.artist && state.currentSong.artist !== "Générique" && state.currentSong.artist !== "Soundtrack") {
        targets.push(state.currentSong.artist);
    }
    if (state.currentSong.brand) {
        targets.push(state.currentSong.brand);
    }
    if (state.currentSong.title) {
        targets.push(state.currentSong.title);
    }
    if (state.currentSong.hints && state.currentSong.hints.length) {
        targets.push(state.currentSong.hints[0]);
    }
    
    targets = targets.map(t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    
    let isCorrect = false;

    const normalizePhonetic = (str) => {
        return str.replace(/ph/g, "f")
                  .replace(/th/g, "z")
                  .replace(/ea/g, "i")
                  .replace(/oo/g, "ou")
                  .replace(/y/g, "i")
                  .replace(/c/g, "k")
                  .replace(/sh/g, "ch")
                  .replace(/x/g, "ks")
                  .replace(/w/g, "ou")
                  .replace(/(.)\1/g, "$1"); 
    };

    for (let target of targets) {
        let cleanTarget = target.replace(/[^a-z0-9]/g, "");
        let cleanTranscript = transcript.replace(/[^a-z0-9]/g, "");
        if (cleanTarget.length < 3) continue;
        
        if (cleanTranscript.includes(cleanTarget)) {
            isCorrect = true;
            break;
        }

        let phTarget = normalizePhonetic(cleanTarget);
        let phTranscript = normalizePhonetic(cleanTranscript);

        if (phTranscript.includes(phTarget)) {
            isCorrect = true; break;
        }

        let targetWords = phTarget.split(' ').filter(x => x.length > 2);
        
        let distThreshold = Math.max(1, Math.floor(phTarget.length / 4));
        if (phTarget.length < 4) distThreshold = 0;

        for (let i = 0; i <= phTranscript.length - phTarget.length + distThreshold; i++) {
            for (let lenOffset = -distThreshold; lenOffset <= distThreshold; lenOffset++) {
                let subLen = phTarget.length + lenOffset;
                if (subLen <= 0 || i + subLen > phTranscript.length) continue;
                let sub = phTranscript.substring(i, i + subLen);
                
                let a = phTarget, b = sub;
                let matrix = [];
                for(let k = 0; k <= b.length; k++){ matrix[k] = [k]; }
                for(let k = 0; k <= a.length; k++){ matrix[0][k] = k; }
                for(let m = 1; m <= b.length; m++){
                    for(let n = 1; n <= a.length; n++){
                        if(b.charAt(m-1) == a.charAt(n-1)) matrix[m][n] = matrix[m-1][n-1];
                        else matrix[m][n] = Math.min(matrix[m-1][n-1] + 1, Math.min(matrix[m][n-1] + 1, matrix[m-1][n] + 1));
                    }
                }
                
                if (matrix[b.length][a.length] <= distThreshold) {
                    isCorrect = true; break;
                }
            }
            if (isCorrect) break;
        }
        if (isCorrect) break;
    }

    lastBuzzedTeam = data.teamIdx;

    if (isCorrect) {
        revealArtist.innerText = state.currentSong.artist || "Artiste inconnu";
        revealTitle.innerText = state.currentSong.title || "Titre inconnu";
        revealCard.classList.remove('hidden');
        revealCard.classList.add('stitch-reveal-anim');
        btnCorrect.click();
    } else {
        btnWrong.click();
    }
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function handleTimeout() {
    state.isPlaying = false;
    audioPlayer.pause();

    displayFeedback("C'ÉTAIT PAS SI DUR POURTANT 😉", "feedback-dommage");
    playTone(220, 'sawtooth', 0.5);

    // Reveal song without validation controls
    lastBuzzedTeam = null;
    victory();
}


function showHints() {
    if (state.gameMode === 'buttons') {
        hintsEl.classList.remove('hidden');
    } else if (state.gameMode === 'oral' && state.roomRef) {
        // En mode voix haute, on envoie les indices au client (mobile) pour affichage discret
        state.roomRef.update({
            showHintsToPlayer: true,
            choices: shuffle([...state.currentSong.hints])
        });
    }
}


function selectArtist(name) {
    if (isCorrectAnswer(name, state.currentSong)) {
        victory();
    } else {
        playTone(110, 'sawtooth', 0.3);
    }
}

function victory() {
    state.isPlaying = false;
    clearInterval(state.interval);
    audioPlayer.pause();

    if (!state.currentSong) {
        logDebug("Victory called but no song loaded!");
        return;
    }

    revealArtist.innerText = state.currentSong.brand ? state.currentSong.brand : state.currentSong.artist;
    revealTitle.innerText = state.currentSong.brand ? `${state.currentSong.artist} - ${state.currentSong.title}` : state.currentSong.title;
    // Sync victory state to players
    if (state.roomRef) {
        state.roomRef.update({
            status: 'finished_song',
            winnerTeam: lastBuzzedTeam,
            winnerName: lastBuzzedTeam !== null ? state.teams[lastBuzzedTeam].name : null,
            revealedArtist: state.currentSong.artist,
            revealedTitle: state.currentSong.title
        });
    }

    revealCard.classList.remove('hidden');
    hintsEl.classList.add('hidden');
    countdownEl.classList.add('hidden');

    if (lastBuzzedTeam !== null) {
        validationControls.classList.remove('hidden');
        btnNext.classList.add('hidden');
    } else {
        validationControls.classList.add('hidden');
        btnNext.classList.remove('hidden');
    }
}




btnCorrect.addEventListener('click', () => {
    if (lastBuzzedTeam !== null) {
        // Gestion de la série (Streak)
        if (state.streakTeam === lastBuzzedTeam) {
            state.streakCount++;
        } else {
            state.streakTeam = lastBuzzedTeam;
            state.streakCount = 1;
        }

        // Calcul des points de base selon la série
        let basePoints = 1;
        let isSpecialStreak = false;

        if (state.streakCount >= 7) {
            basePoints = 5;
            isSpecialStreak = true;
        } else if (state.streakCount >= 3) {
            basePoints = 3;
            isSpecialStreak = true;
        }

        let points = basePoints;

        // Ajout des bonus si un badge est affiché à l'écran
        if (state.currentModifier === 'bonus1') points += 1;
        if (state.currentModifier === 'bonus3') points += 3;
        if (state.currentModifier === 'double') points *= 2;
        if (state.currentModifier === 'steal') points += 2;
        if (state.currentModifier === 'mystery') points += 1; // Slight bonus for mystery speed

        // Le joker double le gain final du tour (Quitte ou Double)
        if (state.activeJoker === lastBuzzedTeam) {
            points *= 2;
            state.jokers[lastBuzzedTeam] = false; // Mark as used
            const jokerBtn = document.getElementById(`joker-${lastBuzzedTeam + 1}`);
            if (jokerBtn) jokerBtn.classList.add('used');

            // Sync used joker to Firebase
            if (state.roomRef) {
                state.roomRef.update({ jokers: state.jokers });
            }
            state.activeJoker = null;
        }


        state.teams[lastBuzzedTeam].score += points;

        // Special Steal effect: remove points from others
        if (state.currentModifier === 'steal') {
            state.teams.forEach((team, idx) => {
                if (idx !== lastBuzzedTeam && idx < state.teamCount) {
                    team.score = Math.max(0, team.score - 1);
                }
            });
            launchBonusParticles("PIRATE ! 🏴‍☠️");
        }
        updateScores();

        // Feedback "Stitch 2026"
        let feedbackMsg = `BONNE RÉPONSE ! (+${points} PTS)`;

        if (isSpecialStreak) {
            feedbackMsg = `QUEL TALENT ! 😉 (+${points} PTS)`;
            launchBonusParticles("QUEL TALENT !");
        } else {
            launchBonusParticles(`+${points} PTS`);
        }
        displayFeedback(feedbackMsg, 'feedback-bravo');

        // v46: On révèle les infos de la chanson
        victory();

        lastBuzzedTeam = null;
        validationControls.classList.add('hidden');
        btnNext.classList.remove('hidden');
        playTone(660, 'sine', 0.2);
    }
});


btnWrong.addEventListener('click', () => {
    const teamIdx = lastBuzzedTeam;
    if (teamIdx !== null) {
        applyWrongPenalty(teamIdx);
    }

    displayFeedback("MAUVAISE RÉPONSE ! QUELQU'UN D'AUTRE A UNE IDÉE ?", "feedback-dommage");
    playTone(220, 'sawtooth', 0.2);

    validationControls.classList.add('hidden'); 
    revealCard.classList.add('hidden'); 
    const vocalDisplay = document.getElementById('vocal-answer-display');
    if (vocalDisplay) vocalDisplay.classList.add('hidden');

    // On ne finit pas le tour, on reprend
    setTimeout(() => {
        if (state.roomRef) {
            state.roomRef.update({
                status: 'playing',
                buzzerTeam: null,
                buzzerName: null,
                answer: null,
                vocalAnswer: null,
                buzz: null
            });
        }
        lastBuzzedTeam = null;
        audioPlayer.play().then(() => {
            state.isPlaying = true;
            startTimer();
        });
    }, 2000);
});





function launchBonusParticles(text) {
    const count = 30;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            const isPenalty = text.includes("-");
            p.className = 'particle ' + (i % 2 === 0 ? 'heart-particle' : (isPenalty ? 'penalty-label' : 'bonus-label'));

            p.innerHTML = (i % 2 === 0 ? '❤️' : text);
            p.style.left = Math.random() * 100 + 'vw';
            p.style.animationDuration = (Math.random() * 2 + 2) + 's';
            p.style.setProperty('--drift', (Math.random() * 400 - 200) + 'px');
            p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
            document.body.appendChild(p);

            p.addEventListener('animationend', () => p.remove());
        }, i * 100);
    }
}


function displayFeedback(text, className) {
    bravoContainer.innerHTML = '';
    const feedback = document.createElement('div');
    feedback.className = `feedback-text ${className}`;
    feedback.innerText = text;
    bravoContainer.appendChild(feedback);

    // Sync feedback to players
    if (state.roomRef) {
        state.roomRef.update({
            status: 'feedback',
            feedbackMsg: text
        });
    }
}


// Team Buzzers Delegation (More robust for multi-team and iPad)
const teamsAction = document.getElementById('teams-action');
if (teamsAction) {
    const handleBuzz = (idx) => {
        if (!state.isPlaying) return;
        audioPlayer.pause();
        state.isPlaying = false;
        clearInterval(state.interval);

        lastBuzzedTeam = idx;
        if (state.timer > 25) state.speedBonusActive = true;

        setTimeout(() => {
            victory();
        }, 1200);
        playTone(440, 'triangle', 0.3);
    };

    teamsAction.addEventListener('click', (e) => {
        const btn = e.target.closest('.team-btn');
        if (btn) {
            const idx = parseInt(btn.getAttribute('data-team'));
            handleBuzz(idx);
        }
    });

    // iPad Touch support for buzzers
    teamsAction.addEventListener('touchstart', (e) => {
        const btn = e.target.closest('.team-btn');
        if (btn) {
            e.preventDefault();
            const idx = parseInt(btn.getAttribute('data-team'));
            handleBuzz(idx);
        }
    }, { passive: false });
}






function activateJoker(teamIdx) {
    if (!state.isPlaying) return;
    const btn = document.getElementById(`joker-${teamIdx + 1}`);
    if (btn.classList.contains('hidden') || btn.classList.contains('used')) return;

    // Toggle logic
    let newVal = null;
    if (state.activeJoker === teamIdx) {
        newVal = null;
        btn.classList.remove('active');
        playTone(330, 'sine', 0.1);
    } else if (state.activeJoker === null) {
        newVal = teamIdx;
        btn.classList.add('active');
        playTone(880, 'sine', 0.1);
    }

    // Sync to Firebase if role is player
    if (state.role === 'player' && state.roomRef) {
        state.roomRef.update({ activeJoker: newVal });
    }
}

function handlePlayerJoker() {
    activateJoker(state.myTeamIdx);
}






btnNext.addEventListener('click', () => {
    nextSong();
});

btnNext.addEventListener('touchstart', (e) => {
    e.preventDefault();
    nextSong();
}, { passive: false });

function stopGame() {
    state.isPlaying = false;
    audioPlayer.pause();
    if (state.interval) clearInterval(state.interval);
}

function playTone(freq, type, duration) {
    if (!audioContext) initAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + duration);
}

async function launchWheelOfFate(modifier) {
    return new Promise(resolve => {
        const modal = document.getElementById('modal-wheel');
        const reel = document.getElementById('slot-reel');
        const teamZone = document.getElementById('wheel-team-zone');
        const teamNameEl = document.getElementById('wheel-team-name');
        const spinBtn = document.getElementById('btn-spin-wheel');
        const slotWindow = document.getElementById('slot-window');

        // Pick a random team to spin the wheel
        const luckyTeamIdx = Math.floor(Math.random() * state.teamCount);
        teamNameEl.innerText = state.teams[luckyTeamIdx].name.toUpperCase();

        const items = [
            { id: 'bonus1', label: 'Surprise +1 🎁' },
            { id: 'bonus3', label: 'Ultra +3 💎' },
            { id: 'double', label: 'Doubles 🔥' },
            { id: 'mystery', label: 'Mystère 🌀' },
            { id: 'fast', label: 'Chrono ⏱️' },
            { id: 'steal', label: 'Pirate 🏴‍☠️' },
            { id: 'bomb', label: 'Bombe 💣' }
        ];

        // Populate reel with many items for the spinning effect
        let strip = [];
        for (let i = 0; i < 20; i++) {
            // Randomize the "visuals" during spin
            const randItem = items[Math.floor(Math.random() * items.length)];
            strip.push(randItem);
        }
        const target = items.find(i => i.id === modifier);
        strip.push(target);

        reel.innerHTML = strip.map(i => `<div class="slot-item ${i.id}">${i.label}</div>`).join('');
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';

        // Show modal and team zone
        slotWindow.classList.add('hidden');
        teamZone.classList.remove('hidden');
        modal.classList.remove('hidden');

        playTone(440, 'sine', 0.2);

        // Interaction
        spinBtn.onclick = () => {
            playTone(880, 'sine', 0.1);
            teamZone.classList.add('hidden');
            slotWindow.classList.remove('hidden');

            setTimeout(() => {
                reel.style.transition = 'transform 2.5s cubic-bezier(0.1, 0, 0.1, 1)';
                const offset = (strip.length - 1) * 120;
                reel.style.transform = `translateY(-${offset}px)`;
            }, 50);

            setTimeout(() => {
                playTone(880, 'sine', 0.5); // Victory sound
                setTimeout(() => {
                    modal.classList.add('hidden');
                    resolve();
                }, 1500);
            }, 2700);
        };
    });
}


function showResults() {
    showScreen('results');
    audioPlayer.pause();
    if (state.interval) clearInterval(state.interval);

    // Hide the reveal card overlay if it's still visible
    revealCard.classList.add('hidden');

    const activeTeams = state.teams.slice(0, state.teamCount);
    // Sort teams by score descending
    const sorted = [...activeTeams].sort((a, b) => b.score - a.score);

    const winner = sorted[0];
    const winnerNameEl = document.getElementById('winner-name');
    const winnerMsgEl = document.getElementById('winner-message');
    const comfortMsgEl = document.getElementById('comfort-message');
    const podiumContainer = document.getElementById('final-podium');

    // Winner Display
    if (sorted.length > 1 && sorted[0].score === sorted[1].score) {
        winnerNameEl.innerText = "ÉGALITÉ !";
        winnerMsgEl.innerText = "Quel match serré ! Vous êtes tous des champions.";
    } else {
        winnerNameEl.innerText = winner.name;
        winnerMsgEl.innerText = "Félicitations pour cette victoire écrasante ! 🎉";
    }

    // Dynamic Podium
    podiumContainer.innerHTML = '';
    sorted.forEach((team, index) => {
        const podiumItem = document.createElement('div');
        podiumItem.className = `podium-item rank-${index + 1}`;
        podiumItem.innerHTML = `
            <div class="podium-rank">#${index + 1}</div>
            <div class="podium-bar">
                <div class="podium-name">${team.name}</div>
                <div class="podium-pts">${team.score} PTS</div>
            </div>
        `;
        podiumContainer.appendChild(podiumItem);
    });

    // Comfort message for the last one
    const losers = sorted.slice(1);
    if (losers.length > 0) {
        comfortMsgEl.innerText = `Pas de panique ${losers[losers.length - 1].name}, la prochaine fois sera la bonne ! 😉`;
    } else {
        comfortMsgEl.innerText = "";
    }

    // Sync finished status to players
    if (state.roomRef) {
        state.roomRef.update({
            status: 'finished',
            scores: activeTeams.map(t => ({ name: t.name, score: t.score }))
        });
    }
}


function restartGame() {
    state.teams.forEach(t => t.score = 0);
    state.round = 0;
    state.playedSongs = [];
    state.jokers = [true, true, true, true];
    document.querySelectorAll('.joker-btn').forEach(btn => btn.classList.remove('used', 'active'));
    updateScores();
    showScreen('home');

}

window.syncHostTeams = syncHostTeams;
window.restartGame = restartGame;
window.handlePlayerJoker = handlePlayerJoker;
window.activateJoker = activateJoker;
