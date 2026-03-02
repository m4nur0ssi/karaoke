/**
 * LOBBY JS - STITCH 2026 - v54.7
 */
let oralFallbackTimeout = null;
const SILENCE_SRC = "data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A/wD/Lw==";

// Use global window scope for shared audio elements
if (!window.playerAudio) window.playerAudio = new Audio();
if (!window.keepAliveAudio) window.keepAliveAudio = new Audio();

window.lastSyncRate = 1.0;

btnRolePlayer.addEventListener('click', () => {
    state.role = 'player';
    showScreen('player');
    if (inputRoomCode) {
        inputRoomCode.value = '';
        lastFetchedCode = '';
        selectTeamJoin.innerHTML = '<option value="">Entrez le code...</option>';
        btnJoinRoom.disabled = true;
        btnJoinRoom.innerText = 'REJOINDRE LE JEU';
        setTimeout(() => inputRoomCode.focus(), 150);
    }
});

window.populateTeams = (teams) => {
    if (!teams) return;
    const teamArray = Array.isArray(teams) ? teams : Object.values(teams);
    const prevSelection = selectTeamJoin.value;

    selectTeamJoin.innerHTML = '';
    if (teamArray.length === 0) {
        selectTeamJoin.innerHTML = '<option value="">Salon vide (Ajustez hôte)</option>';
        return;
    }

    teamArray.forEach((name, idx) => {
        if (name) {
            if (state.teams[idx]) state.teams[idx].name = name;
            const opt = document.createElement('option');
            opt.value = idx;
            opt.innerText = name.toString().toUpperCase();
            selectTeamJoin.appendChild(opt);
        }
    });

    if (selectTeamJoin.options.length > 0) {
        if (prevSelection !== "" && Array.from(selectTeamJoin.options).some(o => o.value === prevSelection)) {
            selectTeamJoin.value = prevSelection;
        } else {
            selectTeamJoin.selectedIndex = 0;
        }
    }

    btnJoinRoom.disabled = false;
    btnJoinRoom.classList.add('primary');

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

        const activeSoloModeBtn = document.querySelector('.solo-mode-btn.active');
        if (activeSoloModeBtn) {
            state.gameMode = activeSoloModeBtn.getAttribute('data-solo-mode');
        }

        state.soloMode = true;
        state.roomId = null;
        state.roomRef = null;
        state.role = 'host';
        state.teamCount = 1;
        state.teams[0].name = soloName;
        state.teams[0].score = 0;
        for (let i = 1; i < 4; i++) state.teams[i].score = 0;
        state.round = 0;
        state.playedSongs = [];
        state.failedSongs = [];
        state.jokers = [true, true, true, true];
        state.activeJoker = null;

        const block1 = document.getElementById('block-team-1');
        const btn1 = block1 ? block1.querySelector('.team-btn') : null;
        if (btn1) btn1.innerText = "BUZZ";
        ['block-team-2', 'block-team-3', 'block-team-4'].forEach(id => {
            const b = document.getElementById(id); if (b) b.classList.add('hidden');
        });
        if (block1) {
            // Hide team blocks in solo mode as the huge BUZZ button is used instead
            block1.classList.add('hidden');
        }

        const chip1 = document.getElementById('score-team-1');
        if (chip1) {
            chip1.classList.remove('hidden');
            const modeName = state.gameMode === 'buttons' ? 'ARCADE' : 'ORAL';
            chip1.innerText = `${soloName} [${modeName}]: 0`;
        }
        ['score-team-2', 'score-team-3', 'score-team-4'].forEach(id => {
            const c = document.getElementById(id); if (c) c.classList.add('hidden');
        });

        document.querySelectorAll('.joker-btn').forEach(b => b.classList.add('hidden'));

        state.roomRef = null;
        state.roomId = null;

        const roomCodeDisplay = document.getElementById('room-code-display');
        if (roomCodeDisplay) roomCodeDisplay.classList.add('hidden');

        if (window.syncSongs) window.syncSongs();

        // --- NOUVEAU : Pré-autorisation du micro ---
        if (state.gameMode === 'oral' || !state.gameMode) {
            // Check for secure context (Required for Mic)
            const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (!isSecure) {
                console.warn("MICROPHONE: Connexion non sécurisée. Le micro ne s'activera probablement pas sur cet appareil.");
            }

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                console.log("Demande de pré-autorisation micro...");
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        stream.getTracks().forEach(t => t.stop());
                        logDebug("✅ Microphone autorisé et prêt.");
                    })
                    .catch(e => {
                        console.error("Microphone denied or insecure:", e);
                    });
            }
        }

        window.initAudio();
        if (window.audioContext) window.audioContext.resume().catch(() => { });

        // Anti-blocage mobile : "primer" le player sur ce geste utilisateur
        if (typeof audioPlayer !== 'undefined') {
            audioPlayer.src = "data:audio/wav;base64,UklGRigAAABXQVZFVZmIBAAwAACIAAAAhQAAQAEAgAMEFBMUEjMDADf/f/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/y/+7/";
            audioPlayer.play().then(() => audioPlayer.pause()).catch(() => { });
        }

        showScreen('themes');
    };
    btnSoloMode.addEventListener('click', launchSolo);
}

// --- SOLO MODE SELECTOR ---
const soloModeBtns = document.querySelectorAll('.solo-mode-btn');
soloModeBtns.forEach(btn => {
    const handleSoloModeClick = () => {
        soloModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gameMode = btn.getAttribute('data-solo-mode');
        // Sync normal mode buttons too
        modeButtons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-mode') === state.gameMode);
        });
        // Update chip if playing
        const chip1 = document.getElementById('score-team-1');
        if (state.soloMode && chip1) {
            const modeName = state.gameMode === 'buttons' ? 'ARCADE' : 'ORAL';
            const name = state.teams[0].name || 'SOLO';
            chip1.innerText = `${name} [${modeName}]: ${state.teams[0].score}`;
        }
    };
    btn.addEventListener('click', handleSoloModeClick);
});

// --- MODE SELECTOR (NORMAL) ---
modeButtons.forEach(btn => {
    const handleModeClick = () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gameMode = btn.getAttribute('data-mode');

        // Sync solo buttons for visual consistency
        soloModeBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-solo-mode') === state.gameMode);
        });

        if (state.roomRef) {
            state.roomRef.update({ mode: state.gameMode });
        }
    };
    btn.addEventListener('click', handleModeClick);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleModeClick(); }, { passive: false });
});

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
        const msg = finalCode.length === 0 ? "Entrez le code..." : `[${finalCode}] (${finalCode.length}/4)...`;
        selectTeamJoin.innerHTML = `<option value="">${msg}</option>`;
        btnJoinRoom.disabled = true;
        return;
    }

    const searchMsg = `RECHERCHE DU SALON [${finalCode}]...`;
    if (finalCode !== lastFetchedCode) {
        selectTeamJoin.innerHTML = `<option value="">${searchMsg}</option>`;
        btnJoinRoom.disabled = true;
    }

    code = finalCode;
    if (code === lastFetchedCode) return;
    lastFetchedCode = code;

    const dbUrl = (typeof firebaseConfig !== 'undefined') ? firebaseConfig.databaseURL : "https://quizzgame2026-default-rtdb.firebaseio.com";

    const tryREST = () => {
        if (lastFetchedCode !== code) return;
        fetch(`${dbUrl}/rooms/${code}.json`)
            .then(r => r.json())
            .then(data => {
                if (data && data.teams) {
                    window.populateTeams(data.teams);
                }
            })
            .catch(e => { });
    };

    setTimeout(tryREST, 300);

    if (window.teamListener) window.teamListener.off();
    window.teamListener = firebase.database().ref('rooms/' + code);
    window.teamListener.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.teams) {
            window.populateTeams(data.teams);
        } else if (data) {
            if (selectTeamJoin.innerHTML.includes('RECHERCHE')) {
                selectTeamJoin.innerHTML = '<option value="">Attente configuration hôte...</option>';
            }
        }
    });
}

setInterval(() => {
    if (state.role === 'player' && inputRoomCode && inputRoomCode.value) {
        fetchTeams(inputRoomCode.value);
    }
}, 300);

inputRoomCode.addEventListener('input', () => fetchTeams(inputRoomCode.value));
inputRoomCode.addEventListener('keydown', () => fetchTeams(inputRoomCode.value));
inputRoomCode.addEventListener('keyup', () => fetchTeams(inputRoomCode.value));
inputRoomCode.addEventListener('blur', () => fetchTeams(inputRoomCode.value));

const handleJoinRoom = () => {
    const code = inputRoomCode.value.trim().toUpperCase();
    if (code.length !== 4) return alert("Code invalide");

    state.roomId = code; localStorage.setItem("lastRoomId", code);

    if (window.firebase && firebase.apps && firebase.apps.length) {
        state.roomRef = firebase.database().ref('rooms/' + state.roomId);
    }

    if (selectTeamJoin.value === "") return alert("Veuillez choisir une équipe");
    state.myTeamIdx = parseInt(selectTeamJoin.value);

    // Store remote preference
    const checkRemote = document.getElementById('check-remote-audio');
    state.isRemote = checkRemote ? checkRemote.checked : false;
    localStorage.setItem("isRemote", state.isRemote);

    btnJoinRoom.innerText = "CONNEXION EN COURS...";
    btnJoinRoom.disabled = true;

    // --- NOUVEAU : Pré-autorisation du son IMMÉDIATE (Mode Distance) ---
    // On utilise DEUX players : un dédié au silence (Keep-Alive) et un pour les chansons
    // --- NOUVEAU : Pré-autorisation du son IMMÉDIATE (Mode Distance) ---
    // On utilise DEUX players : un dédié au silence (Keep-Alive) et un pour les chansons

    // Config du Keep-Alive (NE CHANGE JAMAIS de source pour garder la session active)
    window.keepAliveAudio.src = SILENCE_SRC;
    window.keepAliveAudio.loop = true;
    window.keepAliveAudio.volume = 0.1;
    window.keepAliveAudio.play().catch(() => { });

    // --- GLOBAL TAP AUTHORIZATION ---
    if (!window._globalTouchAuthorized) {
        window._globalTouchAuthorized = true;
        const primeAudio = () => {
            if (window.playerAudio) window.playerAudio.play().then(() => window.playerAudio.pause()).catch(() => { });
            if (window.keepAliveAudio) window.keepAliveAudio.play().catch(() => { });
            document.removeEventListener('touchstart', primeAudio);
            document.removeEventListener('click', primeAudio);
        };
        document.addEventListener('touchstart', primeAudio);
        document.addEventListener('click', primeAudio);
    }

    // Config du Player Principal
    window.playerAudio.src = SILENCE_SRC;
    window.playerAudio.loop = false;
    window.playerAudio.volume = 0.8;

    // Anti-reset playbackRate (Mystery Mode)
    window.playerAudio.addEventListener('play', () => {
        if (window.lastSyncRate) window.playerAudio.playbackRate = window.lastSyncRate;
    });
    window.playerAudio.addEventListener('playing', () => {
        if (window.lastSyncRate) window.playerAudio.playbackRate = window.lastSyncRate;
    });

    window.playerAudio.play().then(() => {
        logDebug("🔊 Audio principal prêt (Sync autorisée).");
    }).catch(e => {
        logDebug("⚠️ Audio principal restreint (On débloquera au prochain buzz/clic).");
    });

    const proceedToLobby = () => {
        playerLobby.classList.add('hidden');
        playerGame.classList.remove('hidden');

        // Pre-authorize Microphone for the player
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    stream.getTracks().forEach(t => t.stop());
                    logDebug("✅ Player Mic ready");
                })
                .catch(e => {
                    logDebug("❌ Player Mic pre-auth failed");
                });
        }

        const badge = document.getElementById('player-room-badge');
        if (badge) badge.innerText = "ROOM: " + code;
        const myName = (state.teams[state.myTeamIdx] && state.teams[state.myTeamIdx].name) ? state.teams[state.myTeamIdx].name : `Équipe ${state.myTeamIdx + 1}`;
        waitingMsg.innerText = myName.toUpperCase() + " PRÊT !";

        if (state.roomRef) {
            state.roomRef.on('value', (snap) => {
                const data = snap.val();
                if (data) updatePlayerInterface(data);
            });
        }

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

    if (!state.dbConnected || checkFirebase().ok === false) {
        proceedToLobby();
        return;
    }

    if (state.roomRef) {
        state.roomRef.once('value').then(snapshot => {
            if (!snapshot.val()) {
                alert("Erreur: Le salon n'est pas encore prêt.");
                btnJoinRoom.innerText = "REJOINDRE LE JEU";
                btnJoinRoom.disabled = false;
                return;
            }
            proceedToLobby();
        }).catch(err => {
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

// --- BRUTE FORCE AUDIO UNLOCK ---
const runAudioTest = (e) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const btn = document.getElementById('btn-test-audio');
    if (btn) btn.innerText = "DÉBLOQUAGE...";

    // Ensure we are using the global singletons
    const audio = window.playerAudio || (window.playerAudio = new Audio());
    const keep = window.keepAliveAudio || (window.keepAliveAudio = new Audio());

    // 1. First trigger: Try to play silence synchronously
    audio.src = SILENCE_SRC;
    keep.src = SILENCE_SRC;

    const p1 = audio.play();
    keep.play().catch(() => { });

    if (p1 !== undefined) {
        p1.then(() => {
            // SUCCESS: Audio driver is now open.
            // 2. Play the actual sound
            audio.src = "https://www.soundjay.com/button/button-1.mp3";
            return audio.play();
        }).then(() => {
            if (btn) {
                btn.innerText = "✅ SON OK";
                btn.style.background = "rgba(0, 255, 136, 0.2)";
                btn.style.borderColor = "#00ff88";
            }
        }).catch(err => {
            console.warn("Test audio failed:", err);
            // It could be that play() was successful but the MP3 URL failed.
            // If the first play() (silence) worked, we are still UNLOCKED.
            if (btn) btn.innerText = "✅ AUDIO DÉBLOQUÉ";
        });
    } else {
        // Fallback for very old browsers
        if (btn) btn.innerText = "❌ RÉ-ESSAYEZ";
    }
};

const btnTestAudio = document.getElementById('btn-test-audio');
if (btnTestAudio) {
    btnTestAudio.addEventListener('click', runAudioTest);
    btnTestAudio.addEventListener('touchstart', runAudioTest, { passive: false });
}

// Team Setup
btnCreateTeams.addEventListener('click', () => {
    modalTeams.classList.add('active');
    syncHostTeams();
});

btnCreateTeams.addEventListener('touchstart', (e) => {
    e.preventDefault();
    modalTeams.classList.add('active');
    syncHostTeams();
}, { passive: false });

// Team Sync for Host
function syncHostTeams() {
    if (state.role !== 'host' || !state.roomId) return;
    const teamNames = [];
    for (let i = 1; i <= state.teamCount; i++) {
        const input = document.getElementById(`input-team-${i}`);
        if (input) teamNames.push(input.value || `Équipe ${i}`);
    }

    if (state.roomRef) state.roomRef.update({ teams: teamNames });

    const dbUrl = (typeof firebaseConfig !== 'undefined') ? firebaseConfig.databaseURL : "https://quizzgame2026-default-rtdb.firebaseio.com";
    const restUrl = `${dbUrl}/rooms/${state.roomId}/teams.json`;
    fetch(restUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamNames)
    }).catch(e => { });
}

// Team Count Selector
const countContainer = document.querySelector('.count-btns');
if (countContainer) {
    const handleCountSelection = (btn) => {
        document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.teamCount = parseInt(btn.getAttribute('data-count'));

        for (let i = 1; i <= 4; i++) {
            const input = document.getElementById(`input-team-${i}`);
            if (input) {
                if (i <= state.teamCount) input.classList.remove('hidden');
                else input.classList.add('hidden');
            }
        }
        syncHostTeams();
    };

    countContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.count-btn');
        if (btn) handleCountSelection(btn);
    });

    countContainer.addEventListener('touchstart', (e) => {
        const btn = e.target.closest('.count-btn');
        if (btn) {
            e.preventDefault();
            handleCountSelection(btn);
        }
    }, { passive: false });
}

document.querySelectorAll('.team-inputs input').forEach(input => {
    input.addEventListener('focus', function () {
        if (this.value.includes('Équipe')) this.value = '';
    });
    input.addEventListener('input', syncHostTeams);
});

const startGame = () => {
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

    if (state.roomRef) {
        state.roomRef.update({
            teams: teamNames,
            status: 'lobby',
            timestamp: Date.now()
        });
    }

    updateScores();
    modalTeams.classList.remove('active');
    window.initAudio();
    if (window.audioContext) window.audioContext.resume();
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
        if (chip) {
            let label = state.teams[i].name;
            if (state.soloMode && i === 0) {
                const modeName = state.gameMode === 'buttons' ? 'ARCADE' : 'ORAL';
                label = `${state.teams[0].name} [${modeName}]`;
            }
            chip.innerText = `${label}: ${state.teams[i].score}`;
        }
    }
    if (state.roomRef) {
        state.roomRef.update({
            scores: state.teams.slice(0, state.teamCount).map(t => ({ name: t.name, score: t.score }))
        });
    }
}
// --- REMOTE SYNC & PLAYER UI ---

window.updatePlayerInterface = (roomData) => {
    if (!roomData) return;

    // UI Elements
    const waitingMsg = document.getElementById('waiting-msg');
    const btnPlayerBuzz = document.getElementById('btn-player-buzz');
    const playerChoices = document.getElementById('player-choices');
    const btnPlayerJoker = document.getElementById('btn-player-joker');
    const playerModifierZone = document.getElementById('player-modifier-zone');
    const playerModifierBadge = document.getElementById('player-modifier-badge');
    const playerWheelZone = document.getElementById('player-wheel-zone');
    const playerWheelMsg = document.getElementById('player-wheel-msg');
    const playerWheelExpl = document.getElementById('player-wheel-expl');
    const playerViz = document.getElementById('player-viz');

    if (!waitingMsg) return;

    // Mode Distance Logic
    const remoteCheckEl = document.getElementById('check-remote-audio');
    if (remoteCheckEl) {
        state.isRemote = remoteCheckEl.checked;
        localStorage.setItem("isRemote", state.isRemote);
    } else if (state.isRemote === undefined) {
        state.isRemote = localStorage.getItem("isRemote") === "true";
    }
    const isRemote = state.isRemote;

    // Helper map for modifiers
    const modifierMap = {
        bonus1: { emoji: '🎁', title: '+1 PT', desc: 'Bonus surprise !', cls: 'modifier-bonus1' },
        bonus3: { emoji: '💎', title: 'ULTRA +3', desc: 'Bonus massif !', cls: 'modifier-bonus3' },
        double: { emoji: '🔥', title: 'DOUBLES', desc: 'Points x2 !', cls: 'modifier-double' },
        mystery: { emoji: '🌀', title: 'MYSTÈRE', desc: 'Vitesse modifiée !', cls: 'modifier-mystery' },
        fast: { emoji: '⏱️', title: 'CHRONO', desc: '10 secondes !', cls: 'modifier-fast' },
        steal: { emoji: '🏴‍☠️', title: 'PIRATE', desc: 'Vol de points !', cls: 'modifier-steal' },
        bomb: { emoji: '💣', title: 'BOMBE', desc: '-3 si erreur !', cls: 'modifier-fast' }
    };

    // 1. Sync Modifier
    if (playerModifierZone && playerModifierBadge) {
        if (roomData.currentModifier && roomData.currentModifier !== 'normal' && modifierMap[roomData.currentModifier]) {
            const mod = modifierMap[roomData.currentModifier];
            playerModifierBadge.innerText = `${mod.emoji} ${mod.title}`;
            playerModifierBadge.className = `modifier-badge ${mod.cls}`;
            playerModifierZone.classList.remove('hidden');
        } else {
            playerModifierZone.classList.add('hidden');
        }
    }

    // 2. Sync Wheel
    if (playerWheelZone) {
        if (roomData.status === 'wheel_waiting' || roomData.status === 'wheel_spinning') {
            playerWheelZone.classList.remove('hidden');
            if (waitingMsg) waitingMsg.style.display = 'none'; // Force hide status msg during wheel

            const isSpinning = roomData.status === 'wheel_spinning';
            if (playerWheelMsg) {
                playerWheelMsg.innerText = isSpinning ? "LA ROUE TOURNE..." : (roomData.wheelTeamName || "L'ÉQUIPE").toUpperCase() + " LANCE LA ROUE...";
            }

            // Find current modifier details
            if (roomData.currentModifier && roomData.currentModifier !== 'normal' && modifierMap[roomData.currentModifier]) {
                const mod = modifierMap[roomData.currentModifier];
                if (playerWheelExpl) {
                    playerWheelExpl.innerHTML = `
                        <div class="wheel-expl-emoji" style="color:var(--secondary); text-shadow:0 0 10px var(--secondary);">${mod.emoji}</div>
                        <div class="wheel-expl-title">${mod.title}</div>
                        <div class="wheel-expl-desc" style="font-size:0.9rem; opacity:0.8; margin-top:5px;">${mod.desc}</div>
                    `;
                    playerWheelExpl.classList.remove('hidden');
                }
            } else {
                if (playerWheelExpl) playerWheelExpl.classList.add('hidden');
            }
        } else {
            playerWheelZone.classList.add('hidden');
            if (waitingMsg) waitingMsg.style.display = ''; // Restore status msg
        }
    }

    // 3. Main Status Handling - USE CLASSLIST, NOT CLASSNAME
    if (waitingMsg) {
        waitingMsg.classList.remove('status-active', 'status-waiting', 'status-finished', 'status-buzzed');
        waitingMsg.classList.add('player-status-indicator');
    }

    if (roomData.status === 'playing' || roomData.status === 'loading') {
        const isPlaying = roomData.status === 'playing';

        // Only update text if not showing unlock button
        if (!document.getElementById('btn-unlock-audio')) {
            waitingMsg.innerText = isPlaying ? "À L'ÉCOUTE..." : "CHARGEMENT...";
        }
        waitingMsg.classList.add(isPlaying ? 'status-active' : 'status-waiting');

        const isArcade = roomData.mode === 'buttons';
        const showHints = isPlaying && (roomData.showHintsToPlayer || isArcade) && roomData.choices;

        if (isPlaying && !showHints && !isArcade) {
            btnPlayerBuzz.classList.remove('hidden');
            btnPlayerBuzz.disabled = false;
        } else {
            btnPlayerBuzz.classList.add('hidden');
        }

        if (showHints) showPlayerChoices(roomData.choices);
        else playerChoices.classList.add('hidden');

        // Audio Sync
        if (state.isRemote && isPlaying && roomData.audioUrl) {
            syncRemoteAudio(roomData.audioUrl, roomData.mysteryRate || 1.0, roomData.timestamp);
        } else {
            if (window.playerAudio && window.playerAudio.src && !window.playerAudio.src.includes("data:audio")) {
                window.playerAudio.src = SILENCE_SRC;
                window.playerAudio.loop = true;
                window.playerAudio.play().catch(() => { });
            }
            if (playerViz) playerViz.classList.add('hidden');
        }

    } else if (roomData.status === 'buzzed' || roomData.status === 'feedback') {
        // Stop audio if playing
        if (window.playerAudio && window.playerAudio.src && !window.playerAudio.src.includes("data:audio")) {
            window.playerAudio.src = SILENCE_SRC;
            window.playerAudio.loop = true;
            window.playerAudio.play().catch(() => { });
            if (window.keepAliveAudio) window.keepAliveAudio.play().catch(() => { });
        }
        if (playerViz) playerViz.classList.add('hidden');

        const isMyTurn = (roomData.buzzerTeam === state.myTeamIdx);
        btnPlayerBuzz.classList.add('hidden');

        if (isMyTurn) {
            waitingMsg.innerText = roomData.status === 'feedback' ? (roomData.feedbackMsg || "VÉRIFICATION...") : "C'EST À VOUS !";
            waitingMsg.classList.add('status-active');
            if (roomData.mode === 'oral' || !roomData.mode) startVoiceRecognition();

            // Respect showHintsToPlayer in oral mode (delay fallback)
            const showChoices = (roomData.mode === 'buttons' || roomData.showHintsToPlayer);
            if (roomData.choices && showChoices) showPlayerChoices(roomData.choices);
            else playerChoices.classList.add('hidden');
        } else {
            waitingMsg.innerText = roomData.status === 'feedback' ? (roomData.feedbackMsg || "VÉRIFICATION...") : (roomData.buzzerName || "Quelqu'un") + " a buzzé !";
            waitingMsg.classList.add('status-buzzed');
            playerChoices.classList.add('hidden');
        }

    } else if (roomData.status === 'finished_song') {
        if (window.playerAudio && window.playerAudio.src && !window.playerAudio.src.includes("data:audio")) {
            window.playerAudio.src = SILENCE_SRC;
            window.playerAudio.loop = true;
            window.playerAudio.play().catch(() => { });
            if (window.keepAliveAudio) window.keepAliveAudio.play().catch(() => { });
        }

        const isWinner = (roomData.winnerTeam === state.myTeamIdx);
        const titleLine = isWinner ? "BRAVO ! 🎉" : (roomData.winnerTeam !== null ? "DOMMAGE ! ⏳" : "TEMPS ÉCOULÉ ! ⌛");
        const songLine = `${roomData.revealedArtist || "?"} - ${roomData.revealedTitle || "?"}`;
        const coverImg = roomData.revealedCover ? `<img src="${roomData.revealedCover}" class="player-result-cover">` : "";

        // Build score list for sync
        let scoresHtm = "<div class='player-scores-list'>";
        if (roomData.scores) {
            [...roomData.scores].sort((a, b) => b.score - a.score).forEach((t, i) => {
                scoresHtm += `<div class="player-score-item ${i === 0 ? 'gold' : ''}"><span>${t.name}</span><span>${t.score} PTS</span></div>`;
            });
        }
        scoresHtm += "</div>";

        waitingMsg.innerHTML = `
            <div style="font-size:1.4rem; font-weight:900; color:var(--secondary); margin-bottom:15px; letter-spacing:2px; text-shadow:0 0 20px var(--secondary);">FIN DU TITRE</div>
            ${coverImg}
            <div class="player-result-title" style="color:${isWinner ? 'var(--secondary)' : 'var(--primary)'}; font-size:1.8rem; margin:10px 0;">${titleLine}</div>
            <div style="font-size:0.8rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:2px; margin-top:15px; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">La réponse était :</div>
            <div style="font-size:1.3rem; font-weight:900; color:white; margin:10px 0 20px; line-height:1.2;">
                <span style="display:block; font-size:0.9rem; opacity:0.8; font-weight:400;">${(roomData.revealedArtist || "Artiste inconnu").toUpperCase()}</span>
                ${(roomData.revealedTitle || "Titre inconnu").toUpperCase()}
            </div>
            ${scoresHtm}
        `;
        waitingMsg.className = 'player-status-indicator status-finished';
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');

    } else if (roomData.status === 'finished') {
        waitingMsg.innerHTML = "<div class='player-result-title'>PARTIE TERMINÉE !</div>";
        if (roomData.scores) {
            let podiumHtm = "<div class='player-scores-list' style='margin-top:20pxScale;'>";
            [...roomData.scores].sort((a, b) => b.score - a.score).forEach((t, i) => {
                podiumHtm += `<div class="player-score-item ${i === 0 ? 'gold' : ''}"><span>#${i + 1} ${t.name}</span><span>${t.score} PTS</span></div>`;
            });
            podiumHtm += "</div>";
            waitingMsg.innerHTML += podiumHtm;
        }
        showScreen('player');
    }

    // Joker button visibility
    if (btnPlayerJoker) {
        const isJokerUsed = roomData.jokers && roomData.jokers[state.myTeamIdx] === false;
        const showJoker = !isJokerUsed && roomData.status === 'playing' && (roomData.mode === 'buttons' || roomData.jokerAvailableThisRound);
        btnPlayerJoker.classList.toggle('hidden', !showJoker);
    }

    // Spin button visibility
    const btnPlayerSpin = document.getElementById('btn-player-spin');
    if (btnPlayerSpin) {
        const isMyTurnToSpin = (roomData.status === 'wheel_waiting' && roomData.wheelTeamIdx === state.myTeamIdx);
        btnPlayerSpin.classList.toggle('hidden', !isMyTurnToSpin);
    }
};

// Wheel Spin Trigger
const btnPlayerSpin = document.getElementById('btn-player-spin');
if (btnPlayerSpin) {
    const triggerSpin = () => {
        if (state.roomRef) {
            state.roomRef.child('wheelSpin').set(true);
            btnPlayerSpin.classList.add('hidden');
        }
    };
    btnPlayerSpin.addEventListener('click', triggerSpin);
    btnPlayerSpin.addEventListener('touchstart', (e) => {
        e.preventDefault();
        triggerSpin();
    }, { passive: false });
}

// BUZZ Trigger for Player
if (btnPlayerBuzz) {
    const handleBuzz = () => {
        if (!btnPlayerBuzz.disabled && state.roomRef) {
            state.roomRef.child('buzz').set({
                teamIdx: state.myTeamIdx,
                timestamp: Date.now()
            });
            btnPlayerBuzz.disabled = true;

            // Trigger Voice Recognition immediately on user gesture
            if (state.gameMode === 'oral' || !state.gameMode) {
                startVoiceRecognition();
            }

            // Re-warm remote audio on gesture to keep Safari happy
            if (state.isRemote && window.playerAudio) {
                window.playerAudio.play().catch(e => { });
            }
        }
    };
    btnPlayerBuzz.addEventListener('click', handleBuzz);
    btnPlayerBuzz.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleBuzz();
    }, { passive: false });
}

// --- VOICE RECOGNITION (STITCH 2026) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecognizing = false;

function setupRecognition(instance) {
    if (!instance) return;
    instance.lang = 'fr-FR';
    instance.continuous = false;
    instance.interimResults = true;
    instance.maxAlternatives = 1;

    instance.onstart = () => {
        isRecognizing = true;
        logDebug("🎤 Micro ON");
        const msg = document.getElementById('waiting-msg');
        if (msg) msg.innerText = "🎤 JE VOUS ÉCOUTE...";
    };

    instance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const isFinal = event.results[0].isFinal;

        if (state.roomRef) {
            state.roomRef.child('vocalAnswer').set({
                teamIdx: state.myTeamIdx !== null ? state.myTeamIdx : 0,
                text: transcript,
                isFinal: isFinal,
                timestamp: Date.now()
            });
        } else if (state.soloMode && window.handleRemoteVocal) {
            window.handleRemoteVocal({
                teamIdx: 0,
                text: transcript,
                isFinal: isFinal
            });
        }

        const waitingMsg = document.getElementById('waiting-msg');
        if (waitingMsg) waitingMsg.innerText = "🎤 " + transcript.toUpperCase();
    };

    instance.onend = () => {
        isRecognizing = false;
        logDebug("🎤 Micro OFF");
    };

    instance.onerror = (event) => {
        isRecognizing = false;
        if (event.error === 'aborted') {
            logDebug("🎤 Micro: Aborted (Normal ignore)");
            return;
        }
        logDebug("🎤 Micro Error: " + event.error);
        if (event.error === 'not-allowed') {
            const msg = document.getElementById('waiting-msg');
            if (msg) msg.innerText = "MICRO BLOQUÉ (Vérifiez réglages)";
        }
    };
}

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    setupRecognition(recognition);
}

function startVoiceRecognition() {
    try {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;

        if (!recognition) {
            recognition = new SR();
            setupRecognition(recognition);
        }

        if (isRecognizing) return;

        // Safari requires a fresh cycle if it was just stop()ed
        setTimeout(() => {
            try {
                if (!isRecognizing) {
                    recognition.start();
                    logDebug("🎤 Mic Start Triggered");
                }
            } catch (e) {
                // If already started or aborting, ignore to prevent freeze
            }
        }, 100);
    } catch (e) {
        logDebug("🎤 Recognition Start Error: " + e.message);
        isRecognizing = false;
    }
}
window.startVoiceRecognition = startVoiceRecognition;

function syncRemoteAudio(url, rate, serverTime) {
    if (!url || !window.playerAudio) return;
    window.lastSyncRate = rate || 1.0;

    // Si on joue déjà cette URL, on s'assure juste d'être en lecture
    if (window.playerAudio.src && window.playerAudio.src.includes(url)) {
        if (window.playerAudio.paused) {
            window.playerAudio.play().catch(e => { });
        }
        if (window.playerAudio.playbackRate !== rate) window.playerAudio.playbackRate = rate;
        return;
    }

    logDebug("📖 Sync New Song: " + url.split('/').pop());
    window.playerAudio.loop = false;
    window.playerAudio.src = url;
    window.playerAudio.load(); // Explicit load fixes some iOS Safari stream locks
    try { window.playerAudio.playbackRate = rate; } catch (e) { }

    // Calculate offset based on server time + offset
    const now = Date.now() + (typeof serverTimeOffset !== 'undefined' ? serverTimeOffset : 0);
    let offset = (now - serverTime) / 1000;

    // Safety: don't seek too far or into negative
    if (offset < 0) offset = 0;
    // v54.5: Better safety for short previews
    if (offset > 28) offset = 0;

    // NEVER set currentTime synchronously before loadedmetadata on iOS!
    // It permanently breaks the audio element's pipeline for certain files.

    const applyOffset = () => {
        if (offset > 0.5 && window.playerAudio.readyState >= 1) {
            try {
                if (Math.abs(window.playerAudio.currentTime - offset) > 1.5) {
                    window.playerAudio.currentTime = offset;
                }
            } catch (e) { }
        }
    };

    // Listen once for metadata to apply the offset correctly
    window.playerAudio.addEventListener('loadedmetadata', applyOffset, { once: true });

    const tryPlay = () => {
        if (!window.playerAudio.src.includes(url) && window.playerAudio.src !== url) return; // Prevent racing updates

        applyOffset();

        window.playerAudio.play().then(() => {
            logDebug("🔊 Sync OK: Joue maintenant.");
            const viz = document.getElementById('player-viz');
            if (viz) viz.classList.remove('hidden');

            const oldBtn = document.getElementById('btn-unlock-audio');
            if (oldBtn) {
                const msg = document.getElementById('waiting-msg');
                if (msg && msg.innerHTML.includes('btn-unlock-audio')) {
                    msg.innerText = "À L'ÉCOUTE...";
                }
            }
        }).catch(e => {
            console.warn("Autoplay failed, showing fallback.", e);
            showUnlockButton();
        });
    };

    tryPlay();
    window.playerAudio.addEventListener('canplay', tryPlay, { once: true });
}

function showUnlockButton() {
    const msg = document.getElementById('waiting-msg');
    if (!msg || document.getElementById('btn-unlock-audio')) return;

    const btnHtml = `<button id='btn-unlock-audio' class='main-btn primary' style='width:100%; border-radius:20px; padding:25px; box-shadow: 0 0 40px var(--primary); animation: pulse 1s infinite;'>🔊 RÉ-ACTIVER LE SON DISTANCE</button>`;

    if (msg.innerText.includes("À L'ÉCOUTE") || msg.innerText.includes("CHARGEMENT")) {
        msg.innerHTML = btnHtml;
    } else {
        const wrapper = document.createElement('div');
        wrapper.style.marginTop = "20px";
        wrapper.innerHTML = btnHtml;
        msg.appendChild(wrapper);
    }

    const unlock = document.getElementById('btn-unlock-audio');
    if (unlock) {
        const trigger = () => {
            if (window.keepAliveAudio) window.keepAliveAudio.play().catch(() => { });
            if (window.playerAudio) window.playerAudio.play().then(() => {
                msg.innerText = "À L'ÉCOUTE...";
            });
        };
        unlock.onclick = trigger;
        unlock.ontouchstart = (e) => { e.preventDefault(); trigger(); };
    }
}

function showPlayerChoices(choices) {
    const playerChoices = document.getElementById('player-choices');
    const waitingMsg = document.getElementById('waiting-msg');
    const btnPlayerBuzz = document.getElementById('btn-player-buzz');

    playerChoices.classList.remove('hidden');
    btnPlayerBuzz.classList.add('hidden');
    const bts = playerChoices.querySelectorAll('.choice-btn');

    bts.forEach(b => b.classList.add('hidden'));

    choices.forEach((c, i) => {
        if (bts[i]) {
            bts[i].innerText = c;
            bts[i].classList.remove('hidden');
            const handleChoice = () => {
                if (state.roomRef) {
                    state.roomRef.child('answer').set({
                        teamIdx: state.myTeamIdx,
                        choice: c,
                        timestamp: Date.now() + (window.serverTimeOffset || 0)
                    });
                }
                playerChoices.classList.add('hidden');
                waitingMsg.innerText = "RÉPONSE ENVOYÉE...";

                // Re-warm remote audio on gesture (Safari stabilization)
                if (state.isRemote && window.playerAudio) {
                    window.playerAudio.play().catch(e => { });
                }
            };
            bts[i].onclick = handleChoice;
            bts[i].ontouchstart = (e) => {
                e.preventDefault();
                handleChoice();
            };
        }
    });
}
