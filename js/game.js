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
 * Sets up keyboard controls with event listeners
 */
function setupKeyboardControls() {
    const keyMap = {
        '39': 'RIGHT',
        '37': 'LEFT',
        '38': 'UP',
        '40': 'DOWN',
        '84': 'T',
        '27': 'ESC',
        '66': 'B'
    };

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
 * This function ensures all dependencies are loaded before starting the game
 */
function startGameSequence() {
    try {
        if (typeof initLevel !== 'function') {
            console.error('initLevel function not found');
            return;
        }
        if (typeof init !== 'function') {
            console.error('init function not found');
            return;
        }
        if (typeof startGame !== 'function') {
            console.error('startGame function not found');
            return;
        }

        initLevel();
        
        init();
        
        startGame();
        
    } catch (error) {
        console.error('Error starting game:', error);
        setTimeout(() => {
            try {
                initLevel();
                init();
                startGame();
            } catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }, 100);
    }
}

/**
 * Ensure all scripts are loaded before allowing game start
 */
document.addEventListener('DOMContentLoaded', function() {
    window.startGameSequence = startGameSequence;
    
    const requiredClasses = ['World', 'Keyboard', 'Level', 'Character'];
    const missingClasses = requiredClasses.filter(className => typeof window[className] === 'undefined');
    
    if (missingClasses.length > 0) {
        console.warn('Missing classes:', missingClasses);
    }
});



