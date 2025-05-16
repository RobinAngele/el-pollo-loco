/**
 * Manages game state and UI interactions
 */
class GameStateManager {
    /**
     * World reference
     * @type {World}
     */
    world;
    
    /**
     * Flag indicating if bottle notification is shown
     * @type {boolean}
     */
    bottleNotificationShown = false;

    /**
     * @param {World} world - Reference to the game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks if the game should end based on character or endboss state
     */
    checkForGameOver() {
        setInterval(() => {
            if (this.world.character.isDead()) {
                setTimeout(() => {
                    this.hideBottleNotificationAndShowGameOver('lost');
                }, 1500);
            } else if (this.world.endboss.isDead()) {
                setTimeout(() => {
                    this.hideBottleNotificationAndShowGameOver('win');
                }, 1500);
            }
        }, 1000);
    }

    /**
     * Hides bottle notification and shows appropriate game over screen
     * @param {string} outcome - 'win' or 'lost'
     */
    hideBottleNotificationAndShowGameOver(outcome) {
        // Hide bottle notification if shown
        const notification = document.getElementById('bottleNotification');
        if (notification) {
            notification.classList.add('d-none');
        }
        this.bottleNotificationShown = false;
        
        // Show appropriate game over screen
        if (outcome === 'lost') {
            this.showYouLostScreen();
        } else {
            this.showGameOverScreen();
        }
        
        this.clearAllIntervals();
        gameMusic.pause();
    }

    /**
     * Shows the game over screen when player loses
     */
    showYouLostScreen() {
        let lost = document.getElementById('gameOverScreenLost');
        lost.style.display = "flex";
        lost.style.zIndex = "999";
    }

    /**
     * Shows the game over screen when player wins
     */
    showGameOverScreen() {
        let win = document.getElementById('gameOverScreenWin');
        win.style.display = "flex";
        win.style.zIndex = "999";
    }

    /**
     * Refreshes the page after a delay
     */
    refreshPageWithTimer() {
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    /**
     * Checks if music should be playing based on global sound settings
     */
    checkPlayMusic() {
        if (playMusic && gameMusic && gameMusic.paused) {
            gameMusic.play();
        } else if (!playMusic && gameMusic && !gameMusic.paused) {
            gameMusic.pause();
        }
    }

    /**
     * Position where the endboss fight is triggered
     * @type {number}
     */
    static BOSS_TRIGGER_POSITION = 2000;

    /**
     * Checks if the boss fight should start based on character position
     */
    checkBossFight() {
        if (this.world.character.x > GameStateManager.BOSS_TRIGGER_POSITION) {
            this.world.endboss.firstContact = true;
            this.world.statusBarEndboss.visible = true;
        }
    }

    /**
     * Handles showing/hiding the bottle notification
     */
    checkBottleNotification() {
        const notification = document.getElementById('bottleNotification');
        if (!notification) return;
        
        if (this.world.character.bottles === 0 && this.world.character.coins >= 20) {
            if (!this.bottleNotificationShown) {
                notification.classList.remove('d-none');
                this.bottleNotificationShown = true;
            }
        } else if (this.bottleNotificationShown) {
            notification.classList.add('d-none');
            this.bottleNotificationShown = false;
        }
    }

    /**
     * Removes dead baby chickens from the game
     */
    cleanupBabyChickens() {
        this.cleanupFromBabyChickensArray();
        this.cleanupFromEnemiesArray();
    }

    /**
     * Removes dead baby chickens from the babyChickens array
     */
    cleanupFromBabyChickensArray() {
        for (let i = this.world.babyChickens.length - 1; i >= 0; i--) {
            const chicken = this.world.babyChickens[i];
            if (chicken.isDead() && chicken.defeated) {
                this.world.babyChickens.splice(i, 1);
            }
        }
    }

    /**
     * Removes dead baby chickens from the enemies array
     */
    cleanupFromEnemiesArray() {
        for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.world.level.enemies[i];
            if (enemy instanceof BabyChicken && enemy.isDead() && enemy.defeated) {
                this.scheduleEnemyRemoval(enemy);
            }
        }
    }

    /**
     * Schedules an enemy for removal after a delay
     * @param {MovableObject} enemy - The enemy to remove
     */
    scheduleEnemyRemoval(enemy) {
        setTimeout(() => {
            const index = this.world.level.enemies.indexOf(enemy);
            if (index !== -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }

    /**
     * Checks overall game state (music, boss, cleanup)
     */
    checkGameState() {
        this.checkPlayMusic();
        this.checkBossFight();
        this.cleanupBabyChickens();
    }

    /**
     * Clears all interval timers to prevent memory leaks
     * Uses a batch approach to optimize performance
     */
    clearAllIntervals() {
        const MAX_INTERVAL_ID = 9999;
        const BATCH_SIZE = 1000;
        
        for (let batchStart = 1; batchStart < MAX_INTERVAL_ID; batchStart += BATCH_SIZE) {
            this.clearIntervalBatch(batchStart, batchStart + BATCH_SIZE);
        }
    }
    
    /**
     * Clears a batch of intervals within a given range
     * @param {number} start - Starting interval ID
     * @param {number} end - Ending interval ID (exclusive)
     */
    clearIntervalBatch(start, end) {
        for (let i = start; i < end; i++) {
            window.clearInterval(i);
        }
    }
}