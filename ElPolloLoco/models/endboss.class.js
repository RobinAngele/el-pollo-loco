class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    energy = 7;
    x = 2500;
    
    startFight = false;
    firstContact = false;
    getHit = false;
    isJumping = false;
    jumpCooldown = 0;
    isConcentrating = false;
    concentrationCooldown = 0;
    world;
    
    getHitSound = new Audio('audio/endboss_hit.mp3');
    jumpAttackSound = new Audio('audio/endboss_attack.mp3');
    concentrationSound = new Audio('audio/concentration.wav');

    IMAGES_IDLE = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png'
    ];

    IMAGES_FIGHT = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    IMAGES_JUMP = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png'
    ];

    IMAGES_CONCENTRATION = [
        'img/4_enemie_boss_chicken/2_alert/G6.png',
    ];

    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_FIGHT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_CONCENTRATION);
        this.animate();
        this.applyGravity();
    }

    animate() {
        setInterval(() => {
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                if (window.SOUNDS_ENABLED) {
                    this.getHitSound.play();
                }
            } else if (this.isJumping && !this.isDead()) {
                this.playAnimation(this.IMAGES_JUMP);
            } else if (this.isConcentrating && !this.isDead()) {
                this.playAnimation(this.IMAGES_CONCENTRATION);
            } else if (this.firstContact && !this.isDead()) {
                this.playAnimation(this.IMAGES_FIGHT);
                this.moveAndAttack();
            } else if (!this.firstContact) {
                this.playAnimation(this.IMAGES_IDLE);
            } else {
                if (this.isDead()) {
                    this.playAnimation(this.IMAGES_DEAD);
                }
            }
        }, 200);

        setInterval(() => {
            if (this.jumpCooldown > 0) {
                this.jumpCooldown--;
            }
            if (this.concentrationCooldown > 0) {
                this.concentrationCooldown--;
            }
        }, 1000);
    }

    moveAndAttack() {
        this.x -= 10;
        
        if (this.jumpCooldown === 0 && !this.isJumping && this.firstContact) {
            this.performJumpAttack();
        }
        
        if (this.concentrationCooldown === 0 && !this.isConcentrating && !this.isJumping && this.firstContact) {
            this.concentrateAndSpawnChicken();
        }
    }

    performJumpAttack() {
        this.isJumping = true;
        this.jumpCooldown = 5; 
        if (window.SOUNDS_ENABLED) {
            this.jumpAttackSound.play();
        }
        this.jump();
        
        let jumpInterval = setInterval(() => {
            if (this.isAboveGround()) {
                this.x -= 25;
            } else {
                this.isJumping = false;
                clearInterval(jumpInterval);
            }
        }, 100);
    }

    concentrateAndSpawnChicken() {
        this.isConcentrating = true;
        this.concentrationCooldown = 8;
        if (window.SOUNDS_ENABLED) {
            this.concentrationSound.play();
        }
        
        setTimeout(() => {
            if (this.world && !this.isDead()) {
                const numChickens = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < numChickens; i++) {
                    const babyChicken = new BabyChicken();
                    babyChicken.x = this.x;
                    babyChicken.y = 380;
                    this.world.level.enemies.push(babyChicken);
                }
            }
            this.isConcentrating = false;
        }, 1500);
    }

    isAboveGround() {
        return this.y < 55;
    }

    offset = {
        top: 120, 
        bottom: 30,
        right: 60,  
        left: 60
    }
}