class Bottle extends MovableObject {
    static IMAGE_PATH = 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    static HEIGHT = 80;
    static WIDTH = 80;
    static GROUND_LEVEL = 350;
    
    constructor(x) {
        super();
        this.loadImage(Bottle.IMAGE_PATH);
        this.x = x;
        this.y = Bottle.GROUND_LEVEL;
        this.height = Bottle.HEIGHT;
        this.width = Bottle.WIDTH;
        this.offset = {
            top: 10,
            bottom: 10,
            right: 10,
            left: 10
        };
    }
}