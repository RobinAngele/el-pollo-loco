/**
 * Status bar to display collected bottles
 * @extends DrawableObjects
 */
class StatusBarBottle extends DrawableObjects{
    /**
     * Image paths for different bottle count levels
     * @type {string[]}
     */
    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png'
    ]

    /**
     * Current bottle percentage
     * @type {number}
     */
    percentageBottle = 0;

    /**
     * Constructor for bottle status bar
     */
    constructor(){
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.setPercentageBottle(0);
        this.x = 50;
        this.y = 40;
        this.width = 160;
        this.height = 50;
    }

    /**
     * Updates the bottle count and corresponding image
     * @param {number} percentageBottle - New bottle count (0-5)
     */
    setPercentageBottle(percentageBottle){
        this.percentageBottle = percentageBottle;
        let path = this.IMAGES_BOTTLE[this.resolveImageIndexBottle()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the correct image index based on bottle count
     * @returns {number} Index of the image to use
     */
    resolveImageIndexBottle(){
        if(this.percentageBottle == 5){
            return 0;
        }else if(this.percentageBottle == 4){
            return 1;
        }else if(this.percentageBottle == 3){
            return 2;
        }else if(this.percentageBottle == 2){
            return 3;
        }else if(this.percentageBottle == 1){
            return 4;
        }else{
            return 5;
        }
    }
}