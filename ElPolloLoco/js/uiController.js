/**
 * Controller for handling UI interactions in the game
 * @module uiController
 */

/**
 * Flag indicating whether the control menu is currently open
 * @type {boolean}
 */
let control = false;

/**
 * Flag indicating whether the game has been started
 * @type {boolean}
 */
let gameStarted = false;

/**
 * Flag indicating whether the game is in fullscreen mode
 * @type {boolean}
 */
let fullscreenMode = false;

/**
 * Share gameStarted status with soundController
 * @type {boolean}
 */
window.gameStarted = gameStarted;

/**
 * Event handler for fullscreen change detection
 * Handles UI updates when exiting fullscreen mode
 */
document.addEventListener('fullscreenchange', fullscreenchanged);

/**
 * Starts the game, shows the game UI, and initializes the game state
 */
function startGame() {
  showGame();
  gameStarted = true;
  window.gameStarted = true;
  checkPlayMusic();
  showResponsiveBtn();
  if (fullscreenMode) {
    showCanvasinFull();
  }
}

/**
 * Event handler for fullscreen change detection
 */
function fullscreenchanged() {
  if (document.fullscreenElement == null) {
    closeFullCanvas();
    closeFullNav();
    fullscreenMode = false;
  }
}

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
 */
function showResponsiveBtn() {
  const mobileControl = document.getElementById('mobile-cont');
  
  if (shouldShowMobileControls()) {
    mobileControl.classList.remove('d-none');
  }
}

/**
 * Determines if mobile controls should be shown based on device and screen size
 * @returns {boolean} True if mobile controls should be displayed
 */
function shouldShowMobileControls() {
  return gameStarted && (
    window.innerHeight < 480 || 
    window.innerWidth <= 1024 || 
    isTabletDevice()
  );
}

/**
 * Detects if the current device is likely a tablet
 * @returns {boolean} True if the device is a tablet
 */
function isTabletDevice() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const tabletSized = window.innerWidth >= 600 && window.innerWidth <= 1024;
  const tabletUA = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
  
  return hasTouch && (tabletSized || tabletUA);
}

/**
 * Toggles the visibility of the controls instructions panel
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
 * Toggles fullscreen mode for the game canvas
 */
function setFullscreen() {
  let fullscreenCont = document.getElementById('canvas-cont');
  if (!fullscreenMode) {
    enterFullscreen(fullscreenCont);
    showCanvasinFull();
    showNavinFull();
    updateGameOverScreensForFullscreen(true);
    fullscreenMode = true;
  } else {
    exitFullscreen();
    closeFullCanvas();
    closeFullNav();
    updateGameOverScreensForFullscreen(false);
    fullscreenMode = false;
  }
}

/**
 * Updates game over screens for fullscreen mode
 * @param {boolean} isFullscreen - Whether fullscreen is being enabled or disabled
 */
function updateGameOverScreensForFullscreen(isFullscreen) {
  const gameOverScreenLost = document.getElementById('gameOverScreenLost');
  const gameOverScreenWin = document.getElementById('gameOverScreenWin');
  
  if (isFullscreen) {
    gameOverScreenLost.classList.add('fullscreen-overlay');
    gameOverScreenWin.classList.add('fullscreen-overlay');
  } else {
    gameOverScreenLost.classList.remove('fullscreen-overlay');
    gameOverScreenWin.classList.remove('fullscreen-overlay');
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
  } else {
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
 * Clears all interval timers in the game
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
}

/**
 * Resets the game world state to initial values
 */
function resetGameWorld() {
  if (window.world) {
    resetCharacterState();
    resetStatusBars();
    clearWorldCanvas();
  }
}

/**
 * Resets the character state (coins, bottles)
 */
function resetCharacterState() {
  window.world.character.coins = 0;
  window.world.character.bottles = 0;
}

/**
 * Resets all status bars to their initial values
 */
function resetStatusBars() {
  window.world.statusBarHealth.setPercentageHealth(100);
  window.world.statusBarBottle.setPercentageBottle(0);
  window.world.statusBarCoin.setPercentageCoin(0);
  window.world.statusBarEndboss.setPercentageEndboss(100);
  window.world.statusBarEndboss.visible = false;
}

/**
 * Clears the game canvas and resets bottle notification
 */
function clearWorldCanvas() {
  window.world.bottleNotificationShown = false;
  window.world.ctx.clearRect(0, 0, window.world.canvas.width, window.world.canvas.height);
}

/**
 * Restarts the game after a game over
 * Resets all game state variables and hides game over screens
 */
function restartGame() {
  hideGameScreens();
  resetGameState();
  startNewGame();
}

/**
 * Hides game over screens and notifications
 */
function hideGameScreens() {
  document.getElementById('gameOverScreenLost').style.display = "none";
  document.getElementById('gameOverScreenWin').style.display = "none";
  document.getElementById('bottleNotification').classList.add('d-none');
}

/**
 * Resets the game state
 */
function resetGameState() {
  gameStarted = false;
  window.gameStarted = false;
  clearAllIntervals();
  resetGameWorld();
  stopMusic();
}

/**
 * Initializes and starts a new game
 */
function startNewGame() {
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
  hideGameElements();
  showStartScreen();
  resetGameData();
}

/**
 * Hides all game-related UI elements
 */
function hideGameElements() {
  document.getElementById('canvas').classList.add('d-none');
  document.getElementById('gameOverScreenLost').style.display = "none";
  document.getElementById('gameOverScreenWin').style.display = "none";
  document.getElementById('game-nav').classList.add('d-none');
  document.getElementById('bottleNotification').classList.add('d-none');
}

/**
 * Shows the start screen
 */
function showStartScreen() {
  document.getElementById('first-screen').classList.remove('d-none');
}

/**
 * Resets all game data and stops music
 */
function resetGameData() {
  gameStarted = false;
  window.gameStarted = false;
  clearAllIntervals();
  resetGameWorld();
  stopMusic();
}