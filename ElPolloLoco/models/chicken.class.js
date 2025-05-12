class Chicken extends MovableObject {

    y = 360;
    height = 60;
    width = 60;
    energy = 1;
    defeated = false

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    dead_sound = new Audio('audio/chicken_dies.mp3');

    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x - 100 + Math.random() * 200;
        this.speed = 0.15 + Math.random() * 0.20;
        this.animate();
    }

    animate() {
        this.startWalkingAnimation();
        this.startMovementLoop();
    }
    
    startWalkingAnimation() {
        setInterval(() => {
            if (this.energy == 1) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }
    
    startMovementLoop() {
        setInterval(() => {
            if (this.energy == 1) {
                this.moveLeft();
            }
            this.checkForDeadEnemy();
        }, 1000 / 60);
    }
    
    checkForDeadEnemy() {
        if (this.isDead() && !this.defeated) {
            this.img = this.imageCache[this.IMAGES_DEAD];
            this.playDeathSound();
            this.defeated = true;
        }
    }
    
    playDeathSound() {
        if (window.SOUNDS_ENABLED) {
            this.dead_sound.play();
        }
    }

    offset = {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    }

}