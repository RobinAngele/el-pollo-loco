/**
 * Manages all collision detection and related logic for the game world
 */
class CollisionManager {
    /**
     * World reference
     * @type {World}
     */
    world;

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
     * @param {World} world - Reference to the game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks for player collisions with enemies
     */
    checkPlayerCollisions() {
        this.checkPeppeHitsEnemy();
    }

    /**
     * Checks if enemies are hitting the player character
     */
    checkEnemyHitsPeppe() {
        if (this.characterInvincible) return;
        
        this.world.level.enemies.forEach((enemy) => {
            if (this.hitboxColliding(enemy)) {
                this.playerTakesDamage();
            }
        });
    }
    
    /**
     * Applies damage to the player and updates UI
     */
    playerTakesDamage() {
        this.world.character.hit(20);
        this.world.character.idleTimer = 0;
        this.world.statusBarHealth.setPercentageHealth(this.world.character.energy);
        
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
        return this.world.character.isColliding(enemy) &&
            !enemy.isDead() &&
            this.world.character.speedY >= 0;
    }

    /**
     * Checks if player character is jumping on enemies
     */
    checkPeppeHitsEnemy() {
        this.world.level.enemies.forEach((enemy) => {
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
        return this.world.character.isColliding(enemy) &&
            !enemy.isDead() &&
            this.world.character.speedY < 0 &&
            (enemy instanceof Chicken || enemy instanceof BabyChicken);
    }
    
    /**
     * Handles the character jumping on an enemy
     * @param {MovableObject} enemy - The enemy being jumped on
     */
    handleJumpOnEnemy(enemy) {
        this.world.character.speedY = 30;
        
        this.world.character.animations.prepareJump();
        this.world.character.animations.isRising = true;
        this.world.character.animations.jumpUpCurrentImage = 0;
        
        enemy.energy--;
    }
}