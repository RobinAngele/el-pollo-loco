/**
 * Status bar to display endboss health
 * @extends DrawableObjects
 */
class StatusBarEndboss extends DrawableObjects {
    /**
     * Image paths for different endboss health levels
     * @type {string[]}
     */
    IMAGES_ENDBOSS = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    /**
     * Current endboss health percentage
     * @type {number}
     */
    percentageEndboss = 100;
    
    /**
     * Flag indicating if the status bar is visible
     * @type {boolean}
     */
    visible = false;

    /**
     * Constructor for endboss health status bar
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS);
        this.setPercentageEndboss(100);  
        this.x = 500;
        this.y = 10;
        this.width = 160;
        this.height = 50;
    }

    /**
     * Updates the endboss health percentage and corresponding image
     * @param {number} percentageEndboss - New health percentage value
     */
    setPercentageEndboss(percentageEndboss) {
        this.percentageEndboss = percentageEndboss;
        let path = this.IMAGES_ENDBOSS[this.resolveImageIndexEndboss()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the correct image index based on endboss health percentage
     * @returns {number} Index of the image to use
     */
    resolveImageIndexEndboss() {
        if(this.percentageEndboss == 100) {
            return 5;
        } else if(this.percentageEndboss > 80) {
            return 4;
        } else if(this.percentageEndboss > 60) {
            return 3;
        } else if(this.percentageEndboss > 40) {
            return 2;
        } else if(this.percentageEndboss > 20) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Overrides the draw method to only draw when visible
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    draw(ctx) {
        if (this.visible) {
            super.draw(ctx);
        }
    }
}