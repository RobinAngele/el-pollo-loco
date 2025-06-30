/**
 * Manages bottle throwing mechanics in the game world
 */
class BottleManager {
    /**
     * World reference
     * @type {World}
     */
    world;

    /**
     * @param {World} world - Reference to the game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks if bottle can be thrown and handles throwing
     */
    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
            this.world.character.bottleCooldown = this.world.character.bottleCooldownTime;
            this.world.character.idleTimer = 0;
        }
        this.handleBottleCollisions();
        this.handleBottleCleanup();
        this.world.statusBarBottle.setPercentageBottle(this.world.character.bottles);
    }
    
    /**
     * Checks if the conditions to throw a bottle are met
     * @returns {boolean} True if bottle can be thrown
     */
    canThrowBottle() {
        return this.world.keyboard.T && 
               this.world.character.bottles > 0 && 
               this.world.character.bottleCooldown <= 0;
    }
    
    /**
     * Handles collisions between thrown bottles and enemies
     */
    handleBottleCollisions() {
        for (let i = this.world.throwableObject.length - 1; i >= 0; i--) {
            const bottle = this.world.throwableObject[i];
            const hitEnemy = this.findCollidingEnemy(bottle);
            
            if (hitEnemy && !bottle.hasHit) {
                // Apply damage to enemy and trigger bottle explosion
                this.damageEnemy(hitEnemy, bottle);
                bottle.explode();
                
                // Remove bottle from array after a short delay to allow animation to play
                setTimeout(() => {
                    const index = this.world.throwableObject.indexOf(bottle);
                    if (index !== -1) {
                        this.world.throwableObject.splice(index, 1);
                    }
                }, 300); // Short delay for explosion animation
            }
        }
    }
    
    /**
     * Applies damage to an enemy hit by a bottle
     * @param {MovableObject} enemy - The enemy to damage
     * @param {ThrowableObjects} bottle - The bottle that hit the enemy
     */
    damageEnemy(enemy, bottle) {
        enemy.hit(1);
        if (enemy instanceof Endboss) {
            this.world.statusBarEndboss.setPercentageEndboss(enemy.energy * 20);
        }
    }

    /**
     * Finds an enemy that a bottle is colliding with
     * @param {ThrowableObjects} bottle - The bottle to check
     * @returns {MovableObject|undefined} The colliding enemy or undefined
     */
    findCollidingEnemy(bottle) {
        return this.world.level.enemies.find(enemy => 
            bottle.isColliding(enemy) && !enemy.isDead() && !bottle.hasHit);
    }
    
    /**
     * Removes bottles that are out of bounds
     */
    handleBottleCleanup() {
        // Modified to account for bottles thrown in either direction
        this.world.throwableObject = this.world.throwableObject.filter(bottle => 
            bottle.y <= 500 && 
            bottle.x >= -500 && 
            bottle.x <= this.world.level.level_end_x + 500
        );
    }

    /**
     * Creates and throws a bottle in the direction the character is facing
     */
    throwBottle() {
        const offsetY = 100;
        const offsetX = this.world.character.otherDirection ? -20 : 40;
        const bottle = new ThrowableObjects(
            this.world.character.x + offsetX, 
            this.world.character.y + offsetY,
            this.world.character.otherDirection
        );
        this.world.throwableObject.push(bottle);
        this.world.character.bottles--;
        this.world.itemManager.updateStatusBarBottle();
    }
}