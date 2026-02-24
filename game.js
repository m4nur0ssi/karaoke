/**
 * GAME LOGIC - STITCH 2026
 */
let soloOralFallbackTimeout = null;

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
    if (window.syncSongs) window.syncSongs();

    // Anti-blocage mobile : geste utilisateur ici pour débloquer le player
    if (typeof audioPlayer !== 'undefined') {
        audioPlayer.play().then(() => audioPlayer.pause()).catch(() => { });
    }

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
            signal: controller ? controller.signal : undefined
        });

        if (timeoutId) clearTimeout(timeoutId);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            let coverUrl = data.results[0].artworkUrl100.replace('100x100bb', '1000x1000bb');
            let audioUrl = data.results[0].previewUrl;

            // Override cover for Series / Movies / Cartoons
            if (['series', 'clubdorothee', 'disney', 'cartoons', 'movies'].includes(theme) && brand) {
                try {
                    let searchBrand = brand;
                    if (theme === 'disney') searchBrand += " Disney Pixar Animation";

                    // Use short timeout for secondary fetches too
                    const secController = window.AbortController ? new AbortController() : null;
                    const secTimeout = secController ? setTimeout(() => secController.abort(), 3000) : null;

                    let tvResponse = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchBrand)}&entity=tvSeason&limit=1&country=FR`, {
                        signal: secController ? secController.signal : undefined
                    });
                    if (secTimeout) clearTimeout(secTimeout);

                    let tvData = await tvResponse.json();
                    if (tvData.results && tvData.results.length > 0) {
                        coverUrl = tvData.results[0].artworkUrl100.replace('100x100bb', '1000x1000bb');
                    } else {
                        const movieController = window.AbortController ? new AbortController() : null;
                        const movieTimeout = movieController ? setTimeout(() => movieController.abort(), 3000) : null;

                        let movResponse = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchBrand)}&entity=movie&limit=1&country=FR`, {
                            signal: movieController ? movieController.signal : undefined
                        });
                        if (movieTimeout) clearTimeout(movieTimeout);

                        let movData = await movResponse.json();
                        if (movData.results && movData.results.length > 0) {
                            coverUrl = movData.results[0].artworkUrl100.replace('100x100bb', '1000x1000bb');
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

    if (soloOralFallbackTimeout) { clearTimeout(soloOralFallbackTimeout); soloOralFallbackTimeout = null; }

    initAudio();
    if (audioContext) audioContext.resume();

    try {
        state.isPlaying = false;
        audioPlayer.pause();
        if (state.interval) clearInterval(state.interval);

        // Initial UI elements
        const vocalDisplay = document.getElementById('vocal-answer-display');
        const teamsActionArea = document.getElementById('teams-action');
        const soloBuzzContainer = document.getElementById('solo-buzz-container');

        // UI states - SHOW LOADING STATUS
        if (countdownEl) {
            countdownEl.innerText = "...";
            countdownEl.classList.remove('hidden');
            countdownEl.style.fontSize = "4rem";
        }
        if (hintsEl) hintsEl.classList.add('hidden');
        if (revealCard) revealCard.classList.add('hidden');
        if (btnNext) btnNext.classList.add('hidden');
        if (bravoContainer) bravoContainer.innerHTML = '';

        if (vocalDisplay) {
            vocalDisplay.innerText = '';
            vocalDisplay.classList.add('hidden');
        }

        if (soloBuzzContainer) soloBuzzContainer.classList.add('hidden');

        // Unhide visualizer and show animation at start of song
        const viz = document.querySelector('.visualizer');
        if (viz) viz.classList.remove('hidden');

        if (state.soloMode) {
            // In solo mode, hide the teams action area (Team 1 button is redundant with huge BUZZ)
            if (teamsActionArea) teamsActionArea.classList.add('hidden');
        }

        // Sync loading status to players & Reset states
        const jokerAvailable = Math.random() < 0.20; // 20% chance
        if (state.roomRef) {
            state.roomRef.update({
                status: 'loading',
                buzzerTeam: null,
                vocalAnswer: null,
                buzz: null,
                answer: null,
                activeJoker: null,
                showHintsToPlayer: state.gameMode === 'buttons',
                jokerAvailableThisRound: jokerAvailable
            });
        }

        // Sécurité : Si le chargement prend trop de temps (timeout réseau), on affiche un moyen de passer
        // Sécurité chargement (pas de message moche)
        const loadingSafetyTimeout = setTimeout(() => {
            if (countdownEl.classList.contains('hidden')) {
                btnNext.innerText = "PASSER CE TITRE";
                btnNext.classList.remove('hidden');
            }
        }, 8000);

        // Clear bravo UI and vocal UI (Already done above, keeping for safety or re-checking)
        if (bravoContainer) bravoContainer.innerHTML = '';
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

            const soloBuzz = document.getElementById('solo-buzz-container');
            const teamsActionArea = document.getElementById('teams-action');
            if (soloBuzz) soloBuzz.classList.add('hidden');
            if (teamsActionArea) teamsActionArea.classList.add('hidden');
            if (countdownEl) countdownEl.classList.add('hidden');
            if (validationControls) validationControls.classList.add('hidden');

            // Suspension : Lancer la roue
            await launchWheelOfFate(state.currentModifier);

            if (countdownEl) countdownEl.classList.remove('hidden');

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
        let themeSongs = state.songs ? state.songs[activeTheme] : null;

        // Safety check
        if (!Array.isArray(themeSongs) && activeTheme !== 'random') {
            if (countdownEl) {
                countdownEl.innerText = "Base de données non chargée";
                countdownEl.style.fontSize = "2rem";
                countdownEl.classList.remove('hidden');
            }
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

            // Sync loading status to players & Reset states
            if (state.roomRef) {
                state.roomRef.update({
                    status: 'playing',
                    audioUrl: result.audio,
                    mysteryRate: state.mysteryRate,
                    currentModifier: state.currentModifier,
                    buzzerTeam: null,
                    buzzerName: null,
                    answer: null,
                    buzz: null,
                    mode: state.gameMode,
                    round: state.round,
                    theme: activeTheme,
                    timer: (state.currentModifier === 'fast') ? 10 : 30,
                    choices: shuffle([...state.currentSong.hints]),
                    jokers: state.jokers,
                    activeJoker: null,
                    showHintsToPlayer: state.gameMode === 'buttons',
                    timestamp: Date.now()
                });
            }

            // Apply mystery rate AFTER loading
            audioPlayer.defaultPlaybackRate = state.mysteryRate;
            audioPlayer.playbackRate = state.mysteryRate;

            // --- Host / Solo UI Logic ---
            const soloBuzz = document.getElementById('solo-buzz-container');
            const hints = document.getElementById('hints');
            const teamsActionArea = document.getElementById('teams-action');

            if (state.gameMode === 'buttons') {
                if (soloBuzz) soloBuzz.classList.add('hidden');
                if (teamsActionArea) teamsActionArea.classList.add('hidden');
                showHints(); // Populates and unhides
            } else {
                // ORAL MODE
                if (state.soloMode) {
                    if (soloBuzz) soloBuzz.classList.remove('hidden');
                    if (teamsActionArea) teamsActionArea.classList.add('hidden');
                } else {
                    if (soloBuzz) soloBuzz.classList.add('hidden');
                    if (teamsActionArea) teamsActionArea.classList.remove('hidden');
                }
                if (hints) hints.classList.add('hidden');
            }

            // Unhide Timer HUD normally
            if (countdownEl) {
                state.timer = (state.currentModifier === 'fast') ? 10 : 30;
                countdownEl.innerText = state.timer;
                countdownEl.style.fontSize = "8rem"; // Restore huge size
                countdownEl.classList.remove('hidden');
            }

            audioPlayer.play().then(() => {
                clearTimeout(loadingSafetyTimeout);
                // Double check rate on actual playback start
                audioPlayer.playbackRate = state.mysteryRate;
                state.isPlaying = true;
                startTimer();
            }).catch(e => {
                clearTimeout(loadingSafetyTimeout);
                console.warn("Auto-play blocked:", e);
                if (countdownEl) {
                    countdownEl.innerText = "PRÊT ? CLIQUEZ !";
                    countdownEl.style.fontSize = "2.5rem";
                }
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
            if (countdownEl) {
                countdownEl.innerText = "Indisponible";
                countdownEl.style.fontSize = "2.5rem";
                countdownEl.classList.remove('hidden');
            }
            btnNext.innerText = "TITRE SUIVANT";
            btnNext.classList.remove('hidden');
            displayFeedback("TITRE INDISPONIBLE... DÉSOLÉ ! 😓", "feedback-dommage");
        }


    } catch (err) {
        console.error("Critical error in nextSong:", err);
        if (countdownEl) {
            countdownEl.innerText = "Erreur: " + err.message.substring(0, 30);
            countdownEl.style.fontSize = "1.5rem";
            countdownEl.classList.remove('hidden');
        }
        if (btnNext) {
            btnNext.innerText = "RÉESSAYER";
            btnNext.classList.remove('hidden');
        }
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

        if (state.timer === 10) {
            showHints();
        }

        if (state.timer <= 0) {
            clearInterval(state.interval);
            handleTimeout();
        }
    }, 1000);
}

function handleRemoteBuzz(teamIdx) {
    // Allow buzz if playing OR if we are on the game screen waiting for the "Play" click
    const isWaitingForPlay = (btnNext.innerText === "LANCER LE SON" && !btnNext.classList.contains('hidden'));
    if (!state.isPlaying && !isWaitingForPlay) return;

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

        displayFeedback("ÉCOUTE EN COURS...", "feedback-bravo", true);

        // Clean UI for better visibility while listening
        const modifierBadge = document.getElementById('modifier-badge');
        if (modifierBadge) modifierBadge.classList.add('hidden');
        const viz = document.getElementById('player-viz'); // Visualization element on host too? Usually it's in CSS
        if (viz) viz.classList.add('hidden');
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
            btnCorrect.click();
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
            bravoContainer.innerHTML = '';
            audioPlayer.play().then(() => {
                state.isPlaying = true;

                // Restore host UI elements hidden during buzz
                countdownEl.classList.remove('hidden');
                if (state.timer <= 10) {
                    showHints();
                }

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
    } else if (data.isFinal) {
        // En mode vocal, on ne déclenche la pénalité QUE si c'est le résultat final
        btnWrong.click();
    }
}
window.handleRemoteVocal = handleRemoteVocal;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function handleTimeout() {
    state.isPlaying = false;
    audioPlayer.pause();

    displayFeedback("C'ÉTAIT PAS SI DUR POURTANT 😉", "feedback-dommage");
    playTone(220, 'sawtooth', 0.5);

    lastBuzzedTeam = null;
    victory();
}

function showHints() {
    if (!state.currentSong || !state.currentSong.hints) return;

    const hints = document.getElementById('hints');
    if (!hints) return;
    const btns = hints.querySelectorAll('.hint-btn');
    const labels = state.currentSong.hints;

    btns.forEach((btn, idx) => {
        if (labels[idx]) {
            btn.innerText = labels[idx];
            btn.classList.remove('hidden');
            // Re-bind click
            btn.onclick = () => selectArtist(labels[idx]);
        } else {
            btn.classList.add('hidden');
        }
    });

    if (state.gameMode === 'buttons') {
        hints.classList.remove('hidden');
    } else if (state.gameMode === 'oral') {
        if (state.roomRef) {
            state.roomRef.update({
                showHintsToPlayer: true,
                choices: state.currentSong.hints
            });
        }
        // En mode oral (Flash Quizz), on affiche les propositions (en local) à 10s ou sur buzz
        hints.classList.remove('hidden');

        // Hide solo buzz when hints appear at 10s
        if (state.soloMode) {
            const soloBuzz = document.getElementById('solo-buzz-container');
            if (soloBuzz) soloBuzz.classList.add('hidden');
        }
    }
}

function selectArtist(name) {
    if (isCorrectAnswer(name, state.currentSong)) {
        lastBuzzedTeam = 0; // Forced for solo/arcade feedback rewards
        btnCorrect.click();
    } else {
        const penalty = state.currentModifier === 'bomb' ? 3 : 1;
        playTone(110, 'sawtooth', 0.3);
        displayFeedback(`MAUVAISE RÉPONSE ! -${penalty} PTS ❌`, "feedback-dommage");
        applyWrongPenalty(0); // Penalty for solo error
        setTimeout(() => {
            if (bravoContainer.innerText.includes("MAUVAISE")) {
                bravoContainer.innerHTML = '';
            }
        }, 1500);
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

    if (state.roomRef) {
        const updateData = {
            status: 'finished_song',
            winnerTeam: lastBuzzedTeam,
            winnerName: lastBuzzedTeam !== null ? state.teams[lastBuzzedTeam].name : null,
            revealedArtist: state.currentSong.artist,
            revealedTitle: state.currentSong.title
        };
        // Optionnellement, passer le message de feedback au player
        const bravoText = document.querySelector('.feedback-text');
        if (bravoText) updateData.feedbackMsg = bravoText.innerText;

        state.roomRef.update(updateData);
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
        if (state.streakTeam === lastBuzzedTeam) {
            state.streakCount++;
        } else {
            state.streakTeam = lastBuzzedTeam;
            state.streakCount = 1;
        }

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

        if (state.currentModifier === 'bonus1') points += 1;
        if (state.currentModifier === 'bonus3') points += 3;
        if (state.currentModifier === 'double') points *= 2;
        if (state.currentModifier === 'steal') points += 2;
        if (state.currentModifier === 'mystery') points += 1;

        if (state.activeJoker === lastBuzzedTeam) {
            points *= 2;
            state.jokers[lastBuzzedTeam] = false;
            const jokerBtn = document.getElementById(`joker-${lastBuzzedTeam + 1}`);
            if (jokerBtn) jokerBtn.classList.add('used');

            if (state.roomRef) {
                state.roomRef.update({ jokers: state.jokers });
            }
            state.activeJoker = null;
        }

        state.teams[lastBuzzedTeam].score += points;

        if (state.currentModifier === 'steal') {
            state.teams.forEach((team, idx) => {
                if (idx !== lastBuzzedTeam && idx < state.teamCount) {
                    team.score = Math.max(0, team.score - 1);
                }
            });
            launchBonusParticles("PIRATE ! 🏴‍☠️");
        }
        updateScores();

        let feedbackMsg = `BONNE RÉPONSE ! (+${points} PTS)`;

        if (isSpecialStreak) {
            feedbackMsg = `QUEL TALENT ! 😉 (+${points} PTS)`;
            launchBonusParticles("QUEL TALENT !");
        } else {
            launchBonusParticles(`+${points} PTS`);
        }
        displayFeedback(feedbackMsg, 'feedback-bravo');

        victory(true);
        audioPlayer.play();

        lastBuzzedTeam = null;
        validationControls.classList.add('hidden');
        btnNext.classList.remove('hidden');
        playTone(660, 'sine', 0.2);
    }
});

btnWrong.addEventListener('click', () => {
    const teamIdx = lastBuzzedTeam;
    let penalty = 1;
    if (state.currentModifier === 'bomb') penalty = 3;

    if (teamIdx !== null) {
        applyWrongPenalty(teamIdx);
    }

    displayFeedback(`MAUVAISE RÉPONSE ! -${penalty} PTS ❌`, "feedback-dommage");
    playTone(220, 'sawtooth', 0.2);

    validationControls.classList.add('hidden');
    revealCard.classList.add('hidden');
    const vocalDisplay = document.getElementById('vocal-answer-display');
    if (vocalDisplay) vocalDisplay.classList.add('hidden');

    // Restore UI for retry
    const viz = document.querySelector('.visualizer');
    if (viz) viz.classList.remove('hidden');

    setTimeout(() => {
        if (state.roomRef) {
            state.roomRef.update({
                status: 'playing',
                buzzerTeam: null,
                buzzerName: null,
                answer: null,
                vocalAnswer: null,
                buzz: null,
                showHintsToPlayer: state.timer <= 10
            });
        }
        lastBuzzedTeam = null;
        bravoContainer.innerHTML = ''; // Effacer le message de feedback

        // SOLO: Hide hints if they were shown as fallback and timer > 10
        if (state.soloMode && hintsEl && state.timer > 10) {
            hintsEl.classList.add('hidden');
        }

        audioPlayer.play().then(() => {
            state.isPlaying = true;

            // Restore host UI elements hidden during buzz
            countdownEl.classList.remove('hidden');
            if (state.timer <= 10) {
                showHints(); // This will unhide hintsEl or update Firebase for players
            }

            // Re-show solo buzz if it was hidden
            if (state.soloMode && (state.gameMode === 'oral' || !state.gameMode)) {
                const soloBuzz = document.getElementById('solo-buzz-container');
                if (soloBuzz) soloBuzz.classList.remove('hidden');
            }

            if (modifierBadge && state.currentModifier !== 'normal') modifierBadge.classList.remove('hidden');
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

function displayFeedback(text, className, keepBuzzer = false) {
    bravoContainer.innerHTML = '';
    const feedback = document.createElement('div');
    feedback.className = `feedback-text ${className}`;
    feedback.innerText = text;
    bravoContainer.appendChild(feedback);

    if (state.roomRef) {
        const updateData = {
            status: 'feedback',
            feedbackMsg: text
        };
        if (keepBuzzer && lastBuzzedTeam !== null) {
            updateData.buzzerTeam = lastBuzzedTeam;
            updateData.buzzerName = state.teams[lastBuzzedTeam].name;
        }
        state.roomRef.update(updateData);
    }
}
window.displayFeedback = displayFeedback;

// Team Buzzers Delegation
const teamsAction = document.getElementById('teams-action');
const handleBuzz = (idx) => {
    try {
        if (!state.isPlaying) return;
        state.isPlaying = false;
        audioPlayer.pause();
        clearInterval(state.interval);

        // UI CLEANUP IMMEDIATE
        const containers = ['solo-buzz-container', 'teams-action', 'hints'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        const viz = document.querySelector('.visualizer');
        if (viz) viz.classList.add('hidden');

        lastBuzzedTeam = idx;
        if (state.timer > 25) state.speedBonusActive = true;

        if (state.soloMode && (state.gameMode === 'oral' || !state.gameMode)) {
            displayFeedback("JE VOUS ÉCOUTE... 🎤", "feedback-bravo", true);

            // Appel immédiat sans setTimeout pour préserver le geste utilisateur
            if (window.startVoiceRecognition) {
                window.startVoiceRecognition();
            } else {
                displayFeedback("MICRO INDISPONIBLE", "feedback-dommage");
            }
            // Fallback: Show hints after a delay in oral mode in solo
            if (hintsEl) {
                if (soloOralFallbackTimeout) clearTimeout(soloOralFallbackTimeout);
                soloOralFallbackTimeout = setTimeout(() => {
                    if (!state.isPlaying && lastBuzzedTeam !== null) {
                        hintsEl.classList.remove('hidden');
                    }
                    soloOralFallbackTimeout = null;
                }, 5000);
            }
        } else {
            setTimeout(() => {
                victory();
            }, 1200);
        }
        playTone(440, 'triangle', 0.3);
    } catch (err) {
        console.error("Buzz Error:", err);
        state.isPlaying = false;
        victory(); // Fallback to at least show the answer
    }
};

if (teamsAction) {
    if (typeof btnSoloBuzz !== 'undefined' && btnSoloBuzz) {
        btnSoloBuzz.onclick = () => handleBuzz(0);
        btnSoloBuzz.ontouchstart = (e) => {
            e.preventDefault();
            handleBuzz(0);
        };
    }

    teamsAction.addEventListener('click', (e) => {
        const btn = e.target.closest('.team-btn');
        if (btn) {
            const idx = parseInt(btn.getAttribute('data-team'));
            handleBuzz(idx);
        }
    });

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
    if (!btn || btn.classList.contains('hidden') || btn.classList.contains('used')) return;

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

    if (state.role === 'player' && state.roomRef) {
        state.roomRef.update({ activeJoker: newVal });
    }
}

function handlePlayerJoker() {
    activateJoker(state.myTeamIdx);
}

const handleNextOrPlay = () => {
    if (btnNext.innerText === "LANCER LE SON") {
        btnNext.classList.add('hidden');
        countdownEl.innerText = state.timer;
        countdownEl.style.fontSize = "8rem"; // Reset size

        // Restore visualizer
        const viz = document.querySelector('.visualizer');
        if (viz) viz.classList.remove('hidden');

        // Ensure solo UI is shown when sound is manually started
        if (state.soloMode) {
            const soloBuzz = document.getElementById('solo-buzz-container');
            if (soloBuzz && (state.gameMode === 'oral' || !state.gameMode)) {
                soloBuzz.classList.remove('hidden');
            }
            showHints();
        }

        audioPlayer.play().then(() => {
            state.isPlaying = true;
            startTimer();
        }).catch(err => console.error("Still blocked:", err));
        return;
    }
    nextSong();
};

btnNext.addEventListener('click', handleNextOrPlay);
btnNext.addEventListener('touchstart', (e) => { e.preventDefault(); handleNextOrPlay(); }, { passive: false });

function stopGame() {
    state.isPlaying = false;
    audioPlayer.pause();
    if (state.interval) clearInterval(state.interval);
}

function playTone(freq, type, duration, volume = 0.1) {
    if (!audioContext) initAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
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

        slotWindow.classList.add('hidden');
        teamZone.classList.remove('hidden');
        spinBtn.classList.add('hidden');
        modal.classList.remove('hidden');

        playTone(440, 'sine', 0.2);

        const wheelExplanation = document.getElementById('wheel-explanation');
        if (wheelExplanation) wheelExplanation.classList.add('hidden');

        if (state.roomRef) {
            state.roomRef.update({
                status: 'wheel_waiting',
                wheelTeamIdx: luckyTeamIdx,
                wheelTeamName: luckyTeamName,
                wheelSpin: null
            });
        }

        const doSpin = () => {
            playTone(880, 'sine', 0.1);
            teamZone.classList.add('hidden');
            slotWindow.classList.remove('hidden');

            spinBtn.classList.remove('hidden');

            setTimeout(() => {
                reel.style.transition = 'transform 2.5s cubic-bezier(0.1, 0, 0.1, 1)';
                const offset = (strip.length - 1) * 120;
                reel.style.transform = `translateY(-${offset}px)`;

                // Son caractéristique de la roue (tics décélérés)
                const playWheelTics = () => {
                    let tics = 0;
                    const totalTics = 35;
                    const startTime = Date.now();

                    const nextTic = () => {
                        if (tics >= totalTics) return;

                        // Déclenchement d'un son court
                        playTone(700 + (tics * 10), 'sine', 0.03, 0.04);
                        tics++;

                        // Calcul du délai suivant (plus lent à la fin)
                        let delay = 30 + Math.pow(tics / totalTics, 3) * 350;
                        setTimeout(nextTic, delay);
                    };
                    nextTic();
                };
                playWheelTics();
            }, 50);

            setTimeout(() => {
                playTone(880, 'sine', 0.5, 0.15);

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
                    if (state.roomRef) {
                        state.roomRef.update({ status: 'loading', wheelTeamIdx: null, wheelTeamName: null, wheelSpin: null });
                    }
                    if (state.roomRef) state.roomRef.child('wheelSpin').off('value', wheelSpinListener);
                    resolve();
                }, 4000);
            }, 2700);
        };

        const wheelSpinListener = (snap) => {
            if (snap.val() === true) {
                state.roomRef.child('wheelSpin').off('value', wheelSpinListener);
                doSpin();
            }
        };
        if (state.roomRef) {
            state.roomRef.child('wheelSpin').on('value', wheelSpinListener);
        } else {
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

    revealCard.classList.add('hidden');

    const activeTeams = state.teams.slice(0, state.teamCount);
    const sorted = [...activeTeams].sort((a, b) => b.score - a.score);

    const winner = sorted[0];
    const winnerNameEl = document.getElementById('winner-name');
    const winnerMsgEl = document.getElementById('winner-message');
    const comfortMsgEl = document.getElementById('comfort-message');
    const podiumContainer = document.getElementById('final-podium');

    winnerNameEl.innerHTML = `
        <div class="results-stitch-tag">STITCH 2026</div>
        <div class="results-round-info">FIN DE SESSION</div>
        <h2 style="font-size: 4rem; color: white; margin-top: 20px;">${winner.name.toUpperCase()}</h2>
    `;
    winnerMsgEl.innerHTML = `<div style="font-size: 2.5rem; font-weight: 900; color: white;">FÉLICITATIONS !</div>`;

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

    const losers = sorted.slice(1);
    if (losers.length > 0) {
        comfortMsgEl.innerText = `Pas de panique ${losers[losers.length - 1].name}, la prochaine fois sera la bonne ! 😉`;
    } else {
        comfortMsgEl.innerText = "";
    }

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

window.restartGame = restartGame;
window.handlePlayerJoker = handlePlayerJoker;
window.activateJoker = activateJoker;
