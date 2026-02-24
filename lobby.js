/**
 * LOBBY & TEAM MANAGEMENT - STITCH 2026
 */
let oralFallbackTimeout = null;

btnRoleHost.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnRoleHost.click();
}, { passive: false });

btnRolePlayer.addEventListener('click', () => {
    state.role = 'player';
    showScreen('player');
    if (inputRoomCode) {
        inputRoomCode.value = '';
        lastFetchedCode = '';
        selectTeamJoin.innerHTML = '<option value="">ENTREZ LE CODE...</option>';
        btnJoinRoom.disabled = true;
        btnJoinRoom.innerText = 'REJOINDRE LE JEU';
        setTimeout(() => inputRoomCode.focus(), 150);
    }
});

btnRolePlayer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnRolePlayer.click();
}, { passive: false });

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

        initAudio();
        if (audioContext) audioContext.resume().catch(() => { });

        // Anti-blocage mobile : "primer" le player sur ce geste utilisateur
        if (typeof audioPlayer !== 'undefined') {
            audioPlayer.src = "data:audio/wav;base64,UklGRigAAABXQVZFVZmIBAAwAACIAAAAhQAAQAEAgAMEFBMUEjMDADf/f/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/u/+7/7v/y/+7/";
            audioPlayer.play().then(() => audioPlayer.pause()).catch(() => { });
        }

        showScreen('themes');
    };
    btnSoloMode.addEventListener('click', launchSolo);
    btnSoloMode.addEventListener('touchstart', (e) => { e.preventDefault(); launchSolo(); }, { passive: false });
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
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleSoloModeClick(); }, { passive: false });
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
        const msg = finalCode.length === 0 ? "ENTREZ LE CODE..." : `[${finalCode}] (${finalCode.length}/4)...`;
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
    // On le fait ICI, dans le thread direct du clic utilisateur, pour iOS/Safari
    if (!playerAudio) playerAudio = new Audio();
    playerAudio.volume = 0.5;
    playerAudio.play().then(() => {
        logDebug("🔊 Audio débloqué pour mode distance.");
    }).catch(e => {
        logDebug("⚠️ Audio temporairement bloqué par l'OS.");
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
let playerAudio = null;

window.updatePlayerInterface = (roomData) => {
    if (!roomData) return;

    // UI Update
    const waitingMsg = document.getElementById('waiting-msg');
    const btnPlayerBuzz = document.getElementById('btn-player-buzz');
    const playerChoices = document.getElementById('player-choices');
    const btnPlayerJoker = document.getElementById('btn-player-joker');

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
    if (roomData.status === 'playing' && roomData.audioUrl) {
        logDebug("📡 Mode Distance: " + (isRemote ? "OUI" : "NON"));
    }

    // Helper to clear existing classes
    waitingMsg.className = 'player-status-indicator';

    if (roomData.status === 'playing' || roomData.status === 'loading') {
        const isPlaying = roomData.status === 'playing';
        // NE PAS ÉCRASER SI LE BOUTON DE DÉBLOCAGE SON EST PRÉSENT
        if (!document.getElementById('btn-unlock-audio')) {
            waitingMsg.innerText = isPlaying ? "À L'ÉCOUTE..." : "CHARGEMENT DU TITRE...";
        }
        waitingMsg.classList.add(isPlaying ? 'status-active' : 'status-waiting');

        // Safari stabilization: only stop if actually recognizing
        if (isRecognizing && recognition) {
            try { recognition.stop(); } catch (e) { }
        }

        const isArcade = roomData.mode === 'buttons';
        const showHints = isPlaying && (roomData.showHintsToPlayer || isArcade) && roomData.choices;
        if (isPlaying && !showHints && !isArcade) {
            btnPlayerBuzz.classList.remove('hidden');
            btnPlayerBuzz.disabled = false;
        } else {
            btnPlayerBuzz.classList.add('hidden');
        }

        if (showHints) {
            showPlayerChoices(roomData.choices);
        } else {
            playerChoices.classList.add('hidden');
        }

        // Remote Audio Sync
        if (isRemote && isPlaying && roomData.audioUrl) {
            syncRemoteAudio(roomData.audioUrl, roomData.mysteryRate || 1.0, roomData.timestamp);
        } else if (!isPlaying && playerAudio) {
            playerAudio.pause();
            // Important: Don't set playerAudio to null on iOS/Safari, reuse the object
            // Remove visualizer if any
            const viz = document.getElementById('player-viz');
            if (viz) viz.classList.add('hidden');
        }
    } else if (roomData.status === 'buzzed' || roomData.status === 'feedback') {
        if (playerAudio) playerAudio.pause();
        const viz = document.getElementById('player-viz');
        if (viz) viz.classList.add('hidden');

        const isMyTurn = (roomData.buzzerTeam === state.myTeamIdx);
        const isOral = (roomData.mode === 'oral' || !roomData.mode);

        btnPlayerBuzz.disabled = true;
        btnPlayerBuzz.classList.add('hidden');

        if (isMyTurn) {
            waitingMsg.innerText = roomData.status === 'feedback' ? (roomData.feedbackMsg || "VÉRIFICATION...") : "C'EST À VOUS !";
            waitingMsg.classList.add('status-active');

            if (isOral) {
                // Ensure recognition is running
                startVoiceRecognition();
                // FALLBACK: Show choices after a delay in oral mode
                if (roomData.status === 'buzzed' && roomData.choices && !oralFallbackTimeout && playerChoices.classList.contains('hidden')) {
                    oralFallbackTimeout = setTimeout(() => {
                        if (state.roomRef) {
                            // Re-verify we are still in buzzed state and it's our turn
                            state.roomRef.once('value', (snap) => {
                                const d = snap.val();
                                if (d && d.status === 'buzzed' && d.buzzerTeam === state.myTeamIdx) {
                                    showPlayerChoices(d.choices);
                                }
                            });
                        }
                        oralFallbackTimeout = null;
                    }, 5000); // 5 seconds delay
                }
            } else {
                if (isRecognizing && recognition) recognition.stop();
                if (roomData.status === 'buzzed' && roomData.choices) {
                    showPlayerChoices(roomData.choices);
                }
            }
        } else {
            if (isRecognizing && recognition) recognition.stop();
            waitingMsg.innerText = roomData.status === 'feedback' ? (roomData.feedbackMsg || "VÉRIFICATION...") : (roomData.buzzerName || "Quelqu'un") + " a buzzé !";
            waitingMsg.classList.add('status-buzzed');
            playerChoices.classList.add('hidden');
        }
    } else if (roomData.status === 'finished_song') {
        if (oralFallbackTimeout) { clearTimeout(oralFallbackTimeout); oralFallbackTimeout = null; }
        if (isRecognizing && recognition) recognition.stop();
        if (playerAudio) playerAudio.pause();

        const isWinner = (roomData.winnerTeam === state.myTeamIdx);
        const titleLine = isWinner ? "BRAVO ! 🎉" : (roomData.winnerTeam !== null ? "DOMMAGE ! ⏳" : "FIN DU TEMPS ! ⌛");
        const pointsLine = roomData.feedbackMsg || "";
        const songLine = `${roomData.revealedArtist || "?"} - ${roomData.revealedTitle || "?"}`;

        waitingMsg.innerHTML = `
            <div style="font-size:1.8rem; font-weight:900; color:var(--secondary); margin-bottom:10px;">${titleLine}</div>
            <div style="font-size:1.1rem; color:white; font-weight:bold; margin-bottom:15px; background:rgba(255,255,255,0.1); padding:5px 15px; border-radius:10px;">${pointsLine}</div>
            <div style="font-size:0.9rem; color:var(--text-dim);">C'était :</div>
            <div style="font-size:1.2rem; font-weight:bold; color:var(--primary); margin-top:5px;">${songLine.toUpperCase()}</div>
        `;

        waitingMsg.classList.add('status-active');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
        if (btnPlayerJoker) btnPlayerJoker.classList.add('hidden');

    } else if (roomData.status === 'finished') {
        if (isRecognizing && recognition) recognition.stop();
        if (playerAudio) playerAudio.pause();
        waitingMsg.innerHTML = "<div style='color:var(--secondary); font-size:1.5rem; font-weight:900;'>PARTIE TERMINÉE !</div>";
        if (roomData.scores) {
            const sorted = [...roomData.scores].sort((a, b) => b.score - a.score);
            let podiumHtm = "<div style='margin-top:20px; text-align:left; background:rgba(255,255,255,0.05); padding:15px; border-radius:15px; font-size: 0.9rem;'>";
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
    } else {
        if (isRecognizing && recognition) recognition.stop();
        waitingMsg.innerText = "EN ATTENTE...";
        waitingMsg.classList.add('status-waiting');
        btnPlayerBuzz.classList.add('hidden');
        playerChoices.classList.add('hidden');
    }

    // Refresh Joker Button
    if (btnPlayerJoker) {
        const isJokerUsed = roomData.jokers && roomData.jokers[state.myTeamIdx] === false;
        const isOral = roomData.mode === 'oral' || !roomData.mode;
        // Joker Rare : Uniquement si jokerAvailableThisRound est vrai (en mode Flash Quizz)
        const showJoker = !isJokerUsed && roomData.status === 'playing' && (!isOral || roomData.jokerAvailableThisRound);
        btnPlayerJoker.classList.toggle('hidden', !showJoker);
    }

    // Wheel of Fate Handling
    const btnPlayerSpin = document.getElementById('btn-player-spin');
    if (btnPlayerSpin) {
        if (roomData.status === 'wheel_waiting') {
            const isMyTurnToSpin = (roomData.wheelTeamIdx === state.myTeamIdx);
            btnPlayerSpin.classList.toggle('hidden', !isMyTurnToSpin);

            if (isMyTurnToSpin) {
                waitingMsg.innerText = "À VOUS DE LANCER LA ROUE !";
                waitingMsg.classList.add('status-active');
                btnPlayerBuzz.classList.add('hidden');
            } else {
                waitingMsg.innerText = "L'ÉQUIPE " + (roomData.wheelTeamName || "").toUpperCase() + " LANCE LA ROUE...";
                waitingMsg.classList.add('status-waiting');
            }
        } else {
            btnPlayerSpin.classList.add('hidden');
        }
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
    if (!url) return;

    if (!playerAudio) {
        playerAudio = new Audio();
    }

    // Use includes to avoid issues with absolute/relative URL translations by the browser
    if (playerAudio.src && playerAudio.src.includes(url)) {
        if (playerAudio.paused && !playerAudio.ended) {
            playerAudio.play().catch(e => { /* still blocked? */ });
        }
        return;
    }

    logDebug("📖 Sync Audio: " + url.split('/').pop());
    playerAudio.pause();
    playerAudio.src = url;
    playerAudio.load();
    playerAudio.playbackRate = rate;

    // Calculate offset based on server time + offset
    const now = Date.now() + (typeof serverTimeOffset !== 'undefined' ? serverTimeOffset : 0);
    const offset = (now - serverTime) / 1000;

    if (offset > 0 && offset < 30) {
        playerAudio.currentTime = offset;
    }

    const tryPlay = () => {
        playerAudio.play().then(() => {
            logDebug("🔊 Audio en cours (Sync OK)");
            const viz = document.getElementById('player-viz');
            if (viz) viz.classList.remove('hidden');
            // Hide unlock button if it was there
            const oldBtn = document.getElementById('btn-unlock-audio');
            if (oldBtn) {
                const msg = document.getElementById('waiting-msg');
                if (msg) msg.innerText = "À L'ÉCOUTE...";
            }
        }).catch(e => {
            console.warn("Remote audio blocked by browser behavior:", e);
            // Fallback UI to unlock audio
            const msg = document.getElementById('waiting-msg');
            if (msg && !document.getElementById('btn-unlock-audio')) {
                msg.innerHTML = `<button id='btn-unlock-audio' style='background:var(--secondary); color:white; border:none; padding:15px 30px; border-radius:15px; font-weight:bold; font-size:1.2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: pulse 1.5s infinite;'>🔊 ACTIVER LE SON DISTANCE</button>`;
                const unlock = document.getElementById('btn-unlock-audio');
                if (unlock) {
                    const trigger = () => {
                        playerAudio.play().then(() => {
                            msg.innerText = "À L'ÉCOUTE...";
                        });
                    };
                    unlock.onclick = trigger;
                    unlock.ontouchstart = (e) => { e.preventDefault(); trigger(); };
                }
            }
        });
    };

    // Give it a tiny moment to load metadata for currentTime
    if (playerAudio.readyState >= 2) {
        tryPlay();
    } else {
        playerAudio.oncanplay = () => {
            tryPlay();
            playerAudio.oncanplay = null;
        };
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
                        timestamp: Date.now()
                    });
                }
                playerChoices.classList.add('hidden');
                waitingMsg.innerText = "RÉPONSE ENVOYÉE...";
            };
            bts[i].onclick = handleChoice;
            bts[i].ontouchstart = (e) => {
                e.preventDefault();
                handleChoice();
            };
        }
    });
}
