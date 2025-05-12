class StatusBarEndboss extends DrawableObjects {

    IMAGES_ENDBOSS = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    percentageEndboss = 100;
    visible = false;

    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS);
        this.setPercentageEndboss(100);  
        this.x = 500;
        this.y = 10;
        this.width = 160;
        this.height = 50;
    }

    setPercentageEndboss(percentageEndboss) {
        this.percentageEndboss = percentageEndboss;
        let path = this.IMAGES_ENDBOSS[this.resolveImageIndexEndboss()];
        this.img = this.imageCache[path];
    }

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

    draw(ctx) {
        if (this.visible) {
            super.draw(ctx);
        }
    }
}