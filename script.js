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
    streakTeam: null,
    streakCount: 0,
    currentModifier: null, // "normal", "double", "mystery"
    mysteryRate: 1.0,
    speedBonusActive: false, // If buzzed before hints
    winningTeam: null,
    jokers: [true, true, true, true],
    activeJoker: null, // Which team activated a joker this round
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
        'poprock': [
            { artist: 'Nirvana', title: 'Smells Like Teen Spirit', hints: ['Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains'] },
            { artist: 'Queen', title: 'Bohemian Rhapsody', hints: ['Queen', 'The Rolling Stones', 'Led Zeppelin', 'Pink Floyd'] },
            { artist: 'Coldplay', title: 'Viva la Vida', hints: ['Coldplay', 'Snow Patrol', 'Keane', 'The Fray'] },
            { artist: 'Red Hot Chili Peppers', title: 'Californication', hints: ['RHCP', 'Foo Fighters', 'Incubus', 'Audioslave'] },
            { artist: 'Green Day', title: 'Basket Case', hints: ['Green Day', 'The Offspring', 'Blink-182', 'Sum 41'] },
            { artist: 'The Killers', title: 'Mr. Brightside', hints: ['The Killers', 'The Strokes', 'Franz Ferdinand', 'Interpol'] },
            { artist: 'Linkin Park', title: 'In the End', hints: ['Linkin Park', 'Evanescence', 'Papa Roach', 'Limp Bizkit'] },
            { artist: 'Radiohead', title: 'Creep', hints: ['Radiohead', 'Muse', 'Placebo', 'Blur'] },
            { artist: 'Evanescence', title: 'Bring Me to Life', hints: ['Evanescence', 'Within Temptation', 'Nightwish', 'Lacuna Coil'] },
            { artist: 'Panic! At The Disco', title: 'I Write Sins Not Tragedies', hints: ['P!ATD', 'Fall Out Boy', 'Paramore', 'My Chemical Romance'] },
            { artist: 'Fall Out Boy', title: 'Sugar, We\'re Goin Down', hints: ['Fall Out Boy', 'Panic! At The Disco', 'Yellowcard', 'All Time Low'] },
            { artist: 'Paramore', title: 'Misery Business', hints: ['Paramore', 'Flyleaf', 'Tonight Alive', 'Hey Monday'] },
            { artist: 'My Chemical Romance', title: 'Welcome to the Black Parade', hints: ['MCR', 'The Used', 'Taking Back Sunday', 'Brand New'] },
            { artist: 'Imagine Dragons', title: 'Believer', hints: ['Imagine Dragons', 'OneRepublic', 'Bastille', 'X Ambassadors'] },
            { artist: 'Maroon 5', title: 'Sugar', hints: ['Maroon 5', 'Train', 'The Script', 'Matchbox Twenty'] },
            { artist: 'The White Stripes', title: 'Seven Nation Army', hints: ['The White Stripes', 'The Black Keys', 'The Hives', 'The Vines'] },
            { artist: 'Arctic Monkeys', title: 'Do I Wanna Know?', hints: ['Arctic Monkeys', 'The Last Shadow Puppets', 'Kasabian', 'Miles Kane'] },
            { artist: 'Muse', title: 'Uprising', hints: ['Muse', 'Radiohead', 'Thirty Seconds to Mars', 'Royal Blood'] },
            { artist: 'Foo Fighters', title: 'Everlong', hints: ['Foo Fighters', 'Nirvana', 'Pearl Jam', 'The Smashing Pumpkins'] },
            { artist: 'Kings of Leon', title: 'Use Somebody', hints: ['Kings of Leon', 'The Killers', 'The Temper Trap', 'Phoenix'] },
            { artist: 'OneRepublic', title: 'Counting Stars', hints: ['OneRepublic', 'Imagine Dragons', 'Bastille', 'Awolnation'] },
            { artist: 'The Fray', title: 'How to Save a Life', hints: ['The Fray', 'Five for Fighting', 'Keane', 'Snow Patrol'] },
            { artist: 'Keane', title: 'Somewhere Only We Know', hints: ['Keane', 'Coldplay', 'Travis', 'Snow Patrol'] },
            { artist: 'Snow Patrol', title: 'Chasing Cars', hints: ['Snow Patrol', 'Keane', 'The Script', 'Kodaline'] },
            { artist: 'The Script', title: 'Hall of Fame', hints: ['The Script', 'The Fray', 'Train', 'Maroon 5'] },
            { artist: 'Train', title: 'Hey, Soul Sister', hints: ['Train', 'Maroon 5', 'Jason Mraz', 'Phillip Phillips'] },
            { artist: 'Nickelback', title: 'How You Remind Me', hints: ['Nickelback', 'Daughtry', 'Theory of a Deadman', 'Seether'] },
            { artist: '30 Seconds to Mars', title: 'The Kill', hints: ['30STM', 'Muse', 'Linkin Park', 'Placebo'] },
            { artist: 'Good Charlotte', title: 'Lifestyles of the Rich & Famous', hints: ['Good Charlotte', 'Simple Plan', 'Sum 41', 'New Found Glory'] },
            { artist: 'Simple Plan', title: 'Welcome to My Life', hints: ['Simple Plan', 'Good Charlotte', 'All Time Low', 'Yellowcard'] },
            { artist: 'Sum 41', title: 'Fat Lip', hints: ['Sum 41', 'Blink-182', 'Green Day', 'Zebrahead'] },
            { artist: 'Blink-182', title: 'All the Small Things', hints: ['Blink-182', 'Sum 41', 'Green Day', 'New Found Glory'] },
            { artist: 'Avril Lavigne', title: 'Complicated', hints: ['Avril Lavigne', 'Michelle Branch', 'Ashlee Simpson', 'Vanessa Carlton'] },
            { artist: 'Hozier', title: 'Take Me to Church', hints: ['Hozier', 'Rag\'n\'Bone Man', 'George Ezra', 'James Bay'] },
            { artist: 'Twenty One Pilots', title: 'Stressed Out', hints: ['TOP', 'Imagine Dragons', 'Panic! At The Disco', 'AJR'] },
            { artist: 'The Black Keys', title: 'Lonely Boy', hints: ['The Black Keys', 'The White Stripes', 'Gary Clark Jr.', 'Cage the Elephant'] },
            { artist: 'No Doubt', title: 'Don\'t Speak', hints: ['No Doubt', 'Gwen Stefani', 'Garbage', 'The Cardigans'] },
            { artist: 'Bastille', title: 'Pompeii', hints: ['Bastille', 'Two Door Cinema Club', 'Alt-J', 'The 1975'] },
            { artist: 'The 1975', title: 'Somebody Else', hints: ['The 1975', 'Pale Waves', 'LANY', 'The Neighbourhood'] },
            { artist: 'Foster The People', title: 'Pumped Up Kicks', hints: ['Foster The People', 'Grouplove', 'Phoenix', 'Two Door Cinema Club'] },
            { artist: 'Florence + The Machine', title: 'Dog Days Are Over', hints: ['Florence', 'Bat for Lashes', 'Marina', 'Lykke Li'] },
            { artist: 'MGMT', title: 'Kids', hints: ['MGMT', 'Empire of the Sun', 'Passion Pit', 'Phoenix'] },
            { artist: 'Phoenix', title: 'Lisztomania', hints: ['Phoenix', 'Two Door Cinema Club', 'Vampire Weekend', 'Friendly Fires'] },
            { artist: 'Vampire Weekend', title: 'A-Punk', hints: ['Vampire Weekend', 'The Shins', 'Death Cab for Cutie', 'Local Natives'] },
            { artist: 'Bon Iver', title: 'Holocene', hints: ['Bon Iver', 'Fleet Foxes', 'Iron & Wine', 'The National'] },
            { artist: 'The National', title: 'Bloodbuzz Ohio', hints: ['The National', 'Interpol', 'Editors', 'Future Islands'] },
            { artist: 'Tame Impala', title: 'The Less I Know the Better', hints: ['Tame Impala', 'Unknown Mortal Orchestra', 'Glass Animals', 'Pond'] },
            { artist: 'The Strokes', title: 'Last Nite', hints: ['The Strokes', 'The Libertines', 'The Vines', 'The Hives'] },
            { artist: 'The Offspring', title: 'Self Esteem', hints: ['The Offspring', 'Bad Religion', 'Pennywise', 'Social Distortion'] },
            { artist: 'U2', title: 'Beautiful Day', hints: ['U2', 'Coldplay', 'The Police', 'Simple Minds'] }
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
            { artist: 'Ninho', title: 'Lettre à une femme', hints: ['Ninho', 'Gazo', 'Tiakola', 'Jul'] },
            { artist: 'Jul', title: 'Tchikita', hints: ['Jul', 'SCH', 'Naps', 'Soolking'] },
            { artist: 'Gazo', title: 'DIE', hints: ['Gazo', 'Central Cee', 'Zola', 'Koba LaD'] },
            { artist: 'Tiakola', title: 'Meuda', hints: ['Tiakola', 'Niska', 'Hamza', 'Gazo'] },
            { artist: 'Naps', title: 'La Kiffance', hints: ['Naps', 'Jul', 'Soso Maness', 'L\'Algérino'] },

            { artist: 'Orelsan', title: 'La Quête', hints: ['Orelsan', 'Vald', 'Lomepal', 'Nekfeu'] },
            { artist: 'Hamza', title: 'Fade Up', hints: ['Hamza', 'SCH', 'Zola', 'SDM'] },
            { artist: 'SCH', title: 'Bande Organisée', hints: ['SCH', 'Jul', 'Naps', 'Soso Maness'] },
            { artist: 'Ninho', title: 'VVS', hints: ['Ninho', 'Werenoi', 'Zola', 'PLK'] },
            { artist: 'Dinos', title: 'Helsinki', hints: ['Dinos', 'Laylow', 'Lomepal', 'Josman'] },
            { artist: 'Josman', title: 'Intro', hints: ['Josman', 'Dinos', 'Ziak', 'Vald'] },
            { artist: 'Nekfeu', title: 'On verra', hints: ['Nekfeu', 'Lomepal', 'Orelsan', 'Damso'] },
            { artist: 'Damso', title: 'Macarena', hints: ['Damso', 'Nekfeu', 'Booba', 'Shay'] },
            { artist: 'Booba', title: '92i Veyron', hints: ['Booba', 'Kaaris', 'Lacrim', 'Rohff'] },
            { artist: 'PLK', title: 'Petrouchka', hints: ['PLK', 'Soso Maness', 'Oboy', 'Zola'] },
            { artist: 'Zola', title: 'Amber', hints: ['Zola', 'Gazo', 'Koba LaD', 'Maes'] },
            { artist: 'Maes', title: 'Madrina', hints: ['Maes', 'Booba', 'Ninho', 'Lacrim'] },
            { artist: 'Lacrim', title: 'AWA', hints: ['Lacrim', 'SCH', 'Kaaris', 'Booba'] },
            { artist: 'Kaaris', title: 'Zoo', hints: ['Kaaris', 'Booba', 'Gims', 'Kalash Criminel'] },
            { artist: 'Gims', title: 'Bella', hints: ['Gims', 'Dadju', 'Ninho', 'Soprano'] },
            { artist: 'Dadju', title: 'Reine', hints: ['Dadju', 'Gims', 'Tayc', 'Franglish'] },
            { artist: 'Tayc', title: 'Le Temps', hints: ['Tayc', 'Dadju', 'Burnaboy', 'Wizkid'] },
            { artist: 'Burna Boy', title: 'Ye', hints: ['Burna Boy', 'Wizkid', 'Davido', 'Tayc'] },

            { artist: 'Soprano', title: 'Cosmo', hints: ['Soprano', 'Gims', 'Black M', 'Lefa'] },
            { artist: 'Lomepal', title: 'Trop beau', hints: ['Lomepal', 'Angèle', 'Eddy de Pretto', 'Orelsan'] },
            { artist: 'Vald', title: 'Désaccordé', hints: ['Vald', 'Orelsan', 'Lorenzo', 'Alkpote'] },
            { artist: 'Heuss l\'Enfoiré', title: 'Moulaga', hints: ['Heuss', 'Jul', 'Naps', 'SCH'] },
            { artist: 'Soolking', title: 'Dalida', hints: ['Soolking', 'L\'Algérino', 'Gims', 'Dadju'] },
            { artist: 'Heuss', title: 'Ne reviens pas', hints: ['Heuss', 'Gradur', 'Gambi', 'Zola'] },
            { artist: 'Gambi', title: 'Popopop', hints: ['Gambi', 'Zola', 'Koba LaD', 'Gazo'] },
            { artist: 'Koba LaD', title: 'Doudou', hints: ['Koba LaD', 'Gazo', 'Zola', 'Niska'] },
            { artist: 'Niska', title: 'Réseaux', hints: ['Niska', 'MHD', 'Gradur', 'Kalash'] },
            { artist: 'MHD', title: 'Afro Trap Part.7', hints: ['MHD', 'Niska', 'Vegedream', 'Kalash'] },
            { artist: 'Gradur', title: 'Sheguey 10', hints: ['Gradur', 'Niska', 'MHD', 'Kaaris'] },
            { artist: 'PNL', title: 'Au DD', hints: ['PNL', 'DTF', 'Ademo', 'N.O.S'] },
            { artist: 'Ademo', title: 'DA', hints: ['PNL', 'Booba', 'Nekfeu', 'Damso'] },
            { artist: 'Jul', title: 'On m\'appelle l\'ovni', hints: ['Jul', 'SCH', 'Alonzo', 'Naps'] },
            { artist: 'Alonzo', title: 'Tout va bien', hints: ['Alonzo', 'Naps', 'Jul', 'SCH'] },
            { artist: 'Shay', title: 'PMW', hints: ['Shay', 'Aya Nakamura', 'Meryl', 'Ronisia'] },
            { artist: 'Aya Nakamura', title: 'Djadja', hints: ['Aya Nakamura', 'Wejdene', 'Imen Es', 'Lyna Mahyem'] },
            { artist: 'Rim\'K', title: 'Air Max', hints: ['Rim\'K', 'Ninho', '113', 'Lacrim'] },
            { artist: 'Rohff', title: 'Qui est l\'exemple ?', hints: ['Rohff', 'Booba', 'Kery James', 'Diam\'s'] },
            { artist: 'Diam\'s', title: 'La Boulette', hints: ['Diam\'s', 'Vitaa', 'Shy\'m', 'Amel Bent'] },
            { artist: 'Kery James', title: 'Musique Nègre', hints: ['Kery James', 'Youssoupha', 'Medine', 'Lino'] },
            { artist: 'Youssoupha', title: 'On se connaît', hints: ['Youssoupha', 'Oxmo Puccino', 'Abd Al Malik', 'Disiz'] },
            { artist: 'Oxmo Puccino', title: 'L\'enfant seul', hints: ['Oxmo', 'IAM', 'NTM', 'Lunatic'] },
            { artist: 'IAM', title: 'Demain, c\'est loin', hints: ['IAM', 'NTM', 'Akhenaton', 'Shurik\'n'] },
            { artist: 'NTM', title: 'Laisse pas traîner ton fils', hints: ['NTM', 'IAM', 'JoeyStarr', 'Kool Shen'] },
            { artist: '113', title: 'Tonton du bled', hints: ['113', 'Rim\'K', 'Mokobé', 'AP'] },
            { artist: 'Assassin', title: 'Esclave de votre société', hints: ['Assassin', 'Rockin\' Squat', 'IAM', 'NTM'] }
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
    results: document.getElementById('screen-results')
};


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





// Navigation
function showScreen(name) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.toggle('active', key === name);
    });
    state.screen = name;
}

navHome.addEventListener('click', () => {
    stopGame();
    showScreen('home');
});

// Team Setup
btnCreateTeams.addEventListener('click', () => {
    modalTeams.classList.add('active');
    console.log("Modal ouvert");
});

btnCreateTeams.addEventListener('touchstart', (e) => {
    e.preventDefault();
    modalTeams.classList.add('active');
}, { passive: false });

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

// Auto-clear default names
document.querySelectorAll('.team-inputs input').forEach(input => {
    input.addEventListener('focus', function () {
        if (this.value.includes('Équipe')) this.value = '';
    });
});


const startGame = () => {
    console.log("Démarrage avec", state.teamCount, "équipes");

    // Refresh team buttons reference to be sure we have them all
    const allTeamBtns = document.querySelectorAll('.team-btn');

    for (let i = 0; i < 4; i++) {
        const val = document.getElementById(`input-team-${i + 1}`).value;
        state.teams[i].name = val || `Équipe ${i + 1}`;

        // Setup in-game UI visibility
        const scoreChip = document.getElementById(`score-team-${i + 1}`);
        const teamBlock = document.getElementById(`block-team-${i + 1}`);

        if (i < state.teamCount) {
            if (scoreChip) scoreChip.classList.remove('hidden');
            if (teamBlock) teamBlock.classList.remove('hidden');
            if (allTeamBtns[i]) {
                allTeamBtns[i].innerText = state.teams[i].name;
                allTeamBtns[i].setAttribute('data-team', i);
            }
        } else {
            if (scoreChip) scoreChip.classList.add('hidden');
            if (teamBlock) teamBlock.classList.add('hidden');
        }
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
        chip.innerText = `${state.teams[i].name}: ${state.teams[i].score}`;
    }
}


// Game Logic
themeCards.forEach(card => {
    card.addEventListener('click', () => {
        const theme = card.getAttribute('data-theme');
        startTheme(theme);
    });
});

function startTheme(theme) {
    state.currentTheme = theme;
    showScreen('game');
    nextSong();
}

// Audio Management
const audioPlayer = new Audio();
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

        // Sécurité : Si le chargement prend trop de temps (timeout réseau), on affiche un moyen de passer
        const loadingSafetyTimeout = setTimeout(() => {
            if (countdownEl.innerText === "Chargement...") {
                countdownEl.innerText = "Connexion lente...";
                btnNext.innerText = "PASSER CE TITRE";
                btnNext.classList.remove('hidden');
            }
        }, 6000);

        // Clear bravo UI
        bravoContainer.innerHTML = '';



        // Pick Modifier (Wheel of Misfortune) - Much rarer for Stitch 2026
        // About 1 chance in 5 to get a special event
        const mods = [
            'normal', 'normal', 'normal', 'normal', 'normal',
            'normal', 'normal', 'normal', 'normal', 'normal',
            'normal', 'normal', 'normal', 'normal', 'normal',
            'double', 'mystery', 'bonus1', 'bonus3'
        ];
        state.currentModifier = mods[Math.floor(Math.random() * mods.length)];
        state.speedBonusActive = false;
        state.activeJoker = null;
        state.mysteryRate = 1.0;
        audioPlayer.playbackRate = 1.0;

        // Update Mod UI
        modifierBadge.classList.add('hidden');
        modifierBadge.className = 'modifier-badge';
        if (state.currentModifier !== 'normal') {
            // Suspense : Launch the destiny wheel before starting
            await launchWheelOfFate(state.currentModifier);

            modifierBadge.classList.remove('hidden');
            if (state.currentModifier === 'double') {
                modifierBadge.innerText = "🔥 POINTS DOUBLES";
                modifierBadge.classList.add('modifier-double');
            } else if (state.currentModifier === 'mystery') {
                const rates = [0.7, 1.7, 2.0];
                state.mysteryRate = rates[Math.floor(Math.random() * rates.length)];

                modifierBadge.innerText = state.mysteryRate < 1 ? "🌀 AUDIO RALENTI" : "🌀 AUDIO ACCÉLÉRÉ";
                modifierBadge.classList.add('modifier-mystery');
            } else if (state.currentModifier === 'bonus1') {
                modifierBadge.innerText = "✨ BONUS +1 PT";
                modifierBadge.classList.add('modifier-bonus1');
            } else if (state.currentModifier === 'bonus3') {
                modifierBadge.innerText = "💎 ULTRA BONUS +3 PTS";
                modifierBadge.classList.add('modifier-bonus3');
            }
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

        // Filter out already played songs to avoid infinite loops
        let availableSongs = themeSongs.filter(s => !state.playedSongs.includes(s.title));

        // If no songs left, reset history for this theme
        if (availableSongs.length === 0) {
            state.playedSongs = [];
            availableSongs = themeSongs;
        }

        while (!result && attempts < maxAttempts) {
            let candidate = availableSongs[Math.floor(Math.random() * availableSongs.length)];
            state.currentSong = candidate;

            result = await fetchPreview(state.currentSong.artist, state.currentSong.title, activeTheme, state.currentSong.brand);

            if (!result || !result.audio) {
                attempts++;
                // Remove candidate that failed to load from this session's available list
                availableSongs = availableSongs.filter(s => s.title !== candidate.title);
                if (availableSongs.length === 0) break;
                result = null;
            }
        }


        if (result && result.audio) {
            state.playedSongs.push(state.currentSong.title);
            audioPlayer.src = result.audio;
            audioPlayer.load();

            // Apply mystery rate AFTER loading, otherwise some browsers reset it to 1.0
            audioPlayer.playbackRate = state.mysteryRate;

            audioPlayer.play().then(() => {
                clearTimeout(loadingSafetyTimeout);
                // Double check rate on actual playback start (Crucial for mobile Safari)
                audioPlayer.playbackRate = state.mysteryRate;
                state.isPlaying = true;

                state.timer = 30;
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

        if (state.timer === 15) {
            showHints();
        }



        if (state.timer <= 0) {
            clearInterval(state.interval);
            handleTimeout();
        }
    }, 1000);
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
    hintsEl.classList.remove('hidden');
    // We keep countdown visible as requested
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

    revealArtist.innerText = state.currentSong.brand ? state.currentSong.brand : state.currentSong.artist;
    revealTitle.innerText = state.currentSong.brand ? `${state.currentSong.artist} - ${state.currentSong.title}` : state.currentSong.title;
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

        // Calcul des points de base selon la série (1, 3 ou 5)
        let basePoints = 1;
        let isSpecialStreak = false;

        if (state.streakCount >= 5) {
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

        // Le joker double le gain final du tour (Quitte ou Double)
        if (state.activeJoker === lastBuzzedTeam) {
            points *= 2;
        }

        state.teams[lastBuzzedTeam].score += points;
        updateScores();

        // Feedback "Stitch 2026"
        let feedbackMsg = `BRAVO ! (+${points} PTS)`;
        if (isSpecialStreak) {
            feedbackMsg = `QUEL TALENT ! 😉 (+${points} PTS)`;
            launchBonusParticles("QUEL TALENT !");
        } else {
            launchBonusParticles(`+${points} PTS`);
        }
        displayFeedback(feedbackMsg, 'feedback-bravo');

        lastBuzzedTeam = null;
        validationControls.classList.add('hidden');
        btnNext.classList.remove('hidden');
        playTone(660, 'sine', 0.2);
    }
});






btnWrong.addEventListener('click', () => {
    if (lastBuzzedTeam !== null) {
        if (state.activeJoker === lastBuzzedTeam) {
            state.teams[lastBuzzedTeam].score = Math.max(0, state.teams[lastBuzzedTeam].score - 2);
            launchBonusParticles("-2 PTS 💀");
            updateScores();
        } else {
            // 50% chance to lose a point
            if (Math.random() > 0.5) {
                state.teams[lastBuzzedTeam].score = Math.max(0, state.teams[lastBuzzedTeam].score - 1);
                launchBonusParticles("-1 PT ❌");
                updateScores();
            } else {
                displayFeedback("OFFERT PAR LA MAISON ! 🙏", "feedback-bravo");
                playTone(880, 'sine', 0.1);
            }
        }
    }



    state.streakTeam = null;
    state.streakCount = 0;

    lastBuzzedTeam = null;
    validationControls.classList.add('hidden');
    btnNext.classList.remove('hidden');
    displayFeedback('DOMMAGE...', 'feedback-dommage');
    playTone(220, 'sawtooth', 0.2);
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
    if (btn.classList.contains('hidden')) return;

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
            { id: 'mystery', label: 'Mystère 🌀' }
        ];

        // Populate reel with many items for the spinning effect
        let strip = [];
        for (let i = 0; i < 15; i++) {
            strip.push(items[i % items.length]);
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
    updateScores();
    showScreen('home');
}


