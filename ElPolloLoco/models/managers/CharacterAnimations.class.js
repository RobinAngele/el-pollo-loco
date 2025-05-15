/**
 * Handles all animation-related functionality for the character
 */
class CharacterAnimations {
    /**
     * Character reference
     * @type {Character}
     */
    character;

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
     * @param {Character} character - Reference to the character
     */
    constructor(character) {
        this.character = character;
        this.setupAnimations();
    }

    /**
     * Sets up animation intervals
     */
    setupAnimations() {
        setInterval(() => this.animations(), 40);
        setInterval(() => this.idle(), 200);
    }

    /**
     * Handles jump animations
     */
    animateJump() {
        setInterval(() => {
            if (this.character.isAboveGround()) {
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
        if (this.jumpUpCurrentImage < this.character.IMAGES_JUMPING_UP.length) {
            this.character.img = this.character.imageCache[this.character.IMAGES_JUMPING_UP[this.jumpUpCurrentImage]];
            this.jumpUpCurrentImage++;
            this.checkJumpUpAnimationComplete();
        }
    }

    /**
     * Checks if jump up animation is complete and cleans up
     */
    checkJumpUpAnimationComplete() {
        if (this.jumpUpCurrentImage >= this.character.IMAGES_JUMPING_UP.length) {
            this.jumpUpCurrentImage = this.character.IMAGES_JUMPING_UP.length - 1;
            clearInterval(this.jumpUpInterval);
            this.jumpUpInterval = null;
        }
    }

    /**
     * Animates jump down
     */
    animateJumpDown() {
        if (this.jumpDownCurrentImage < this.character.IMAGES_JUMPING_DOWN.length) {
            this.character.img = this.character.imageCache[this.character.IMAGES_JUMPING_DOWN[this.jumpDownCurrentImage]];
            this.jumpDownCurrentImage++;
            this.checkJumpDownAnimationComplete();
        }
    }

    /**
     * Checks if jump down animation is complete and cleans up
     */
    checkJumpDownAnimationComplete() {
        if (this.jumpDownCurrentImage >= this.character.IMAGES_JUMPING_DOWN.length) {
            this.jumpDownCurrentImage = this.character.IMAGES_JUMPING_DOWN.length - 1;
            clearInterval(this.jumpDownInterval);
            this.jumpDownInterval = null;
        }
    }

    /**
     * Prepares for jump animation
     */
    prepareJump() {
        this.isRising = true;
        this.isFalling = false;
        this.jumpUpCurrentImage = 0;
        this.jumpDownCurrentImage = 0;
        this.clearJumpAnimations();
    }

    /**
     * Handles character animations based on state
     */
    animations() {
        if (this.character.isDead()) {
            this.character.playAnimation(this.character.IMAGES_ISDEAD);
        } else if (this.character.isHurt()) {
            this.character.playAnimation(this.character.IMAGES_HURT);
            if (window.SOUNDS_ENABLED) {
                this.character.gethit_sound.play();
            }
        } else if (this.character.isAboveGround()) {
            // Jump animation handled by separate method
        } else {
            if (this.moveToSide()) {
                this.character.playAnimation(this.character.IMAGES_WALKING);
            }
        }
    }

    /**
     * Checks if character is moving to the side
     * @returns {boolean}
     */
    moveToSide() {
        return this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT;
    }

    /**
     * Handles idle animations
     */
    idle() {
        if (!this.character.isAboveGround() && !this.moveToSide() && !this.character.isHurt()) {
            if (this.longTimeWithoutActions()) {
                this.character.playAnimation(this.character.IMAGES_LONGIDLE);
                console.log("Playing long idle, timer: " + this.character.idleTimer); // Debug logging
            } else if (this.shortTimeWithoutActions()) {
                this.character.playAnimation(this.character.IMAGES_IDLE);
                console.log("Playing idle, timer: " + this.character.idleTimer); // Debug logging
            }
        }
    }

    /**
     * Checks if character has been idle for a long time
     * @returns {boolean}
     */
    longTimeWithoutActions() {
        return this.character.idleTimer >= 10; // Changed from > to >= for reliability
    }

    /**
     * Checks if character has been idle for a short time
     * @returns {boolean}
     */
    shortTimeWithoutActions() {
        return this.character.idleTimer > 0 && this.character.idleTimer < 10;
    }

    /**
     * Updates isRising and isFalling states based on vertical speed
     */
    updateJumpState(speedY) {
        if (speedY <= 0 && this.isRising) {
            this.isRising = false;
            this.isFalling = true;
        }
    }
}