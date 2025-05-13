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
     * Constructor for throwable objects
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMG_BOTTLE);
        this.x = x;
        this.y = y;
        this.height = 100
        this.width = 100;
        this.throw();
    }

    /**
     * Throws the object by applying gravity and setting initial speed
     * @param {number} x - Not used but kept for compatibility
     * @param {number} y - Not used but kept for compatibility
     */
    throw(x, y) {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.playAnimation(this.IMG_BOTTLE)
            this.x += 20;
        }, 50);
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