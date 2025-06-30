/**
 * Handles movement-related functionality for the character
 */
class CharacterMovement {
    /**
     * Character reference
     * @type {Character}
     */
    character;

    /**
     * @param {Character} character - Reference to the character
     */
    constructor(character) {
        this.character = character;
        this.setupMovement();
    }

    /**
     * Sets up movement intervals
     */
    setupMovement() {
        setInterval(() => this.movement(), 1000 / 60);
        this.applyGravity();
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
        if (this.character.world.keyboard.UP && !this.character.isAboveGround()) {
            this.jump();
        }
        this.updateCameraPosition();
    }

    /**
     * Updates camera position to follow character
     */
    updateCameraPosition() {
        this.character.world.camera_x = -this.character.x + 100;
    }

    /**
     * Moves character to the right
     */
    moveRight() {
        this.character.moveRight();
        this.character.otherDirection = false;
        this.character.idleTimer = 0;
    }

    /**
     * Moves character to the left
     */
    moveLeft() {
        this.character.moveLeft();
        this.character.otherDirection = true;
        this.character.idleTimer = 0;
    }

    /**
     * Checks if character can move to the right
     * @returns {boolean}
     */
    canMoveRight() {
        return this.character.world.keyboard.RIGHT && 
               this.character.x < this.character.world.level.level_end_x;
    }

    /**
     * Checks if character can move to the left
     * @returns {boolean}
     */
    canMoveLeft() {
        return this.character.world.keyboard.LEFT && this.character.x > 0;
    }

    /**
     * Handles character jump
     */
    jump() {
        this.character.jump();
        this.character.animations.prepareJump();
        this.character.idleTimer = 0;
    }

    /**
     * Applies gravity to the character
     */
    applyGravity() {
        setInterval(() => {
            this.applyGravityPhysics();
        }, 1000 / 25);
    }

    /**
     * Applies gravity physics calculations
     */
    applyGravityPhysics() {
        if (this.character.isAboveGround() || this.character.speedY > 0) {
            this.character.y -= this.character.speedY;
            this.character.speedY -= this.character.acceleration;
            this.checkFallingState();
        } else {
            this.resetGroundPosition();
        }
    }

    /**
     * Checks if character has started falling
     */
    checkFallingState() {
        if (this.character.speedY <= 0 && this.character.animations.isRising) {
            this.character.animations.updateJumpState(this.character.speedY);
        }
    }

    /**
     * Resets position when character is on the ground
     */
    resetGroundPosition() {
        this.character.y = 180;
        this.character.speedY = 0;
        this.character.animations.isRising = false;
        this.character.animations.isFalling = false;
    }
}