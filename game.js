/**
 * AUDIO & GAME ENGINE - STITCH 2026
 */

let audioContext = null;
let currentBuffer = null;
let currentSource = null;
let currentGain = null;
let playbackStartTime = 0;
let pauseOffset = 0;

// Init Audio Context (sur geste utilisateur)
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Chargement et Playback
async function loadSong(song) {
    logDebug(`Chargement : ${song.artist} - ${song.title}`);
    
    // Reset UI
    document.getElementById('modifier-badge').classList.add('hidden');
    state.currentModifier = null;

    // Reset Pitch/Rate
    const rate = 1.0;

    // Si nous sommes l'hôte, on met à jour le state Firebase
    if (state.isHost && state.roomRef) {
        state.roomRef.child('gameState').set({
            status: 'playing',
            song: song,
            timer: 30,
            modifier: null
        });
    }

    // Ici on simulerait le chargement d'un vrai fichier audio.
    // Pour la démo, on utilise l'AudioContext pour générer un son.
    playDemoSequence(rate);

    // Affichage des buzzer si mode boutons
    if (state.soloMode) {
        if (state.gameMode === 'buttons') {
            document.getElementById('hints').classList.remove('hidden');
            document.getElementById('solo-buzz-container').classList.add('hidden');
            showHints(song);
        } else {
            document.getElementById('hints').classList.add('hidden');
            document.getElementById('solo-buzz-container').classList.remove('hidden');
        }
    } else if (state.isHost) {
        // En multi, l'hôte montre les scores et les boutons d'action d'équipe (au cas où les téléphones buggent)
        document.getElementById('teams-action').classList.remove('hidden');
    }

    startTimer();
}

function playTone(freq, type = 'sine', duration = 0.5, volume = 0.1) {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const g = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    g.gain.setValueAtTime(volume, audioContext.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
    osc.connect(g);
    g.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + duration);
}

function playDemoSequence(rate = 1.0) {
    if (currentSource) try { currentSource.stop(); } catch(e) {}
    
    // On simule une lecture audio
    state.isPlaying = true;
    logDebug("Lecture musique démarrée...");
}

function startTimer() {
    if (state.interval) clearInterval(state.interval);
    state.timer = 15;
    const countDisplay = document.getElementById('countdown');
    countDisplay.innerText = state.timer;
    countDisplay.classList.remove('danger');

    state.interval = setInterval(() => {
        if (!state.isPlaying) return;

        state.timer--;
        countDisplay.innerText = state.timer;

        if (state.timer <= 5) countDisplay.classList.add('danger');

        if (state.timer <= 0) {
            clearInterval(state.interval);
            revealSong(false); // Temps écoulé
        }
    }, 1000);
}

// REVEAL
function revealSong(success = false, teamIdx = null) {
    state.isPlaying = false;
    if (state.interval) clearInterval(state.interval);

    // Sound effect
    if (success) playTone(880, 'triangle', 0.5);
    else playTone(220, 'sine', 0.5);

    // UI Update
    const reveal = document.getElementById('reveal-card');
    reveal.classList.remove('hidden');
    document.getElementById('reveal-artist').innerText = state.currentSong.artist;
    document.getElementById('reveal-title').innerText = state.currentSong.title;

    // Masquer les buzzers
    document.getElementById('hints').classList.add('hidden');
    document.getElementById('solo-buzz-container').classList.add('hidden');
    document.getElementById('teams-action').classList.add('hidden');

    // Display validation controls only for Host (Multi) or Solo
    const valControls = document.getElementById('validation-controls');
    const nextBtn = document.getElementById('btn-next');
    
    if (state.soloMode) {
        valControls.classList.add('hidden');
        nextBtn.classList.remove('hidden');
    } else if (state.isHost) {
        valControls.classList.remove('hidden');
        nextBtn.classList.add('hidden');
    }

    if (state.isHost && state.roomRef) {
        state.roomRef.child('gameState').update({
            status: 'reveal',
            winnerTeam: teamIdx,
            success: success
        });
    }
}

// NAVIGATION & FLOW
function startNewGame(theme) {
    initAudio();
    showScreen('game');
    
    // Sélectionner une chanson au hasard
    const songs = SONG_DATABASE[theme] || SONG_DATABASE['8090'];
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    state.currentSong = randomSong;

    // Reset scores display
    updateScoreUI();

    // Lancer après un court délai
    setTimeout(() => {
        loadSong(randomSong);
    }, 1000);
}

function initSoloGame() {
    initAudio();
    updateScoreUI();
    showScreen('themes');
}

function updateScoreUI() {
    for (let i = 0; i < 4; i++) {
        const chip = document.getElementById(`score-team-${i + 1}`);
        if (state.teams[i]) {
            chip.classList.remove('hidden');
            chip.innerText = `${state.teams[i]} : ${state.scores[i]} pts`;
            
            // On affiche aussi les blocs d'action hôte
            const block = document.getElementById(`block-team-${i + 1}`);
            if (block) {
                block.classList.remove('hidden');
                block.querySelector('.team-btn').innerText = state.teams[i];
            }
        } else {
            chip.classList.add('hidden');
            const block = document.getElementById(`block-team-${i + 1}`);
            if (block) block.classList.add('hidden');
        }
    }
}

// GESTION DU BUZZ
document.getElementById('btn-solo-buzz').addEventListener('click', () => {
    handleBuzz(0); // Le joueur solo est toujours index 0
});

document.querySelectorAll('.team-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.team);
        handleBuzz(idx);
    });
});

function handleBuzz(teamIdx) {
    if (!state.isPlaying) return;
    
    // MASQUER IMMEDIATEMENT TOUS LES ELEMENTS UI DE JEU POUR EVITER LES DOUBLE-CLIQUER
    document.getElementById('solo-buzz-container').classList.add('hidden');
    document.getElementById('hints').classList.add('hidden');
    document.getElementById('teams-action').classList.add('hidden');
    
    state.isPlaying = false;
    playTone(440, 'square', 0.2);

    // On stocke qui a buzzé dans le state local
    state.activeBuzzer = teamIdx;

    if (state.soloMode && (state.gameMode === 'oral' || !state.gameMode)) {
        displayFeedback("JE VOUS ÉCOUTE... 🎤", "feedback-bravo", true);

        // Afficher le bouton de secours pour iPhone/HTTP
        const manualBtn = document.getElementById('btn-manual-validate');
        if (manualBtn) {
            manualBtn.classList.remove('hidden');
            manualBtn.onclick = () => {
                manualBtn.classList.add('hidden');
                victory();
            };
        }

        // Appel immédiat sans setTimeout pour préserver le geste utilisateur
        if (window.startVoiceRecognition) {
            window.startVoiceRecognition();
        } else {
            displayFeedback("MICRO INDISPONIBLE", "feedback-dommage");
            setTimeout(() => victory(), 1500);
        }
    } else {
        // En mode bouton ou multi, on attend un peu pour l'effet dramatique
        setTimeout(() => {
            victory();
        }, 1200);
    }
}

function victory() {
    // Dans cette version simplifiée, on révèle juste la chanson
    revealSong(true, state.activeBuzzer);
}

// VALIDATION MANUELLE (HÔTE)
document.getElementById('btn-correct').addEventListener('click', () => {
    const winnerIdx = state.activeBuzzer !== undefined ? state.activeBuzzer : 0;
    
    let points = 10;
    if (state.currentModifier === 'double') points = 20;
    if (state.currentModifier === 'triple') points = 30;

    state.scores[winnerIdx] += points;
    updateScoreUI();
    
    displayFeedback("BRAVO ! +" + points + " pts", "feedback-bravo");
    
    // Firebase update scores
    if (state.roomRef) {
        state.roomRef.child('scores').set(state.scores);
    }

    launchBonusParticles();
    nextRound();
});

document.getElementById('btn-wrong').addEventListener('click', () => {
    applyWrongPenalty();
    displayFeedback("DOMMAGE ! -5 pts", "feedback-dommage");
    nextRound();
});

document.getElementById('btn-next').addEventListener('click', () => {
    nextRound();
});

function applyWrongPenalty() {
    const loserIdx = state.activeBuzzer !== undefined ? state.activeBuzzer : 0;
    state.scores[loserIdx] = Math.max(0, state.scores[loserIdx] - 5);
    updateScoreUI();
    if (state.roomRef) {
        state.roomRef.child('scores').set(state.scores);
    }
}

function nextRound() {
    document.getElementById('reveal-card').classList.add('hidden');
    document.getElementById('bravo-container').innerHTML = '';
    
    if (checkVictory()) return;

    // On recharge une chanson
    setTimeout(() => {
        // En vrai on reprendrait le thème actuel
        const currentTheme = document.querySelector('.theme-card.active')?.dataset.theme || '8090';
        startNewGame('8090');
    }, 1000);
}

function checkVictory() {
    const winnerIdx = state.scores.findIndex(s => s >= 50);
    if (winnerIdx !== -1) {
        showVictory(winnerIdx);
        return true;
    }
    return false;
}

function showVictory(idx) {
    showScreen('results');
    document.getElementById('winner-name').innerText = state.teams[idx];
    
    // Podium logic
    const podium = document.getElementById('final-podium');
    podium.innerHTML = '';
    
    const sorted = state.teams
        .map((t, i) => ({ name: t, score: state.scores[i] }))
        .sort((a, b) => b.score - a.score);

    sorted.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'podium-item';
        div.innerHTML = `
            <div class="rank">${i + 1}</div>
            <div class="name">${item.name}</div>
            <div class="score">${item.score} pts</div>
        `;
        podium.appendChild(div);
    });
}

function displayFeedback(text, className, permanent = false) {
    const container = document.getElementById('bravo-container');
    container.innerHTML = `<div class="feedback-msg ${className}">${text}</div>`;
    
    if (state.roomRef) {
        state.roomRef.child('feedback').set({ text, className, timestamp: Date.now() });
    }

    if (!permanent) {
        setTimeout(() => {
            container.innerHTML = '';
        }, 3000);
    }
}

function showHints(song) {
    const buttons = document.querySelectorAll('.hint-btn');
    const artists = [song.artist];
    
    // On pioche 3 faux artistes
    const allSongs = SONG_DATABASE['8090'];
    while(artists.length < 4) {
        const r = allSongs[Math.floor(Math.random() * allSongs.length)].artist;
        if (!artists.includes(r)) artists.push(r);
    }

    // Shuffle
    artists.sort(() => Math.random() - 0.5);

    buttons.forEach((btn, i) => {
        btn.innerText = artists[i];
        btn.onclick = () => {
            if (artists[i] === song.artist) {
                btn.style.background = "lime";
                handleBuzz(0);
            } else {
                btn.style.background = "red";
                btn.disabled = true;
                applyWrongPenalty();
            }
        };
    });
}

function launchBonusParticles() {
    // Effet visuel simple
    document.body.style.boxShadow = "inset 0 0 100px rgba(0,255,100,0.3)";
    setTimeout(() => document.body.style.boxShadow = "none", 500);
}

async function handleRemoteVocal(transcript, isFinal) {
    if (!state.currentSong) return;
    
    const display = document.getElementById('vocal-answer-display');
    display.classList.remove('hidden');
    display.innerText = transcript;

    if (isFinal) {
        // Comparaison phonétique basique
        const target = state.currentSong.artist.toLowerCase();
        const input = transcript.toLowerCase();
        
        if (input.includes(target) || target.includes(input)) {
            victory();
        } else {
            // On laisse l'hôte décider ou on laisse une chance
            logDebug("Tentative vocale : " + input);
        }
        
        setTimeout(() => {
            display.classList.add('hidden');
        }, 2000);
    }
}

window.handleRemoteVocal = handleRemoteVocal;
window.handleBuzz = handleBuzz;
