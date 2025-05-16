/**
 * Class for objects that can be thrown by the character (salsa bottles)
 * @extends MovableObject
 */
class ThrowableObjects extends MovableObject {
    /**
     * Image paths for bottle rotation animation
     * @type {string[]}
     */
    IMG_BOTTLE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /**
     * Image paths for bottle splash animation
     * @type {string[]}
     */
    IMG_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Flag to track if bottle has hit ground or enemy
     * @type {boolean}
     */
    hasHit = false;

    /**
     * Constructor for throwable objects
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {boolean} [otherDirection=false] - Direction to throw (true = left, false = right)
     */
    constructor(x, y, otherDirection = false) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMG_BOTTLE);
        this.loadImages(this.IMG_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
        this.otherDirection = otherDirection;
        this.throw();
    }

    /**
     * Throws the object by applying gravity and setting initial speed
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        
        const animationInterval = this.setupAnimationInterval();
        const collisionInterval = this.setupCollisionInterval();
        
        // Store intervals for cleanup
        this.intervals = { animationInterval, collisionInterval };
    }
    
    /**
     * Sets up animation interval for bottle rotation and splash
     * @returns {number} Interval ID
     */
    setupAnimationInterval() {
        let animationCleared = false;
        
        return setInterval(() => {
            if (this.hasHit) {
                this.playAnimation(this.IMG_SPLASH);
                this.checkSplashAnimationComplete(animationCleared);
            } else {
                this.playAnimation(this.IMG_BOTTLE);
                this.x += this.otherDirection ? -20 : 20;
            }
        }, 50);
    }
    
    /**
     * Checks if splash animation is complete
     * @param {boolean} animationCleared - Reference to animation cleared flag
     */
    checkSplashAnimationComplete(animationCleared) {
        if (this.currentImage >= this.IMG_SPLASH.length * 2 && !animationCleared) {
            clearInterval(this.intervals.animationInterval);
            clearInterval(this.intervals.collisionInterval);
            animationCleared = true;
        }
    }
    
    /**
     * Sets up collision detection interval
     * @returns {number} Interval ID
     */
    setupCollisionInterval() {
        return setInterval(() => {
            if ((this.y > 350 || !this.isAboveGround()) && !this.hasHit) {
                this.explode();
            }
        }, 20);
    }

    /**
     * Triggers bottle explosion animation
     * Called both when hitting ground and when hitting enemies
     */
    explode() {
        if (!this.hasHit) {  // Only trigger once
            this.hasHit = true;
            this.currentImage = 0; // Reset animation frame for splash
            // Stop all movement when exploding
            this.speedY = 0;
        }
    }

    /**
     * Override isAboveGround to provide a more accurate ground detection
     * @returns {boolean} True if the object is above ground level
     */
    isAboveGround() {
        return this.y < 350;
    }

    /**
     * Collision offset values for hit detection
     * @type {object}
     */
    offset = {
        top: 10,
        bottom: 10,
        right: 10,
        left: 10
    }
}