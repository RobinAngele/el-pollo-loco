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
     * Sound effect for collecting coins
     * @type {Audio}
     */
    coin_sound = new Audio('audio/coin.mp3');
    
    /**
     * Sound effect for collecting bottles
     * @type {Audio}
     */
    bottle_sound = new Audio('audio/bottle.mp3');
    
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
     * Maximum number of coins player can collect
     * @type {number}
     */
    MAX_COINS = 100;
    
    /**
     * Maximum number of bottles player can carry
     * @type {number}
     */
    MAX_BOTTLES = 5;
    
    /**
     * Flag indicating if bottle notification is shown
     * @type {boolean}
     */
    bottleNotificationShown = false;

    /**
     * Flag indicating if character is temporarily invincible after taking damage
     * @type {boolean}
     */
    characterInvincible = false;

    /**
     * Duration of invincibility after taking damage (in milliseconds)
     * @type {number}
     */
    invincibleDuration = 1000;

    /**
     * Timestamp when character was last hit
     * @type {number}
     */
    lastHitTime = 0;

    /**
     * World constructor
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - The keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.checkForGameOver();
        this.endbossIcon.src = 'img/7_statusbars/3_icons/icon_health_endboss.png';
        this.coinIcon.src = 'img/7_statusbars/3_icons/icon_coin.png';
        this.bottleIcon.src = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    }

    /**
     * Checks if the game should end based on character or endboss state
     */
    checkForGameOver() {
        setInterval(() => {
            if (this.character.isDead()) {
                setTimeout(() => {
                    this.hideBottleNotificationAndShowGameOver('lost');
                }, 1500);
            } else if (this.endboss.isDead()) {
                setTimeout(() => {
                    this.hideBottleNotificationAndShowGameOver('win');
                }, 1500);
            }
        }, 1000);
    }

    /**
     * Hides bottle notification and shows appropriate game over screen
     * @param {string} outcome - 'win' or 'lost'
     */
    hideBottleNotificationAndShowGameOver(outcome) {
        // Hide bottle notification if shown
        const notification = document.getElementById('bottleNotification');
        if (notification) {
            notification.classList.add('d-none');
        }
        this.bottleNotificationShown = false;
        
        // Show appropriate game over screen
        if (outcome === 'lost') {
            this.showYouLostScreen();
        } else {
            this.showGameOverScreen();
        }
        
        this.clearAllIntervals();
        gameMusic.pause();
    }

    /**
     * Refreshes the page after a delay
     */
    refreshPageWithTimer() {
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    /**
     * Shows the game over screen when player loses
     */
    showYouLostScreen() {
        let lost = document.getElementById('gameOverScreenLost');
        lost.style.display = "flex";
        lost.style.zIndex = "999";
    }

    /**
     * Shows the game over screen when player wins
     */
    showGameOverScreen() {
        let win = document.getElementById('gameOverScreenWin');
        win.style.display = "flex";
        win.style.zIndex = "999";
    }

    /**
     * Checks if music should be playing based on global sound settings
     */
    checkPlayMusic() {
        if (playMusic && gameMusic && gameMusic.paused) {
            gameMusic.play();
        } else if (!playMusic && gameMusic && !gameMusic.paused) {
            gameMusic.pause();
        }
    }

    /**
     * Sets the world reference on character and endboss
     */
    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    /**
     * Position where the endboss fight is triggered
     * @type {number}
     */
    static BOSS_TRIGGER_POSITION = 2000;

    /**
     * Checks if the boss fight should start based on character position
     */
    checkBossFight() {
        if (this.character.x > World.BOSS_TRIGGER_POSITION) {
            this.endboss.firstContact = true;
            this.statusBarEndboss.visible = true;
        }
    }

    /**
     * Handles showing/hiding the bottle notification
     */
    checkBottleNotification() {
        const notification = document.getElementById('bottleNotification');
        if (!notification) return;
        
        if (this.character.bottles === 0 && this.character.coins >= 20) {
            if (!this.bottleNotificationShown) {
                notification.classList.remove('d-none');
                this.bottleNotificationShown = true;
            }
        } else if (this.bottleNotificationShown) {
            notification.classList.add('d-none');
            this.bottleNotificationShown = false;
        }
    }

    /**
     * Starts the game main loop with required intervals
     */
    run() {
        setInterval(() => {
            this.checkPlayerCollisions();
            this.checkEnvironmentInteractions();
            this.checkGameState();
            this.checkBottleNotification();
            this.checkInvincibilityStatus();
        }, 1000 / 60);
        
        setInterval(() => this.checkEnemyHitsPeppe(), 200);
        setInterval(() => this.checkThrowObjects(), 100);
    }
    
    /**
     * Checks for player collisions with enemies
     */
    checkPlayerCollisions() {
        this.checkPeppeHitsEnemy();
    }
    
    /**
     * Checks for interactions with environment objects (coins, bottles)
     */
    checkEnvironmentInteractions() {
        this.checkCollisionsCoins();
        this.checkCollisionBottles();
    }
    
    /**
     * Checks overall game state (music, boss, cleanup)
     */
    checkGameState() {
        this.checkPlayMusic();
        this.checkBossFight();
        this.cleanupBabyChickens();
    }

    /**
     * Checks if enemies are hitting the player character
     */
    checkEnemyHitsPeppe() {
        if (this.characterInvincible) return;
        
        this.level.enemies.forEach((enemy) => {
            if (this.hitboxColliding(enemy)) {
                this.playerTakesDamage();
            }
        });
    }
    
    /**
     * Applies damage to the player and updates UI
     */
    playerTakesDamage() {
        this.character.hit(20);
        this.character.idleTimer = 0;
        this.statusBarHealth.setPercentageHealth(this.character.energy);
        
        // Set character as invincible for a short duration
        this.characterInvincible = true;
        this.lastHitTime = new Date().getTime();
    }

    /**
     * Checks and updates the character's invincibility status
     */
    checkInvincibilityStatus() {
        if (this.characterInvincible) {
            const currentTime = new Date().getTime();
            if (currentTime - this.lastHitTime > this.invincibleDuration) {
                this.characterInvincible = false;
            }
        }
    }

    /**
     * Checks if enemy is colliding with character's hitbox
     * @param {MovableObject} enemy - The enemy to check collision with
     * @returns {boolean} True if collision is occurring
     */
    hitboxColliding(enemy) {
        return this.character.isColliding(enemy) &&
            !enemy.isDead() &&
            this.character.speedY >= 0;
    }

    /**
     * Checks if bottle can be thrown and handles throwing
     */
    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
            this.character.bottleCooldown = this.character.bottleCooldownTime;
            this.character.idleTimer = 0;
        }
        this.handleBottleCollisions();
        this.handleBottleCleanup();
        this.statusBarBottle.setPercentageBottle(this.character.bottles);
    }
    
    /**
     * Checks if the conditions to throw a bottle are met
     * @returns {boolean} True if bottle can be thrown
     */
    canThrowBottle() {
        return this.keyboard.T && 
               this.character.bottles > 0 && 
               this.character.bottleCooldown <= 0;
    }
    
    /**
     * Handles collisions between thrown bottles and enemies
     */
    handleBottleCollisions() {
        for (let i = this.throwableObject.length - 1; i >= 0; i--) {
            const bottle = this.throwableObject[i];
            const hitEnemy = this.findCollidingEnemy(bottle);
            
            if (hitEnemy) {
                this.damageEnemy(hitEnemy, bottle);
                this.throwableObject.splice(i, 1);
            }
        }
    }
    
    /**
     * Finds an enemy that a bottle is colliding with
     * @param {ThrowableObjects} bottle - The bottle to check
     * @returns {MovableObject|undefined} The colliding enemy or undefined
     */
    findCollidingEnemy(bottle) {
        return this.level.enemies.find(enemy => 
            bottle.isColliding(enemy) && !enemy.isDead());
    }
    
    /**
     * Removes bottles that are out of bounds
     */
    handleBottleCleanup() {
        // Modified to account for bottles thrown in either direction
        this.throwableObject = this.throwableObject.filter(bottle => 
            bottle.y <= 500 && 
            bottle.x >= -500 && 
            bottle.x <= this.level.level_end_x + 500
        );
    }
    
    /**
     * Applies damage to an enemy hit by a bottle
     * @param {MovableObject} enemy - The enemy to damage
     * @param {ThrowableObjects} bottle - The bottle that hit the enemy
     */
    damageEnemy(enemy, bottle) {
        enemy.hit(1);
        if (enemy instanceof Endboss) {
            this.statusBarEndboss.setPercentageEndboss(enemy.energy * 20);
        }
    }

    /**
     * Creates and throws a bottle in the direction the character is facing
     */
    throwBottle() {
        const offsetY = 100;
        const offsetX = this.character.otherDirection ? -20 : 40;
        const bottle = new ThrowableObjects(
            this.character.x + offsetX, 
            this.character.y + offsetY,
            this.character.otherDirection
        );
        this.throwableObject.push(bottle);
        this.character.bottles--;
        this.updateStatusBarBottle();
    }

    /**
     * Clears all interval timers to prevent memory leaks
     */
    clearAllIntervals() {
        const MAX_INTERVAL_ID = 9999;
        for (let i = 1; i < MAX_INTERVAL_ID; i++) {
            window.clearInterval(i);
        }
    }

    /**
     * Checks if player character is jumping on enemies
     */
    checkPeppeHitsEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.canJumpOnEnemy(enemy)) {
                this.handleJumpOnEnemy(enemy);
            }
        });
    }
    
    /**
     * Determines if the character can jump on an enemy
     * @param {MovableObject} enemy - The enemy to check
     * @returns {boolean} True if the character can jump on the enemy
     */
    canJumpOnEnemy(enemy) {
        return this.character.isColliding(enemy) &&
            !enemy.isDead() &&
            this.character.speedY < 0 &&
            (enemy instanceof Chicken || enemy instanceof BabyChicken);
    }
    
    /**
     * Handles the character jumping on an enemy
     * @param {MovableObject} enemy - The enemy being jumped on
     */
    handleJumpOnEnemy(enemy) {
        this.character.jump();
        enemy.energy--;
    }

    /**
     * Checks for collisions between the character and coins
     */
    checkCollisionsCoins() {
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    /**
     * Collects a coin when the character collides with it
     * @param {Coin} coin - The coin object to collect
     */
    collectCoin(coin) {
        if (window.SOUNDS_ENABLED) {
            this.coin_sound.play();
        }
        let coinNum = this.level.coins.indexOf(coin);
        this.level.coins.splice(coinNum, 1);
        this.character.coins = Math.min(this.character.coins + 20, this.MAX_COINS);
        this.statusBarCoin.setPercentageCoin(this.character.coins);
    }

    /**
     * Checks for collisions between the character and bottles
     */
    checkCollisionBottles() {
        this.level.bottles.forEach(bottle => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    /**
     * Collects a bottle when the character collides with it
     * @param {Bottle} bottle - The bottle object to collect
     */
    collectBottle(bottle) {
        if (window.SOUNDS_ENABLED) {
            this.bottle_sound.play();
        }
        let bottleNum = this.level.bottles.indexOf(bottle);
        this.level.bottles.splice(bottleNum, 1);

        if (this.character.bottles < this.MAX_BOTTLES) {
            this.character.bottles++;
            this.updateStatusBarBottle();
        }
    }

    /**
     * Checks if there's space to collect another bottle
     * @returns {boolean} Always returns true in current implementation
     */
    freeBottleSpace() {
        return true;
    }

    /**
     * Updates the bottle status bar display
     */
    updateStatusBarBottle() {
        this.statusBarBottle.setPercentageBottle(this.character.bottles);
    }

    /**
     * Removes dead baby chickens from the game
     */
    cleanupBabyChickens() {
        for (let i = this.babyChickens.length - 1; i >= 0; i--) {
            const chicken = this.babyChickens[i];
            if (chicken.isDead() && chicken.defeated) {
                this.babyChickens.splice(i, 1);
            }
        }
        
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (enemy instanceof BabyChicken && enemy.isDead() && enemy.defeated) {
                setTimeout(() => {
                    const index = this.level.enemies.indexOf(enemy);
                    if (index !== -1) {
                        this.level.enemies.splice(index, 1);
                    }
                }, 1000);
            }
        }
    }

    /**
     * Main game rendering loop
     * Clears the canvas and draws all game objects
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObject);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.babyChickens);
        this.ctx.translate(-this.camera_x, 0);

        this.addTopMap(this.statusBarHealth);
        this.addTopMap(this.statusBarBottle);
        this.addTopMap(this.statusBarCoin);
        this.addTopMap(this.statusBarEndboss);

        if (this.statusBarEndboss.visible) {
            this.ctx.drawImage(this.endbossIcon, 495, 10, 60, 60);
        }

        this.ctx.translate(this.camera_x, 0);
        this.addTopMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds an array of objects to the game map
     * @param {Array} objects - Array of drawable objects to add to the map
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addTopMap(o);
        });
    }

    /**
     * Adds a single object to the game map, handling direction
     * @param {DrawableObjects} mo - The movable object to draw
     */
    addTopMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an image horizontally for rendering objects facing left
     * @param {DrawableObjects} mo - The movable object to flip
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas state after flipping an image
     * @param {DrawableObjects} mo - The movable object to restore
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}

