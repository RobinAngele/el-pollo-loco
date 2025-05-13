/**
 * BabyChicken enemy class - smaller, faster variant of chicken enemies
 * @extends MovableObject
 */
class BabyChicken extends MovableObject {
    /**
     * Y position of the baby chicken
     * @type {number}
     */
    y = 375;
    
    /**
     * Height of the baby chicken
     * @type {number}
     */
    height = 40;
    
    /**
     * Width of the baby chicken
     * @type {number}
     */
    width = 40;
    
    /**
     * Energy/health of the baby chicken
     * @type {number}
     */
    energy = 1;
    
    /**
     * Flag indicating if chicken has been defeated
     * @type {boolean}
     */
    defeated = false;
    
    /**
     * Image paths for walking animation
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /**
     * Image paths for dead animation
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Sound effect for baby chicken death
     * @type {Audio}
     */
    dead_sound = new Audio('audio/chicken_dies.mp3');

    /**
     * BabyChicken constructor
     * @param {number} x - Initial x position
     */
    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x - 100 + Math.random() * 200;
        this.speed = 1 + Math.random() * 4;
        this.offset = {
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
        };
        this.animate();
    }

    /**
     * Starts animations and movement loops
     */
    animate() {
        this.startAnimationLoop();
        this.startMovementLoop();
    }
    
    /**
     * Starts the walking animation loop
     */
    startAnimationLoop() {
        setInterval(() => {
            if (this.energy == 1) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 80);
    }
    
    /**
     * Starts the movement loop
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
            if (window.SOUNDS_ENABLED) {
                this.dead_sound.play();
            }
            this.defeated = true;
        }
    }
}
