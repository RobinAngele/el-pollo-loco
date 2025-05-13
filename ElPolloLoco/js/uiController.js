/**
 * Controller for handling UI interactions in the game
 * @module uiController
 */

/**
 * Flag indicating whether the control menu is currently open
 * @type {boolean}
 * @default false
 */
let control = false;

/**
 * Flag indicating whether music should be played
 * @type {boolean}
 * @default true
 */
let playMusic = true;

/**
 * Flag indicating whether the game has been started
 * @type {boolean}
 * @default false
 */
let gameStarted = false;

/**
 * Audio element for the background music
 * @type {HTMLAudioElement}
 */
let gameMusic = new Audio('audio/background_music.mp3');
gameMusic.volume = 0.3;

/**
 * Flag indicating whether the game is in fullscreen mode
 * @type {boolean}
 * @default false
 */
let fullscreenMode = false;

/**
 * Global flag to enable/disable all sound effects in the game
 * @type {boolean}
 * @default true
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
 * Starts the game, shows the game UI, and initializes the game state
 */
function startGame() {
  showGame();
  gameStarted = true;
  checkPlayMusic();
  showResponsiveBtn();
  if (fullscreenMode && gameStarted) {
    showCanvasinFull();
  }
}

/**
 * Event handler for fullscreen change detection
 * Handles UI updates when exiting fullscreen mode
 */
function fullscreenchanged () {
  if (document.fullscreenElement == null) {
    let fullscreenCont = document.getElementById('canvas-cont');
    closeFullCanvas();
    closeFullNav();
    fullscreenMode = false;
  }
}
document.addEventListener('fullscreenchange', fullscreenchanged);

/**
 * Shows the game canvas and navigation, hides the start screen
 */
function showGame() {
  let canvas = document.getElementById('canvas');
  let startScreen = document.getElementById('first-screen');
  let gameNav = document.getElementById('game-nav');
  canvas.classList.remove('d-none');
  startScreen.classList.add('d-none');
  gameNav.classList.remove('d-none');
}

/**
 * Shows responsive buttons for mobile devices when appropriate
 * Also shows controls on tablet devices based on screen size or touch capability
 */
function showResponsiveBtn() {
  let mobileControl = document.getElementById('mobile-cont');
  
  // Show controls on small height screens (phones in landscape)
  if (window.innerHeight < 480 && gameStarted) {
    mobileControl.classList.remove('d-none');
  } 
  // Show controls on tablet devices (based on width or touch capability)
  else if (gameStarted && (window.innerWidth <= 1024 || isTabletDevice())) {
    mobileControl.classList.remove('d-none');
  }
}

/**
 * Detects if the current device is likely a tablet
 * @returns {boolean} True if the device is a tablet
 */
function isTabletDevice() {
  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  /**
   * Checks if the device has screen dimensions typical for tablets
   * @type {boolean}
   * @private
   */
  const tabletSized = window.innerWidth >= 600 && window.innerWidth <= 1024;
  
  /**
   * Checks if the user agent string matches common tablet identifiers
   * Note: User agent detection is not fully reliable but used as a fallback
   * @type {boolean}
   * @private
   */
  const tabletUA = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
  
  return hasTouch && (tabletSized || tabletUA);
}

/**
 * Plays background music if audio is enabled in game settings
 * @returns {void}
 */
function checkPlayMusic() {
  if (playMusic) {
    gameMusic.play();
  }
}

/**
 * Toggles the visibility of the controls instructions panel
 * Updates the control state flag to track panel visibility
 * @returns {void}
 */
function toggleControlsInstructions() {
  let controlMenu = document.getElementById('game-controls-instructions');
  if (!control) {
    controlMenu.classList.remove('d-none');
    control = true;
  } else {
    controlMenu.classList.add('d-none');
    control = false;
  }
}

/**
 * Toggles game sound on/off and updates the UI accordingly
 * Saves the user's preference to localStorage for persistence between sessions
 * @returns {void}
 */
function muteSound() {
  let mute = document.getElementById('mute');
  let unmute = document.getElementById('unmute');
  let muteInGame = document.getElementById('muteInGame');
  let unmuteInGame = document.getElementById('unmuteInGame');
  
  if (playMusic) {
    gameMusic.pause();
    playMusic = false;
    window.SOUNDS_ENABLED = false;
    muteIcon(mute, unmute, muteInGame, unmuteInGame);
    localStorage.setItem('soundsEnabled', 'false');
  } else {
    if (gameStarted) {
      gameMusic.play();
    }
    playMusic = true;
    window.SOUNDS_ENABLED = true;
    unmuteIcon(mute, unmute, muteInGame, unmuteInGame);
    localStorage.setItem('soundsEnabled', 'true');
  }
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
 * Plays a sound if sounds are enabled
 * @param {HTMLAudioElement} sound - The sound to play
 */
function playSound(sound) {
  if (window.SOUNDS_ENABLED) {
      sound.play();
  }
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
 * Toggles fullscreen mode for the game canvas
 */
function setFullscreen() {
  let fullscreenCont = document.getElementById('canvas-cont');
  if (!fullscreenMode) {
    enterFullscreen(fullscreenCont);
    showCanvasinFull();
    showNavinFull();
    fullscreenMode = true;
  } else {
    exitFullscreen(fullscreenCont);
    closeFullCanvas();
    closeFullNav();
    fullscreenMode = false;
  }
}

/**
 * Reverts canvas styling when exiting fullscreen mode
 */
function closeFullCanvas() {
  let canvas = document.getElementById('canvas');
  let canvasCont = document.getElementById('canvas-cont');
  let headline = document.getElementById('headline');

  if (screen.height < 480) {
    canvasCont.style.maxWidth = '560px';
    canvasCont.style.maxHeight = '400px';
  }else{
    canvasCont.style.maxWidth = '720px';
    canvasCont.style.maxHeight = '480px';
  }
  canvas.style.height = '480px';

  headline.classList.remove('d-none');
}

/**
 * Updates navigation styling for fullscreen mode
 */
function showNavinFull() {
  let gameNav = document.getElementById('game-nav');
  gameNav.style.position = 'absolute';
  gameNav.style.top = '10px';
  gameNav.style.left = '10px';
  gameNav.style.right = '10px';
}

/**
 * Reverts navigation styling when exiting fullscreen mode
 */
function closeFullNav() {
  let gameNav = document.getElementById('game-nav');
  gameNav.style.position = 'unset';
  gameNav.style.top = 'unset';
  gameNav.style.left = 'unset';
  gameNav.style.right = 'unset';
}

/**
 * Updates canvas styling for fullscreen mode
 */
function showCanvasinFull() {
  let canvas = document.getElementById('canvas');
  let canvasCont = document.getElementById('canvas-cont');
  let headline = document.getElementById('headline');

  canvasCont.style.maxWidth = 'none';
  canvasCont.style.maxHeight = 'none';
  canvas.style.width = '100%';
  canvas.style.height = '100vh';
  headline.classList.add('d-none');
}

/**
 * Requests fullscreen mode for a specific element
 * @param {HTMLElement} element - The element to display in fullscreen
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Toggles the visibility of the control instructions
 */
function showControl() {
  let controlInstructions = document.getElementById('controller-exp');
  if (!control) {
    controlInstructions.classList.remove('d-none');
    control = true;
  } else {
    controlInstructions.classList.add('d-none');
    control = false;
  }
}

/**
 * Restarts the game after a game over
 * Resets all game state variables and hides game over screens
 */
function restartGame() {
  document.getElementById('gameOverScreenLost').style.display = "none";
  document.getElementById('gameOverScreenWin').style.display = "none";
  document.getElementById('bottleNotification').classList.add('d-none');
  
  gameStarted = false;
  
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
  
  if (window.world) {
    window.world.character.coins = 0;
    window.world.character.bottles = 0;
    
    window.world.statusBarHealth.setPercentageHealth(100);
    window.world.statusBarBottle.setPercentageBottle(0);
    window.world.statusBarCoin.setPercentageCoin(0);
    window.world.statusBarEndboss.setPercentageEndboss(100);
    window.world.statusBarEndboss.visible = false;
    
    if (window.world.bottleNotificationShown) {
      window.world.bottleNotificationShown = false;
    }
    
    window.world.ctx.clearRect(0, 0, window.world.canvas.width, window.world.canvas.height);
  }
  
  if (gameMusic && !gameMusic.paused) {
    gameMusic.pause();
    gameMusic.currentTime = 0;
  }
  
  initLevel();
  init();
  startGame();
}

/**
 * Hides the bottle notification overlay
 */
function hideBottleNotification() {
  const bottleNotification = document.getElementById('bottleNotification');
  if (bottleNotification) {
    bottleNotification.classList.add('d-none');
  }
  
  if (window.world && window.world.bottleNotificationShown) {
    window.world.bottleNotificationShown = false;
  }
}

/**
 * Returns to the main menu from the game
 * Resets game state and shows the start screen
 */
function backToMainMenu() {
  document.getElementById('canvas').classList.add('d-none');
  document.getElementById('gameOverScreenLost').style.display = "none";
  document.getElementById('gameOverScreenWin').style.display = "none";
  document.getElementById('game-nav').classList.add('d-none');
  document.getElementById('bottleNotification').classList.add('d-none');
  
  document.getElementById('first-screen').classList.remove('d-none');
  
  gameStarted = false;
  
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
  
  if (window.world) {
    window.world.character.coins = 0;
    window.world.character.bottles = 0;
    
    window.world.statusBarHealth.setPercentageHealth(100);
    window.world.statusBarBottle.setPercentageBottle(0);
    window.world.statusBarCoin.setPercentageCoin(0);
    window.world.statusBarEndboss.setPercentageEndboss(100);
    window.world.statusBarEndboss.visible = false;
    
    if (window.world.bottleNotificationShown) {
      window.world.bottleNotificationShown = false;
    }
    
    window.world.ctx.clearRect(0, 0, window.world.canvas.width, window.world.canvas.height);
  }
  
  if (gameMusic && !gameMusic.paused) {
    gameMusic.pause();
    gameMusic.currentTime = 0;
  }
}