/**
 * Chicken enemy class
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    /**
     * Y position of the chicken
     * @type {number}
     */
    y = 360;
    
    /**
     * Height of the chicken
     * @type {number}
     */
    height = 60;
    
    /**
     * Width of the chicken
     * @type {number}
     */
    width = 60;
    
    /**
     * Energy/health of the chicken
     * @type {number}
     */
    energy = 1;
    
    /**
     * Flag indicating if chicken has been defeated
     * @type {boolean}
     */
    defeated = false

    /**
     * Image paths for walking animation
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /**
     * Image paths for dead animation
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Sound effect for chicken death
     * @type {Audio}
     */
    dead_sound = new Audio('audio/chicken_dies.mp3');

    /**
     * Chicken constructor
     * @param {number} x - Initial x position
     */
    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x - 100 + Math.random() * 200;
        this.speed = 0.15 + Math.random() * 0.20;
        this.animate();
    }

    /**
     * Starts chicken animations
     */
    animate() {
        this.startWalkingAnimation();
        this.startMovementLoop();
    }
    
    /**
     * Starts walking animation loop
     */
    startWalkingAnimation() {
        setInterval(() => {
            if (this.energy == 1) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }
    
    /**
     * Starts movement loop
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.energy == 1) {
                this.moveLeft();
            }
            this.checkForDeadEnemy();
        }, 1000 / 60);
    }
    
    /**
     * Checks if chicken is dead and updates animation
     */
    checkForDeadEnemy() {
        if (this.isDead() && !this.defeated) {
            this.img = this.imageCache[this.IMAGES_DEAD];
            this.playDeathSound();
            this.defeated = true;
        }
    }
    
    /**
     * Plays death sound if sound is enabled
     */
    playDeathSound() {
        if (window.SOUNDS_ENABLED) {
            this.dead_sound.play();
        }
    }

    /**
     * Collision offset values
     * @type {object}
     */
    offset = {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    }
}