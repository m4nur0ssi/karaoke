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

logDebug('Script loaded v2026_v54.3');

// Tentative de synchronisation immédiate
setTimeout(() => {
    if (window.syncSongs) window.syncSongs();
}, 100);

// Global Error Handler for remote debugging
window.onerror = function (msg, url, lineNo, columnNo, error) {
    logDebug(`ERROR: ${msg} line:${lineNo} col:${columnNo}`);
    return false;
};

window.audioContext = null;
function initAudio() {
    if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}
window.initAudio = initAudio;

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
    failedSongs: [],
    streakTeam: null,
    streakCount: 0,
    currentModifier: null,
    mysteryRate: 1.0,
    speedBonusActive: false,
    winningTeam: null,
    jokers: [true, true, true, true],
    activeJoker: null,
    soloMode: false,

    // Multiplayer State
    role: null,
    roomId: null,
    gameMode: 'oral',
    myTeamIdx: null,
    roomRef: null,
    songsUntilWheel: 0,

    songs: {}
};

// Initialisation différée pour s'assurer que SONG_DATABASE est chargé
function syncSongs() {
    if (typeof SONG_DATABASE !== 'undefined' && Object.keys(state.songs).length === 0) {
        state.songs = SONG_DATABASE;
        logDebug("Database synchronisée : " + Object.keys(state.songs).length + " thèmes.");
        return true;
    }
    return Object.keys(state.songs).length > 0;
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

// Lobby / Setup Elements (Shared)
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
const btnCreateTeams = document.getElementById('btn-create-teams');
const navHome = document.getElementById('nav-home');
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
const btnSoloBuzz = document.getElementById('btn-solo-buzz');
const soloBuzzContainer = document.getElementById('solo-buzz-container');

let lastBuzzedTeam = null;

// Firebase Connection Monitor
let serverTimeOffset = 0;
if (typeof firebase !== 'undefined') {
    firebase.database().ref('.info/serverTimeOffset').on('value', (snap) => {
        serverTimeOffset = snap.val() || 0;
    });
    firebase.database().ref('.info/connected').on('value', (snap) => {
        const connected = snap.val();
        state.dbConnected = connected;
        const statusEl = document.getElementById('firebase-status');
        if (statusEl) {
            statusEl.innerText = connected ? "DB CONNECTÉE ✅" : "DB DÉCONNECTÉE ❌ (Auto-Secours...)";
            statusEl.style.color = connected ? "#00ff88" : "#ff3366";
            statusEl.style.cursor = "pointer";
            statusEl.onclick = () => {
                logDebug("Tentative de reconnexion manuelle...");
                firebase.database().goOnline();
            };
        }
    });
}

function showScreen(name) {
    if (!screens[name]) return;
    Object.values(screens).forEach(s => s && s.classList.remove('active'));
    screens[name].classList.add('active');
    state.screen = name;
}

function goHome() {
    if (state.role === 'player') {
        if (state.roomRef) state.roomRef.off();
        if (window.teamListener) window.teamListener.off();
        state.role = null;
        state.roomId = null;
        state.roomRef = null;
        state.myTeamIdx = null;
        if (playerLobby) playerLobby.classList.remove('hidden');
        if (playerGame) playerGame.classList.add('hidden');
    }
    if (state.role === 'host') {
        state.isPlaying = false;
        if (typeof audioPlayer !== 'undefined') audioPlayer.pause();
        if (state.interval) clearInterval(state.interval);
    }
    state.soloMode = false;
    showScreen('role');
}
window.goHome = goHome;

if (navHome) {
    navHome.addEventListener('click', goHome);
    navHome.addEventListener('touchstart', (e) => { e.preventDefault(); goHome(); }, { passive: false });
}

// Host Room Creation
btnRoleHost.addEventListener('click', () => {
    state.role = 'host';
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    state.roomId = "";
    for (let i = 0; i < 4; i++) state.roomId += charset.charAt(Math.floor(Math.random() * charset.length));

    currentRoomIdSpan.innerText = state.roomId;
    roomCodeDisplay.classList.remove('hidden');

    if (window.firebase && firebase.apps.length) {
        state.roomRef = firebase.database().ref('rooms/' + state.roomId);

        const initData = {
            status: 'initiating',
            timestamp: Date.now(),
            hostActive: true,
            version: 'v2026_v54.3',
            teams: state.teams.slice(0, state.teamCount).map(t => t.name)
        };

        state.roomRef.set(initData);

        // REST Force Fallback
        const forceREST = (data = initData) => {
            const dbUrl = (typeof firebaseConfig !== 'undefined') ? firebaseConfig.databaseURL : "https://quizzgame2026-default-rtdb.firebaseio.com";
            fetch(`${dbUrl}/rooms/${state.roomId}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(e => { });
        };

        forceREST();
        if (window.syncHostTeams) setTimeout(window.syncHostTeams, 500);

        setInterval(() => {
            if (state.role === 'host' && state.roomId) {
                const hb = { hostHeartbeat: Date.now() };
                if (state.roomRef) state.roomRef.update(hb);
                if (!state.dbConnected) forceREST(hb);
            }
        }, 3000);

        state.roomRef.child('buzz').on('value', (snap) => {
            const val = snap.val();
            if (val && window.handleRemoteBuzz) window.handleRemoteBuzz(val.teamIdx);
        });

        state.roomRef.child('answer').on('value', (snap) => {
            const val = snap.val();
            if (val && window.handleRemoteAnswer) window.handleRemoteAnswer(val);
        });

        state.roomRef.child('vocalAnswer').on('value', (snap) => {
            const val = snap.val();
            if (val && window.handleRemoteVocal) window.handleRemoteVocal(val);
        });

        state.roomRef.child('activeJoker').on('value', (snap) => {
            const val = snap.val();
            if (val !== undefined) state.activeJoker = val;
        });
    }

    // Auto-open the Team configuration modal directly after creating the room
    const modalTeams = document.getElementById('modal-teams');
    if (modalTeams) modalTeams.classList.add('active');
});

logDebug('Script initialized (v2026_v54.3)');

// Prevent iOS bounce on non-scrollable containers
document.addEventListener('touchmove', function (e) {
    if (!e.target.closest('#screen-themes') && !e.target.closest('#screen-role')) {
        e.preventDefault();
    }
}, { passive: false });
