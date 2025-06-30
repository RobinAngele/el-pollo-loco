/**
 * Handles state management for the character
 */
class CharacterState {
    /**
     * Character reference
     * @type {Character}
     */
    character;
    
    /**
     * Timer for idle state
     * @type {number}
     */
    idleTimer = 0;
    
    /**
     * Flag indicating if coin-bottle exchange is active
     * @type {boolean}
     */
    exchangeCoinBottleActive = false;
    
    /**
     * Sound effect for exchanging coins for bottles
     * @type {Audio}
     */
    exchange_sound = new Audio('audio/coin_exchange.mp3');

    /**
     * @param {Character} character - Reference to the character
     */
    constructor(character) {
        this.character = character;
        this.setupStateManagement();
    }

    /**
     * Sets up state management intervals
     */
    setupStateManagement() {
        setInterval(() => this.increaseIdleTimer(), 500);
        setInterval(() => this.checkCoinBottleExchange(), 100);
        setInterval(() => this.updateBottleCooldown(), 20);
    }

    /**
     * Updates bottle cooldown timer
     */
    updateBottleCooldown() {
        if (this.character.bottleCooldown > 0) {
            this.character.bottleCooldown -= 20;
        }
    }

    /**
     * Increases idle timer
     */
    increaseIdleTimer() {
        if (this.noInteractions()) {
            this.character.idleTimer++;  
        } else {
            this.character.idleTimer = 0; 
        }
    }

    /**
     * Checks if there are no interactions
     * @returns {boolean}
     */
    noInteractions() {
        return !this.character.world.keyboard.RIGHT &&
               !this.character.world.keyboard.LEFT && 
               !this.character.world.keyboard.UP &&
               !this.character.world.keyboard.T &&
               !this.character.isHurt() &&
               this.character.y >= 180;
    }

    /**
     * Checks and handles coin-bottle exchange
     */
    checkCoinBottleExchange() {
        if (!this.character.world.keyboard.B) {
            this.exchangeCoinBottleActive = false;
        }   
        if (this.canExchangeCoin()) {
            this.exchangeCoin();
            this.exchangeCoinBottleActive = true; 
        }
    }
    
    /**
     * Checks if coin can be exchanged for a bottle
     * @returns {boolean}
     */
    canExchangeCoin() {
        return this.character.world && 
               this.character.world.keyboard.B && 
               !this.exchangeCoinBottleActive &&
               this.character.coins >= 20 && 
               this.character.bottles < 5; // Using fixed value for MAX_BOTTLES
    }
    
    /**
     * Exchanges coin for a bottle
     */
    exchangeCoin() {
        this.character.coins -= 20;
        this.character.bottles++;
        this.updateStatusBars();
        
        if (window.SOUNDS_ENABLED) {
            this.exchange_sound.play();
        }
    }
    
    /**
     * Updates status bars for coins and bottles
     */
    updateStatusBars() {
        this.character.world.statusBarCoin.setPercentageCoin(this.character.coins);
        this.character.world.statusBarBottle.setPercentageBottle(this.character.bottles);
    }
}