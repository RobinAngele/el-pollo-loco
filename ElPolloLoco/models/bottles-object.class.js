/**
 * Bottle class representing collectible salsa bottles in the game
 * @extends MovableObject
 */
class Bottle extends MovableObject {
    /**
     * Image path for the bottle
     * @type {string}
     * @static
     */
    static IMAGE_PATH = 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    
    /**
     * Height of the bottle
     * @type {number}
     * @static
     */
    static HEIGHT = 80;
    
    /**
     * Width of the bottle
     * @type {number}
     * @static
     */
    static WIDTH = 80;
    
    /**
     * Ground level for placing the bottle
     * @type {number}
     * @static
     */
    static GROUND_LEVEL = 350;
    
    /**
     * Constructor for bottle objects
     * @param {number} x - X coordinate for positioning the bottle
     */
    constructor(x) {
        super();
        this.loadImage(Bottle.IMAGE_PATH);
        this.x = x;
        this.y = Bottle.GROUND_LEVEL;
        this.height = Bottle.HEIGHT;
        this.width = Bottle.WIDTH;
        this.offset = {
            top: 10,
            bottom: 10,
            right: 10,
            left: 10
        };
    }
}