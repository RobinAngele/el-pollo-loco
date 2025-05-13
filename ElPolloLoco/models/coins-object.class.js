/**
 * Collectable coin object
 * @extends MovableObject
 */
class Coin extends MovableObject {
    /**
     * Path to the coin image
     * @type {string}
     */
    static IMAGE_PATH = 'img/8_coin/coin_1.png';
    
    /**
     * Height of the coin
     * @type {number}
     */
    static HEIGHT = 100;
    
    /**
     * Width of the coin
     * @type {number}
     */
    static WIDTH = 100;
    
    /**
     * Random position variance for coin placement
     * @type {number}
     */
    static POSITION_VARIANCE = 100;
    
    /**
     * Base Y position for coins
     * @type {number}
     */
    static BASE_Y_POSITION = 200;
    
    /**
     * Constructor for coin
     * @param {number} x - Base X position
     */
    constructor(x) {
        super();
        this.loadImage(Coin.IMAGE_PATH);
        this.x = x - Math.random() * Coin.POSITION_VARIANCE;
        this.y = Coin.BASE_Y_POSITION - Math.random() * Coin.POSITION_VARIANCE;
        this.height = Coin.HEIGHT;
        this.width = Coin.WIDTH;
        this.offset = {
            top: 25,
            bottom: 25,
            right: 25,
            left: 25
        };
    }
}