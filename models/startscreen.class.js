/**
 * Startscreen class representing the game's start screen
 * @extends DrawableObjects
 */
class Startscreen extends DrawableObjects {
    /**
     * Constructor for the Startscreen class
     * Initializes the start screen with default position and dimensions
     */
    constructor(){
        super().loadImage('img/9_intro_outro_screens/start/startscreen_1.png');
        this.x = 0;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}