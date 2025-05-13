/**
 * Base class for all drawable game objects
 */
class DrawableObjects {
    /**
     * X position of the object
     * @type {number}
     */
    x = 120;
    
    /**
     * Y position of the object
     * @type {number}
     */
    y = 180;
    
    /**
     * Image object
     * @type {HTMLImageElement}
     */
    img;
    
    /**
     * Height of the object
     * @type {number}
     */
    height = 150;
    
    /**
     * Width of the object
     * @type {number}
     */
    width = 100;
    
    /**
     * Current frame index of animation
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * Cache for preloaded images
     * @type {Object<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * Loads an image from a given path
     * @param {string} path - Path to the image file
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Preloads an array of images into the image cache
     * @param {string[]} arr - Array of image paths to load
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws a debugging frame around the object if applicable
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    drawFrame(ctx) {
        if (this.canDrawFrame()) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Determines if this object can have a frame drawn (for debugging)
     * @returns {boolean} True if the frame should be drawn
     */
    canDrawFrame() {
        return this instanceof Character ||
            this instanceof Chicken ||
            this instanceof Bottle ||
            this instanceof Coin ||
            this instanceof ThrowableObject;
    }
}