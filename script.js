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

    songs: {
        '80s': [
            { artist: 'A-ha', title: 'Take on Me', brand: 'A-ha', hints: ['A-ha', 'Alphaville', 'Depeche Mode', 'Duran Duran'] },
            { artist: 'Michael Jackson', title: 'Billie Jean', brand: 'Michael Jackson', hints: ['Michael Jackson', 'Prince', 'Lionel Richie', 'Rick James'] },
            { artist: 'Queen', title: 'Another One Bites the Dust', brand: 'Queen', hints: ['Queen', 'The Police', 'Dire Straits', 'U2'] },
            { artist: 'Cyndi Lauper', title: 'Girls Just Want to Have Fun', brand: 'Cyndi Lauper', hints: ['Cyndi Lauper', 'Madonna', 'Tiffany', 'Belinda Carlisle'] },
            { artist: 'Eurythmics', title: 'Sweet Dreams (Are Made of This)', brand: 'Eurythmics', hints: ['Eurythmics', 'Soft Cell', 'Yazoo', 'Pet Shop Boys'] },
            { artist: 'Journey', title: 'Don\'t Stop Believin\'', brand: 'Journey', hints: ['Journey', 'Toto', 'Foreigner', 'Boston'] },
            { artist: 'Survivor', title: 'Eye of the Tiger', brand: 'Survivor', hints: ['Survivor', 'Europe', 'Van Halen', 'Bon Jovi'] },
            { artist: 'The Police', title: 'Every Breath You Take', brand: 'The Police', hints: ['The Police', 'Sting', 'Genesis', 'Phil Collins'] },
            { artist: 'Kenny Loggins', title: 'Footloose', brand: 'Kenny Loggins', hints: ['Kenny Loggins', 'Ray Parker Jr.', 'Huey Lewis', 'Billy Ocean'] },
            { artist: 'George Michael', title: 'Careless Whisper', brand: 'George Michael', hints: ['George Michael', 'Wham!', 'Spandau Ballet', 'Culture Club'] },
            { artist: 'Bonnie Tyler', title: 'Total Eclipse of the Heart', brand: 'Bonnie Tyler', hints: ['Bonnie Tyler', 'Celine Dion', 'Meat Loaf', 'Tina Turner'] },
            { artist: 'Whitney Houston', title: 'I Wanna Dance with Somebody', brand: 'Whitney Houston', hints: ['Whitney Houston', 'Chaka Khan', 'Donna Summer', 'Diana Ross'] },
            { artist: 'Tears for Fears', title: 'Everybody Wants to Rule the World', brand: 'Tears for Fears', hints: ['Tears for Fears', 'Simple Minds', 'The Cure', 'New Order'] },
            { artist: 'Kim Wilde', title: 'Kids in America', brand: 'Kim Wilde', hints: ['Kim Wilde', 'Blondie', 'Nena', 'Bananarama'] },
            { artist: 'Imagination', title: 'Just an Illusion', brand: 'Imagination', hints: ['Imagination', 'Kool & The Gang', 'Earth Wind & Fire', 'Chic'] }
        ],
        'poprock': [
            { artist: 'Imagine Dragons', title: 'Believer', brand: 'Imagine Dragons', hints: ['Imagine Dragons', 'Bastille', 'OneRepublic', 'Twenty One Pilots'] },
            { artist: 'Coldplay', title: 'Viva la Vida', brand: 'Coldplay', hints: ['Coldplay', 'Keane', 'Snow Patrol', 'The Killers'] },
            { artist: 'The Killers', title: 'Mr. Brightside', brand: 'The Killers', hints: ['The Killers', 'Franz Ferdinand', 'Arctic Monkeys', 'Kaiser Chiefs'] },
            { artist: 'Arctic Monkeys', title: 'Do I Wanna Know?', brand: 'Arctic Monkeys', hints: ['Arctic Monkeys', 'The Strokes', 'The Black Keys', 'Interpol'] },
            { artist: 'Radiohead', title: 'Creep', brand: 'Radiohead', hints: ['Radiohead', 'Muse', 'Placebo', 'Blur'] },
            { artist: 'Nirvana', title: 'Smells Like Teen Spirit', brand: 'Nirvana', hints: ['Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains'] },
            { artist: 'Red Hot Chili Peppers', title: 'Californication', brand: 'Red Hot Chili Peppers', hints: ['RHCP', 'Foo Fighters', 'Incubus', 'Audioslave'] },
            { artist: 'Linkin Park', title: 'In the End', brand: 'Linkin Park', hints: ['Linkin Park', 'Evanescence', 'Papa Roach', 'Limp Bizkit'] },
            { artist: 'Panic! At The Disco', title: 'High Hopes', brand: 'Panic! At The Disco', hints: ['Panic!', 'Fall Out Boy', 'Paramore', 'My Chemical Romance'] },
            { artist: 'Maneskin', title: 'Beggin\'', brand: 'Maneskin', hints: ['Maneskin', 'Greta Van Fleet', 'The White Stripes', 'Royal Blood'] },
            { artist: 'Kings of Leon', title: 'Use Somebody', brand: 'Kings of Leon', hints: ['Kings of Leon', 'The Fray', 'Lifehouse', 'Matchbox Twenty'] },
            { artist: 'Nickelback', title: 'How You Remind Me', brand: 'Nickelback', hints: ['Nickelback', '3 Doors Down', 'Puddle of Mudd', 'Staind'] },
            { artist: 'Green Day', title: 'Basket Case', brand: 'Green Day', hints: ['Green Day', 'Offspring', 'Blink-182', 'Sum 41'] },
            { artist: 'Oasis', title: 'Wonderwall', brand: 'Oasis', hints: ['Oasis', 'Blur', 'The Verve', 'Pulp'] },
            { artist: 'Bon Jovi', title: 'Livin\' on a Prayer', brand: 'Bon Jovi', hints: ['Bon Jovi', 'Guns N\' Roses', 'Aerosmith', 'Def Leppard'] }
        ],
        'disney': [
            { artist: 'Anaïs Delva', title: 'Libérée, délivrée', brand: 'La Reine des Neiges', hints: ['La Reine des Neiges', 'Vaiana', 'Raiponce', 'Rebelle'] },
            { artist: 'Jean-Philippe Puymartin', title: 'Je suis ton ami', brand: 'Toy Story', hints: ['Toy Story', 'Cars', 'Monstres & Cie', 'Le Monde de Nemo'] },
            { artist: 'Anthony Kavanagh', title: 'Je suis ton meilleur ami', brand: 'Aladdin', hints: ['Aladdin', 'Le Roi Lion', 'Hercule', 'Tarzan'] },
            { artist: 'Emmanuel Curtil', title: 'Je voudrais déjà être roi', brand: 'Le Roi Lion', hints: ['Le Roi Lion', 'Le Livre de la Jungle', 'Bambi', 'Dumbo'] },
            { artist: 'Claude Lombardo', title: 'Histoire éternelle', brand: 'La Belle et la Bête', hints: ['La Belle et la Bête', 'Cendrillon', 'Blanche Neige', 'La Petite Sirène'] },
            { artist: 'Bénédicte Lécroart', title: 'Partir là-bas', brand: 'La Petite Sirène', hints: ['La Petite Sirène', 'Pocahontas', 'Mulan', 'La Princesse et la Grenouille'] },
            { artist: 'Debbie Davis', title: 'L\'histoire de la vie', brand: 'Le Roi Lion', hints: ['Le Roi Lion', 'Frère des Ours', 'Tarzan', 'Dinosaure'] },
            { artist: 'Camille Lou', title: 'L\'air du vent', brand: 'Pocahontas', hints: ['Pocahontas', 'Mulan', 'Le Bossu de Notre Dame', 'Atlantide'] },
            { artist: 'Patrick Fiori', title: 'Comme un homme', brand: 'Mulan', hints: ['Mulan', 'Hercule', 'Tarzan', 'La Planète au Trésor'] },
            { artist: 'Cerise Calixte', title: 'Le Bleu Lumière', brand: 'Vaiana', hints: ['Vaiana', 'La Reine des Neiges', 'Encanto', 'Asha'] },
            { artist: 'Richard Darbois', title: 'Sous l\'Océan', brand: 'La Petite Sirène', hints: ['La Petite Sirène', 'Pinocchio', 'Peter Pan', 'Alice au Pays des Merveilles'] },
            { artist: 'Henri Salvador', title: 'Tout le monde veut devenir un cat', brand: 'Les Aristochats', hints: ['Les Aristochats', 'Robin des Bois', 'Merlin l\'Enchanteur', 'La Belle et le Clochard'] },
            { artist: 'Lauri Markkanen', title: 'Hakuna Matata', brand: 'Le Roi Lion', hints: ['Le Roi Lion', 'Timon & Pumbaa', 'Lilo & Stitch', 'Kuzco'] },
            { artist: 'Dalida', title: 'Ce rêve bleu', brand: 'Aladdin', hints: ['Aladdin', 'Hercule', 'Anastasia', 'Cendrillon'] },
            { artist: 'Michel Elias', title: 'Être un homme comme vous', brand: 'Le Livre de la Jungle', hints: ['Livre de la Jungle', 'Tarzan', 'Frère des Ours', 'Oliver et Compagnie'] }
        ],
        'rapfr': [
            { artist: 'Ninho', title: 'Lettre à une femme', brand: 'Ninho', hints: ['Ninho', 'Gazo', 'Tiakola', 'Hamza'] },
            { artist: 'Gazo', title: 'DIE', brand: 'Gazo', hints: ['Gazo', 'Freeze Corleone', 'Ziak', 'Central Cee'] },
            { artist: 'Damso', title: 'Signaler', brand: 'Damso', hints: ['Damso', 'Booba', 'Shay', 'Kalash'] },
            { artist: 'Paps & PNL', title: 'Au DD', brand: 'PNL', hints: ['PNL', 'DTF', 'Ademo', 'N.O.S'] },
            { artist: 'SDM', title: 'Bolide Allemand', brand: 'SDM', hints: ['SDM', 'Niska', 'Sch', 'Jul'] },
            { artist: 'Jul', title: 'Tchikita', brand: 'Jul', hints: ['Jul', 'L\'Algérino', 'Soolking', 'Naps'] },
            { artist: 'SCH', title: 'Fade Up', brand: 'SCH', hints: ['SCH', 'Hamza', 'PLK', 'Zola'] },
            { artist: 'Booba', title: '92i Veyron', brand: 'Booba', hints: ['Booba', 'Kaaris', 'Rohff', 'La Fouine'] },
            { artist: 'Orelsan', title: 'La terre est ronde', brand: 'Orelsan', hints: ['Orelsan', 'Lomepal', 'Vald', 'Nekfeu'] },
            { artist: 'Nekfeu', title: 'On verra', brand: 'Nekfeu', hints: ['Nekfeu', 'Alpha Wann', 'Dadju', 'Tayc'] },
            { artist: 'Manau', title: 'La Tribu de Dana', brand: 'Manau', hints: ['Manau', 'IAM', 'NTM', 'MC Solaar'] },
            { artist: 'IAM', title: 'Petit Frère', brand: 'IAM', hints: ['IAM', 'Fonky Family', 'Sniper', '113'] },
            { artist: 'Suprême NTM', title: 'Laisse pas traîner ton fils', brand: 'NTM', hints: ['NTM', 'Assassin', 'Ministère AMER', 'Passi'] },
            { artist: 'Diam\'s', title: 'La Boulette', brand: 'Diam\'s', hints: ['Diam\'s', 'Vitaa', 'Sheryfa Luna', 'Amel Bent'] },
            { artist: 'Sexion d\'Assaut', title: 'Désolé', brand: 'Sexion d\'Assaut', hints: ['Sexion d\'Assaut', 'Maître Gims', 'Black M', 'Lefa'] }
        ],
        'rapus': [
            { artist: 'Eminem', title: 'Lose Yourself', brand: 'Eminem', hints: ['Eminem', 'Dr. Dre', '50 Cent', 'Snoop Dogg'] },
            { artist: 'Drake', title: 'God\'s Plan', brand: 'Drake', hints: ['Drake', 'Travis Scott', 'Future', 'Lil Baby'] },
            { artist: 'Kendrick Lamar', title: 'HUMBLE.', brand: 'Kendrick Lamar', hints: ['Kendrick Lamar', 'J. Cole', 'ASAP Rocky', 'Tyler The Creator'] },
            { artist: 'Travis Scott', title: 'Goosebumps', brand: 'Travis Scott', hints: ['Travis Scott', 'Don Toliver', 'Lil Uzi Vert', 'Gunna'] },
            { artist: 'Post Malone', title: 'Rockstar', brand: 'Post Malone', hints: ['Post Malone', 'The Weeknd', 'Khalid', 'Juice WRLD'] },
            { artist: 'Kanye West', title: 'Stronger', brand: 'Kanye West', hints: ['Kanye West', 'Jay-Z', 'Pharrell', 'Kid Cudi'] },
            { artist: 'Coolio', title: 'Gangsta\'s Paradise', brand: 'Coolio', hints: ['Coolio', '2Pac', 'Notorious BIG', 'Ice Cube'] },
            { artist: 'Outkast', title: 'Hey Ya!', brand: 'Outkast', hints: ['Outkast', 'Gnarls Barkley', 'Usher', 'Nelly'] },
            { artist: '50 Cent', title: 'In Da Club', brand: '50 Cent', hints: ['50 Cent', 'The Game', 'Ludacris', 'T.I.'] },
            { artist: 'Doja Cat', title: 'Say So', brand: 'Doja Cat', hints: ['Doja Cat', 'Megan Thee Stallion', 'Cardi B', 'Nicki Minaj'] },
            { artist: 'Rihanna', title: 'Umbrella', brand: 'Rihanna', hints: ['Rihanna', 'Beyoncé', 'Alicia Keys', 'Ciara'] },
            { artist: 'The Weeknd', title: 'Blinding Lights', brand: 'The Weeknd', hints: ['The Weeknd', 'Bruno Mars', 'Justin Bieber', 'Harry Styles'] },
            { artist: 'Dr. Dre feat. Snoop Dogg', title: 'Still D.R.E.', brand: 'Dr. Dre', hints: ['Dr. Dre', 'Snoop Dogg', 'Xzibit', 'Nate Dogg'] },
            { artist: 'Lil Nas X', title: 'Old Town Road', brand: 'Lil Nas X', hints: ['Lil Nas X', 'Post Malone', 'DaBaby', 'Roddy Ricch'] },
            { artist: 'Wiz Khalifa', title: 'See You Again', brand: 'Wiz Khalifa', hints: ['Wiz Khalifa', 'Ty Dolla Sign', 'French Montana', 'Big Sean'] }
        ],
        'cartoons': [
            { artist: 'Noam', title: 'Goldorak', brand: 'Goldorak', hints: ['Goldorak', 'Albator', 'Ulysse 31', 'Capitaine Flam'] },
            { artist: 'Jean-Pierre Savelli', title: 'X-Or', brand: 'X-Or', hints: ['X-Or', 'Bioman', 'Spectreman', 'San Ku Kaï'] },
            { artist: 'Bernard Minet', title: 'Bioman', brand: 'Bioman', hints: ['Bioman', 'Flashman', 'Maskman', 'Spielvan'] },
            { artist: 'Marie Dauphin', title: 'Bibifoc', brand: 'Bibifoc', hints: ['Bibifoc', 'Clémentine', 'Les Mondes Engloutis', 'Maya l\'Abeille'] },
            { artist: 'Claude Valois', title: 'Cat\'s Eyes', brand: 'Cat\'s Eyes', hints: ['Cat\'s Eyes', 'Signé Cat\'s Eyes', 'Lupin III', 'City Hunter'] },
            { artist: 'Jean-Luc Azoulay', title: 'Inspecteur Gadget', brand: 'Inspecteur Gadget', hints: ['Gadget', 'Denver', 'TMNT', 'Mask'] },
            { artist: 'Valérie Barouille', title: 'Jeanne et Serge', brand: 'Jeanne et Serge', hints: ['Jeanne et Serge', 'Olive et Tom', 'Princesse Sarah', 'Lucile Amour et Rock n Roll'] },
            { artist: 'Cyril de la Patellière', title: 'Les Mystérieuses Cités d\'Or', brand: 'Cités d\'Or', hints: ['Cités d\'Or', 'Sherlock Holmes', 'Jayce', 'M.A.S.K.'] },
            { artist: 'Ariane', title: 'Dragon Ball', brand: 'Dragon Ball', hints: ['Dragon Ball', 'Dragon Ball Z', 'Saint Seiya', 'Ken le Survivant'] },
            { artist: 'Douchka', title: 'Mickey, Donald et moi', brand: 'Disney Channel', hints: ['Disney', 'Gummi Bears', 'DuckTales', 'Winnie the Pooh'] },
            { artist: 'Jacques Cardona', title: 'Les Entrechats', brand: 'Les Entrechats', hints: ['Les Entrechats', 'Les Snorky', 'Les Schtroumpfs', 'Les Bisounours'] },
            { artist: 'Nicky Larson Theme', title: 'Nicky Larson', brand: 'Nicky Larson', hints: ['Nicky Larson', 'City Hunter', 'Ranma 1/2', 'Sailor Moon'] },
            { artist: 'Pokémon Theme', title: 'Pokémon Theme', brand: 'Pokémon', hints: ['Pokémon', 'Digimon', 'Yu-Gi-Oh', 'BeyBlade'] },
            { artist: 'The Simpsons', title: 'Main Title', brand: 'Les Simpson', hints: ['Les Simpson', 'Futurama', 'Family Guy', 'South Park'] },
            { artist: 'SpongeBob SquarePants', title: 'Opening Theme', brand: 'Bob l\'Eponge', hints: ['SpongeBob', 'Patrick Star', 'Squidward', 'Sandy Cheeks'] }
        ],
        'movies': [
            { artist: 'John Williams', title: 'Star Wars Main Title', brand: 'Star Wars', hints: ['Star Wars', 'Indiana Jones', 'Jurassic Park', 'Superman'] },
            { artist: 'Hans Zimmer', title: 'He\'s a Pirate', brand: 'Pirates des Caraïbes', hints: ['Pirates des Caraïbes', 'Gladiator', 'Inception', 'Lion King'] },
            { artist: 'Ennio Morricone', title: 'Le Bon, la Brute et le Truand', brand: 'The Good, the Bad and the Ugly', hints: ['The Good...", "Once Upon a Time...', 'Cinema Paradiso', 'The Mission'] },
            { artist: 'Bill Conti', title: 'Gonna Fly Now', brand: 'Rocky', hints: ['Rocky', 'Rambo', 'Top Gun', 'Karate Kid'] },
            { artist: 'Danny Elfman', title: 'Batman Theme', brand: 'Batman', hints: ['Batman', 'Spider-Man', 'Flash', 'Wonder Woman'] },
            { artist: 'Monty Norman', title: 'James Bond Theme', brand: 'James Bond', hints: ['James Bond', 'Mission Impossible', 'Jason Bourne', 'Austin Powers'] },
            { artist: 'Ray Parker Jr.', title: 'Ghostbusters', brand: 'SOS Fantômes', hints: ['Ghostbusters', 'Gremlins', 'Back to the Future', 'The Goonies'] },
            { artist: 'Celine Dion', title: 'My Heart Will Go On', brand: 'Titanic', hints: ['Titanic', 'The Bodyguard', 'Ghost', 'Pretty Woman'] },
            { artist: 'Pharrell Williams', title: 'Happy', brand: 'Moi, Moche et Méchant 2', hints: ['Minions', 'Shrek', 'Toy Story', 'Madagascar'] },
            { artist: 'Adele', title: 'Skyfall', brand: 'James Bond', hints: ['James Bond', 'Quantum of Solace', 'Casino Royale', 'Spectre'] },
            { artist: 'Howard Shore', title: 'Concerning Hobbits', brand: 'Le Seigneur des Anneaux', hints: ['Lord of the Rings', 'The Hobbit', 'Harry Potter', 'Game of Thrones'] },
            { artist: 'Lalo Schifrin', title: 'Mission: Impossible', brand: 'Mission: Impossible', hints: ['Mission Impossible', 'Jason Bourne', 'Bond 007', 'Ocean\'s Eleven'] },
            { artist: 'Dick Dale', title: 'Misirlou', brand: 'Pulp Fiction', hints: ['Pulp Fiction', 'Kill Bill', 'Reservoir Dogs', 'Django Unchained'] },
            { artist: 'Alan Silvestri', title: 'Back to the Future Theme', brand: 'Retour vers le futur', hints: ['Retour vers le futur', 'Goonies', 'E.T.', 'Indiana Jones'] },
            { artist: 'Brad Fiedel', title: 'Terminator Theme', brand: 'Terminator', hints: ['Terminator', 'Robocop', 'Alien', 'Predator'] }
        ],
        'series': [
            { artist: 'Ramin Djawadi', title: 'Game of Thrones Main Title', brand: 'Game of Thrones', hints: ['Game of Thrones', 'The Witcher', 'Vikings', 'House of the Dragon'] },
            { artist: 'The Rembrandts', title: 'I\'ll Be There for You', brand: 'Friends', hints: ['Friends', 'How I Met Your Mother', 'Seinfeld', 'Modern Family'] },
            { artist: 'Cecilia Krull', title: 'My Life Is Going On', brand: 'La Casa de Papel', hints: ['La Casa de Papel', 'Elite', 'Vis a Vis', 'Lupin'] },
            { artist: 'Lazerhawk', title: 'Stranger Things Main Title', brand: 'Stranger Things', hints: ['Stranger Things', 'Dark', 'Black Mirror', '1899'] },
            { artist: 'Massive Attack', title: 'Teardrop', brand: 'Dr House', hints: ['Dr House', 'Grey\'s Anatomy', 'ER', 'Good Doctor'] },
            { artist: 'The Who', title: 'Won\'t Get Fooled Again', brand: 'Les Experts : Miami', hints: ['CSI: Miami', 'CSI', 'NCIS', 'Bones'] },
            { artist: 'Bear McCreary', title: 'The Walking Dead', brand: 'The Walking Dead', hints: ['The Walking Dead', 'Fear TWD', 'The Last of Us', 'American Horror Story'] },
            { artist: 'Frou Frou', title: 'Let Go', brand: 'Scrubs', hints: ['Scrubs', 'Grey\'s Anatomy', 'OC', 'Gossip Girl'] },
            { artist: 'Phantom Planet', title: 'California', brand: 'Newport Beach', hints: ['Newport Beach', 'Gossip Girl', '90210', 'One Tree Hill'] },
            { artist: 'Remy Zero', title: 'Save Me', brand: 'Smallville', hints: ['Smallville', 'Arrow', 'Flash', 'Supergirl'] },
            { artist: 'Lazlo Bane', title: 'Superman', brand: 'Scrubs', hints: ['Scrubs', 'Friends', 'The Office', 'Community'] },
            { artist: 'Alabama 3', title: 'Woke Up This Morning', brand: 'Les Soprano', hints: ['Les Soprano', 'The Wire', 'Boardwalk Empire', 'Oz'] },
            { artist: 'Nick Cave', title: 'Red Right Hand', brand: 'Peaky Blinders', hints: ['Peaky Blinders', 'Sons of Anarchy', 'Vikings', 'Sherlock'] },
            { artist: 'The Heights', title: 'How Do You Talk To An Angel', brand: 'Beverly Hills 90210', hints: ['Melrose Place', 'Beverly Hills', 'Dawson', 'Charmed'] },
            { artist: 'Paula Cole', title: 'I Don\'t Want to Wait', brand: 'Dawson', hints: ['Dawson', 'Felicity', 'Everwood', 'Buffy'] }
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





// Role Selection Logic
btnRoleHost.addEventListener('click', () => {
    state.role = 'host';
    state.roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    currentRoomIdSpan.innerText = state.roomId;
    roomCodeDisplay.classList.remove('hidden');

    // Create Room in Firebase
    if (window.firebase && firebase.apps.length) {
        state.roomRef = firebase.database().ref('rooms/' + state.roomId);
        state.roomRef.set({
            status: 'lobby',
            mode: state.gameMode,
            timestamp: Date.now()
        });

        // Listen for buzzer
        state.roomRef.child('buzz').on('value', (snapshot) => {
            const Val = snapshot.val();
            if (Val && state.isPlaying) {
                handleRemoteBuzz(Val.teamIdx);
            }
        });

        // Listen for answers (Mode Buttons)
        state.roomRef.child('answer').on('value', (snapshot) => {
            const Val = snapshot.val();
            if (Val) handleRemoteAnswer(Val);
        });
    }

    showScreen('home');
    // Ensure room code is visible
    roomCodeDisplay.classList.remove('hidden');
});

btnRolePlayer.addEventListener('click', () => {
    state.role = 'player';
    showScreen('player');
});

// Join Room Logic
// Auto-fetch Team Names when room code is entered
inputRoomCode.addEventListener('input', () => {
    const code = inputRoomCode.value.trim().toUpperCase();
    if (code.length === 4 && window.firebase) {
        const roomRef = firebase.database().ref('rooms/' + code);
        roomRef.child('teams').once('value', (snapshot) => {
            const teams = snapshot.val();
            if (teams && Array.isArray(teams)) {
                selectTeamJoin.innerHTML = '';
                teams.forEach((name, idx) => {
                    const opt = document.createElement('option');
                    opt.value = idx;
                    opt.innerText = name.toUpperCase();
                    selectTeamJoin.appendChild(opt);
                });
                console.log("Teams loaded for room:", code);
            }
        });
    }
});

// Join Room Logic
btnJoinRoom.addEventListener('click', () => {
    const code = inputRoomCode.value.trim().toUpperCase();
    if (code.length !== 4) return alert("Code invalide");

    state.roomId = code;
    state.myTeamIdx = parseInt(selectTeamJoin.value);

    if (window.firebase && firebase.apps.length) {
        state.roomRef = firebase.database().ref('rooms/' + state.roomId);

        // Listen for room state
        state.roomRef.on('value', (snapshot) => {
            const Val = snapshot.val();
            if (!Val) return console.log("Waiting for room...");
            updatePlayerInterface(Val);
        });

        playerLobby.classList.add('hidden');
        playerGame.classList.remove('hidden');
        playTone(880, 'sine', 0.2);
    } else {
        alert("Firebase n'est pas configuré. Vérifiez firebase-config.js");
    }
});

function updatePlayerInterface(roomData) {
    waitingMsg.className = 'player-status-indicator';

    if (roomData.status === 'playing') {
        waitingMsg.innerText = "À L'ÉCOUTE...";
        waitingMsg.classList.add('status-active');
        btnPlayerBuzz.classList.remove('hidden');
        playerChoices.classList.add('hidden');
        btnPlayerBuzz.disabled = false;
    } else if (roomData.status === 'buzzed') {
        btnPlayerBuzz.disabled = true;
        if (roomData.buzzerTeam === state.myTeamIdx) {
            waitingMsg.innerText = "C'EST À VOUS !";
            waitingMsg.classList.add('status-active');
            if (roomData.mode === 'buttons') {
                showPlayerChoices(roomData.choices);
            }
        } else {
            waitingMsg.innerText = (roomData.buzzerName || "Quelqu'un") + " a buzzé !";
            waitingMsg.classList.add('status-buzzed');
            btnPlayerBuzz.classList.add('hidden');
            playerChoices.classList.add('hidden');
        }
    } else {
        waitingMsg.innerText = "PRÉPAREZ-VOUS...";
        waitingMsg.classList.add('status-waiting');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    }
}

function showPlayerChoices(choices) {
    playerChoices.classList.remove('hidden');
    const btns = playerChoices.querySelectorAll('.choice-btn');
    choices.forEach((c, i) => {
        if (btns[i]) {
            btns[i].innerText = c;
            btns[i].onclick = () => {
                state.roomRef.child('answer').set({
                    teamIdx: state.myTeamIdx,
                    answer: c,
                    timestamp: Date.now()
                });
                playerChoices.classList.add('hidden');
                waitingMsg.innerText = "RÉPONSE ENVOYÉE !";
            };
        }
    });
}

btnPlayerBuzz.addEventListener('click', () => {
    if (!state.roomRef) return;
    
    // Attempt to get the real name if possible
    const myName = state.teams && state.teams[state.myTeamIdx] ? state.teams[state.myTeamIdx].name : `Équipe ${state.myTeamIdx + 1}`;
    
    state.roomRef.child('buzz').set({
        teamIdx: state.myTeamIdx,
        name: myName,
        time: Date.now()
    });
});

// Mode Selection Logic (Host)
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gameMode = btn.getAttribute('data-mode');
        if (state.roomRef) {
            state.roomRef.update({ mode: state.gameMode });
        }
    });
});


// Audio Setup (using iTunes API)
const audioPlayer = new Audio();
let audioContext = null;

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

audioPlayer.addEventListener('play', () => {
    audioPlayer.playbackRate = state.mysteryRate;
});
audioPlayer.addEventListener('playing', () => {
    audioPlayer.playbackRate = state.mysteryRate;
});

// Initialization
function setup() {
    updateScores();

    navHome.addEventListener('click', () => {
        window.location.reload();
    });

    btnCreateTeams.addEventListener('click', () => {
        modalTeams.classList.add('active');
    });

    // Team selection buttons in modal
    const countBtns = document.querySelectorAll('.count-btn');
    countBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            countBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.teamCount = parseInt(btn.getAttribute('data-count'));

            // Toggle input visibility
            for (let i = 1; i <= 4; i++) {
                document.getElementById(`input-team-${i}`).classList.toggle('hidden', i > state.teamCount);
            }
        });
    });

    btnStartGame.addEventListener('click', () => {
        startGame();
    });

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            state.currentTheme = card.getAttribute('data-theme');
            startRound();
        });
    });

    btnCorrect.addEventListener('click', () => victory());
    btnWrong.addEventListener('click', () => defeat());
}

function showScreen(name) {
    Object.keys(screens).forEach(key => {
        if (screens[key]) screens[key].classList.toggle('active', key === name);
    });
    state.screen = name;
}

function updateScores() {
    for (let i = 0; i < 4; i++) {
        const chip = document.getElementById(`score-team-${i + 1}`);
        const block = document.getElementById(`block-team-${i + 1}`);

        if (i < state.teamCount) {
            chip.innerText = `${state.teams[i].name} : ${state.teams[i].score}`;
            chip.classList.remove('hidden');
            if (block) block.classList.remove('hidden');
        } else {
            chip.classList.add('hidden');
            if (block) block.classList.add('hidden');
        }
    }
}

async function startRound() {
    showScreen('game');
    nextSong();
}

async function fetchPreview(artist, title, theme, brand) {
    try {
        const query = `${artist} ${title}`;
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return {
                audio: data.results[0].previewUrl,
                cover: data.results[0].artworkUrl100.replace('100x100', '400x400')
            };
        }
        return null;
    } catch (e) {
        console.error("Fetch error", e);
        return null;
    }
}

async function nextSong() {
    if (state.interval) clearInterval(state.interval);
    state.isPlaying = false;
    audioPlayer.pause();

    // Reset modifier effects
    state.mysteryRate = 1.0;
    state.speedBonusActive = false;
    audioPlayer.playbackRate = 1.0;
    audioPlayer.defaultPlaybackRate = 1.0;

    // Check for Wheel of Fate trigger (every 3 to 5 songs)
    if (!state.songsUntilWheel) state.songsUntilWheel = Math.floor(Math.random() * 3) + 3;

    state.songsUntilWheel--;
    if (state.songsUntilWheel <= 0) {
        const mods = ['double', 'mystery', 'bonus1', 'bonus3', 'fast', 'steal', 'bomb'];
        state.currentModifier = mods[Math.floor(Math.random() * mods.length)];
        await launchWheelOfFate(state.currentModifier);

        // Apply visual and logic for modifier
        modifierBadge.classList.remove('hidden', 'modifier-double', 'modifier-mystery', 'modifier-bonus1', 'modifier-bonus3', 'modifier-fast', 'modifier-steal');
        modifierBadge.classList.add(`modifier-${state.currentModifier}`);

        let label = "Bonus";
        if (state.currentModifier === 'double') label = "Points Doubles 🔥";
        if (state.currentModifier === 'mystery') {
            label = "Vitesse Mystère 🌀";
            state.mysteryRate = Math.random() < 0.5 ? 0.75 : 1.35;
        }
        if (state.currentModifier === 'bonus1') label = "Surprise +1 🎁";
        if (state.currentModifier === 'bonus3') label = "Ultra +3 💎";
        if (state.currentModifier === 'fast') label = "Chrono 10s ⏱️";
        if (state.currentModifier === 'steal') label = "Le Voleur de Points 🏴‍☠️";
        if (state.currentModifier === 'bomb') label = "La Bombe 💣";

        modifierBadge.innerText = label;
        state.songsUntilWheel = Math.floor(Math.random() * 3) + 3;
    } else {
        modifierBadge.classList.add('hidden');
        state.currentModifier = null;
    }

    const activeTheme = state.currentTheme === 'random' ?
        Object.keys(state.songs)[Math.floor(Math.random() * Object.keys(state.songs).length)] :
        state.currentTheme;

    const themeSongs = state.songs[activeTheme];
    let availableSongs = themeSongs.filter(s => !state.playedSongs.includes(s.title) && !state.failedSongs.includes(s.title));

    if (availableSongs.length === 0) {
        showResults();
        return;
    }

    let attempts = 0;
    let result = null;

    while (!result && attempts < 10) {
        state.currentSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
        result = await fetchPreview(state.currentSong.artist, state.currentSong.title, activeTheme, state.currentSong.brand);

        if (!result || !result.audio) {
            attempts++;
            console.warn(`Song unavailable: ${state.currentSong.title}. Retrying...`);
            if (!state.failedSongs.includes(state.currentSong.title)) {
                state.failedSongs.push(state.currentSong.title);
            }
            availableSongs = themeSongs.filter(s => !state.playedSongs.includes(s.title) && !state.failedSongs.includes(s.title));
            if (availableSongs.length === 0) break;
        }
    }

    if (!result) {
        showResults();
        return;
    }

    state.playedSongs.push(state.currentSong.title);
    revealArtist.innerText = state.currentSong.artist;
    revealTitle.innerText = state.currentSong.title;
    document.querySelector('.mini-cover').style.backgroundImage = `url(${result.cover})`;

    audioPlayer.src = result.audio;

    // Apply speed if mystery
    audioPlayer.defaultPlaybackRate = state.mysteryRate;
    audioPlayer.playbackRate = state.mysteryRate;

    audioPlayer.play();

    state.isPlaying = true;
    state.timer = state.currentModifier === 'fast' ? 10 : 30;
    countdownEl.innerText = state.timer;
    revealCard.classList.add('hidden');
    btnNext.classList.add('hidden');
    bravoContainer.innerHTML = '';
    validationControls.classList.remove('hidden');

    // Notify Players
    if (state.roomRef) {
        const choices = generateChoices(state.currentSong);
        state.roomRef.update({
            status: 'playing',
            buzzerTeam: null,
            choices: choices
        });
        // Clear buzzes from previous round
        state.roomRef.child('buzz').set(null);
        state.roomRef.child('answer').set(null);
    }

    state.interval = setInterval(() => {
        state.timer--;
        countdownEl.innerText = state.timer;
        if (state.timer <= 0) {
            audioPlayer.pause();
            clearInterval(state.interval);
            state.isPlaying = false;
            defeat("Temps écoulé ! ⏰");
        }
    }, 1000);
}

function generateChoices(correct) {
    let pool = [correct.artist];
    let others = correct.hints.filter(h => h !== correct.artist);
    // Shuffle and pick 3
    others.sort(() => Math.random() - 0.5);
    pool.push(...others.slice(0, 3));
    return pool.sort(() => Math.random() - 0.5);
}

function handleRemoteBuzz(teamIdx) {
    if (!state.isPlaying) return;
    audioPlayer.pause();
    state.isPlaying = false;
    clearInterval(state.interval);

    lastBuzzedTeam = teamIdx;

    if (state.roomRef) {
        state.roomRef.update({
            status: 'buzzed',
            buzzerTeam: teamIdx,
            buzzerName: state.teams[teamIdx].name
        });
    }

    // Small delay to let users see who buzzed
    setTimeout(() => {
        if (state.gameMode === 'oral') {
            victory();
        }
    }, 800);
}

function handleRemoteAnswer(data) {
    if (state.screen !== 'game') return;
    if (data.teamIdx === lastBuzzedTeam) {
        if (data.answer === state.currentSong.artist) {
            victory();
        } else {
            defeat();
        }
    }
}

function victory() {
    state.isPlaying = false;
    audioPlayer.pause();
    clearInterval(state.interval);

    const teamIdx = lastBuzzedTeam !== null ? lastBuzzedTeam : 0;

    // Streak Logic
    if (teamIdx === state.streakTeam) {
        state.streakCount++;
    } else {
        state.streakTeam = teamIdx;
        state.streakCount = 1;
    }

    let basePoints = 1;
    if (state.streakCount >= 7) {
        basePoints = 5;
    } else if (state.streakCount >= 3) {
        basePoints = 3;
    }

    // Modifier Logic
    let finalPoints = basePoints;
    if (state.currentModifier === 'double') finalPoints *= 2;
    if (state.currentModifier === 'bonus1') finalPoints += 1;
    if (state.currentModifier === 'bonus3') finalPoints += 3;

    // Joker Quitte ou Double
    if (state.activeJoker === teamIdx) {
        finalPoints *= 2;
        const btn = document.getElementById(`joker-${teamIdx + 1}`);
        btn.classList.add('used');
        btn.classList.remove('active');
        state.activeJoker = null;
    }

    // Special: Steal points from others
    if (state.currentModifier === 'steal') {
        state.teams.forEach((t, i) => {
            if (i !== teamIdx && t.score > 0) {
                t.score -= 1;
                spawnPenalty(i, "-1");
            }
        });
    }

    state.teams[teamIdx].score += finalPoints;

    updateScores();
    displayFeedback("GÉNIAL ! ✅", "feedback-bravo");
    spawnParticles(teamIdx, finalPoints > 1 ? `+${finalPoints}` : "+1");

    // Speed Bonus Visual
    if (state.speedBonusActive) {
        const bonusTxt = document.createElement('div');
        bonusTxt.className = 'speed-bonus-text';
        bonusTxt.innerText = "BONUS DE VITESSE ! ⚡";
        bravoContainer.appendChild(bonusTxt);
        state.speedBonusActive = false;
    }

    revealCard.classList.remove('hidden');
    validationControls.classList.add('hidden');
    btnNext.classList.remove('hidden');

    if (state.roomRef) {
        state.roomRef.update({ status: 'lobby' });
    }
}

function defeat(message) {
    state.isPlaying = false;
    audioPlayer.pause();
    clearInterval(state.interval);

    let finalPoints = 0;
    // Penalty logic for specific modifiers
    if (state.currentModifier === 'bomb') {
        if (lastBuzzedTeam !== null) {
            state.teams[lastBuzzedTeam].score = Math.max(0, state.teams[lastBuzzedTeam].score - 3);
            spawnPenalty(lastBuzzedTeam, "-3");
        }
    }

    // Joker Penalty
    if (state.activeJoker !== null) {
        const teamIdx = state.activeJoker;
        state.teams[teamIdx].score = Math.max(0, state.teams[teamIdx].score - 2);
        const btn = document.getElementById(`joker-${teamIdx + 1}`);
        btn.classList.add('used');
        btn.classList.remove('active');
        state.activeJoker = null;
        spawnPenalty(teamIdx, "-2");
    }

    state.streakTeam = null;
    state.streakCount = 0;

    updateScores();
    displayFeedback(message || "DOMMAGE... ❌", "feedback-dommage");

    revealCard.classList.remove('hidden');
    validationControls.classList.add('hidden');
    btnNext.classList.remove('hidden');

    if (state.roomRef) {
        state.roomRef.update({ status: 'lobby' });
    }
}

function spawnParticles(teamIdx, label) {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'particle';
            p.innerHTML = `<span class="bonus-label">${label}</span>`;
            p.style.left = (Math.random() * 100) + 'vw';
            p.style.fontSize = (Math.random() * 1 + 1) + 'rem';
            p.style.animationDuration = (Math.random() * 2 + 2) + 's';
            p.style.setProperty('--drift', (Math.random() * 400 - 200) + 'px');
            p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
            document.body.appendChild(p);

            p.addEventListener('animationend', () => p.remove());
        }, i * 100);
    }
}

function spawnPenalty(teamIdx, label) {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'particle';
            p.innerHTML = `<span class="penalty-label">${label}</span>`;
            p.style.left = (Math.random() * 80 + 10) + 'vw';
            p.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
            p.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
            p.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
            document.body.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }, i * 150);
    }
}


function displayFeedback(text, className) {
    bravoContainer.innerHTML = '';
    const feedback = document.createElement('div');
    feedback.className = `feedback-text ${className}`;
    feedback.innerText = text;
    bravoContainer.appendChild(feedback);
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
    if (state.activeJoker === teamIdx) {
        state.activeJoker = null;
        btn.classList.remove('active');
        playTone(330, 'sine', 0.1);
    } else if (state.activeJoker === null) {
        state.activeJoker = teamIdx;
        btn.classList.add('active');
        playTone(880, 'sine', 0.1);
    }
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
            { id: 'steal', label: 'Pirate 🏴‍C ️' },
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
}


function restartGame() {
    state.teams.forEach(t => t.score = 0);
    state.round = 0;
    state.playedSongs = [];
    document.querySelectorAll('.joker-btn').forEach(btn => btn.classList.remove('used', 'active'));
    updateScores();
    showScreen('home');
}

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

setup();
