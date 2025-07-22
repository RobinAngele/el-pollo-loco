/**
 * Canvas element for the game
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Main world object that handles game logic
 * @type {World}
 */
let world;

/**
 * Keyboard input handler for the game
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Initializes the game by setting up the canvas and world
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    responsiveControl();
}

/**
 * Sets up responsive controls for both touch and keyboard inputs
 */
function responsiveControl() {
    setupTouchControls();
    setupKeyboardControls();
}

/**
 * Sets up touch controls for mobile devices
 */
function setupTouchControls() {
    setupTouchButton('btnLeft', 'LEFT');
    setupTouchButton('btnRight', 'RIGHT');
    setupTouchButton('btnJump', 'UP');
    setupTouchButton('btnThrow', 'T');
    setupTouchButton('btnExchange', 'B');
}

/**
 * Sets up a touch button with event listeners
 * @param {string} buttonId - The ID of the button element
 * @param {string} keyProperty - The corresponding keyboard property to set
 */
function setupTouchButton(buttonId, keyProperty) {
    const button = document.getElementById(buttonId);
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = true;
    });
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = false;
    });
}

/**
 * Sets up keyboard event listeners for game controls
 */
function setupKeyboardControls() {
    const keyMap = getKeyMapping();
    addKeyEventListeners(keyMap);
}

/**
 * Returns the key code to action mapping
 * @returns {object} Key code mapping
 */
function getKeyMapping() {
    return {
        '39': 'RIGHT', '37': 'LEFT', '38': 'UP', '40': 'DOWN',
        '84': 'T', '27': 'ESC', '66': 'B'
    };
}

/**
 * Adds keydown and keyup event listeners
 * @param {object} keyMap - Key code mapping
 */
function addKeyEventListeners(keyMap) {
    window.addEventListener("keydown", (e) => {
        if (keyMap[e.keyCode]) {
            keyboard[keyMap[e.keyCode]] = true;
        }
    });
    window.addEventListener("keyup", (e) => {
        if (keyMap[e.keyCode]) {
            keyboard[keyMap[e.keyCode]] = false;
        }
    });
}

/**
 * Handles the complete game start sequence with proper error handling
 */
function startGameSequence() {
    try {
        if (!validateGameFunctions()) return;
        executeGameStart();
    } catch (error) {
        handleGameStartError(error);
    }
}

/**
 * Validates that all required game functions exist
 * @returns {boolean} True if all functions are available
 */
function validateGameFunctions() {
    const requiredFunctions = ['initLevel', 'init', 'startGame'];
    for (const funcName of requiredFunctions) {
        if (typeof window[funcName] !== 'function') {
            console.error(`${funcName} function not found`);
            return false;
        }
    }
    return true;
}

/**
 * Executes the game start sequence
 */
function executeGameStart() {
    initLevel();
    init();
    startGame();
}

/**
 * Handles errors during game start with retry logic
 * @param {Error} error - The error that occurred
 */
function handleGameStartError(error) {
    console.error('Error starting game:', error);
    setTimeout(() => {
        try {
            executeGameStart();
        } catch (retryError) {
            console.error('Retry failed:', retryError);
        }
    }, 100);
}

/**
 * Ensure all scripts are loaded before allowing game start
 */
document.addEventListener('DOMContentLoaded', function() {
    window.startGameSequence = startGameSequence;
});