/**
 * Endboss (final enemy) class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    /**
     * Height of the end boss
     * @type {number}
     */
    height = 400;
    
    /**
     * Width of the end boss
     * @type {number}
     */
    width = 250;
    
    /**
     * Y position of the end boss
     * @type {number}
     */
    y = 55;
    
    /**
     * Energy/health of the end boss
     * @type {number}
     */
    energy = 7;
    
    /**
     * X position of the end boss
     * @type {number}
     */
    x = 2500;
    
    /**
     * Flag indicating if the boss fight has started
     * @type {boolean}
     */
    startFight = false;
    
    /**
     * Flag indicating if the character has made first contact with the boss
     * @type {boolean}
     */
    firstContact = false;
    
    /**
     * Flag indicating if the boss has been hit
     * @type {boolean}
     */
    getHit = false;
    
    /**
     * Flag indicating if the boss is jumping
     * @type {boolean}
     */
    isJumping = false;
    
    /**
     * Cooldown time for jump attacks
     * @type {number}
     */
    jumpCooldown = 0;
    
    /**
     * Flag indicating if the boss is concentrating to spawn chickens
     * @type {boolean}
     */
    isConcentrating = false;
    
    /**
     * Cooldown time for concentration attacks
     * @type {number}
     */
    concentrationCooldown = 0;
    
    /**
     * Reference to the game world
     * @type {World}
     */
    world;
    
    /**
     * Sound effect played when boss is hit
     * @type {Audio}
     */
    getHitSound = new Audio('audio/endboss_hit.mp3');
    
    /**
     * Sound effect played during jump attack
     * @type {Audio}
     */
    jumpAttackSound = new Audio('audio/endboss_attack.mp3');
    
    /**
     * Sound effect played during concentration
     * @type {Audio}
     */
    concentrationSound = new Audio('audio/concentration.wav');

    /**
     * Image paths for idle animation
     * @type {string[]}
     */
    IMAGES_IDLE = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png'
    ];

    /**
     * Image paths for fight animation
     * @type {string[]}
     */
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

    /**
     * Image paths for hurt animation
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /**
     * Image paths for dead animation
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Image paths for jump animation
     * @type {string[]}
     */
    IMAGES_JUMP = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png'
    ];

    /**
     * Image paths for concentration animation
     * @type {string[]}
     */
    IMAGES_CONCENTRATION = [
        'img/4_enemie_boss_chicken/2_alert/G6.png',
    ];

    /**
     * Constructor for the Endboss class
     * Initializes images, animations, and gravity
     */
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

    /**
     * Handles all animations and state changes
     */
    animate() {
        this.setupAnimationInterval();
        this.setupCooldownInterval();
    }

    /**
     * Sets up the main animation interval based on boss state
     */
    setupAnimationInterval() {
        setInterval(() => {
            if (this.isHurt()) {
                this.playHurtAnimation();
            } else if (this.isJumping && !this.isDead()) {
                this.playAnimation(this.IMAGES_JUMP);
            } else if (this.isConcentrating && !this.isDead()) {
                this.playAnimation(this.IMAGES_CONCENTRATION);
            } else if (this.firstContact && !this.isDead()) {
                this.playAnimation(this.IMAGES_FIGHT);
                this.moveAndAttack();
            } else if (!this.firstContact) {
                this.playAnimation(this.IMAGES_IDLE);
            } else if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            }
        }, 200);
    }

    /**
     * Plays hurt animation with sound
     */
    playHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        if (window.SOUNDS_ENABLED) {
            this.getHitSound.play();
        }
    }

    /**
     * Sets up cooldown timer interval
     */
    setupCooldownInterval() {
        setInterval(() => {
            if (this.jumpCooldown > 0) {
                this.jumpCooldown--;
            }
            if (this.concentrationCooldown > 0) {
                this.concentrationCooldown--;
            }
        }, 1000);
    }

    /**
     * Handles boss movement and attack pattern selection
     */
    moveAndAttack() {
        this.x -= 10;
        
        if (this.jumpCooldown === 0 && !this.isJumping && this.firstContact) {
            this.performJumpAttack();
        }
        
        if (this.concentrationCooldown === 0 && !this.isConcentrating && !this.isJumping && this.firstContact) {
            this.concentrateAndSpawnChicken();
        }
    }

    /**
     * Performs the jump attack that moves boss toward player
     */
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

    /**
     * Performs concentration attack that spawns baby chickens
     */
    concentrateAndSpawnChicken() {
        this.startConcentration();
        setTimeout(() => this.spawnBabyChickens(), 1500);
    }

    /**
     * Starts the concentration state and plays sound
     */
    startConcentration() {
        this.isConcentrating = true;
        this.concentrationCooldown = 8;
        if (window.SOUNDS_ENABLED) {
            this.concentrationSound.play();
        }
    }

    /**
     * Spawns baby chickens if the boss is still alive
     */
    spawnBabyChickens() {
        if (this.world && !this.isDead()) {
            const numChickens = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numChickens; i++) {
                this.createBabyChicken();
            }
        }
        this.isConcentrating = false;
    }

    /**
     * Creates a single baby chicken and adds it to the world
     */
    createBabyChicken() {
        const babyChicken = new BabyChicken();
        babyChicken.x = this.x;
        babyChicken.y = 380;
        this.world.level.enemies.push(babyChicken);
    }

    /**
     * Checks if the endboss is above the ground
     * @returns {boolean} True if above ground
     */
    isAboveGround() {
        return this.y < 55;
    }

    /**
     * Collision offset values for hit detection
     * @type {object}
     */
    offset = {
        top: 110, 
        bottom: 20,
        right: 50,  
        left: 50
    }
}