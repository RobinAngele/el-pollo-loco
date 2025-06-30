/**
 * Base class for all objects that can move in the game
 * @extends DrawableObjects
 */
class MovableObject extends DrawableObjects {
    /**
     * Movement speed of the object
     * @type {number}
     */
    speed = 5;
    
    /**
     * Flag to indicate if object is facing left
     * @type {boolean}
     */
    otherDirection = false;
    
    /**
     * Vertical speed for jumping and falling
     * @type {number}
     */
    speedY = 0;
    
    /**
     * Gravity acceleration value
     * @type {number}
     */
    acceleration = 2.5;
    
    /**
     * Timestamp of the last hit taken
     * @type {number}
     */
    lastHit = 0;
    
    /**
     * Health/energy level
     * @type {number}
     */
    energy = 100;
    
    /**
     * Health/energy level for enemies
     * @type {number}
     */
    energyEnemies = 1;
    
    /**
     * Sound effect for jumping
     * @type {Audio}
     */
    jump_sound = new Audio('audio/jump.mp3');

    /**
     * Applies gravity to the object, making it fall if not on the ground
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else if (!this.isAboveGround()) {
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground
     * @returns {boolean} True if the object is above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObjects)
            return true;
        return this.y < 180;
    }

    /**
     * Checks if this object is colliding with another object
     * @param {MovableObject} mo - The other object to check collision with
     * @returns {boolean} True if objects are colliding
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces energy when hit by an amount
     * @param {number} damage - Amount of damage to take
     */
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }
        else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object is currently in hurt state
     * @returns {boolean} True if object is hurt
     */
    isHurt() {
        let timepassed = (new Date().getTime() - this.lastHit) / 1000; 
        return timepassed < 0.7;
    }

    /**
     * Checks if the object is dead (no energy left)
     * @returns {boolean} True if object is dead
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Plays an animation by cycling through a set of images
     * @param {string[]} images - Array of image paths for the animation
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by setting upward velocity
     */
    jump() {
        this.speedY = 25;
        if (window.SOUNDS_ENABLED) {
            this.jump_sound.play();
        }
    }
}