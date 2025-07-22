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
    updateNavStyling(false);
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
 * Toggles the visibility of control instructions
 * @param {string} elementId - ID of the element to toggle
 */
function toggleControlVisibility(elementId) {
  let element = document.getElementById(elementId);
  if (!control) {
    element.classList.remove('d-none');
    control = true;
  } else {
    element.classList.add('d-none');
    control = false;
  }
}

/**
 * Toggles the controls instructions panel
 */
function toggleControlsInstructions() {
  toggleControlVisibility('game-controls-instructions');
}

/**
 * Toggles the control instructions
 */
function showControl() {
  toggleControlVisibility('controller-exp');
}

/**
 * Toggles fullscreen mode for the game canvas
 */
function setFullscreen() {
  let fullscreenCont = document.getElementById('canvas-cont');
  if (!fullscreenMode) {
    enableFullscreen(fullscreenCont);
  } else {
    disableFullscreen();
  }
}

/**
 * Enables fullscreen mode and updates UI
 * @param {HTMLElement} fullscreenCont - The container element
 */
function enableFullscreen(fullscreenCont) {
  enterFullscreen(fullscreenCont);
  showCanvasinFull();
  updateNavStyling(true);
  updateGameOverScreensForFullscreen(true);
  fullscreenMode = true;
}

/**
 * Disables fullscreen mode and resets UI
 */
function disableFullscreen() {
  exitFullscreen();
  closeFullCanvas();
  updateNavStyling(false);
  updateGameOverScreensForFullscreen(false);
  fullscreenMode = false;
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
  setCanvasContainerSize(canvasCont);
  canvas.style.height = '480px';
  headline.classList.remove('d-none');
}

/**
 * Sets the appropriate canvas container size based on screen height
 * @param {HTMLElement} canvasCont - The canvas container element
 */
function setCanvasContainerSize(canvasCont) {
  if (screen.height < 480) {
    canvasCont.style.maxWidth = '560px';
    canvasCont.style.maxHeight = '400px';
  } else {
    canvasCont.style.maxWidth = '720px';
    canvasCont.style.maxHeight = '480px';
  }
}

/**
 * Updates navigation styling for fullscreen mode
 * @param {boolean} isFullscreen - Whether to apply fullscreen styling
 */
function updateNavStyling(isFullscreen) {
  let gameNav = document.getElementById('game-nav');
  if (isFullscreen) {
    gameNav.style.position = 'absolute';
    gameNav.style.top = '10px';
    gameNav.style.left = '10px';
    gameNav.style.right = '10px';
  } else {
    gameNav.style.position = 'unset';
    gameNav.style.top = 'unset';
    gameNav.style.left = 'unset';
    gameNav.style.right = 'unset';
  }
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
    window.world.character.coins = 0;
    window.world.character.bottles = 0;
    window.world.statusBarHealth.setPercentageHealth(100);
    window.world.statusBarBottle.setPercentageBottle(0);
    window.world.statusBarCoin.setPercentageCoin(0);
    window.world.statusBarEndboss.setPercentageEndboss(100);
    window.world.statusBarEndboss.visible = false;
    window.world.bottleNotificationShown = false;
    window.world.ctx.clearRect(0, 0, window.world.canvas.width, window.world.canvas.height);
  }
}

/**
 * Restarts the game after a game over
 */
function restartGame() {
  handleGameNavigation(false);
}

/**
 * Returns to the main menu from the game
 */
function backToMainMenu() {
  handleGameNavigation(true);
}

/**
 * Handles game restart and menu navigation
 * @param {boolean} returnToMenu - If true, returns to main menu; if false, restarts game
 */
function handleGameNavigation(returnToMenu) {
  resetGameState();
  if (returnToMenu) {
    showMainMenu();
  } else {
    restartGameSession();
  }
}

/**
 * Resets the game state and UI
 */
function resetGameState() {
  hideGameScreens();
  gameStarted = false;
  window.gameStarted = false;
  clearAllIntervals();
  resetGameWorld();
  stopMusic();
}

/**
 * Shows the main menu and hides game elements
 */
function showMainMenu() {
  document.getElementById('first-screen').classList.remove('d-none');
  hideGameElements();
}

/**
 * Restarts a new game session
 */
function restartGameSession() {
  initLevel();
  init();
  startGame();
}

/**
 * Hides game over screens and notifications
 */
function hideGameScreens() {
  const elements = ['gameOverScreenLost', 'gameOverScreenWin'];
  elements.forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById('bottleNotification').classList.add('d-none');
}

/**
 * Hides all game-related UI elements
 */
function hideGameElements() {
  document.getElementById('canvas').classList.add('d-none');
  hideGameScreens();
  document.getElementById('game-nav').classList.add('d-none');
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