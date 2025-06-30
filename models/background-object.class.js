/**
 * BackgroundObject class representing background elements in the game
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    /**
     * Width of the background object
     * @type {number}
     */
    width = 720;
    
    /**
     * Height of the background object
     * @type {number}
     */
    height = 480;
    
    /**
     * Constructor for the BackgroundObject class
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X coordinate for positioning the background object
     */
    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}