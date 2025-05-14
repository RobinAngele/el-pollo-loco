/**
 * Character class representing the player character (Pepe)
 * @extends MovableObject
 */
class Character extends MovableObject {

    y = 180;
    height = 250;
    width = 100;
    /**
     * Image paths for walking animation
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * Image paths for jumping up animation
     * @type {string[]}
     */
    IMAGES_JUMPING_UP = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png'
    ];

    /**
     * Image paths for jumping down animation
     * @type {string[]}
     */
    IMAGES_JUMPING_DOWN = [
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Image paths for hurt animation
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Image paths for dead animation
     * @type {string[]}
     */
    IMAGES_ISDEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Image paths for idle animation
     * @type {string[]}
     */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /**
     * Image paths for long idle animation
     * @type {string[]}
     */
    IMAGES_LONGIDLE = [

        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /**
     * Number of coins collected by the character
     * @type {number}
     */
    coins = 0;

    /**
     * Number of bottles collected by the character
     * @type {number}
     */
    bottles = 0;

    /**
     * Cooldown time for bottle usage
     * @type {number}
     */
    bottleCooldown = 0;

    /**
     * Maximum cooldown time for bottle usage
     * @type {number}
     */
    bottleCooldownTime = 1000;

    /**
     * Reference to the game world
     * @type {object}
     */
    world;

    /**
     * Timer for idle state
     * @type {number}
     */
    idleTimer = 0;

    /**
     * Sound effect for getting hit
     * @type {Audio}
     */
    gethit_sound = new Audio('audio/hit.wav');

    /**
     * Flag indicating if coin-bottle exchange is active
     * @type {boolean}
     */
    exchangeCoinBottleActive = false;

    /**
     * Flag indicating if the character is rising during a jump
     * @type {boolean}
     */
    isRising = false;

    /**
     * Flag indicating if the character is falling during a jump
     * @type {boolean}
     */
    isFalling = false;

    /**
     * Current image index for jump up animation
     * @type {number}
     */
    jumpUpCurrentImage = 0;

    /**
     * Current image index for jump down animation
     * @type {number}
     */
    jumpDownCurrentImage = 0;

    /**
     * Interval ID for jump up animation
     * @type {number|null}
     */
    jumpUpInterval = null;

    /**
     * Interval ID for jump down animation
     * @type {number|null}
     */
    jumpDownInterval = null;

    /**
     * Constructor for the Character class
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING_UP);
        this.loadImages(this.IMAGES_JUMPING_DOWN);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ISDEAD);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.animate();
        this.animateJump();
        this.applyGravity();
    };

    /**
     * Handles character animations
     */
    animate() {
        setInterval(() => this.movement(), 1000 / 60);
        setInterval(() => this.animations(), 40);
        setInterval(() => this.increaseIdleTimer(), 500);
        setInterval(() => this.idle(), 200);
        setInterval(() => {
            if (this.bottleCooldown > 0) {
                this.bottleCooldown -= 20;
            }
        }, 20);
        setInterval(() => this.checkCoinBottleExchange(), 100);
    }

    /**
     * Handles jump animations
     */
    animateJump() {
        setInterval(() => {
            if (this.isAboveGround()) {
                if (this.isRising && !this.jumpUpInterval) {
                    this.startJumpUpAnimation();
                } else if (!this.isRising && !this.jumpDownInterval) {
                    this.startJumpDownAnimation();
                }
            } else {
                this.clearJumpAnimations();
            }
        }, 20);
    }

    /**
     * Starts jump up animation
     */
    startJumpUpAnimation() {
        this.jumpUpInterval = setInterval(() => {
            this.animateJumpUp();
        }, 35);
    }

    /**
     * Starts jump down animation
     */
    startJumpDownAnimation() {
        this.jumpDownInterval = setInterval(() => {
            this.animateJumpDown();
        }, 100);
    }

    /**
     * Clears jump animations
     */
    clearJumpAnimations() {
        if (this.jumpUpInterval) {
            clearInterval(this.jumpUpInterval);
            this.jumpUpInterval = null;
        }
        if (this.jumpDownInterval) {
            clearInterval(this.jumpDownInterval);
            this.jumpDownInterval = null;
        }
    }

    /**
     * Animates jump up
     */
    animateJumpUp() {
        if (this.jumpUpCurrentImage < this.IMAGES_JUMPING_UP.length) {
            this.img = this.imageCache[this.IMAGES_JUMPING_UP[this.jumpUpCurrentImage]];
            this.jumpUpCurrentImage++;
            if (this.jumpUpCurrentImage >= this.IMAGES_JUMPING_UP.length) {
                this.jumpUpCurrentImage = this.IMAGES_JUMPING_UP.length - 1;
                clearInterval(this.jumpUpInterval);
                this.jumpUpInterval = null;
            }
        }
    }

    /**
     * Animates jump down
     */
    animateJumpDown() {
        if (this.jumpDownCurrentImage < this.IMAGES_JUMPING_DOWN.length) {
            this.img = this.imageCache[this.IMAGES_JUMPING_DOWN[this.jumpDownCurrentImage]];
            this.jumpDownCurrentImage++;
            if (this.jumpDownCurrentImage >= this.IMAGES_JUMPING_DOWN.length) {
                this.jumpDownCurrentImage = this.IMAGES_JUMPING_DOWN.length - 1;
                clearInterval(this.jumpDownInterval);
                this.jumpDownInterval = null;
            }
        }
    }

    /**
     * Handles character jump
     */
    jump() {
        super.jump();
        this.isRising = true;
        this.isFalling = false;
        this.jumpUpCurrentImage = 0;
        this.jumpDownCurrentImage = 0;
        this.clearJumpAnimations();
        this.idleTimer = 0;
    }

    /**
     * Applies gravity to the character
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (this.speedY <= 0 && this.isRising) {
                    this.isRising = false;
                    this.isFalling = true;
                }
            } else {
                this.y = 180;
                this.speedY = 0;
                this.isRising = false;
                this.isFalling = false;
            }
        }, 1000 / 25);
    }

    /**
     * Handles character movement
     */
    movement() {
        if (this.canMoveRight()) {
            this.moveRight();
        }
        if (this.canMoveLeft()) {
            this.moveLeft();
        }
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            this.idleTimer = 0;
        }
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Moves character to the right
     */
    moveRight(){
        super.moveRight();
        this.otherDirection = false;
        this.idleTimer = 0;
    }

    /**
     * Moves character to the left
     */
    moveLeft(){
        super.moveLeft();
        this.otherDirection = true;
        this.idleTimer = 0;
    }

    /**
     * Checks if character can move to the right
     * @returns {boolean}
     */
    canMoveRight(){
        return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x
    }

    /**
     * Checks if character can move to the left
     * @returns {boolean}
     */
    canMoveLeft(){
        return this.world.keyboard.LEFT && this.x > 0
    }

    /**
     * Handles character animations based on state
     */
    animations() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_ISDEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            if (window.SOUNDS_ENABLED) {
                this.gethit_sound.play();
            }
        } else if (this.isAboveGround()) {
        } else {
            if (this.moveToSide()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }
    }

    /**
     * Checks if character is moving to the side
     * @returns {boolean}
     */
    moveToSide(){
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT
    }

    /**
     * Increases idle timer
     */
    increaseIdleTimer() {
        if (this.noInteractions) {
            this.idleTimer++;
        }
    }

    /**
     * Handles idle animations
     */
    idle() {
        if (this.shortTimeWithoutActions()) {
            this.playAnimation(this.IMAGES_IDLE);
        } else if (this.longTimeWithoutActions()) {
            this.playAnimation(this.IMAGES_LONGIDLE);
        }
    }

    /**
     * Checks if character has been idle for a long time
     * @returns {boolean}
     */
    longTimeWithoutActions(){
        return this.idleTimer > 10
    }

    /**
     * Checks if character has been idle for a short time
     * @returns {boolean}
     */
    shortTimeWithoutActions() {
        return this.idleTimer > 0 && this.idleTimer < 10;
    }

    /**
     * Checks if there are no interactions
     * @returns {boolean}
     */
    noInteractions() {
        return !this.world.keyboard.RIGHT &&
               !this.world.keyboard.LEFT &&
               !this.world.keyboard.UP &&
               !this.world.keyboard.T &&
               !this.isHurt();
    }

    /**
     * Checks and handles coin-bottle exchange
     */
    checkCoinBottleExchange() {
        if (!this.world.keyboard.B) {
            this.exchangeCoinBottleActive = false;
        }   
        if (this.canExchangeCoin()) {
            this.exchangeCoin();
            this.exchangeCoinBottleActive = true; 
        }
    }
    
    /**
     * Checks if coin can be exchanged for a bottle
     * @returns {boolean}
     */
    canExchangeCoin() {
        return this.world && 
               this.world.keyboard.B && 
               !this.exchangeCoinBottleActive &&
               this.coins >= 20 && 
               this.bottles < this.world.MAX_BOTTLES;
    }
    
    /**
     * Exchanges coin for a bottle
     */
    exchangeCoin() {
        this.coins -= 20;
        this.bottles++;
        this.updateStatusBars();
        
        if (window.SOUNDS_ENABLED && this.world) {
            this.world.exchange_sound.play();
        }
    }
    
    /**
     * Updates status bars for coins and bottles
     */
    updateStatusBars() {
        this.world.statusBarCoin.setPercentageCoin(this.coins);
        this.world.statusBarBottle.setPercentageBottle(this.bottles);
    }

    /**
     * Offset values for collision detection
     * @type {object}
     */
    offset = {
        top: 125,
        bottom: 0,
        right: 20,
        left: 20
    }
}