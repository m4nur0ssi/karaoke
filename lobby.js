/**
 * MULTIPLAYER LOBBY - STITCH 2026
 * FIREBASE SYNC
 */

let recognition = null;
let isRecognizing = false;

async function createRoom() {
    // On génère un code à 4 lettres
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    state.roomCode = code;
    state.roomRef = firebase.database().ref('rooms/' + code);
    
    // Initial State in DB
    state.roomRef.set({
        teams: state.teams,
        scores: state.scores,
        gameState: { status: 'lobby' },
        createdAt: Date.now()
    });

    logDebug("Salon créé : " + code);
    document.getElementById('room-code-display').classList.remove('hidden');
    document.getElementById('current-room-id').innerText = code;
}

async function joinRoom(code, teamIdx) {
    logDebug("Tentative de connexion au salon : " + code);
    const ref = firebase.database().ref('rooms/' + code);
    
    ref.once('value', (snap) => {
        if (!snap.exists()) {
            alert("Salon introuvable !");
            return;
        }

        state.roomCode = code;
        state.roomRef = ref;
        state.myTeamIdx = teamIdx;
        
        showScreen('player');
        document.getElementById('player-lobby').classList.add('hidden');
        document.getElementById('player-game').classList.remove('hidden');
        document.getElementById('player-room-badge').innerText = "ROOM: " + code;
        
        logDebug("Connecté ! Équipe : " + state.teams[teamIdx]);

        // Sync with Room
        listenToRoom();
    });
}

function listenToRoom() {
    state.roomRef.on('value', (snap) => {
        const data = snap.val();
        if (!data) return;

        state.teams = data.teams;
        state.scores = data.scores;
        state.gameState = data.gameState;

        // Update local UI
        if (!state.isHost) {
            handleGameStatePlayer(data.gameState);
        }
    });

    // Listen to feedback (Bravo/Dommage)
    state.roomRef.child('feedback').on('value', (snap) => {
        const f = snap.val();
        if (f && !state.isHost) {
            const msg = document.getElementById('waiting-msg');
            msg.innerText = f.text;
            msg.className = "waiting-msg " + f.className;
        }
    });
}

function handleGameStatePlayer(gs) {
    const buzzBtn = document.getElementById('btn-player-buzz');
    const msg = document.getElementById('waiting-msg');
    const viz = document.getElementById('player-viz');
    const choices = document.getElementById('player-choices');

    if (gs.status === 'playing') {
        buzzBtn.classList.remove('hidden');
        viz.classList.remove('hidden');
        msg.innerText = "MUSIQUE EN COURS...";
        choices.classList.add('hidden');
    } else if (gs.status === 'buzz') {
        buzzBtn.classList.add('hidden');
        viz.classList.add('hidden');
        if (gs.activeBuzzer === state.myTeamIdx) {
            msg.innerText = "À VOUS !";
            startVoiceRecognition();
        } else {
            msg.innerText = "L'ADVERSAIRE RÉPOND...";
        }
    } else if (gs.status === 'reveal') {
        buzzBtn.classList.add('hidden');
        viz.classList.add('hidden');
        msg.innerText = "RÉVÉLATION...";
    }
}

// BUZZER PLAYER
document.getElementById('btn-player-buzz').addEventListener('click', () => {
    if (!state.roomRef) return;
    
    // Geste utilisateur indispensable avant l'appel asynchrone pour le micro plus tard
    if (window.startVoiceRecognition) {
       // On pré-autorise ou on garde le context
    }

    state.roomRef.child('gameState').update({
        status: 'buzz',
        activeBuzzer: state.myTeamIdx,
        buzzTime: Date.now()
    });
});

// VOICE RECOGNITION (Player side)
function startVoiceRecognition() {
    try {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            if (window.displayFeedback) window.displayFeedback("MICRO NON SUPPORTÉ", "feedback-dommage");
            return;
        }

        if (!recognition) {
            recognition = new SR();
            setupRecognition(recognition);
        }

        if (isRecognizing) {
            try { recognition.stop(); } catch (e) { }
        }

        // APPEL IMMEDIAT - Indispensable pour iOS/Safari
        try {
            recognition.start();
        } catch (e) {
            console.warn("Recognition start failed, retrying with tiny delay...", e);
            setTimeout(() => {
                try { recognition.start(); } catch (err) { }
            }, 100);
        }
    } catch (e) {
        console.error("Failed to start recognition:", e);
        if (window.displayFeedback) window.displayFeedback("ERREUR Lancement Micro", "feedback-dommage");
        isRecognizing = false;
    }
}

function setupRecognition(instance) {
    if (!instance) return;
    instance.lang = 'fr-FR';
    instance.continuous = false;
    instance.interimResults = true;

    instance.onstart = () => {
        isRecognizing = true;
        logDebug("Microphone activé !");
        if (window.displayFeedback) {
            window.displayFeedback("JE VOUS ÉCOUTE... 🎤", "feedback-bravo", true);
        }
        const waitingMsg = document.getElementById('waiting-msg');
        if (waitingMsg) waitingMsg.innerText = "🎤 JE VOUS ÉCOUTE...";
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
            window.handleRemoteVocal(transcript, isFinal);
        }
    };

    instance.onend = () => {
        isRecognizing = false;
        logDebug("Microphone coupé.");
        const waitingMsg = document.getElementById('waiting-msg');
        if (waitingMsg && !waitingMsg.innerText.includes("BRAVO") && !waitingMsg.innerText.includes("DOMMAGE")) {
            waitingMsg.innerText = "Terminé.";
        }
    };

    instance.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        isRecognizing = false;
    };
}

// Init tôt pour Safari
document.addEventListener('click', () => {
    // On essaye d'instancier un micro factice sur un clic pour débloquer les permissions
    if (!recognition) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) {
            recognition = new SR();
            setupRecognition(recognition);
            logDebug("Speech recognition initialized on user gesture.");
        }
    }
}, { once: true });

window.startVoiceRecognition = startVoiceRecognition;
