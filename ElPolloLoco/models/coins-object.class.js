class Coin extends MovableObject {
    static IMAGE_PATH = 'img/8_coin/coin_1.png';
    static HEIGHT = 100;
    static WIDTH = 100;
    static POSITION_VARIANCE = 100;
    static BASE_Y_POSITION = 200;
    
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