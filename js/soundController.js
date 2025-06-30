/**
 * Controller for managing sound functionality in the game
 * @module soundController
 */

/**
 * Flag indicating whether music should be played
 * @type {boolean}
 */
let playMusic = true;

/**
 * Audio element for the background music
 * @type {HTMLAudioElement}
 */
let gameMusic = new Audio('audio/background_music.mp3');
gameMusic.volume = 0.3;

/**
 * Global flag to enable/disable all sound effects in the game
 * @type {boolean}
 * @global
 */
window.SOUNDS_ENABLED = true;

/**
 * Initialize sound preferences when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    loadSoundPreference();
});

/**
 * Loads sound preference from localStorage and updates the UI accordingly
 */
function loadSoundPreference() {
    const soundState = localStorage.getItem('soundsEnabled');
    
    if (soundState === 'false') {
        playMusic = false;
        window.SOUNDS_ENABLED = false;
        updateMuteButtonsDisplay(true);
    } else {
        playMusic = true;
        window.SOUNDS_ENABLED = true;
        updateMuteButtonsDisplay(false);
    }
}

/**
 * Updates the mute button display based on current mute state
 * @param {boolean} isMuted - Whether the sound is currently muted
 */
function updateMuteButtonsDisplay(isMuted) {
    const mute = document.getElementById('mute');
    const unmute = document.getElementById('unmute');
    const muteInGame = document.getElementById('muteInGame');
    const unmuteInGame = document.getElementById('unmuteInGame');
    
    if (isMuted) {
        muteIcon(mute, unmute, muteInGame, unmuteInGame);
    } else {
        unmuteIcon(mute, unmute, muteInGame, unmuteInGame);
    }
}

/**
 * Gets all sound control button elements
 * @returns {Object} Object containing all mute/unmute buttons
 */
function getSoundButtons() {
    return {
        mute: document.getElementById('mute'),
        unmute: document.getElementById('unmute'),
        muteInGame: document.getElementById('muteInGame'),
        unmuteInGame: document.getElementById('unmuteInGame')
    };
}

/**
 * Toggles game sound on/off and updates the UI accordingly
 */
function muteSound() {
    const buttons = getSoundButtons();
    toggleSoundState();
    updateSoundUI(buttons);
    saveSoundPreference();
}

/**
 * Toggles the sound state variables
 */
function toggleSoundState() {
    playMusic = !playMusic;
    window.SOUNDS_ENABLED = playMusic;
}

/**
 * Updates the sound-related UI based on current sound state
 * @param {Object} buttons - Object containing sound control buttons
 */
function updateSoundUI(buttons) {
    if (playMusic) {
        if (window.gameStarted) gameMusic.play();
        unmuteIcon(buttons.mute, buttons.unmute, buttons.muteInGame, buttons.unmuteInGame);
    } else {
        gameMusic.pause();
        muteIcon(buttons.mute, buttons.unmute, buttons.muteInGame, buttons.unmuteInGame);
    }
}

/**
 * Saves sound preference to localStorage
 */
function saveSoundPreference() {
    localStorage.setItem('soundsEnabled', playMusic.toString());
}

/**
 * Updates UI to show muted icons
 * @param {HTMLElement} mute - The mute button in main menu
 * @param {HTMLElement} unmute - The unmute button in main menu
 * @param {HTMLElement} muteInGame - The mute button in game
 * @param {HTMLElement} unmuteInGame - The unmute button in game
 */
function muteIcon(mute, unmute, muteInGame, unmuteInGame) {
    mute.classList.add('d-none');
    unmute.classList.remove('d-none');
    muteInGame.classList.add('d-none');
    unmuteInGame.classList.remove('d-none');
}

/**
 * Updates UI to show unmuted icons
 * @param {HTMLElement} mute - The mute button in main menu
 * @param {HTMLElement} unmute - The unmute button in main menu
 * @param {HTMLElement} muteInGame - The mute button in game
 * @param {HTMLElement} unmuteInGame - The unmute button in game
 */
function unmuteIcon(mute, unmute, muteInGame, unmuteInGame) {
    mute.classList.remove('d-none');
    unmute.classList.add('d-none');
    muteInGame.classList.remove('d-none');
    unmuteInGame.classList.add('d-none');
}

/**
 * Plays background music if audio is enabled in game settings
 */
function checkPlayMusic() {
    if (playMusic) {
        gameMusic.play();
    }
}

/**
 * Stops background music and resets it to the beginning
 */
function stopMusic() {
    if (gameMusic && !gameMusic.paused) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
    }
}

/**
 * Plays a sound if sounds are enabled
 * @param {HTMLAudioElement} sound - The sound to play
 */
function playSound(sound) {
    if (window.SOUNDS_ENABLED) {
        sound.play();
    }
}

/**
 * Checks if music is enabled
 * @returns {boolean} True if music is enabled
 */
function isMusicEnabled() {
    return playMusic;
}

// Make functions available globally
window.muteSound = muteSound;
window.playSound = playSound;
window.checkPlayMusic = checkPlayMusic;
window.stopMusic = stopMusic;
window.isMusicEnabled = isMusicEnabled;