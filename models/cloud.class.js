/**
 * Cloud class representing moving cloud elements in the background
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    /**
     * Y position of the cloud
     * @type {number}
     */
    y = 20;
    
    /**
     * Height of the cloud
     * @type {number}
     */
    height = 250;
    
    /**
     * Width of the cloud
     * @type {number}
     */
    width = 500;

    /**
     * Constructor for cloud objects
     * @param {number} x - Initial x position
     */
    constructor(x) {
        super().loadImage('img/5_background/layers/4_clouds/1.png')
        this.x = Math.random() * 500;
        this.speed = 0.15
        this.animate();
    }

    /**
     * Animates the cloud movement
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000/60);
    }
}