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

logDebug('Script loaded v2026_v44.0');
logDebug('Diagnostic: ' + checkFirebase().msg);
logDebug('User Agent: ' + navigator.userAgent);

// Firebase Connection Monitor moved after state initialization

// Global Error Handler for remote debugging
window.onerror = function (msg, url, lineNo, columnNo, error) {
    logDebug(`ERROR: ${msg} line:${lineNo} col:${columnNo}`);
    return false;
};

logDebug('Script initialized (v2026_v44.0)');
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
    failedSongs: [],
    streakTeam: null,
    streakCount: 0,
    currentModifier: null,
    mysteryRate: 1.0,
    speedBonusActive: false,
    winningTeam: null,
    jokers: [true, true, true, true],
    activeJoker: null,
    soloMode: false, // Mode solo : 1 joueur, pas de salon multijoueur

    // Multiplayer State
    role: null, // 'host' or 'player'
    roomId: null,
    gameMode: 'oral', // 'oral' or 'buttons'
    myTeamIdx: null,
    roomRef: null,
    songsUntilWheel: 0, // Initialize to trigger first round wheel or soon

    songs: {

        '8090': [
            {
                "artist": "Indochine",
                "title": "L’Aventurier",
                "hints": []
            },
            {
                "artist": "Vanessa Paradis",
                "title": "Joe le taxi",
                "hints": []
            },
            {
                "artist": "France Gall",
                "title": "Ella, elle l’a",
                "hints": []
            },
            {
                "artist": "Images",
                "title": "Les démons de minuit",
                "hints": []
            },
            {
                "artist": "Peter et Sloane",
                "title": "Besoin de rien, envie de toi",
                "hints": []
            },
            {
                "artist": "Jeanne Mas",
                "title": "Toute première fois",
                "hints": []
            },
            {
                "artist": "Niagara",
                "title": "L’amour à la plage",
                "hints": []
            },
            {
                "artist": "Lio",
                "title": "Amoureux solitaires",
                "hints": []
            },
            {
                "artist": "Rose Laurens",
                "title": "Africa",
                "hints": []
            },
            {
                "artist": "Hervé Cristiani",
                "title": "Il est libre Max",
                "hints": []
            },
            {
                "artist": "Axel Bauer",
                "title": "Cargo",
                "hints": []
            },
            {
                "artist": "Taxi Girl",
                "title": "Cherchez le garçon",
                "hints": []
            },
            {
                "artist": "Les Rita Mitsouko",
                "title": "Marcia Baïla",
                "hints": []
            },
            {
                "artist": "Partenaire Particulier",
                "title": "Partenaire particulier",
                "hints": []
            },
            {
                "artist": "Jean-Jacques Goldman",
                "title": "Envole-moi",
                "hints": []
            },
            {
                "artist": "Jean-Jacques Goldman",
                "title": "Je te donne",
                "hints": []
            },
            {
                "artist": "Fredericks Goldman Jones",
                "title": "À nos actes manqués",
                "hints": []
            },
            {
                "artist": "Téléphone",
                "title": "Cendrillon",
                "hints": []
            },
            {
                "artist": "Téléphone",
                "title": "Ça (c’est vraiment toi)",
                "hints": []
            },
            {
                "artist": "Bandolero",
                "title": "Paris Latino",
                "hints": []
            },
            {
                "artist": "Jean Schultheis",
                "title": "Confidence pour confidence",
                "hints": []
            },
            {
                "artist": "Thierry Pastor",
                "title": "Le coup de folie",
                "hints": []
            },
            {
                "artist": "Jean-Luc Lahaye",
                "title": "Femme que j’aime",
                "hints": []
            },
            {
                "artist": "François Valéry",
                "title": "Aimons-nous vivants",
                "hints": []
            },
            {
                "artist": "Philippe Cataldo",
                "title": "Les Divas du dancing",
                "hints": []
            },
            {
                "artist": "Les Avions",
                "title": "Nuit sauvage",
                "hints": []
            },
            {
                "artist": "Jakie Quartz",
                "title": "Mise au point",
                "hints": []
            },
            {
                "artist": "Caroline Loeb",
                "title": "C’est la ouate",
                "hints": []
            },
            {
                "artist": "Jacques Higelin",
                "title": "Tombé du ciel",
                "hints": []
            },
            {
                "artist": "Mylène Farmer",
                "title": "Désenchantée",
                "hints": []
            },
            {
                "artist": "Céline Dion",
                "title": "Pour que tu m’aimes encore",
                "hints": []
            },
            {
                "artist": "Céline Dion & Jean-Jacques Goldman",
                "title": "J’irai où tu iras",
                "hints": []
            },
            {
                "artist": "Fredericks Goldman Jones",
                "title": "À nos actes manqués",
                "hints": []
            },
            {
                "artist": "Fredericks Goldman Jones",
                "title": "Né en 17 à Leidenstadt",
                "hints": []
            },
            {
                "artist": "MC Solaar",
                "title": "Caroline",
                "hints": []
            },
            {
                "artist": "MC Solaar",
                "title": "Bouge de là",
                "hints": []
            },
            {
                "artist": "IAM",
                "title": "Je danse le mia",
                "hints": []
            },
            {
                "artist": "Zebda",
                "title": "Tomber la chemise",
                "hints": []
            },
            {
                "artist": "Tina Arena",
                "title": "Aller plus haut",
                "hints": []
            },
            {
                "artist": "Pauline Ester",
                "title": "Oui je l’adore",
                "hints": []
            },
            {
                "artist": "Roch Voisine",
                "title": "Hélène",
                "hints": []
            },
            {
                "artist": "Roch Voisine",
                "title": "Pourtant",
                "hints": []
            },
            {
                "artist": "Didier Barbelivien & Félix Gray",
                "title": "À toutes les filles",
                "hints": []
            },
            {
                "artist": "Demis Roussos",
                "title": "On écrit sur les murs",
                "hints": []
            },
            {
                "artist": "Johnny Hallyday",
                "title": "Je te promets",
                "hints": []
            },
            {
                "artist": "Lagaf’",
                "title": "La zoubida",
                "hints": []
            },
            {
                "artist": "Zouk Machine",
                "title": "Maldòn (la musique dans la peau)",
                "hints": []
            },
            {
                "artist": "Pascal Obispo",
                "title": "Tomber pour elle",
                "hints": []
            },
            {
                "artist": "Alain Souchon",
                "title": "Sous les jupes des filles",
                "hints": []
            },
            {
                "artist": "Alain Bashung",
                "title": "Madame rêve",
                "hints": []
            },
            {
                "artist": "Niagara",
                "title": "J’ai vu",
                "hints": []
            },
            {
                "artist": "Laurent Voulzy",
                "title": "Les nuits sans Kim Wilde",
                "hints": []
            },
            {
                "artist": "Axel Bauer",
                "title": "Éteins la lumière",
                "hints": []
            },
            {
                "artist": "François Feldman",
                "title": "Les valses de Vienne",
                "hints": []
            },
            {
                "artist": "Teri Moïse",
                "title": "Je serai là",
                "hints": []
            },
            {
                "artist": "Mylène Farmer",
                "title": "Tomber...",
                "hints": []
            },
            {
                "artist": "Hélène",
                "title": "Hélène et les garçons",
                "hints": []
            },
            {
                "artist": "Marc Lavoine",
                "title": "Tomber la nuit",
                "hints": []
            }
        ],
        'raphaly': [
            { artist: 'Ninho', title: 'Mamacita', hints: ["Gazo", "Damso", "Tiakola", "SDM"] },
            { artist: 'Ninho', title: 'Elle m\'a eu', hints: ["Jul", "SCH", "SDM", "Gazo"] },
            { artist: 'PNL', title: 'Menace', hints: ["DTF", "Ademo", "N.O.S", "Ziak"] },
            { artist: 'Hamza', title: 'Kyky2Bondy', hints: ["SCH", "Zola", "SDM", "Gazo"] },
            { artist: 'Dadju', title: 'Bob Marley', hints: ["Gims", "Tayc", "Franglish", "Ninho"] },
            { artist: 'Zola', title: 'Amber', hints: ["Gazo", "Koba LaD", "Maes", "Ninho"] },
            { artist: 'Aya Nakamura', title: 'Baddies', hints: ["Aya", "Gazo", "Damso", "Tiakola"] },
            { artist: 'Jul', title: 'Madame', hints: ["Jul", "SCH", "Naps", "Alonzo"] },
            { artist: 'Orelsan', title: 'La Quête', hints: ["Vald", "Lomepal", "Nekfeu", "Damso"] },
            { artist: 'SDM', title: 'Pour Elle', hints: ["SDM", "Gazo", "Tiakola", "Ninho"] },
            { artist: 'Ninho', title: 'Lettre à une femme', hints: ["Gazo", "Tiakola", "Jul", "Ninho"] },
            { artist: 'Gazo', title: 'DIE', hints: ["Central Cee", "Zola", "Koba LaD", "Gazo"] },
            { artist: 'Tiakola', title: 'Meuda', hints: ["Niska", "Hamza", "Gazo", "Tiakola"] },
            { artist: 'Naps', title: 'La Kiffance', hints: ["Jul", "Soso Maness", "L'Algérino", "Naps"] },
            { artist: 'SCH', title: 'Bande Organisée', hints: ["Jul", "Naps", "Soso Maness", "SCH"] },
            { artist: 'PLK', title: 'Petrouchka', hints: ["Soso Maness", "Oboy", "Zola", "PLK"] },
            { artist: 'Tayc', title: 'Le Temps', hints: ["Dadju", "Burnaboy", "Wizkid", "Tayc"] },
            { artist: 'PNL', title: 'Au DD', hints: ["DTF", "Ademo", "N.O.S", "PNL"] }
        ],
        'grungerock': [
            { artist: "K's Choice", title: "Not an Addict", hints: [] },
            { artist: "The Cranberries", title: "Zombie", hints: [] },
            { artist: "Garbage", title: "Stupid Girl", hints: [] },
            { artist: "Skunk Anansie", title: "Infidelity (Only You)", hints: [] },
            { artist: "Silverchair", title: "Tomorrow", hints: [] },
            { artist: "Nirvana", title: "Something In The Way", hints: [] },
            { artist: "Red Hot Chili Peppers", title: "Under the Bridge", hints: [] },
            { artist: "U2", title: "With or Without You", hints: [] },
            { artist: "The Police", title: "Roxanne", hints: [] },
            { artist: "No Doubt", title: "Don't Speak", hints: [] },
            { artist: "INXS", title: "Need You Tonight", hints: [] },
            { artist: "Led Zeppelin", title: "Whole Lotta Love", hints: [] },
            { artist: "Queen", title: "Bohemian Rhapsody", hints: [] },
            { artist: "Soundgarden", title: "Black Hole Sun", hints: [] },
            { artist: "Green Day", title: "Basket Case", hints: [] },
            { artist: "Beck", title: "Loser", hints: [] },
            { artist: "Oasis", title: "Wonderwall", hints: [] },
            { artist: "Sheryl Crow", title: "All I Wanna Do", hints: [] },
            { artist: "Spin Doctors", title: "Two Princes", hints: [] },
            { artist: "Radiohead", title: "Creep", hints: [] },
            { artist: "Rage Against the Machine", title: "Bulls On Parade", hints: [] },
            { artist: "Counting Crows", title: "Mr. Jones", hints: [] },
            { artist: "Blur", title: "Song 2", hints: [] },
            { artist: "The Smashing Pumpkins", title: "Bullet With Butterfly Wings", hints: [] },
            { artist: "Red Hot Chili Peppers", title: "Give It Away", hints: [] },
            { artist: "Lenny Kravitz", title: "Are You Gonna Go My Way", hints: [] },
            { artist: "Weezer", title: "Say It Ain't So", hints: [] },
            { artist: "Collective Soul", title: "Shine", hints: [] },
            { artist: "The Breeders", title: "Cannonball", hints: [] },
            { artist: "Beck", title: "Where It's At", hints: [] },
            { artist: "Aerosmith", title: "Crazy", hints: [] },
            { artist: "Weezer", title: "Buddy Holly", hints: [] },
            { artist: "Last Train", title: "Scars", hints: [] }
        ],
        'disney': [
            { brand: 'Le Roi Lion', artist: 'Debbie Davis', title: 'L\'histoire de la vie' },
            { brand: 'Le Roi Lion', artist: 'Emmanuel Curtil', title: 'Je voudrais déjà être roi' },
            { brand: 'Le Roi Lion', artist: 'Emmanuel Curtil', title: 'Hakuna Matata' },
            { brand: 'Le Roi Lion', artist: 'Maeva Méline', title: 'L\'amour brille sous les étoiles' },
            { brand: 'Aladdin', artist: 'Paolo Domingo', title: 'Ce rêve bleu' },
            { brand: 'Aladdin', artist: 'Richard Darbois', title: 'Prince Ali' },
            { brand: 'Aladdin', artist: 'Richard Darbois', title: 'Je suis ton meilleur ami' },
            { brand: 'Aladdin', artist: 'Paolo Domingo', title: 'Nuits d\'Arabie' },
            { brand: 'La Petite Sirène', artist: 'Henri Salvador', title: 'Sous l\'océan' },
            { brand: 'La Petite Sirène', artist: 'Claire Guyot', title: 'Partir là-bas' },
            { brand: 'La Petite Sirène', artist: 'Gérard Rinaldi', title: 'Embrasse-la' },
            { brand: 'La Belle et la Bête', artist: 'Liane Foly', title: 'Histoire éternelle' },
            { brand: 'La Belle et la Bête', artist: 'Lucie Dolène', title: 'C\'est la fête' },
            { brand: 'La Belle et la Bête', artist: 'Bénédicte Lécroart', title: 'Belle' },
            { brand: 'Pocahontas', artist: 'Laura Mayne', title: 'L\'air du vent' },
            { brand: 'Pocahontas', artist: 'Karine Costa', title: 'Des sauvages' },
            { brand: 'Mulan', artist: 'Patrick Fiori', title: 'Comme un homme' },
            { brand: 'Mulan', artist: 'Marie Galey', title: 'Réflexion' },
            { brand: 'Hercule', artist: 'Emmanuel Dahl', title: 'De zéro en héros' },
            { brand: 'Hercule', artist: 'Mimi Félixine', title: 'Jamais je n\'avouerai' },
            { brand: 'Tarzan', artist: 'Phil Collins', title: 'Je veux savoir' },
            { brand: 'Tarzan', artist: 'Phil Collins', title: 'Entre deux mondes' },
            { brand: 'Toy Story', artist: 'Charlélie Couture', title: 'Je suis ton ami' },
            { brand: 'La Reine des Neiges', artist: 'Anaïs Delva', title: 'Libérée, délivrée' },
            { brand: 'La Reine des Neiges', artist: 'Emmylou Homs', title: 'Le renouveau' },
            { brand: 'Raiponce', artist: 'Maeva Méline', title: 'Où est la vraie vie ?' },
            { brand: 'Raiponce', artist: 'Maeva Méline', title: 'Je veux y croire' },
            { brand: 'Vaiana', artist: 'Cerise Calixte', title: 'Le Bleu lumière' },
            { brand: 'Vaiana', artist: 'Anthony Kavanagh', title: 'Pour les hommes' },
            { brand: 'Vaiana', artist: 'Jean-Luc Guizonne', title: 'L\'explorateur' },
            { brand: 'Le Livre de la Jungle', artist: 'Jean Stout', title: 'Il en faut peu pour être heureux' },
            { brand: 'Le Livre de la Jungle', artist: 'José Bartel', title: 'Être un homme comme vous' },
            { brand: 'Les Aristochats', artist: 'José Bartel', title: 'Tout le monde veut devenir un cat' },
            { brand: 'Robin des Bois', artist: 'Gilles Guillot', title: 'Quel beau jour vraiment' },
            { brand: 'Peter Pan', artist: 'Générique', title: 'Tu t\'envoles' },
            { brand: 'Pinocchio', artist: 'Générique', title: 'Quand on prie la bonne étoile' },
            { brand: 'Cendrillon', artist: 'Générique', title: 'Tendre rêve' },
            { brand: 'Blanche-Neige', artist: 'Générique', title: 'Un jour mon prince viendra' },
            { brand: 'La Princesse et la Grenouille', artist: 'China Moses', title: 'Au bout du rêve' },
            { brand: 'Mary Poppins', artist: 'Générique', title: 'Supercalifragilisticexpialidocious' },
            { brand: 'Les 101 Dalmatiens', artist: 'Générique', title: 'Cruella d\'Enfer' },
            { brand: 'Frère des Ours', artist: 'Phil Collins', title: 'Je m\'en vais' },
            { brand: 'Coco', artist: 'Andrea Santamaria', title: 'Ne m\'oublie pas' },
            { brand: 'Coco', artist: 'Andrea Santamaria', title: 'Un poco loco' },
            { brand: 'Encanto', artist: 'Générique', title: 'Ne parlons pas de Bruno' },
            { brand: 'Le Monde de Nemo', artist: 'Générique', title: 'Au-delà du récif' },
            { brand: 'Le Bossu de Notre-Dame', artist: 'Francis Lalanne', title: 'Rien qu\'un jour' },
            { brand: 'La Planète au Trésor', artist: 'David Hallyday', title: 'Un homme libre' },
            { brand: 'Frère des Ours', artist: 'Phil Collins', title: 'Regarde dans mes yeux' },
            { brand: 'Cars', artist: 'Rascal Flatts', title: 'Life is a Highway' }
        ],

        'rapfr': [
            { artist: 'Suprême NTM', title: 'La fièvre', hints: ["Suprême NTM", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Fonky Family', title: 'Mystère et suspense', hints: ["Fonky Family", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Assassin', title: 'L\'odyssée suit son cours', hints: ["Assassin", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Oxmo Puccino ft. Dany Dan', title: 'A ton enterrement', hints: ["Oxmo Puccino ft. Dany Dan", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Fabe ft. Dany Dan', title: 'Rien ne change à part les saisons', hints: ["Fabe ft. Dany Dan", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Suprême NTM', title: 'Seine Saint Denis Style', hints: ["Suprême NTM", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Assassin', title: 'Shoota Babylone', hints: ["Assassin", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Tandem', title: 'Les maux', hints: ["Tandem", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Daddy Lord C', title: 'Freaky flow', hints: ["Daddy Lord C", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Akhenaton', title: 'Au fin fond d\'une contrée', hints: ["Akhenaton", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Kery James', title: '28 décembre 1977', hints: ["Kery James", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Zoxea', title: 'Rap musique que j\'aime', hints: ["Zoxea", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'La Brigade ft. Lunatic', title: '16 rimes', hints: ["La Brigade ft. Lunatic", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Fabe', title: 'Aujourd\'hui', hints: ["Fabe", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Akhenaton ft. Fonky Family', title: 'Bad Boys de Marseille', hints: ["Akhenaton ft. Fonky Family", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'La Rumeur', title: 'La cuir usé d\'une valise', hints: ["La Rumeur", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Ideal J', title: 'Le ghetto français', hints: ["Ideal J", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Akhenaton', title: 'Mon texte le savon', hints: ["Akhenaton", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Lunatic ft. Jockey', title: 'Le silence n\'est pas un oubli', hints: ["Lunatic ft. Jockey", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Doc Gynéco', title: 'L\'homme qui ne valait pas dix centimes', hints: ["Doc Gynéco", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Shurik\'N', title: 'Lettre', hints: ["Shurik'N", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Casey', title: 'Chez moi', hints: ["Casey", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Les Sages Poètes de la Rue', title: 'Qu\'est-ce qui fait marcher les sages', hints: ["Les Sages Poètes de la Rue", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'La Rumeur', title: 'L\'ombre sur la mesure', hints: ["La Rumeur", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Booba', title: 'Le bitume avec une plume', hints: ["Booba", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Fonky Family', title: 'Sans rémission', hints: ["Fonky Family", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Kery James', title: '2 issues', hints: ["Kery James", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'La Cliqua', title: 'Un dernier jour sur Terre', hints: ["La Cliqua", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Fabe', title: 'Des durs, des boss... des dombis !', hints: ["Fabe", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Time Bomb', title: 'Les bidons veulent le guidon', hints: ["Time Bomb", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Suprême NTM', title: 'Tout n\'est pas si facile', hints: ["Suprême NTM", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Rocé', title: 'On s\'habitue', hints: ["Rocé", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Doc Gynéco', title: 'Nirvana', hints: ["Doc Gynéco", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Rocca', title: 'Les jeunes de l\'univers', hints: ["Rocca", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Shurik\'N ft. Akhenaton', title: 'Manifeste', hints: ["Shurik'N ft. Akhenaton", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Ärsenik', title: 'Boxe avec les mots', hints: ["Ärsenik", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Shurik\'N', title: 'Samouraï', hints: ["Shurik'N", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Chiens de Paille', title: 'Comme un aimant', hints: ["Chiens de Paille", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'IAM', title: 'La fin de leur monde', hints: ["IAM", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Lunatic', title: 'Civilisé', hints: ["Lunatic", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'IAM', title: 'Nés sous la même étoile', hints: ["IAM", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'X-Men', title: 'Pendez-les, bandez-les, descendez-les', hints: ["X-Men", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Suprême NTM', title: 'Qu\'est-ce qu\'on attend ?', hints: ["Suprême NTM", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Fabe', title: 'L\'impertinent', hints: ["Fabe", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Booba', title: 'Ma définition', hints: ["Booba", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Suprême NTM', title: 'Laisse pas traîner ton fils', hints: ["Suprême NTM", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Booba', title: 'Repose en paix', hints: ["Booba", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Ékoué', title: 'Blessé dans mon égo', hints: ["Ékoué", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'Lunatic', title: 'la lettre', hints: ["Lunatic", "Rap FR", "Classique", "Années 90/00"] },
            { artist: 'IAM', title: 'Petit frère', hints: ["IAM", "Rap FR", "Classique", "Années 90/00"] }
        ],


        'rapus': [
            { "artist": "TLC", "title": "No Scrubs", "hints": ["TLC", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Mario", "title": "Let Me Love You", "hints": ["Mario", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Destiny's Child", "title": "Say My Name", "hints": ["Destiny's Child", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Craig David", "title": "7 Days", "hints": ["Craig David", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Busta Rhymes", "title": "I Know What You Want", "hints": ["Busta Rhymes", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Michael Jackson", "title": "You Rock My World", "hints": ["Michael Jackson", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Ciara", "title": "Like a Boy", "hints": ["Ciara", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Usher", "title": "U Remind Me", "hints": ["Usher", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Brandy & Monica", "title": "The Boy Is Mine", "hints": ["Brandy & Monica", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Blu Cantrell", "title": "Breathe", "hints": ["Blu Cantrell", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Alicia Keys", "title": "My Boo", "hints": ["Alicia Keys", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Lauryn Hill", "title": "Doo Wop (That Thing)", "hints": ["Lauryn Hill", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "B2K", "title": "Bump, Bump, Bump", "hints": ["B2K", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Akon", "title": "Lonely", "hints": ["Akon", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Toni Braxton", "title": "He Wasn't Man Enough", "hints": ["Toni Braxton", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Fugees", "title": "Ready or Not", "hints": ["Fugees", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Jennifer Lopez", "title": "Jenny from the Block", "hints": ["Jennifer Lopez", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Alicia Keys", "title": "Fallin'", "hints": ["Alicia Keys", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Rihanna", "title": "Umbrella", "hints": ["Rihanna", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Blackstreet", "title": "No Diggity", "hints": ["Blackstreet", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "T-Pain", "title": "Buy U a Drank", "hints": ["T-Pain", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Chris Brown", "title": "With You", "hints": ["Chris Brown", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Craig David", "title": "Walking Away", "hints": ["Craig David", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Sean Kingston", "title": "Beautiful Girls", "hints": ["Sean Kingston", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "R. Kelly", "title": "Ignition (Remix)", "hints": ["R. Kelly", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Shakira", "title": "Hips Don't Lie", "hints": ["Shakira", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Brandy", "title": "Right Here (Departed)", "hints": ["Brandy", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Cassidy", "title": "Hotel", "hints": ["Cassidy", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Beyoncé", "title": "Crazy In Love", "hints": ["Beyoncé", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Wyclef Jean", "title": "911", "hints": ["Wyclef Jean", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Joe", "title": "Ride Wit U", "hints": ["Joe", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Ginuwine", "title": "Pony", "hints": ["Ginuwine", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Kelly Rowland", "title": "Dilemma", "hints": ["Kelly Rowland", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Whitney Houston", "title": "I Have Nothing", "hints": ["Whitney Houston", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Amerie", "title": "1 Thing", "hints": ["Amerie", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Madcon", "title": "Beggin'", "hints": ["Madcon", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Bow Wow", "title": "Like You", "hints": ["Bow Wow", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "R. Kelly", "title": "I Believe I Can Fly", "hints": ["R. Kelly", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Nelly", "title": "Hot In Herre", "hints": ["Nelly", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Diana King", "title": "Shy Guy", "hints": ["Diana King", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Pharrell Williams", "title": "Frontin'", "hints": ["Pharrell Williams", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Mariah Carey", "title": "Hero", "hints": ["Mariah Carey", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "TLC", "title": "Waterfalls", "hints": ["TLC", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Big Punisher", "title": "Still Not a Player", "hints": ["Big Punisher", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Toni Braxton", "title": "Un-break My Heart", "hints": ["Toni Braxton", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Next", "title": "Too Close", "hints": ["Next", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Ashanti", "title": "Foolish", "hints": ["Ashanti", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Boyz II Men", "title": "I'll Make Love to You", "hints": ["Boyz II Men", "Rap US / RNB", "Hit", "Classique"] },
            { "artist": "Erick Sermon", "title": "Music", "hints": ["Erick Sermon", "Rap US / RNB", "Hit", "Classique"] }
        ],
        'clubdorothee': [
            { brand: 'Dragon Ball', artist: 'Ariane Carletti', title: 'Dragon Ball', hints: ['Dragon Ball', 'Dragon Ball Z', 'Olive et Tom', 'Nicky Larson'] },
            { brand: 'Dragon Ball Z', artist: 'Ariane Carletti', title: 'Dragon Ball Z', hints: ['Dragon Ball Z', 'Dragon Ball', 'Les Chevaliers du Zodiaque', 'Bioman'] },
            { brand: 'Les Chevaliers du Zodiaque', artist: 'Bernard Minet', title: 'Les Chevaliers du Zodiaque', hints: ['Les Chevaliers du Zodiaque', 'Bioman', 'Sailor Moon', 'Nicky Larson'] },
            { brand: 'Olive et Tom', artist: 'Jean-Claude Corbel', title: 'Olive et Tom', hints: ['Olive et Tom', 'Jeanne et Serge', 'Dragon Ball', 'Lucile Amour et Rock\'n Roll'] },
            { brand: 'Jeanne et Serge', artist: 'Claude Lombard', title: 'Jeanne et Serge', hints: ['Jeanne et Serge', 'Olive et Tom', 'Juliette je t\'aime', 'Max et Compagnie'] },
            { brand: 'Nicky Larson', artist: 'Jean-Paul Césari', title: 'Nicky Larson', hints: ['Nicky Larson', 'Cat\'s Eyes', 'Signé Cat\'s Eyes', 'Cobra'] },
            { brand: 'Bioman', artist: 'Bernard Minet', title: 'Bioman', hints: ['Bioman', 'X-Or', 'Les Chevaliers du Zodiaque', 'Mask'] },
            { brand: 'Inspecteur Gadget', artist: 'Jacques Cardona', title: 'Inspecteur Gadget', hints: ['Inspecteur Gadget', 'Ulysse 31', 'Les Mystérieuses Cités d\'Or', 'Denver le dernier dinosaure'] },
            { brand: 'Sailor Moon', artist: 'Bernard Minet', title: 'Sailor Moon', hints: ['Sailor Moon', 'Cardcaptor Sakura', 'Lucile Amour et Rock\'n Roll', 'Gigi'] },
            { brand: 'Denver le dernier dinosaure', artist: 'Carlos Lipesker', title: 'Denver le dernier dinosaure', hints: ['Denver le dernier dinosaure', 'Inspecteur Gadget', 'Les Tortues Ninja', 'Les Snorky'] },
            { brand: 'Les Mystérieuses Cités d\'Or', artist: 'Jacques Cardona', title: 'Les Mystérieuses Cités d\'Or', hints: ['Les Mystérieuses Cités d\'Or', 'Ulysse 31', 'Tom Sawyer', 'Rémi sans famille'] },
            { brand: 'Signé Cat\'s Eyes', artist: 'Isabelle Ganot', title: 'Signé Cat\'s Eyes', hints: ['Signé Cat\'s Eyes', 'Nicky Larson', 'Juliette je t\'aime', 'Cobra'] },
            { brand: 'Princesse Sarah', artist: 'Cristina D\'Avena', title: 'Princesse Sarah', hints: ['Princesse Sarah', 'Heidi', 'Candy', 'Pollyanna'] },
            { brand: 'Juliette je t\'aime', artist: 'Isabelle Ganot', title: 'Juliette je t\'aime', hints: ['Juliette je t\'aime', 'Lucile Amour et Rock\'n Roll', 'Max et Compagnie', 'Signé Cat\'s Eyes'] },
            { brand: 'Lucile Amour et Rock\'n Roll', artist: 'Isabelle Ganot', title: 'Lucile Amour et Rock\'n Roll', hints: ['Lucile Amour et Rock\'n Roll', 'Juliette je t\'aime', 'Max et Compagnie', 'Creamy'] },
            { brand: 'Max et Compagnie', artist: 'Claude Lombard', title: 'Max et Compagnie', hints: ['Max et Compagnie', 'Lucile Amour et Rock\'n Roll', 'Juliette je t\'aime', 'Théo ou la Batte de la Victoire'] },
            { brand: 'Cat\'s Eyes', artist: 'Isabelle Ganot', title: 'Signé Cat\'s Eyes', hints: ['Cat\'s Eyes', 'Nicky Larson', 'Cobra', 'Sherlock Holmes'] },
            { brand: 'Transformers', artist: 'Bernard Minet', title: 'Transformers pour un monde meilleur', hints: ['Transformers', 'MASK', 'GI Joe', 'GoBots'] },
            { brand: 'MASK', artist: 'Noam Kaniel', title: 'MASK', hints: ['MASK', 'Transformers', 'Jayce et les Conquérants de la Lumière', 'GI Joe'] }
        ],

        'series': [
            { brand: 'Friends', artist: 'The Rembrandts', title: 'I\'ll Be There For You', hints: ['Friends', 'How I Met Your Mother', 'The Big Bang Theory', 'Scrubs'] },
            { brand: 'X-Files', artist: 'Mark Snow', title: 'The X-Files Theme', hints: ['X-Files', 'Fringe', 'Supernatural', 'Twin Peaks'] },
            { brand: 'Prison Break', artist: 'Faf Larage', title: 'Pas le temps', hints: ['Prison Break', 'Lost', '24 Heures Chrono', 'Dexter'] },
            { brand: 'Charmed', artist: 'Love Spit Love', title: 'How Soon Is Now?', hints: ['Charmed', 'Buffy contre les vampires', 'Sabrina l\'apprentie sorcière', 'Ghost Whisperer'] },
            { brand: 'Game of Thrones', artist: 'Ramin Djawadi', title: 'Main Title', hints: ['Game of Thrones', 'Le Seigneur des Anneaux', 'The Witcher', 'Vikings'] },
            { brand: 'Les Frères Scott', artist: 'Gavin DeGraw', title: 'I Don\'t Want to Be', hints: ['Les Frères Scott', 'Newport Beach', 'Dawson', 'Gossip Girl'] },
            { brand: 'Malcolm', artist: 'They Might Be Giants', title: 'Boss of Me', hints: ['Malcolm', 'Ma Famille d\'Abord', 'Scrubs', 'The Middle'] },
            { brand: 'Stranger Things', artist: 'Kyle Dixon', title: 'Stranger Things', hints: ['Stranger Things', 'Dark', 'The OA', 'Black Mirror'] },
            { brand: 'La Casa de Papel', artist: 'Cecilia Krull', title: 'My Life Is Going On', hints: ['La Casa de Papel', 'Narcos', 'Elite', 'Lupin'] },
            { brand: 'Le Prince de Bel-Air', artist: 'DJ Jazzy Jeff', title: 'The Fresh Prince of Bel-Air', hints: ['Le Prince de Bel-Air', 'Ma Famille d\'Abord', 'Cosby Show', 'Kenan et Kel'] },
            { brand: 'Alerte à Malibu', artist: 'Jimi Jamison', title: 'I\'m Always Here', hints: ['Alerte à Malibu', 'Magnum', 'K2000', 'MacGyver'] },
            { brand: 'MacGyver', artist: 'Randy Edelman', title: 'MacGyver Theme', hints: ['MacGyver', 'L\'Agence Tous Risques', 'K2000', 'Magnum'] }
        ]
    }
};

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

// ---- goHome : fonction globale (utilisée aussi par le bouton ACCUEIL de l'écran résultats) ----
function goHome() {
    // Nettoyage joueur
    if (state.role === 'player') {
        if (state.roomRef) state.roomRef.off();
        if (window.teamListener) window.teamListener.off();
        state.role = null;
        state.roomId = null;
        state.roomRef = null;
        state.myTeamIdx = null;
        if (playerLobby) playerLobby.classList.remove('hidden');
        if (playerGame) playerGame.classList.add('hidden');
        if (btnJoinRoom) { btnJoinRoom.innerText = 'REJOINDRE LE JEU'; btnJoinRoom.disabled = false; }
    }
    // Nettoyage hôte sans réinitialiser les scores
    if (state.role === 'host') {
        state.isPlaying = false;
        audioPlayer.pause();
        if (state.interval) clearInterval(state.interval);
        // On NE remet PAS les scores à 0 ici intentionnellement
    }
    // Réinitialisation partielle de l'état
    state.soloMode = false;
    showScreen('role');
}
window.goHome = goHome;

if (navHome) {
    navHome.addEventListener('click', goHome);
    navHome.addEventListener('touchstart', (e) => { e.preventDefault(); goHome(); }, { passive: false });
}
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
    // Fix : vider le champ et placer le curseur dedans automatiquement
    if (inputRoomCode) {
        inputRoomCode.value = '';
        // reset etat entree de code
        lastFetchedCode = '';
        selectTeamJoin.innerHTML = '<option value="">ENTREZ LE CODE...</option>';
        btnJoinRoom.disabled = true;
        btnJoinRoom.innerText = 'REJOINDRE LE JEU';
        // Autofocus après le rendu (délai court pour iOS)
        setTimeout(() => inputRoomCode.focus(), 150);
    }
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

// --- MODE SOLO ---
const btnSoloMode = document.getElementById('btn-solo-mode');
if (btnSoloMode) {
    const launchSolo = () => {
        const inputSoloName = document.getElementById('input-solo-name');
        const soloName = (inputSoloName && inputSoloName.value.trim()) ? inputSoloName.value.trim() : 'SOLO';

        state.soloMode = true;
        state.role = 'host';
        state.teamCount = 1;
        state.teams[0].name = soloName;
        state.teams[0].score = 0;
        // Masquer équipes inutiles
        for (let i = 1; i < 4; i++) state.teams[i].score = 0;
        state.round = 0;
        state.playedSongs = [];
        state.failedSongs = [];
        state.jokers = [true, true, true, true];
        state.activeJoker = null;

        // Mettre à jour les boutons équipe dans le jeu
        const block1 = document.getElementById('block-team-1');
        const btn1 = block1 ? block1.querySelector('.team-btn') : null;
        if (btn1) btn1.innerText = soloName.toUpperCase();
        ['block-team-2', 'block-team-3', 'block-team-4'].forEach(id => {
            const b = document.getElementById(id); if (b) b.classList.add('hidden');
        });
        if (block1) block1.classList.remove('hidden');

        // Score chips
        const chip1 = document.getElementById('score-team-1');
        if (chip1) { chip1.classList.remove('hidden'); chip1.innerText = `${soloName}: 0`; }
        ['score-team-2', 'score-team-3', 'score-team-4'].forEach(id => {
            const c = document.getElementById(id); if (c) c.classList.add('hidden');
        });

        // Jokers : cacher dans le jeu (pas utile en solo)
        document.querySelectorAll('.joker-btn').forEach(b => b.classList.add('hidden'));

        // Pas de Firebase en solo
        state.roomRef = null;
        state.roomId = null;

        // Afficher code salle vide en solo
        const roomCodeDisplay = document.getElementById('room-code-display');
        if (roomCodeDisplay) roomCodeDisplay.classList.add('hidden');

        initAudio();
        if (audioContext) audioContext.resume().catch(() => { });

        showScreen('themes');
    };
    btnSoloMode.addEventListener('click', launchSolo);
    btnSoloMode.addEventListener('touchstart', (e) => { e.preventDefault(); launchSolo(); }, { passive: false });
}



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

    state.roomId = code; localStorage.setItem("lastRoomId", code);

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

    // --- Gestion de la Roue du Destin côté client ---
    if (roomData.status === 'wheel_waiting') {
        // Cacher les éléments de jeu normaux
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
        waitingMsg.className = 'waiting-msg player-status-indicator';

        if (roomData.wheelTeamIdx === state.myTeamIdx) {
            // C'est MON équipe qui doit lancer la roue !
            waitingMsg.innerHTML = `
                <div style="font-size:1.2rem; font-weight:800; color:var(--secondary); margin-bottom:16px;">
                    🎰 C'EST TON TOUR !
                </div>
                <button id="btn-player-spin-wheel" style="
                    display:block; width:100%; padding:24px 20px;
                    font-size:1.6rem; font-weight:900; letter-spacing:2px;
                    background: linear-gradient(135deg, #f800d8, #7b2ff7);
                    color:white; border:none; border-radius:24px;
                    box-shadow: 0 0 30px rgba(248,0,216,0.6);
                    cursor:pointer; animation: pulse 1s infinite alternate;
                ">🎰 LANCER LA ROUE !</button>
            `;
            const spinPlayerBtn = document.getElementById('btn-player-spin-wheel');
            if (spinPlayerBtn) {
                const doPlayerSpin = () => {
                    if (spinPlayerBtn.disabled) return;
                    spinPlayerBtn.disabled = true;
                    spinPlayerBtn.innerText = '⏳ En cours...';
                    if (state.roomRef) {
                        state.roomRef.update({ wheelSpin: true });
                    }
                };
                spinPlayerBtn.onclick = doPlayerSpin;
                spinPlayerBtn.ontouchstart = (e) => { e.preventDefault(); doPlayerSpin(); };
            }
        } else {
            // Autre équipe : on attend
            const wheelTeamName = roomData.wheelTeamName || `Équipe ${(roomData.wheelTeamIdx || 0) + 1}`;
            waitingMsg.innerHTML = `
                <div style="font-size:1.1rem; color:var(--secondary); font-weight:700;">🎰 ROUE DU DESTIN</div>
                <div style="margin-top:8px; opacity:0.8;">${wheelTeamName.toUpperCase()} lance la roue...</div>
            `;
        }
        return; // Ne pas exécuter le reste de la fonction pour ce statut
    }

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
            btnPlayerBuzz.style.opacity = "1";
            btnPlayerBuzz.style.filter = "none";

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

            // v42: On affiche le buzzer mais on le grise (grisé et non disponible)
            btnPlayerBuzz.classList.remove('hidden');
            btnPlayerBuzz.classList.remove('mini-buzz');
            btnPlayerBuzz.disabled = true;
            btnPlayerBuzz.style.opacity = "0.3";
            btnPlayerBuzz.style.filter = "grayscale(1)";

            playerChoices.classList.add('hidden');
        }
    } else if (roomData.status === 'finished_song') {
        const winMsg = roomData.winnerName ? `<br><span style="color:var(--success)">Gagné par ${roomData.winnerName} !</span>` : `<br><span style="color:var(--error)">Personne n'a trouvé !</span>`;
        waitingMsg.innerHTML = `<span style="color:var(--secondary)">RÉVÉLATION :</span><br>${roomData.revealedArtist || ''} - ${roomData.revealedTitle || ''}${winMsg}`;
        waitingMsg.classList.add('status-active');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');

    } else if (roomData.status === 'finished') {
        const sorted = roomData.scores ? [...roomData.scores].sort((a, b) => b.score - a.score) : [];
        const winnerName = sorted[0] ? sorted[0].name.toUpperCase() : "BRAVO";

        waitingMsg.innerHTML = `
            <div class="results-stitch-tag">STITCH 2026</div>
            <div class="results-round-info">FIN DE SESSION</div>
            <div style='font-size: 2.2rem; font-weight: 900; color: white; margin-top: 10px;'>FÉLICITATIONS !</div>
            <div style='font-size: 1.8rem; color: var(--secondary); margin-bottom: 10px;'>${winnerName}</div>
        `;
        if (roomData.scores) {
            const sorted = [...roomData.scores].sort((a, b) => b.score - a.score);
            let podiumHtm = "<div style='margin-top:20px; text-align:left; background:rgba(255,255,255,0.05); padding:15px; border-radius:15px;'>";
            sorted.forEach((team, idx) => {
                const color = idx === 0 ? "gold" : (idx === 1 ? "silver" : (idx === 2 ? "#cd7f32" : "white"));
                podiumHtm += `<div style='display:flex; justify-content:space-between; margin-bottom:8px; color:${color}; font-weight:bold;'>
                    <span>#${idx + 1} ${team.name}</span>
                    <span>${team.score} PTS</span>
                </div>`;
            });
            podiumHtm += "</div>";
            waitingMsg.innerHTML += podiumHtm;
        }
        waitingMsg.classList.add('status-active');
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

    // Round info overlay — Design Premium (ne re-génère que si la manche change)
    if (roomData.round) {
        let roundInfo = document.getElementById('player-round-info');
        if (!roundInfo) {
            roundInfo = document.createElement('div');
            roundInfo.id = 'player-round-info';
            playerGame.prepend(roundInfo);
        }
        // Ne mettre à jour que si le numéro a changé (évite la ré-animation à chaque tick du timer)
        if (roundInfo.dataset.round !== String(roomData.round)) {
            roundInfo.dataset.round = roomData.round;
            roundInfo.innerHTML = `
                <div class="player-round-badge">
                    <span class="round-label">🎵 MANCHE</span>
                    <span class="round-number">${roomData.round}</span>
                </div>
            `;
        }
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
            <button id='btn-send-vocal-now' style='margin-top:10px; padding:10px 20px; background:var(--primary); color:white; border:none; border-radius:30px; font-weight:bold; cursor:pointer;'>ENVOYER</button>
            ${!isSupported ? "<div style='font-size:0.7rem; opacity:0.5; margin-top:10px;'>Hôte à l'écoute (Transcription indisponible)</div>" : ""}
        </div>
    `;

    const timerSpan = document.getElementById('voice-countdown-timer');
    const transcriptSpan = document.getElementById('voice-countdown-transcript');
    const sendNowBtn = document.getElementById('btn-send-vocal-now');

    const finishAndSend = () => {
        if (voiceRecognition) {
            try { voiceRecognition.stop(); } catch (e) { }
        }
        if (voiceAnswerTimeout) clearTimeout(voiceAnswerTimeout);
        if (voiceCountdownInterval) clearInterval(voiceCountdownInterval);

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

        waitingMsg.innerHTML = "PRÉSENTATION DU TITRE...";
    };

    const updateDisplay = () => {
        if (timerSpan) timerSpan.innerText = timeLeft;
        if (transcriptSpan) {
            transcriptSpan.innerText = finalTranscript ? `« ${finalTranscript} »` : "";
        }
    };

    if (sendNowBtn) {
        sendNowBtn.onclick = finishAndSend;
    }

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

    voiceAnswerTimeout = setTimeout(finishAndSend, 5000);
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
        let queryStr = `${artist} ${title}`;
        if (artist === "Générique" || artist === "Soundtrack") queryStr = brand ? `${brand} ${title}` : title;
        if (theme === 'clubdorothee') queryStr += " French";
        if (theme === 'disney') queryStr += " French Disney";
        if (brand && theme === 'series') queryStr += " soundtrack";
        const query = queryStr.replace(/['"]/g, "");

        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1&country=FR`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            let coverUrl = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
            let audioUrl = data.results[0].previewUrl;

            // Override cover for Series / Movies / Cartoons using the Brand name to get a Poster
            if (['series', 'clubdorothee', 'disney', 'cartoons', 'movies'].includes(theme) && brand) {
                try {
                    let searchBrand = brand;
                    if (theme === 'disney') searchBrand += " Disney Pixar Animation";

                    // Try tvSeason first
                    let tvResponse = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchBrand)}&entity=tvSeason&limit=1&country=FR`);
                    let tvData = await tvResponse.json();
                    if (tvData.results && tvData.results.length > 0) {
                        coverUrl = tvData.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
                    } else {
                        // Fallback to movie
                        let movResponse = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchBrand)}&entity=movie&limit=1&country=FR`);
                        let movData = await movResponse.json();
                        if (movData.results && movData.results.length > 0) {
                            coverUrl = movData.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
                        }
                    }
                } catch (e) { }
            }

            return {
                audio: audioUrl,
                cover: coverUrl
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

        // Sync loading status to players & Reset states
        if (state.roomRef) {
            state.roomRef.update({
                status: 'loading',
                buzzerTeam: null,
                vocalAnswer: null,
                buzz: null,
                answer: null,
                activeJoker: null,
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

        // If no songs left in this theme, the game ends
        if (availableSongs.length === 0) {
            showResults();
            return;
        }

        while (!result && attempts < 10) { // Increased to 10 attempts
            let candidate = availableSongs[Math.floor(Math.random() * availableSongs.length)];
            state.currentSong = candidate;

            let searchArtist = state.currentSong.artist;
            if (searchArtist === "Générique" || searchArtist === "Soundtrack") searchArtist = "";
            result = await fetchPreview(searchArtist, state.currentSong.title, activeTheme, state.currentSong.brand);

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

            // Gérer les 4 propositions proprement (1 bonne, 3 mauvaises au hasard dans le même thème)
            const getDisplayTarget = (s) => s.brand || (s.artist === "Générique" || s.artist === "Soundtrack" ? s.title : s.artist);
            let correctChoice = getDisplayTarget(state.currentSong);
            let pool = Array.from(new Set(themeSongs.map(s => getDisplayTarget(s))));
            pool = pool.filter(c => c !== correctChoice);
            pool.sort(() => Math.random() - 0.5);
            let choices = [correctChoice, ...pool.slice(0, 3)].sort(() => Math.random() - 0.5);
            state.currentSong.hints = choices;

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
    if (!choice || !song) return false;
    const clean = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const c = clean(choice);

    // v43: Strict check for Disney theme (brand only = cartoon name)
    if (state.currentTheme === 'disney') {
        if (song.brand && clean(song.brand).includes(c)) return true;
        if (song.brand && c.includes(clean(song.brand))) return true;
        return false;
    }

    if (song.artist && song.artist !== "Générique" && song.artist !== "Soundtrack" && clean(song.artist).includes(c)) return true;
    if (song.brand && clean(song.brand).includes(c)) return true;
    if (song.title && clean(song.title).includes(c)) return true;

    if (song.artist && song.artist !== "Générique" && song.artist !== "Soundtrack" && c.includes(clean(song.artist))) return true;
    if (song.brand && c.includes(clean(song.brand))) return true;
    if (song.title && c.includes(clean(song.title))) return true;

    return false;
}

function handleRemoteAnswer(answerData) {
    if (state.role !== 'host') return;

    // Prise de main automatique ou sélection directe par hint (Mode Oral)
    if (state.gameMode === 'oral' && (state.isPlaying || lastBuzzedTeam !== null)) {
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
    if (['disney', 'clubdorothee', 'series', 'cartoons', 'movies'].includes(state.currentTheme)) {
        // Only the cartoon/series name
        if (state.currentSong.brand) targets.push(state.currentSong.brand);
        else targets.push(state.currentSong.title); // Fallback
    } else {
        if (state.currentSong.artist && state.currentSong.artist !== "Générique" && state.currentSong.artist !== "Soundtrack") {
            targets.push(state.currentSong.artist);
        }
        if (state.currentSong.brand) {
            targets.push(state.currentSong.brand);
        }
        if (state.currentSong.title) {
            targets.push(state.currentSong.title);
        }
    }
    if (state.currentSong.hints && state.currentSong.hints.length && !['disney', 'clubdorothee', 'series', 'cartoons', 'movies'].includes(state.currentTheme)) {
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
                for (let k = 0; k <= b.length; k++) { matrix[k] = [k]; }
                for (let k = 0; k <= a.length; k++) { matrix[0][k] = k; }
                for (let m = 1; m <= b.length; m++) {
                    for (let n = 1; n <= a.length; n++) {
                        if (b.charAt(m - 1) == a.charAt(n - 1)) matrix[m][n] = matrix[m - 1][n - 1];
                        else matrix[m][n] = Math.min(matrix[m - 1][n - 1] + 1, Math.min(matrix[m][n - 1] + 1, matrix[m - 1][n] + 1));
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

function victory(keepPlaying = false) {
    state.isPlaying = false;
    clearInterval(state.interval);
    if (!keepPlaying) audioPlayer.pause();

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
        victory(true);
        audioPlayer.play(); // Reprendre la musique

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
        const luckyTeamName = state.teams[luckyTeamIdx].name;
        teamNameEl.innerText = luckyTeamName.toUpperCase();

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
            const randItem = items[Math.floor(Math.random() * items.length)];
            strip.push(randItem);
        }
        const target = items.find(i => i.id === modifier);
        strip.push(target);

        reel.innerHTML = strip.map(i => `<div class="slot-item ${i.id}">${i.label}</div>`).join('');
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';

        // Show modal and team zone (hôte voit la roue mais PAS le bouton spin)
        slotWindow.classList.add('hidden');
        teamZone.classList.remove('hidden');
        // On cache le bouton spin côté hôte : c'est le joueur qui déclenche
        spinBtn.classList.add('hidden');
        modal.classList.remove('hidden');

        playTone(440, 'sine', 0.2);

        const wheelExplanation = document.getElementById('wheel-explanation');
        if (wheelExplanation) wheelExplanation.classList.add('hidden');

        // --- Publier sur Firebase pour que le client de la bonne équipe voit le bouton ---
        if (state.roomRef) {
            state.roomRef.update({
                status: 'wheel_waiting',
                wheelTeamIdx: luckyTeamIdx,
                wheelTeamName: luckyTeamName,
                wheelSpin: null   // reset spin signal
            });
        }

        // Fonction qui déclenche l'animation de la roue (appelée dès que le client appuie)
        const doSpin = () => {
            playTone(880, 'sine', 0.1);
            teamZone.classList.add('hidden');
            slotWindow.classList.remove('hidden');

            // Remettre le bouton dans son état normal pour les prochains tours
            spinBtn.classList.remove('hidden');

            setTimeout(() => {
                reel.style.transition = 'transform 2.5s cubic-bezier(0.1, 0, 0.1, 1)';
                const offset = (strip.length - 1) * 120;
                reel.style.transform = `translateY(-${offset}px)`;
            }, 50);

            setTimeout(() => {
                playTone(880, 'sine', 0.5);

                if (wheelExplanation) {
                    const modifierData = {
                        bonus1: { emoji: '🎁', title: '+1 POINT BONUS', desc: 'Le gagnant de cette manche reçoit 1 point supplémentaire !', cls: 'wheel-expl-bonus1' },
                        bonus3: { emoji: '💎', title: 'ULTRA BONUS +3 PTS', desc: 'INCROYABLE ! Le vainqueur remporte 3 points en prime !', cls: 'wheel-expl-bonus3' },
                        double: { emoji: '🔥', title: 'POINTS DOUBLÉS', desc: 'Les points de cette manche sont multipliés par 2 !', cls: 'wheel-expl-double' },
                        mystery: { emoji: '🌀', title: 'MYSTÈRE SONORE', desc: 'La chanson sera jouée à vitesse modifiée… Bonne chance !', cls: 'wheel-expl-mystery' },
                        fast: { emoji: '⏱️', title: 'CHRONO DE LA MORT', desc: 'Seulement 10 secondes pour trouver ! Réfléchissez vite !', cls: 'wheel-expl-fast' },
                        steal: { emoji: '🏴‍☠️', title: 'MODE PIRATE', desc: 'Le gagnant vole 1 point à chaque autre équipe !', cls: 'wheel-expl-steal' },
                        bomb: { emoji: '💣', title: 'LA BOMBE', desc: 'Danger ! Une mauvaise réponse fait perdre 3 points !', cls: 'wheel-expl-bomb' }
                    };
                    const md = modifierData[modifier] || { emoji: '🎲', title: modifier.toUpperCase(), desc: '', cls: '' };
                    wheelExplanation.className = `wheel-explanation-text ${md.cls}`;
                    wheelExplanation.innerHTML = `
                        <div class="wheel-expl-emoji">${md.emoji}</div>
                        <div class="wheel-expl-title">${md.title}</div>
                        <div class="wheel-expl-desc">${md.desc}</div>
                    `;
                    wheelExplanation.classList.remove('hidden');
                }


                setTimeout(() => {
                    modal.classList.add('hidden');
                    if (wheelExplanation) wheelExplanation.classList.add('hidden');
                    // Nettoyer l'état wheel sur Firebase
                    if (state.roomRef) {
                        state.roomRef.update({ status: 'loading', wheelTeamIdx: null, wheelTeamName: null, wheelSpin: null });
                    }
                    // Retirer le listener de spin
                    if (state.roomRef) state.roomRef.child('wheelSpin').off('value', wheelSpinListener);
                    resolve();
                }, 4000);
            }, 2700);
        };

        // L'hôte écoute le signal de spin envoyé par le client
        const wheelSpinListener = (snap) => {
            if (snap.val() === true) {
                state.roomRef.child('wheelSpin').off('value', wheelSpinListener);
                doSpin();
            }
        };
        if (state.roomRef) {
            state.roomRef.child('wheelSpin').on('value', wheelSpinListener);
        } else {
            // Pas de Firebase : le bouton spin reste côté hôte comme avant
            spinBtn.classList.remove('hidden');
            spinBtn.onclick = () => {
                state.roomRef && state.roomRef.child('wheelSpin').off('value', wheelSpinListener);
                doSpin();
            };
        }
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
    winnerNameEl.innerHTML = `
        <div class="results-stitch-tag">STITCH 2026</div>
        <div class="results-round-info">FIN DE SESSION</div>
        <h2 style="font-size: 4rem; color: white; margin-top: 20px;">${winner.name.toUpperCase()}</h2>
    `;
    winnerMsgEl.innerHTML = `<div style="font-size: 2.5rem; font-weight: 900; color: white;">FÉLICITATIONS !</div>`;

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

window.addEventListener('load', () => {
    // NE PAS re-remplir le code du dernier salon : l'utilisateur veut un champ vide avec curseur déjà dedans
    // (ancienne logique localStorage supprimée intentionnellement)
});

