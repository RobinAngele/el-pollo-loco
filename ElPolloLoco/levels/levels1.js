/**
 * Main level configuration for the game
 * @type {Level}
 */
let level1;

/**
 * Initializes the game level with enemies, clouds, background, coins and bottles
 */
function initLevel() {
    level1 = new Level(
        createEnemyCharacters(),
        createCloudObjects(),
        createBackgroundLayers(),
        createCoinCollectibles(),
        createBottleCollectibles()
    );
}

/**
 * Creates the enemy characters for the level
 * @returns {Array} Array of enemy objects
 */
function createEnemyCharacters() {
    return [
        new Chicken(400),
        new Chicken(800),
        new Chicken(1000),
        new Chicken(1300),
        new Chicken(1500),
        new Chicken(1700),
        new Endboss(400)
    ];
}

/**
 * Creates cloud objects for the background
 * @returns {Array} Array of cloud objects
 */
function createCloudObjects() {
    return [
        new Cloud(500),
        new Cloud(1000),
        new Cloud(2000)
    ];
}

/**
 * Creates all background layers for the level
 * @returns {Array} Array of background objects
 */
function createBackgroundLayers() {
    return [
        ...createLayerSet(-719, '2'),
        ...createLayerSet(0, '1'),
        ...createLayerSet(719, '2'),
        ...createLayerSet(1438, '1'),
        ...createLayerSet(2157, '2')
    ];
}

/**
 * Creates a set of background layers at a specific position
 * @param {number} position - X position for the layer set
 * @param {string} variant - Variant of the background layer ('1' or '2')
 * @returns {Array} Array of background objects for a single position
 */
function createLayerSet(position, variant) {
    return [
        new BackgroundObject('img/5_background/layers/air.png', position),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, position),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, position),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, position)
    ];
}

/**
 * Creates collectible coins for the level
 * @returns {Array} Array of coin objects
 */
function createCoinCollectibles() {
    return [
        new Coin(200),
        new Coin(300),
        new Coin(500),
        new Coin(700),
        new Coin(1000),
        new Coin(1200),
        new Coin(15000)
    ];
}

/**
 * Creates collectible bottles for the level
 * @returns {Array} Array of bottle objects
 */
function createBottleCollectibles() {
    return [
        new Bottle(500),
        new Bottle(700),
        new Bottle(1500),
        new Bottle(1800),
        new Bottle(2200)
    ];
}