/**
 * Character class representing the player character (Pepe)
 * @extends MovableObject
 */
class Character extends MovableObject {

    y = 180;
    height = 250;
    width = 100;
    /**
     * Image paths for walking animation
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * Image paths for jumping up animation
     * @type {string[]}
     */
    IMAGES_JUMPING_UP = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png'
    ];

    /**
     * Image paths for jumping down animation
     * @type {string[]}
     */
    IMAGES_JUMPING_DOWN = [
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Image paths for hurt animation
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Image paths for dead animation
     * @type {string[]}
     */
    IMAGES_ISDEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Image paths for idle animation
     * @type {string[]}
     */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /**
     * Image paths for long idle animation
     * @type {string[]}
     */
    IMAGES_LONGIDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /**
     * Number of coins collected by the character
     * @type {number}
     */
    coins = 0;

    /**
     * Number of bottles collected by the character
     * @type {number}
     */
    bottles = 0;

    /**
     * Cooldown time for bottle usage
     * @type {number}
     */
    bottleCooldown = 0;

    /**
     * Maximum cooldown time for bottle usage
     * @type {number}
     */
    bottleCooldownTime = 1000;

    /**
     * Reference to the game world
     * @type {object}
     */
    world;

    /**
     * Timer for idle state
     * @type {number}
     */
    idleTimer = 0;

    /**
     * Sound effect for getting hit
     * @type {Audio}
     */
    gethit_sound = new Audio('audio/hit.wav');

    /**
     * Character animations manager
     * @type {CharacterAnimations}
     */
    animations;

    /**
     * Character state manager
     * @type {CharacterState}
     */
    state;

    /**
     * Character movement manager
     * @type {CharacterMovement}
     */
    movement;

    /**
     * Constructor for the Character class
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING_UP);
        this.loadImages(this.IMAGES_JUMPING_DOWN);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ISDEAD);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        
        // Create manager components
        this.animations = new CharacterAnimations(this);
        this.state = new CharacterState(this);
        this.movement = new CharacterMovement(this);
        
        // Initialize animations
        this.animations.animateJump();
    };

    /**
     * Offset values for collision detection
     * @type {object}
     */
    offset = {
        top: 125,
        bottom: 0,
        right: 20,
        left: 20
    }
}