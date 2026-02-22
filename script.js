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

// Firebase Connection Monitor moved after state initialization

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
            { artist: 'La Rvfleuze', title: 'Argent Sale', hints: [] },
            { artist: 'Ninho', title: 'Mamacita', hints: [] },
            { artist: 'Ninho', title: 'Elle m\'a eu', hints: [] },
            { artist: 'PNL', title: 'Menace', hints: [] },
            { artist: 'R2', title: 'Ruinart', hints: [] },
            { artist: 'La Mano', title: 'I\'m Sorry', hints: [] },
            { artist: 'L2B', title: 'Overbooking', hints: [] },
            { artist: 'Nono La Grinta', title: 'Love You', hints: [] },
            { artist: 'Hamza', title: 'Kyky2Bondy', hints: [] },
            { artist: 'Dadju', title: 'Bob Marley', hints: [] },
            { artist: 'RNBoi', title: 'Avec Moi', hints: [] },
            { artist: 'Zola', title: 'Amber', hints: [] },
            { artist: 'Luigi', title: 'Système', hints: [] },
            { artist: 'Aya Nakamura', title: 'Baddies', hints: [] },
            { artist: 'Aupinard', title: 'Pénélope', hints: [] },
            { artist: 'Jul', title: 'Madame', hints: [] },
            { artist: 'A6el', title: 'J\'attends au Carrefour Market', hints: [] },
            { artist: 'Orelsan', title: 'La Quête', hints: [] },
            { artist: 'SDM', title: 'Pour Elle', hints: [] }
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
            { brand: 'Le Roi Lion', artist: 'Debbie Davis', title: 'L\'histoire de la vie', hints: ['Le Roi Lion', 'Aladdin', 'Tarzan', 'Mulan'] },
            { brand: 'Aladdin', artist: 'Karine Costa', title: 'Ce rêve bleu', hints: ['Aladdin', 'Cendrillon', 'La Belle au bois dormant', 'Hercule'] },
            { brand: 'La Petite Sirène', artist: 'Henri Salvador', title: 'Sous l\'océan', hints: ['La Petite Sirène', 'Pinocchio', 'Peter Pan', 'Dumbo'] },
            { brand: 'Pocahontas', artist: 'Laura Mayne', title: 'L\'air du vent', hints: ['Pocahontas', 'Mulan', 'La Princesse et la Grenouille', 'Vaiana'] },
            { brand: 'La Belle et la Bête', artist: 'Lucie Dolène', title: 'Histoire éternelle', hints: ['La Belle et la Bête', 'Blanche-Neige', 'Cendrillon', 'Bambi'] },
            { brand: 'Aladdin', artist: 'Richard Darbois', title: 'Prince Ali', hints: ['Aladdin', 'Hercule', 'Le Génie', 'Mulan'] },
            { brand: 'Aladdin', artist: 'Anthony Kavanagh', title: 'Je suis ton meilleur ami', hints: ['Aladdin', 'Toy Story', 'Hercule', 'Tarzan'] },
            { brand: 'Le Roi Lion', artist: 'Dimitri Rougeul', title: 'Je voudrais déjà être roi', hints: ['Le Roi Lion', 'Bambi', 'Pinocchio', 'Peter Pan'] },
            { brand: 'Frère des Ours', artist: 'Phil Collins', title: 'Je m\'en vais', hints: ['Frère des Ours', 'Tarzan', 'Le Roi Lion', 'Atlantide'] },
            { brand: 'La Reine des Neiges', artist: 'Anaïs Delva', title: 'Libérée, délivrée', hints: ['La Reine des Neiges', 'Raiponce', 'Vaiana', 'Rebelle'] },
            { brand: 'Raiponce', artist: 'Maeva Méline', title: 'Où est la vraie vie ?', hints: ['Raiponce', 'La Reine des Neiges', 'Cendrillon', 'Mulan'] },
            { brand: 'Vaiana', artist: 'Cerise Calixte', title: 'Le Bleu lumière', hints: ['Vaiana', 'Pocahontas', 'Mulan', 'Tarzan'] },
            { brand: 'Hercule', artist: 'Hercule Cast', title: 'De zéro en héros', hints: ['Hercule', 'Mulan', 'Tarzan', 'Aladdin'] },
            { brand: 'Toy Story', artist: 'Jean-Philippe Puymartin', title: 'Je suis ton ami', hints: ['Toy Story', 'Monstres & Cie', 'Cars', 'Ratatouille'] },
            { brand: 'Mulan', artist: 'Lauri Mayne', title: 'Comme un homme', hints: ['Mulan', 'Pocahontas', 'Hercule', 'Tarzan'] },
            { brand: 'Hercule', artist: 'Emmanuel Dahl', title: 'Je n\'ai pas d\'amour', hints: ['Hercule', 'Aladdin', 'Le Roi Lion', 'La Belle et la Bête'] },
            { brand: 'Le Roi Lion', artist: 'Hakuna Matata', title: 'Hakuna Matata', hints: ['Le Roi Lion', 'Bambi', 'Peter Pan', 'Aladdin'] },
            { brand: 'Le Bossu de Notre-Dame', artist: 'Francis Lalanne', title: 'Rien qu\'un jour', hints: ['Le Bossu de Notre-Dame', 'Hercule', 'Tarzan', 'Mulan'] },
            { brand: 'Hercule', artist: 'Mimi Félixine', title: 'Jamais je n\'avouerai', hints: ['Hercule', 'Mulan', 'La Belle et la Bête', 'Aladdin'] },
            { brand: 'Le Livre de la Jungle', artist: 'Jean Stout', title: 'Il en faut peu pour être heureux', hints: ['Le Livre de la Jungle', 'Le Roi Lion', 'Robin des Bois', 'Dumbo'] },
            { brand: 'Disney Noël', artist: 'Claude Bertrand', title: 'Petit-papa Noël', hints: ['Disney Noël', 'Mickey', 'Donald', 'Dingo'] },
            { brand: 'Les Aristochats', artist: 'José Bartel', title: 'Tout le monde veut devenir un cat', hints: ['Les Aristochats', 'Le Livre de la Jungle', 'Les 101 Dalmatiens', 'Dumbo'] },
            { brand: 'Blanche-Neige', artist: 'Rachel Pignot', title: 'Un jour mon prince viendra', hints: ['Blanche-Neige', 'Cendrillon', 'La Belle au bois dormant', 'Bambi'] },
            { brand: 'Alice au pays des merveilles', artist: 'Dominique Poulain', title: 'Au pays d\'Alice', hints: ['Alice au pays des merveilles', 'Cendrillon', 'Pinocchio', 'Bambi'] },
            { brand: 'Pinocchio', artist: 'Christiane Legrand', title: 'Quand on prie la bonne étoile', hints: ['Pinocchio', 'Peter Pan', 'Alice', 'Dumbo'] },
            { brand: 'Mary Poppins', artist: 'Michel Roux', title: 'Supercalifragilistic', hints: ['Mary Poppins', 'Le Livre de la Jungle', 'Alice', 'Peter Pan'] },
            { brand: 'Les 101 Dalmatiens', artist: 'Roger Carel', title: 'Cruella d\'enfer', hints: ['Les 101 Dalmatiens', 'Les Aristochats', 'Robin des Bois', 'Bambi'] },
            { brand: 'Les Aristochats', artist: 'Gérard Rinaldi', title: 'Des gammes et des arpèges', hints: ['Les Aristochats', 'La Belle au bois dormant', 'Cendrillon', 'Bambi'] },
            { brand: 'La Princesse et la Grenouille', artist: 'China Moses', title: 'Au bout du rêve', hints: ['La Princesse et la Grenouille', 'Vaiana', 'Mulan', 'Vaïana'] },
            { brand: 'Vaiana', artist: 'Anthony Kavanagh', title: 'Bling-Bling', hints: ['Vaiana', 'Zootopie', 'Cars', 'Volt'] },
            { brand: 'La Reine des Neiges 2', artist: 'Charlotte Hervieux', title: 'Dans un autre monde', hints: ['La Reine des Neiges 2', 'Vaiana', 'Rebelle', 'Coco'] },
            { brand: 'La Reine des Neiges', artist: 'Dany Boon', title: 'En été', hints: ['La Reine des Neiges', 'Toy Story', 'Cars', 'Zootopie'] },
            { brand: 'Le Roi Lion', artist: 'Michel Prudhomme', title: 'L\'amour brille sous les étoiles', hints: ['Le Roi Lion', 'Bambi', 'La Belle au bois dormant', 'Cendrillon'] },
            { brand: 'La Petite Sirène', artist: 'Sébastien Cast', title: 'Embrasse-la', hints: ['La Petite Sirène', 'Aladdin', 'Hercule', 'Tarzan'] },
            { brand: 'Pocahontas', artist: 'Patrick Fiori', title: 'L\'air du vent (Duo)', hints: ['Pocahontas', 'Mulan', 'Vaiana', 'Kuzco'] },
            { brand: 'Le Livre de la Jungle 2', artist: 'Hocine', title: 'Être un homme comme vous', hints: ['Le Livre de la Jungle 2', 'Le Roi Lion', 'Tarzan', 'Hercule'] },
            { brand: 'La Reine des Neiges 2', artist: 'Prisca Demarez', title: 'Où t\'en vas-tu ?', hints: ['La Reine des Neiges 2', 'Vaiana', 'Mulan', 'Pocahontas'] },
            { brand: 'Raiponce la série', artist: 'Camille Lou', title: 'L\'empire des ombres', hints: ['Raiponce la série', 'La Reine des Neiges', 'Mulan', 'Brave'] },
            { brand: 'La Reine des Neiges 2', artist: 'Olaf Cast', title: 'Quand je serai plus grand', hints: ['La Reine des Neiges 2', 'Zootopie', 'Toy Story', 'Cars'] },
            { brand: 'Hercule', artist: 'Hercule Muse', title: 'Le monde qui est le mien', hints: ['Hercule', 'Mulan', 'Aladdin', 'Tarzan'] },
            { brand: 'Tarzan', artist: 'Tarzan Cast', title: 'Entre deux mondes', hints: ['Tarzan', 'Le Roi Lion', 'Frère des ours', 'Dinausore'] },
            { brand: 'Tarzan', artist: 'Phil Collins', title: 'Enfant de l\'homme', hints: ['Tarzan', 'Kuzco', 'Atlantide', 'Treasure Planet'] },
            { brand: 'Kuzco', artist: 'Kuzco Cast', title: 'Un monde parfait', hints: ['Kuzco', 'Hercule', 'Aladdin', 'Mulan'] },
            { brand: 'Hercule', artist: 'Megara Cast', title: 'Jamais je n\'avouerai (Solo)', hints: ['Hercule', 'Aladdin', 'Mulan', 'Tarzan'] },
            { brand: 'Le Roi Lion', artist: 'Nala Cast', title: 'Soyez prêtes', hints: ['Le Roi Lion', 'Hercule', 'Aladdin', 'Pinocchio'] },
            { brand: 'La Petite Sirène', artist: 'Ursula Cast', title: 'Pauvres âmes en perdition', hints: ['La Petite Sirène', 'Blanche-Neige', 'Cendrillon', 'Bambi'] },
            { brand: 'La Belle et la Bête', artist: 'Gaston Cast', title: 'Gaston', hints: ['La Belle et la Bête', 'Hercule', 'Tarzan', 'Aladdin'] },
            { brand: 'Vaiana', artist: 'Vaiana Choers', title: 'Logo Te Pate', hints: ['Vaiana', 'Lilo & Stitch', 'Le Roi Lion', 'Tarzan'] },
            { brand: 'Vaiana', artist: 'Maui Cast', title: 'Pour les hommes', hints: ['Vaiana', 'Hercule', 'Tarzan', 'Zootopie'] },
            { brand: 'Coco', artist: 'Coco Cast', title: 'Un poco loco', hints: ['Coco', 'Encanto', 'Ratatouille', 'Luca'] }
        ],
        'rapfr': [
            {
                "artist": "Busta Flex",
                "title": "Pourquoi ?",
                "hints": [
                    "Busta Flex",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Suprême NTM",
                "title": "Ma Benz",
                "hints": [
                    "Suprême NTM",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Natty & Rohff",
                "title": "Le son qui tue",
                "hints": [
                    "Natty & Rohff",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Rohff",
                "title": "Sensation brave",
                "hints": [
                    "Rohff",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Ideal J",
                "title": "Le combat continue",
                "hints": [
                    "Ideal J",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Jacky et Ben-J",
                "title": "On fait les choses",
                "hints": [
                    "Jacky et Ben-J",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Oxmo Puccino",
                "title": "Le jour où tu partiras",
                "hints": [
                    "Oxmo Puccino",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Zoxea",
                "title": "La pression",
                "hints": [
                    "Zoxea",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Les Sages Poètes de la Rue",
                "title": "On inonde les ondes",
                "hints": [
                    "Les Sages Poètes de la Rue",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Ol Kainry",
                "title": "Lady",
                "hints": [
                    "Ol Kainry",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Doc Gynéco",
                "title": "Dans ma rue",
                "hints": [
                    "Doc Gynéco",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Passi",
                "title": "Le maton me guette",
                "hints": [
                    "Passi",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Diam's",
                "title": "Suzy 2003",
                "hints": [
                    "Diam's",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Doc Gynéco",
                "title": "Vanessa",
                "hints": [
                    "Doc Gynéco",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Sniper",
                "title": "Gravé dans la roche",
                "hints": [
                    "Sniper",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "La Fouine",
                "title": "Du ferme",
                "hints": [
                    "La Fouine",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Disiz",
                "title": "J'pète les plombs",
                "hints": [
                    "Disiz",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Psy 4 de la Rime",
                "title": "Le son des bandits",
                "hints": [
                    "Psy 4 de la Rime",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Soprano",
                "title": "A la bien",
                "hints": [
                    "Soprano",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "113",
                "title": "Tonton du bled",
                "hints": [
                    "113",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Fonky Family",
                "title": "Art de rue",
                "hints": [
                    "Fonky Family",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Saïan Supa Crew",
                "title": "Angela",
                "hints": [
                    "Saïan Supa Crew",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Oxmo Puccino",
                "title": "Avoir des potes",
                "hints": [
                    "Oxmo Puccino",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Jacky ft. Assia",
                "title": "5.9.1",
                "hints": [
                    "Jacky ft. Assia",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Kery James",
                "title": "Hardcore",
                "hints": [
                    "Kery James",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "MC Solaar",
                "title": "Caroline",
                "hints": [
                    "MC Solaar",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Neg' Marrons",
                "title": "Le bilan",
                "hints": [
                    "Neg' Marrons",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "La Clinique",
                "title": "Tout saigne",
                "hints": [
                    "La Clinique",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "Diam's",
                "title": "Jeune demoiselle",
                "hints": [
                    "Diam's",
                    "Rap FR",
                    "Classique"
                ]
            },
            {
                "artist": "IAM",
                "title": "Nés sous la même étoile",
                "hints": [
                    "IAM",
                    "Rap FR",
                    "Classique"
                ]
            }
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
            {
                "artist": "Générique",
                "title": "Dragon Ball",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Dragon Ball Z",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Olive et Tom",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Olive et Tom : le Retour",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Nicky Larson",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Chevaliers du Zodiaque",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Ken le Survivant",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Sailor Moon",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Ranma ½",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Goldorak",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Candy",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Juliette je t’aime",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Jeanne et Serge",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Max et Compagnie",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Le Collège fou fou fou",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Le Collège des ninjas",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Nadia, le secret de l’eau bleue",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Fly",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Muscleman",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Signé Cat’s Eyes",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "City Hunter",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Hokuto no Ken",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Dragon Ball GT",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Samouraïs de l’éternel",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Mondes engloutis",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Bisounours",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Jayce et les Conquérants de la lumière",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Ulysse 31",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Capitaine Flam",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "La Bande à Picsou",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Minipouss",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Snorky",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Gummi",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Inspecteur Gadget",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "MASK",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Tortues Ninja",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "G.I. Joe",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Cosmocats",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Bioman",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Maskman",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Liveman",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Spielvan",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "X-Or",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Winspector",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "VR Troopers",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Power Rangers",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Docteur Slump",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Lamu",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Sally la petite sorcière",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Papa longues jambes",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Princesse Sarah",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Rémi sans famille",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Georgie",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les 4 Filles du docteur March",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Misérables",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Cherry Miel",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Dare Dare Motus",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "S.O.S. Fantômes",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Aventures de Tintin",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Salut les Musclés",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Pas de pitié pour les croissants",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Hélène et les Garçons",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Premiers Baisers",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Le Miel et les Abeilles",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Filles d’à Côté",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "Les Nouvelles Filles d’à Côté",
                "hints": []
            },
            {
                "artist": "Générique",
                "title": "La Croisière Foll’Amour",
                "hints": []
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
        waitingMsg.innerHTML = "<div style='color:var(--accent-gold); font-size:1.5rem; font-weight:900;'>PARTIE TERMINÉE !</div>";
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
        if (theme === 'disney' || theme === 'clubdorothee') queryStr += " French";
        if (brand && theme === 'series') queryStr += " soundtrack";
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
    if (state.currentTheme === 'disney') {
        // Only the cartoon name for Disney
        if (state.currentSong.brand) targets.push(state.currentSong.brand);
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
    if (state.currentSong.hints && state.currentSong.hints.length && state.currentTheme !== 'disney') {
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

        const wheelExplanation = document.getElementById('wheel-explanation');
        if (wheelExplanation) wheelExplanation.classList.add('hidden');

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

                // Show explanation
                if (wheelExplanation) {
                    let text = "";
                    switch (modifier) {
                        case 'bonus1': text = "Le gagnant gagne +1 Point Bonus !"; break;
                        case 'bonus3': text = "INCROYABLE ! Le gagnant remporte +3 Points Bonus !"; break;
                        case 'double': text = "Points Doublés pour cette chanson !"; break;
                        case 'mystery': text = "La vitesse de la chanson est modifiée au hasard !"; break;
                        case 'fast': text = "Chrono de la mort ! Seulement 10 secondes pour trouver !"; break;
                        case 'steal': text = "Le gagnant vole 1 point à CHAQUE équipe ! 🏴‍☠️"; break;
                        case 'bomb': text = "BOMBE ! Une mauvaise réponse fait perdre -3 Points ! 💣"; break;
                    }
                    wheelExplanation.innerText = text;
                    wheelExplanation.classList.remove('hidden');
                }

                setTimeout(() => {
                    modal.classList.add('hidden');
                    if (wheelExplanation) wheelExplanation.classList.add('hidden');
                    resolve();
                }, 4000); // Laisse l'explication visible plus longtemps (4s au lieu de 1.5s)
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

window.addEventListener('load', () => {
    const lastRoom = localStorage.getItem("lastRoomId");
    if (lastRoom && lastRoom.length === 4) {
        if (document.getElementById('input-room-code')) {
            document.getElementById('input-room-code').value = lastRoom;
        }
    }
});
