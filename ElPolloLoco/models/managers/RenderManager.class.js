/**
 * Manages rendering of all game elements
 */
class RenderManager {
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
     * Main game rendering loop
     * Clears the canvas and draws all game objects
     */
    draw() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        
        this.drawBackgroundElements();
        this.drawStatusBars();
        this.drawCharacter();

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draws all background and world elements
     */
    drawBackgroundElements() {
        this.world.ctx.translate(this.world.camera_x, 0);
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.addObjectsToMap(this.world.throwableObject);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.babyChickens);
        this.world.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Draws all status bars and UI elements
     */
    drawStatusBars() {
        this.addTopMap(this.world.statusBarHealth);
        this.addTopMap(this.world.statusBarBottle);
        this.addTopMap(this.world.statusBarCoin);
        this.addTopMap(this.world.statusBarEndboss);

        if (this.world.statusBarEndboss.visible) {
            this.world.ctx.drawImage(this.world.endbossIcon, 495, 10, 60, 60);
        }
    }

    /**
     * Draws the player character
     */
    drawCharacter() {
        this.world.ctx.translate(this.world.camera_x, 0);
        this.addTopMap(this.world.character);
        this.world.ctx.translate(-this.world.camera_x, 0);
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

        mo.draw(this.world.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an image horizontally for rendering objects facing left
     * @param {DrawableObjects} mo - The movable object to flip
     */
    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas state after flipping an image
     * @param {DrawableObjects} mo - The movable object to restore
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }
}