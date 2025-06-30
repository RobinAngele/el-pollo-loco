/**
 * Manages item collection and interactions in the game world
 */
class ItemManager {
    /**
     * World reference
     * @type {World}
     */
    world;
    
    /**
     * Sound effect for collecting coins
     * @type {Audio}
     */
    coin_sound = new Audio('audio/coin.mp3');
    
    /**
     * Sound effect for collecting bottles
     * @type {Audio}
     */
    bottle_sound = new Audio('audio/bottle.mp3');
    
    /**
     * Sound effect for exchanging coins for bottles
     * @type {Audio}
     */
    exchange_sound = new Audio('audio/coin_exchange.mp3');
    
    /**
     * Maximum number of coins player can collect
     * @type {number}
     */
    MAX_COINS = 100;
    
    /**
     * Maximum number of bottles player can carry
     * @type {number}
     */
    MAX_BOTTLES = 5;

    /**
     * @param {World} world - Reference to the game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks for interactions with environment objects (coins, bottles)
     */
    checkEnvironmentInteractions() {
        this.checkCollisionsCoins();
        this.checkCollisionBottles();
    }

    /**
     * Checks for collisions between the character and coins
     */
    checkCollisionsCoins() {
        this.world.level.coins.forEach(coin => {
            if (this.world.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    /**
     * Collects a coin when the character collides with it
     * @param {Coin} coin - The coin object to collect
     */
    collectCoin(coin) {
        if (window.SOUNDS_ENABLED) {
            this.coin_sound.play();
        }
        let coinNum = this.world.level.coins.indexOf(coin);
        this.world.level.coins.splice(coinNum, 1);
        this.world.character.coins = Math.min(this.world.character.coins + 20, this.MAX_COINS);
        this.world.statusBarCoin.setPercentageCoin(this.world.character.coins);
    }

    /**
     * Checks for collisions between the character and bottles
     */
    checkCollisionBottles() {
        this.world.level.bottles.forEach(bottle => {
            if (this.world.character.isColliding(bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    /**
     * Collects a bottle when the character collides with it
     * @param {Bottle} bottle - The bottle object to collect
     */
    collectBottle(bottle) {
        if (window.SOUNDS_ENABLED) {
            this.bottle_sound.play();
        }
        let bottleNum = this.world.level.bottles.indexOf(bottle);
        this.world.level.bottles.splice(bottleNum, 1);

        if (this.world.character.bottles < this.MAX_BOTTLES) {
            this.world.character.bottles++;
            this.updateStatusBarBottle();
        }
    }

    /**
     * Allows the player to buy a bottle using coins
     * @returns {boolean} Whether the purchase was successful
     */
    buyBottle() {
        if (this.world.character.coins >= 20 && this.world.character.bottles < this.MAX_BOTTLES) {
            this.world.character.coins -= 20;
            this.world.character.bottles++;
            this.updateStatusBarBottle();
            this.world.statusBarCoin.setPercentageCoin(this.world.character.coins);
            
            if (window.SOUNDS_ENABLED) {
                this.exchange_sound.play();
            }
            return true;
        }
        return false;
    }

    /**
     * Checks if there's space to collect another bottle
     * @returns {boolean} Always returns true in current implementation
     */
    freeBottleSpace() {
        return true;
    }

    /**
     * Updates the bottle status bar display
     */
    updateStatusBarBottle() {
        this.world.statusBarBottle.setPercentageBottle(this.world.character.bottles);
    }
}