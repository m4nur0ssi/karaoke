/**
 * KARAOKE ENGINE - STITCH 2026
 * SYNC & CORE LOGIC
 */

let state = {
    screen: 'role',
    teams: [],
    scores: [0, 0, 0, 0],
    currentSong: null,
    isPlaying: false,
    timer: 30,
    interval: null,
    gameMode: 'oral', // 'oral' ou 'buttons'
    soloMode: false,
    soloName: '',
    roomCode: '',
    isHost: false,
    myTeamIdx: null,
    remoteAudio: false,
    roomRef: null,
    jokersUsed: [false, false, false, false],
    activeJoker: null, // index de l'équipe qui a activé un joker
    currentArtistChoices: [],
    currentModifier: null,
    wheelBusy: false,
    streak: 0,
    lastWinnerIdx: null
};

// MODIFICATEURS DE LA ROUE
const MODIFIERS = [
    { id: 'double', label: 'SCORE x2', color: '#ffcc00', weight: 3, icon: '🔥', desc: 'Les points de cette manche comptent double !' },
    { id: 'triple', label: 'SCORE x3', color: '#ff3300', weight: 1, icon: '⚡', desc: 'Manche royale : Points triplés !' },
    { id: 'half', label: 'VITESSE x1.5', color: '#00ccff', weight: 2, icon: '⏩', desc: 'La musique accélère, soyez vifs !' },
    { id: 'slow', label: 'VITESSE x0.75', color: '#9933ff', weight: 2, icon: '🐢', desc: 'Mode escargot activé.' },
    { id: 'blind', label: 'SANS INDICES', color: '#ff0066', weight: 2, icon: '🙈', desc: 'Aucun bouton d\'artiste ne s\'affichera.' },
    { id: 'steal', label: 'VOL DE POINTS', color: '#33cc33', weight: 1, icon: '💰', desc: 'Si vous trouvez, vous volez 10pts à un adversaire !' }
];

function logDebug(msg) {
    console.log(`[QUIZ] ${msg}`);
    const debug = document.getElementById('debug-log');
    if (debug) {
        debug.innerHTML += `<div>> ${msg}</div>`;
        debug.scrollTop = debug.scrollHeight;
    }
}

logDebug('Script loaded v2026_v53.8');

// INITIALISATION UI
document.addEventListener('DOMContentLoaded', () => {
    // Bouton Accueil logo
    document.getElementById('nav-home').addEventListener('click', () => goHome());

    // Role Selection
    document.getElementById('btn-role-host').addEventListener('click', () => {
        state.isHost = true;
        showScreen('home');
        initHostMode();
    });

    document.getElementById('btn-role-player').addEventListener('click', () => {
        state.isHost = false;
        showScreen('player');
    });

    // Home Setup
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.gameMode = btn.dataset.mode;
        });
    });

    document.getElementById('btn-create-teams').addEventListener('click', () => {
        document.getElementById('modal-teams').style.display = 'flex';
    });

    // Solo Mode
    document.querySelectorAll('.solo-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.solo-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('btn-solo-mode').addEventListener('click', () => {
        const name = document.getElementById('input-solo-name').value.trim();
        if (!name) {
            alert("Entrez un prénom pour le mode solo !");
            return;
        }
        state.soloMode = true;
        state.soloName = name;
        state.teams = [name, "Ordinateur"];
        state.isHost = true;
        state.gameMode = document.querySelector('.solo-mode-btn.active').dataset.soloMode;

        initSoloGame();
    });

    // Modal Teams
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const count = parseInt(btn.dataset.count);
            document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            for (let i = 1; i <= 4; i++) {
                const input = document.getElementById(`input-team-${i}`);
                if (i <= count) input.classList.remove('hidden');
                else input.classList.add('hidden');
            }
        });
    });

    document.getElementById('btn-start-game').addEventListener('click', () => {
        const count = parseInt(document.querySelector('.count-btn.active').dataset.count);
        state.teams = [];
        for (let i = 1; i <= count; i++) {
            state.teams.push(document.getElementById(`input-team-${i}`).value || `Équipe ${i}`);
        }
        document.getElementById('modal-teams').style.display = 'none';
        
        if (!state.roomCode) {
            createRoom();
        }
        showScreen('themes');
    });

    // Theme Selection
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
            const theme = card.dataset.theme;
            startNewGame(theme);
        });
    });

    // Player Join
    document.getElementById('btn-join-room').addEventListener('click', () => {
        const code = document.getElementById('input-room-code').value.toUpperCase();
        const teamIdx = parseInt(document.getElementById('select-team-join').value);
        state.remoteAudio = document.getElementById('check-remote-audio').checked;
        joinRoom(code, teamIdx);
    });

    // Monitor Firebase Connection
    if (typeof firebase !== 'undefined') {
        const connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                logDebug("Firebase: CONNECTÉ");
            } else {
                logDebug("Firebase: DÉCONNECTÉ");
            }
        });
    }
});

function showScreen(screenId) {
    state.screen = screenId;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenId}`).classList.add('active');
    
    // Cleanup navigation bar
    if (screenId === 'role' || screenId === 'home') {
        document.getElementById('room-code-display').classList.add('hidden');
    } else if (state.roomCode) {
        document.getElementById('room-code-display').classList.remove('hidden');
        document.getElementById('current-room-id').innerText = state.roomCode;
    }

    window.scrollTo(0, 0);
}

function goHome() {
    if (state.interval) clearInterval(state.interval);
    if (state.roomRef) state.roomRef.off();
    
    // Clean UI
    document.getElementById('reveal-card').classList.add('hidden');
    document.getElementById('modal-teams').style.display = 'none';
    
    state.soloMode = false;
    state.roomCode = '';
    state.isHost = false;
    
    showScreen('role');
}

window.goHome = goHome;
