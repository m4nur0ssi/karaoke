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
            { artist: 'Michael Jackson', title: 'Billie Jean', hints: ['Prince', 'Michael Jackson', 'Lionel Richie', 'Rick James'] },
            { artist: 'A-ha', title: 'Take On Me', hints: ['A-ha', 'Depeche Mode', 'Duran Duran', 'Erasure'] },
            { artist: 'Madonna', title: 'Like a Virgin', hints: ['Madonna', 'Cyndi Lauper', 'Whitney Houston', 'Cher'] },
            { artist: 'Queen', title: 'Another One Bites the Dust', hints: ['Queen', 'The Who', 'Pink Floyd', 'Yes'] },
            { artist: 'Prince', title: 'Purple Rain', hints: ['Prince', 'Rick James', 'Morris Day', 'Michael Jackson'] },
            { artist: 'Wham!', title: 'Wake Me Up Before You Go-Go', hints: ['Wham!', 'Culture Club', 'Spandau Ballet', 'Erasure'] },
            { artist: 'Cyndi Lauper', title: 'Girls Just Want to Have Fun', hints: ['Cyndi Lauper', 'Madonna', 'The Go-Go\'s', 'Blondie'] },
            { artist: 'Journey', title: 'Don\'t Stop Believin\'', hints: ['Journey', 'Foreigner', 'Boston', 'Styx'] },
            { artist: 'Eurythmics', title: 'Sweet Dreams', hints: ['Eurythmics', 'Yazoo', 'Soft Cell', 'Depeche Mode'] },
            { artist: 'The Police', title: 'Every Breath You Take', hints: ['The Police', 'U2', 'Sting', 'The Cars'] },
            { artist: 'Bon Jovi', title: 'Livin\' on a Prayer', hints: ['Bon Jovi', 'Guns N\' Roses', 'Def Leppard', 'Poison'] },
            { artist: 'Whitney Houston', title: 'I Wanna Dance with Somebody', hints: ['Whitney Houston', 'Tina Turner', 'Chaka Khan', 'Diana Ross'] },
            { artist: 'Guns N\' Roses', title: 'Sweet Child O\' Mine', hints: ['Guns N\' Roses', 'Aerosmith', 'Metallica', 'Mötley Crüe'] },
            { artist: 'Tears for Fears', title: 'Everybody Wants to Rule the World', hints: ['Tears for Fears', 'Simple Minds', 'The Cure', 'New Order'] },
            { artist: 'U2', title: 'With or Without You', hints: ['U2', 'The Smiths', 'Echo & the Bunnymen', 'R.E.M.'] },
            { artist: 'Lionel Richie', title: 'All Night Long', hints: ['Lionel Richie', 'Stevie Wonder', 'Kool & The Gang', 'Earth, Wind & Fire'] },
            { artist: 'Simple Minds', title: 'Don\'t You (Forget About Me)', hints: ['Simple Minds', 'The Psychedelic Furs', 'Echo & the Bunnymen', 'The Cure'] },
            { artist: 'Duran Duran', title: 'Hungry Like the Wolf', hints: ['Duran Duran', 'Spandau Ballet', 'The Human League', 'ABC'] },
            { artist: 'Survivor', title: 'Eye of the Tiger', hints: ['Survivor', 'Europe', 'Van Halen', 'Asia'] },
            { artist: 'Phil Collins', title: 'In the Air Tonight', hints: ['Phil Collins', 'Peter Gabriel', 'Genesis', 'Steve Winwood'] },
            { artist: 'Bryan Adams', title: 'Summer of \'69', hints: ['Bryan Adams', 'Bruce Springsteen', 'John Mellencamp', 'Tom Petty'] },
            { artist: 'Bruce Springsteen', title: 'Born in the U.S.A.', hints: ['Bruce Springsteen', 'Bob Seger', 'John Mellencamp', 'Billy Joel'] },
            { artist: 'Dexys Midnight Runners', title: 'Come On Eileen', hints: ['Dexys Midnight Runners', 'The Specials', 'Madness', 'The Beat'] },
            { artist: 'Culture Club', title: 'Karma Chameleon', hints: ['Culture Club', 'Wham!', 'Duran Duran', 'Thompson Twins'] },
            { artist: 'Rick Astley', title: 'Never Gonna Give You Up', hints: ['Rick Astley', 'Kylie Minogue', 'Jason Donovan', 'Bananarama'] },
            { artist: 'Van Halen', title: 'Jump', hints: ['Van Halen', 'Europe', 'Quiet Riot', 'Skid Row'] },
            { artist: 'Kim Wilde', title: 'Kids in America', hints: ['Kim Wilde', 'Nena', 'Toyah', 'Hazel O\'Connor'] },
            { artist: 'Talking Heads', title: 'Burning Down the House', hints: ['Talking Heads', 'The B-52\'s', 'Television', 'The Cars'] },
            { artist: 'Bananarama', title: 'Cruel Summer', hints: ['Bananarama', 'The Bangles', 'Belle Stars', 'Go-Go\'s'] },
            { artist: 'The Bangles', title: 'Walk Like an Egyptian', hints: ['The Bangles', 'The Go-Go\'s', 'Bananarama', 'The Waitresses'] },
            { artist: 'Starship', title: 'We Built This City', hints: ['Starship', 'Jefferson Starship', 'REO Speedwagon', 'Heart'] },
            { artist: 'Pet Shop Boys', title: 'West End Girls', hints: ['Pet Shop Boys', 'Erasure', 'The Communards', 'New Order'] },
            { artist: 'Soft Cell', title: 'Tainted Love', hints: ['Soft Cell', 'Depeche Mode', 'Human League', 'Visage'] },
            { artist: 'Spandau Ballet', title: 'True', hints: ['Spandau Ballet', 'Duran Duran', 'ABC', 'Ultravox'] },
            { artist: 'George Michael', title: 'Careless Whisper', hints: ['George Michael', 'Sting', 'Boy George', 'Elton John'] },
            { artist: 'Depeche Mode', title: 'Enjoy the Silence', hints: ['Depeche Mode', 'New Order', 'The Cure', 'Pet Shop Boys'] },
            { artist: 'The Smiths', title: 'There Is a Light That Never Goes Out', hints: ['The Smiths', 'Morrissey', 'The Cure', 'Joy Division'] },
            { artist: 'Modern Talking', title: 'You\'re My Heart, You\'re My Soul', hints: ['Modern Talking', 'Bad Boys Blue', 'C.C. Catch', 'Sandra'] },
            { artist: 'Scorpions', title: 'Still Loving You', hints: ['Scorpions', 'Whitesnake', 'Deep Purple', 'Iron Maiden'] },
            { artist: 'Alphaville', title: 'Forever Young', hints: ['Alphaville', 'Laura Branigan', 'Berlin', 'A-ha'] },
            { artist: 'Europe', title: 'The Final Countdown', hints: ['Europe', 'Survivor', 'Asia', 'Boston'] },
            { artist: 'Tina Turner', title: 'What\'s Love Got to Do with It', hints: ['Tina Turner', 'Aretha Franklin', 'Diana Ross', 'Gloria Gaynor'] },
            { artist: 'ZZ Top', title: 'Gimme All Your Lovin\'', hints: ['ZZ Top', 'Van Halen', 'AC/DC', 'Def Leppard'] },
            { artist: 'Katrina and the Waves', title: 'Walking on Sunshine', hints: ['Katrina and the Waves', 'Cyndi Lauper', 'Tiffany', 'Belinda Carlisle'] },
            { artist: 'Berlin', title: 'Take My Breath Away', hints: ['Berlin', 'Heart', 'Roxette', 'Laura Branigan'] },
            { artist: 'Foreigner', title: 'I Want to Know What Love Is', hints: ['Foreigner', 'Chicago', 'TOTO', 'REO Speedwagon'] },
            { artist: 'Toto', title: 'Africa', hints: ['Toto', 'Asia', 'Genesis', 'Fleetwood Mac'] },
            { artist: 'Michael Sembello', title: 'Maniac', hints: ['Michael Sembello', 'Irene Cara', 'Kenny Loggins', 'Giorgio Moroder'] },
            { artist: 'Kenny Loggins', title: 'Footloose', hints: ['Kenny Loggins', 'Footloose', 'Flashdance', 'Dirty Dancing'] },
            { artist: 'Billy Idol', title: 'Rebel Yell', hints: ['Billy Idol', 'Alice Cooper', 'Iggy Pop', 'David Bowie'] }
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
            { artist: 'NTM', title: 'La fièvre', hints: ['IAM', 'NTM', 'Assassin', 'Fabe'] },
            { artist: 'Assassin', title: "L'odyssée suit son cours", hints: ['Assassin', 'Ministère A.M.E.R', 'Ideal J', 'Sages Poètes'] },
            { artist: 'Fabe', title: 'Rien ne change', hints: ['Fabe', 'Koma', 'Scred Connexion', 'Oxmo Puccino'] },
            { artist: 'Akhenaton', title: 'Métèque et mat', hints: ['Akhenaton', 'Shurik\'n', 'Freeman', 'IAM'] },
            { artist: 'IAM', title: "L'École du micro d'argent", hints: ['IAM', 'NTM', 'Fonky Family', 'Sniper'] },
            { artist: 'Oxmo Puccino', title: "L'enfant seul", hints: ['Oxmo', 'Booba', 'Lino', 'Pit Baccardi'] },
            { artist: 'Lunatic', title: 'Mauvais Œil', hints: ['Booba', 'Ali', 'Lunatic', 'La Cliqua'] },
            { artist: 'Ministère A.M.E.R.', title: 'Sacrifice de Poulet', hints: ['Passi', 'Stomy Bugsy', 'Gyneco', 'JoeyStarr'] },
            { artist: 'Fonky Family', title: 'Mystère et suspense', hints: ['FF', 'IAM', '3ème Œil', 'Psy 4 de la Rime'] },
            { artist: 'Kery James', title: "Si c'était à refaire...", hints: ['Kery James', 'Rohff', 'Diam\'s', 'Rim\'K'] },
            { artist: 'Tandem', title: '93 Hardcore', hints: ['Mac Tyer', 'Mac Kregor', 'Booba', 'Rohff'] },
            { artist: 'Booba', title: 'Destinée', hints: ['Booba', 'Kaaris', 'La Fouine', 'Sinik'] },
            { artist: 'Rohff', title: 'En mode', hints: ['Rohff', 'Booba', 'Lafouine', 'Rim\'K'] },
            { artist: 'Diam\'s', title: 'La Boulette', hints: ['Diam\'s', 'Vitaa', 'Shy\'m', 'Amel Bent'] },
            { artist: 'La Fouine', title: 'Du ferme', hints: ['La Fouine', 'Rohff', 'Booba', 'Soprano'] },
            { artist: 'Youssoupha', title: 'Éternel recommencement', hints: ['Youssoupha', 'Medine', 'Kery James', 'Disiz'] },
            { artist: 'Sexion d\'Assaut', title: 'Désolé', hints: ['Gims', 'Black M', 'Lefa', 'Barack Adama'] },
            { artist: 'Orelsan', title: 'La Terre est ronde', hints: ['Orelsan', 'Gringe', 'Casseurs Fluxters', 'Vald'] },
            { artist: 'Nekfeu', title: 'On verra', hints: ['Nekfeu', 'Alpha Wann', 'Sneazzy', 'Lomepal'] },
            { artist: 'Damso', title: 'Macarena', hints: ['Damso', 'Hamza', 'Shay', 'Niska'] },
            { artist: 'Jul', title: 'Tchikita', hints: ['Jul', 'Naps', 'Alonzo', 'SCH'] },
            { artist: 'PNL', title: 'Au DD', hints: ['PNL', 'Ademo', 'N.O.S', 'DTF'] },
            { artist: 'Ninho', title: 'Lettre à une femme', hints: ['Ninho', 'Gazo', 'Tiakola', 'SDM'] },
            { artist: 'Gazo', title: 'DIE', hints: ['Gazo', 'Central Cee', 'Zola', 'Koba LaD'] },
            { artist: 'Vald', title: 'Désaccordé', hints: ['Vald', 'Orelsan', 'Lorenzo', 'Soolking'] },
            { artist: 'Lomepal', title: 'Trop beau', hints: ['Lomepal', 'Romeo Elvis', 'Angèle', 'Eddy de Pretto'] },
            { artist: 'Dinos', title: 'Helsinki', hints: ['Dinos', 'Laylow', 'Josman', 'Alpha Wann'] },
            { artist: 'Alpha Wann', title: 'LE PIÈGE', hints: ['Alpha Wann', 'Nekfeu', 'Freeze Corleone', 'Infinit'] },
            { artist: 'Freeze Corleone', title: 'Freeze Raël', hints: ['Freeze', 'Gazo', 'ASHE 22', 'Ziak'] },
            { artist: 'SCH', title: 'A7', hints: ['SCH', 'Jul', 'Naps', 'Soso Maness'] },
            { artist: 'Hamza', title: 'Fade Up', hints: ['Hamza', 'SCH', 'Zola', 'SDM'] },
            { artist: 'SDM', title: 'Bolide Allemand', hints: ['SDM', 'Ninho', 'Booba', 'PLK'] },
            { artist: 'PLK', title: 'Petrouchka', hints: ['PLK', 'Soso Maness', 'Landy', 'Maes'] },
            { artist: 'Maes', title: 'Madrina', hints: ['Maes', 'Booba', 'Ninho', 'Lacrim'] },
            { artist: 'Zola', title: 'Amber', hints: ['Zola', 'Gazo', 'Koba LaD', 'Gambi'] },
            { artist: 'Tiakola', title: 'Meuda', hints: ['Tiakola', 'Gazo', 'Niska', 'Hamza'] },
            { artist: 'Niska', title: 'Réseaux', hints: ['Niska', 'MHD', 'Gradur', 'Kalash'] },
            { artist: 'Gradur', title: 'Sheguey 10', hints: ['Gradur', 'Niska', 'Ninho', 'Lacrim'] },
            { artist: 'Lacrim', title: 'AWA', hints: ['Lacrim', 'SCH', 'Booba', 'Maes'] },
            { artist: 'Sadek', title: 'Casanova', hints: ['Sadek', 'Ninho', 'Sch', 'Jul'] },
            { artist: 'Werenoi', title: 'Chemin d\'or', hints: ['Werenoi', 'Ninho', 'PLK', 'Tiakola'] },
            { artist: 'Laylow', title: 'Special', hints: ['Laylow', 'Nekfeu', 'Fousheé', 'Dinos'] },
            { artist: 'Josman', title: 'Intro', hints: ['Josman', 'Dinos', 'Ziak', 'Vald'] },
            { artist: 'Ziak', title: 'Fixette', hints: ['Ziak', 'Gazo', 'Freeze Corleone', 'Kerchak'] },
            { artist: 'Kerchak', title: 'Peur', hints: ['Kerchak', 'Ziak', 'Favé', 'So La Lune'] },
            { artist: 'Favé', title: 'Urus', hints: ['Favé', 'Kerchak', 'Gazo', 'Leto'] },
            { artist: 'Leto', title: 'Macaroni', hints: ['Leto', 'Ninho', 'Guy2Bezbar', 'Tiakola'] },
            { artist: 'Guy2Bezbar', title: 'Coco', hints: ['Guy2Bezbar', 'Tayc', 'Leto', 'Gazo'] },
            { artist: 'Aya Nakamura', title: 'Djadja', hints: ['Aya', 'Wejdene', 'Tiakola', 'Tayc'] },
            { artist: 'Rim\'K', title: 'Air Max', hints: ['Rim\'K', 'Ninho', '113', 'Rohff'] }
        ],

        'rapus': [
            { artist: 'Drake', title: 'God\'s Plan', hints: ['Drake', 'Kanye West', 'Kendrick Lamar', 'J. Cole'] },
            { artist: 'Kendrick Lamar', title: 'HUMBLE.', hints: ['Kendrick', 'Drake', 'Future', 'A$AP Rocky'] },
            { artist: 'Eminem', title: 'Lose Yourself', hints: ['Eminem', '50 Cent', 'Dr. Dre', 'Snoop Dogg'] },
            { artist: 'The Weeknd', title: 'Blinding Lights', hints: ['The Weeknd', 'Bruno Mars', 'Justin Bieber', 'Post Malone'] },
            { artist: 'Travis Scott', title: 'SICKO MODE', hints: ['Travis Scott', 'Drake', 'Young Thug', 'Quavo'] },
            { artist: 'Post Malone', title: 'Rockstar', hints: ['Post Malone', '21 Savage', 'Ty Dolla $ign', 'Swae Lee'] },
            { artist: 'Future', title: 'Mask Off', hints: ['Future', 'Young Thug', '21 Savage', 'Migos'] },
            { artist: 'Young Thug', title: 'Go Crazy', hints: ['Young Thug', 'Chris Brown', 'Gunna', 'Lil Baby'] },
            { artist: 'Lil Baby', title: 'Drip Too Hard', hints: ['Lil Baby', 'Gunna', 'Lil Durk', 'Roddy Ricch'] },
            { artist: 'Roddy Ricch', title: 'The Box', hints: ['Roddy Ricch', 'Lil Baby', 'DaBaby', 'Megan Thee Stallion'] },
            { artist: 'Cardi B', title: 'Bodak Yellow', hints: ['Cardi B', 'Nicki Minaj', 'Megan Thee Stallion', 'Doja Cat'] },
            { artist: 'Nicki Minaj', title: 'Super Freaky Girl', hints: ['Nicki Minaj', 'Cardi B', 'Ice Spice', 'Latto'] },
            { artist: 'Doja Cat', title: 'Say So', hints: ['Doja Cat', 'SZA', 'Ariana Grande', 'Lizzo'] },
            { artist: 'SZA', title: 'Kill Bill', hints: ['SZA', 'Summer Walker', 'H.E.R.', 'Jhené Aiko'] },
            { artist: 'Summer Walker', title: 'Girls Need Love', hints: ['Summer Walker', 'SZA', 'Kehlani', 'Teyana Taylor'] },
            { artist: 'Chris Brown', title: 'No Guidance', hints: ['Chris Brown', 'Drake', 'Usher', 'Trey Songz'] },
            { artist: 'Usher', title: 'Yeah!', hints: ['Usher', 'Chris Brown', 'Ne-Yo', 'Justin Timberlake'] },
            { artist: 'Ne-Yo', title: 'Miss Independent', hints: ['Ne-Yo', 'Usher', 'T-Pain', 'Mario'] },
            { artist: 'T-Pain', title: 'Buy U a Drank', hints: ['T-Pain', 'Akon', 'Lil Wayne', 'Kanye West'] },
            { artist: 'Akon', title: 'Smack That', hints: ['Akon', 'T-Pain', '50 Cent', 'Eminem'] },
            { artist: '50 Cent', title: 'In Da Club', hints: ['50 Cent', 'Eminem', 'Dr. Dre', 'The Game'] },
            { artist: 'Dr. Dre', title: 'Still D.R.E.', hints: ['Dr. Dre', 'Snoop Dogg', 'Ice Cube', 'Tupac'] },
            { artist: 'Snoop Dogg', title: 'Drop It Like It\'s Hot', hints: ['Snoop Dogg', 'Pharrell', 'Jay-Z', 'Nas'] },
            { artist: 'Jay-Z', title: 'Empire State of Mind', hints: ['Jay-Z', 'Nas', 'Kanye West', 'Kendrick Lamar'] },
            { artist: 'Kanye West', title: 'Gold Digger', hints: ['Kanye West', 'Jay-Z', 'Lil Wayne', 'Drake'] },
            { artist: 'Lil Wayne', title: 'A Milli', hints: ['Lil Wayne', 'Drake', 'Nicki Minaj', '2 Chainz'] },
            { artist: '2 Chainz', title: 'I\'m Different', hints: ['2 Chainz', 'Rick Ross', 'Gucci Mane', 'Quavo'] },
            { artist: 'Migos', title: 'Bad and Boujee', hints: ['Migos', 'Future', 'Travis Scott', 'Young Thug'] },
            { artist: 'Cardi B', title: 'WAP', hints: ['Cardi B', 'Megan Thee Stallion', 'Nicki Minaj', 'Ice Spice'] },

            { artist: 'Pop Smoke', title: 'Dior', hints: ['Pop Smoke', 'Fivio Foreign', 'Lil Tjay', 'Polo G'] },
            { artist: 'Juice WRLD', title: 'Lucid Dreams', hints: ['Juice WRLD', 'XXXTentacion', 'Lil Peep', 'Post Malone'] },
            { artist: 'XXXTentacion', title: 'SAD!', hints: ['XXXTentacion', 'Juice WRLD', 'Lil Uzi Vert', 'Ski Mask'] },
            { artist: 'Lil Uzi Vert', title: 'XO Tour Llif3', hints: ['Lil Uzi Vert', 'Playboi Carti', 'Young Thug', 'Gunna'] },
            { artist: 'Playboi Carti', title: 'Magnolia', hints: ['Playboi Carti', 'Uzi', 'Rocky', 'Future'] },
            { artist: 'A$AP Rocky', title: 'Praise the Lord', hints: ['Rocky', 'Tyler, The Creator', 'Schoolboy Q', 'Vince Staples'] },
            { artist: 'Tyler, The Creator', title: 'EARFQUAKE', hints: ['Tyler', 'Frank Ocean', 'Earl Sweatshirt', 'Steve Lacy'] },
            { artist: 'Frank Ocean', title: 'Pink + White', hints: ['Frank Ocean', 'Daniel Caesar', 'Brent Faiyaz', 'Giveon'] },
            { artist: 'Brent Faiyaz', title: 'Trust', hints: ['Brent Faiyaz', 'SZA', 'Lucky Daye', 'SiR'] },
            { artist: 'Daniel Caesar', title: 'Best Part', hints: ['Daniel Caesar', 'H.E.R.', 'Khalid', 'Joji'] },
            { artist: 'Khalid', title: 'Location', hints: ['Khalid', 'Post Malone', 'Bazzi', 'Lauv'] },
            { artist: 'Bruno Mars', title: '24K Magic', hints: ['Bruno Mars', 'Anderson .Paak', 'Silk Sonic', 'Pharrell'] },
            { artist: 'Pharrell Williams', title: 'Happy', hints: ['Pharrell', 'Justin Timberlake', 'Daft Punk', 'The Weeknd'] },
            { artist: 'Daft Punk', title: 'Get Lucky', hints: ['Daft Punk', 'The Weeknd', 'Pharrell', 'Justice'] },
            { artist: 'Lizzo', title: 'About Damn Time', hints: ['Lizzo', 'Doja Cat', 'Megan Thee Stallion', 'Ice Spice'] },
            { artist: 'Jack Harlow', title: 'First Class', hints: ['Jack Harlow', 'Lil Nas X', 'Post Malone', 'The Kid LAROI'] },
            { artist: 'Lil Nas X', title: 'Industry Baby', hints: ['Lil Nas X', 'Jack Harlow', 'Doja Cat', 'Rosalía'] },
            { artist: 'Gunna', title: 'fukumean', hints: ['Gunna', 'Young Thug', 'Lil Baby', 'Metro Boomin'] },
            { artist: 'Metro Boomin', title: 'Creepin\'', hints: ['Metro Boomin', 'The Weeknd', '21 Savage', 'Travis Scott'] },
            { artist: 'Bad Bunny', title: 'Monaco', hints: ['Bad Bunny', 'J Balvin', 'Rauw Alejandro', 'Karol G'] },
            { artist: '21 Savage', title: 'Redrum', hints: ['21 Savage', 'Drake', 'Metro Boomin', 'Future'] }
        ],
        'cartoons': [
            { artist: 'Noam Kaniel', title: 'Goldorak le grand', hints: ['Goldorak', 'Albator', 'Ulysse 31', 'Cobra'] },
            { artist: 'Jean-Jacques Debout', title: 'Capitaine Flam', hints: ['Capitaine Flam', 'Albator', 'San Ku Kaï', 'Spectreman'] },
            { artist: 'Jacques Cardona', title: 'Les Mystérieuses Cités d\'Or', hints: ['Cités d\'Or', 'Ulysse 31', 'Jayce', 'MASK'] },
            { artist: 'Bernard Minet', title: 'Bioman', hints: ['Bioman', 'Flashman', 'X-Or', 'Jiraya'] },
            { artist: 'Claude Valois', title: 'Inspecteur Gadget', hints: ['Gadget', 'Denver', 'Boumbo', 'Babar'] },
            { artist: 'Ariane', title: 'Dragon Ball Z', hints: ['Dragon Ball Z', 'Pokemon', 'Naruto', 'One Piece'] },
            { artist: 'Pokemon', title: 'Attrapez-les tous', hints: ['Pokemon', 'Digimon', 'Yu-Gi-Oh', 'Beyblade'] },
            { artist: 'Totally Spies', title: 'Here We Go', hints: ['Totally Spies', 'Winx Club', 'WITCH', 'Kim Possible'] },
            { artist: 'Code Lyoko', title: 'Un monde sans danger', hints: ['Code Lyoko', 'Winx Club', 'Totally Spies', 'Galactik Football'] },
            { artist: 'Winx Club', title: 'Winx Club Theme', hints: ['Winx Club', 'WITCH', 'Totally Spies', 'Lolirock'] },
            { artist: 'Jean-Pierre Savelli', title: 'X-Or', hints: ['X-Or', 'Bioman', 'San Ku Kaï', 'Sharivan'] },
            { artist: 'Lionel Leroy', title: 'Ulysse 31', hints: ['Ulysse 31', 'Albator', 'Cobra', 'Jayce'] },
            { artist: 'Shuki Levy', title: 'Jayce et les Conquérants de la Lumière', hints: ['Jayce', 'MASK', 'Transformers', 'GI Joe'] },
            { artist: 'Noam', title: 'Les Entrechats', hints: ['Les Entrechats', 'Les Minikeums', 'Petit Ours Brun', 'Babar'] },
            { artist: 'Minikeums', title: 'Ma Melissa', hints: ['Minikeums', 'Totally Spies', 'Pokemon', 'Digimon'] }
        ],
        'movies': [
            { artist: 'John Williams', title: 'Star Wars Main Title', brand: 'Star Wars', hints: ['Star Wars', 'Indiana Jones', 'Superman', 'E.T.'] },
            { artist: 'Hans Zimmer', title: 'He\'s a Pirate', brand: 'Pirates des Caraïbes', hints: ['Pirates des Caraïbes', 'Gladiator', 'Inception', 'The Dark Knight'] },
            { artist: 'Celine Dion', title: 'My Heart Will Go On', brand: 'Titanic', hints: ['Titanic', 'Avatar', 'Bodyguard', 'Leon'] },
            { artist: 'Bill Conti', title: 'Gonna Fly Now', brand: 'Rocky', hints: ['Rocky', 'Rambo', 'Top Gun', 'Creed'] },
            { artist: 'Ray Parker Jr.', title: 'Ghostbusters', brand: 'S.O.S. Fantômes', hints: ['Ghostbusters', 'Gremlins', 'The Goonies', 'E.T.'] },
            { artist: 'Harold Faltermeyer', title: 'Axel F', brand: 'Le Flic de Beverly Hills', hints: ['Le Flic de Beverly Hills', 'Top Gun', 'Cocktail', 'Footloose'] },
            { artist: 'Survivor', title: 'Eye of the Tiger', brand: 'Rocky III', hints: ['Rocky III', 'Rambo II', 'Karate Kid', 'Over the Top'] },
            { artist: 'Kenny Loggins', title: 'Danger Zone', brand: 'Top Gun', hints: ['Top Gun', 'Footloose', 'Caddyshack', 'Over the Top'] },
            { artist: 'Dick Dale', title: 'Misirlou', brand: 'Pulp Fiction', hints: ['Pulp Fiction', 'Kill Bill', 'Reservoir Dogs', 'Taxi'] },
            { artist: 'Chuck Berry', title: 'You Never Can Tell', brand: 'Pulp Fiction', hints: ['Pulp Fiction', 'Kill Bill', 'Grease', 'Dirty Dancing'] },
            { artist: 'Lalo Schifrin', title: 'Mission: Impossible Theme', brand: 'Mission: Impossible', hints: ['Mission: Impossible', 'James Bond', 'Jason Bourne', 'Speed'] },
            { artist: 'Monty Norman', title: 'James Bond Theme', brand: 'James Bond', hints: ['James Bond', 'Mission: Impossible', 'Kingsman', 'Austin Powers'] },
            { artist: 'Danny Elfman', title: 'Batman Theme', brand: 'Batman', hints: ['Batman', 'Spider-Man', 'Superman', 'Avengers'] },
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

function handleRemoteAnswer(answerData) {
    if (state.role !== 'host') return;

    // Prise de main automatique ou sélection directe par hint (Mode Oral)
    if (state.gameMode === 'oral' && state.isPlaying) {
        // En mode oral, si on clique sur un hint, c'est une victoire directe (ou défaite)
        if (answerData.choice === state.currentSong.artist) {
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

    if (answerData.choice === state.currentSong.artist) {
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

    // Do not show the speech to text transcript
    const vocalDisplay = document.getElementById('vocal-answer-display');
    if (vocalDisplay) {
        vocalDisplay.classList.add('hidden');
    }

    // Now reveal the card and true answer in a STYLISH 2026 way!
    revealArtist.innerText = state.currentSong.artist || "Artiste inconnu";
    revealTitle.innerText = state.currentSong.title || "Titre inconnu";

    revealCard.classList.remove('hidden');
    revealCard.classList.add('stitch-reveal-anim'); // CSS Anim

    if (lastBuzzedTeam !== null) {
        validationControls.classList.remove('hidden');
    }

    displayFeedback("À VOUS DE VALIDER !", "feedback-bravo");
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
    if (name === state.currentSong.artist) {
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

    if (state.gameMode === 'buttons') {
        displayFeedback("MAUVAISE RÉPONSE ! ON CONTINUE...", "feedback-dommage");
        playTone(220, 'sawtooth', 0.2);

        // On ne finit pas le tour, on reprend
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
            lastBuzzedTeam = null;
            audioPlayer.play().then(() => {
                state.isPlaying = true;
                startTimer();
            });
        }, 1500);
    } else {
        // En mode Oral, on finit quand même le tour (Révélation)
        lastBuzzedTeam = null;
        validationControls.classList.add('hidden');
        btnNext.classList.remove('hidden');
        displayFeedback('DOMMAGE...', 'feedback-dommage');
        victory(); // On révèle la réponse en mode oral même si raté
        playTone(220, 'sawtooth', 0.2);
    }
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
