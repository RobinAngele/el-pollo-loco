/**
 * Main game world class that manages all game entities and interactions
 */
class World {
    /**
     * The player character
     * @type {Character}
     */
    character = new Character();
    
    /**
     * The current game level
     * @type {Level}
     */
    level = level1;
    
    /**
     * Canvas element
     * @type {HTMLCanvasElement}
     */
    canvas;
    
    /**
     * Canvas rendering context
     * @type {CanvasRenderingContext2D}
     */
    ctx;
    
    /**
     * Keyboard input handler
     * @type {Keyboard}
     */
    keyboard;
    
    /**
     * Camera X position for scrolling
     * @type {number}
     */
    camera_x = 0;
    
    /**
     * Status bar for player health
     * @type {StatusBarHealth}
     */
    statusBarHealth = new StatusBarHealth();
    
    /**
     * Status bar for collected bottles
     * @type {StatusBarBottle}
     */
    statusBarBottle = new StatusBarBottle();
    
    /**
     * Status bar for collected coins
     * @type {StatusBarCoin}
     */
    statusBarCoin = new StatusBarCoin();
    
    /**
     * Status bar for endboss health
     * @type {StatusBarEndboss}
     */
    statusBarEndboss = new StatusBarEndboss();
    
    /**
     * Start screen object
     * @type {Startscreen}
     */
    startScreen = new Startscreen();
    
    /**
     * Array of throwable objects (bottles)
     * @type {ThrowableObject[]}
     */
    throwableObject = [];
    
    /**
     * Reference to the endboss (final enemy)
     * @type {Endboss}
     */
    endboss = this.level.enemies[this.level.enemies.length - 1];
    
    /**
     * Array of baby chicken enemies
     * @type {BabyChicken[]}
     */
    babyChickens = [];
    
    /**
     * Endboss icon image
     * @type {HTMLImageElement}
     */
    endbossIcon = new Image();
    
    /**
     * Coin icon image
     * @type {HTMLImageElement}
     */
    coinIcon = new Image();
    
    /**
     * Bottle icon image
     * @type {HTMLImageElement}
     */
    bottleIcon = new Image();
    
    /**
     * Manager for collision detection and handling
     * @type {CollisionManager}
     */
    collisionManager;
    
    /**
     * Manager for item collection and interactions
     * @type {ItemManager}
     */
    itemManager;
    
    /**
     * Manager for bottle throwing mechanics
     * @type {BottleManager}
     */
    bottleManager;
    
    /**
     * Manager for rendering game objects
     * @type {RenderManager}
     */
    renderManager;
    
    /**
     * Manager for game state and UI interactions
     * @type {GameStateManager}
     */
    gameStateManager;

    /**
     * World constructor
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - The keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        
        // Initialize managers
        this.collisionManager = new CollisionManager(this);
        this.itemManager = new ItemManager(this);
        this.bottleManager = new BottleManager(this);
        this.renderManager = new RenderManager(this);
        this.gameStateManager = new GameStateManager(this);
        
        this.renderManager.draw();
        this.setWorld();
        this.run();
        this.gameStateManager.checkForGameOver();
        
        // Load icons
        this.endbossIcon.src = 'img/7_statusbars/3_icons/icon_health_endboss.png';
        this.coinIcon.src = 'img/7_statusbars/3_icons/icon_coin.png';
        this.bottleIcon.src = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    }

    /**
     * Sets the world reference on character and endboss
     */
    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    /**
     * Starts the game main loop with required intervals
     */
    run() {
        setInterval(() => {
            this.collisionManager.checkPlayerCollisions();
            this.itemManager.checkEnvironmentInteractions();
            this.gameStateManager.checkGameState();
            this.gameStateManager.checkBottleNotification();
            this.collisionManager.checkInvincibilityStatus();
        }, 1000 / 60);
        
        setInterval(() => this.collisionManager.checkEnemyHitsPeppe(), 200);
        setInterval(() => this.bottleManager.checkThrowObjects(), 100);
    }
    
    /**
     * Allows the player to buy a bottle using coins
     * @returns {boolean} Whether the purchase was successful
     */
    buyBottle() {
        return this.itemManager.buyBottle();
    }
}

