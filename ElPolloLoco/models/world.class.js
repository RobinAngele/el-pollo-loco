class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBarHealth();
    statusBarBottle = new StatusBarBottle();
    statusBarCoin = new StatusBarCoin();
    statusBarEndboss = new StatusBarEndboss();
    startScreen = new Startscreen();
    throwableObject = [];
    coin_sound = new Audio('audio/coin.mp3');
    bottle_sound = new Audio('audio/bottle.mp3');
    endboss = this.level.enemies[this.level.enemies.length - 1];
    babyChickens = [];
    endbossIcon = new Image();
    coinIcon = new Image();
    bottleIcon = new Image();
    MAX_COINS = 100;
    MAX_BOTTLES = 5;
    bottleNotificationShown = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.checkForGameOver();
        this.endbossIcon.src = 'img/7_statusbars/3_icons/icon_health_endboss.png';
        this.coinIcon.src = 'img/7_statusbars/3_icons/icon_coin.png';
        this.bottleIcon.src = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    }

    checkForGameOver() {
        setInterval(() => {
            if (this.character.isDead()) {
                setTimeout(() => {
                    this.showYouLostScreen();
                    this.clearAllIntervals();
                    gameMusic.pause();
                }, 1500);
            } else if (this.endboss.isDead()) {
                setTimeout(() => {
                    this.showGameOverScreen();
                    this.clearAllIntervals();
                    gameMusic.pause();
                }, 1500);
            }
        }, 1000);
    }

    refreshPageWithTimer() {
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    showYouLostScreen() {
        let lost = document.getElementById('gameOverScreenLost');
        lost.style.display = "flex";
        lost.style.zIndex = "999";
    }

    showGameOverScreen() {
        let win = document.getElementById('gameOverScreenWin');
        win.style.display = "flex";
        win.style.zIndex = "999";
    }

    checkPlayMusic() {
        if (this.playMusic) {
            this.gameMusic.play();
        }
    }

    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    static BOSS_TRIGGER_POSITION = 2000;

    checkBossFight() {
        if (this.character.x > World.BOSS_TRIGGER_POSITION) {
            this.endboss.firstContact = true;
            this.statusBarEndboss.visible = true;
        }
    }

    checkBottleNotification() {
        const notification = document.getElementById('bottleNotification');
        if (!notification) return;
        
        if (this.character.bottles === 0 && this.character.coins >= 20) {
            if (!this.bottleNotificationShown) {
                notification.classList.remove('d-none');
                this.bottleNotificationShown = true;
            }
        } else if (this.bottleNotificationShown) {
            notification.classList.add('d-none');
            this.bottleNotificationShown = false;
        }
    }

    run() {
        setInterval(() => {
            this.checkPlayerCollisions();
            this.checkEnvironmentInteractions();
            this.checkGameState();
            this.checkBottleNotification();
        }, 1000 / 60);
        
        setInterval(() => this.checkEnemyHitsPeppe(), 200);
        setInterval(() => this.checkThrowObjects(), 100);
    }
    
    checkPlayerCollisions() {
        this.checkPeppeHitsEnemy();
    }
    
    checkEnvironmentInteractions() {
        this.checkCollisionsCoins();
        this.checkCollisionBottles();
    }
    
    checkGameState() {
        this.checkPlayMusic();
        this.checkBossFight();
        this.cleanupBabyChickens();
    }

    checkEnemyHitsPeppe() {
        this.level.enemies.forEach((enemy) => {
            if (this.hitboxColliding(enemy)) {
                this.playerTakesDamage();
            }
        });
    }
    
    playerTakesDamage() {
        this.character.hit(20);
        this.character.idleTimer = 0;
        this.statusBarHealth.setPercentageHealth(this.character.energy);
    }

    hitboxColliding(enemy) {
        return this.character.isColliding(enemy) &&
            !enemy.isDead() &&
            this.character.speedY >= 0;
    }

    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
            this.character.bottleCooldown = this.character.bottleCooldownTime;
            this.character.idleTimer = 0;
        }
        
        this.handleBottleCollisions();
        this.handleBottleCleanup();
        this.statusBarBottle.setPercentageBottle(this.character.bottles);
    }
    
    canThrowBottle() {
        return this.keyboard.T && 
               this.character.bottles > 0 && 
               this.character.bottleCooldown <= 0;
    }
    
    handleBottleCollisions() {
        for (let i = this.throwableObject.length - 1; i >= 0; i--) {
            const bottle = this.throwableObject[i];
            const hitEnemy = this.findCollidingEnemy(bottle);
            
            if (hitEnemy) {
                this.damageEnemy(hitEnemy, bottle);
                this.throwableObject.splice(i, 1);
            }
        }
    }
    
    findCollidingEnemy(bottle) {
        return this.level.enemies.find(enemy => 
            bottle.isColliding(enemy) && !enemy.isDead());
    }
    
    handleBottleCleanup() {
        this.throwableObject = this.throwableObject.filter(bottle => bottle.y <= 500);
    }
    
    damageEnemy(enemy, bottle) {
        enemy.hit(1);
        if (enemy instanceof Endboss) {
            this.statusBarEndboss.setPercentageEndboss(enemy.energy * 20);
        }
    }

    throwBottle() {
        const offsetX = 40;
        const offsetY = 100;
        const bottle = new ThrowableObjects(
            this.character.x + offsetX, 
            this.character.y + offsetY
        );
        
        this.throwableObject.push(bottle);
        this.character.bottles--;
        this.updateStatusBarBottle();
    }

    clearAllIntervals() {
        const MAX_INTERVAL_ID = 9999;
        for (let i = 1; i < MAX_INTERVAL_ID; i++) {
            window.clearInterval(i);
        }
    }

    checkPeppeHitsEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.canJumpOnEnemy(enemy)) {
                this.handleJumpOnEnemy(enemy);
            }
        });
    }
    
    canJumpOnEnemy(enemy) {
        return this.character.isColliding(enemy) &&
            !enemy.isDead() &&
            this.character.speedY < 0 &&
            (enemy instanceof Chicken || enemy instanceof BabyChicken);
    }
    
    handleJumpOnEnemy(enemy) {
        this.character.jump();
        enemy.energy--;
    }

    checkCollisionsCoins() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin);
                this.statusBarCoin.setPercentageCoin(this.character.coins);
            }
        });
    }

    collectCoin(coin) {
        if (window.SOUNDS_ENABLED) {
            this.coin_sound.play();
        }
        let coinNum = this.level.coins.indexOf(coin);
        this.level.coins.splice(coinNum, 1);
        this.character.coins = Math.min(this.character.coins + 20, this.MAX_COINS);
        this.statusBarCoin.setPercentageCoin(this.character.coins);
    }

    checkCollisionBottles() {
        this.level.bottles.forEach(bottle => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    collectBottle(bottle) {
        if (window.SOUNDS_ENABLED) {
            this.bottle_sound.play();
        }
        let bottleNum = this.level.bottles.indexOf(bottle);
        this.level.bottles.splice(bottleNum, 1);

        if (this.character.bottles < this.MAX_BOTTLES) {
            this.character.bottles++;
            this.updateStatusBarBottle();
        }
    }

    freeBottleSpace() {
        return true;
    }

    updateStatusBarBottle() {
        this.statusBarBottle.setPercentageBottle(this.character.bottles);
    }

    cleanupBabyChickens() {
        for (let i = this.babyChickens.length - 1; i >= 0; i--) {
            const chicken = this.babyChickens[i];
            if (chicken.isDead() && chicken.defeated) {
                this.babyChickens.splice(i, 1);
            }
        }
        
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (enemy instanceof BabyChicken && enemy.isDead() && enemy.defeated) {
                setTimeout(() => {
                    const index = this.level.enemies.indexOf(enemy);
                    if (index !== -1) {
                        this.level.enemies.splice(index, 1);
                    }
                }, 1000);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObject);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.babyChickens);
        this.ctx.translate(-this.camera_x, 0);

        this.addTopMap(this.statusBarHealth);
        this.addTopMap(this.statusBarBottle);
        this.addTopMap(this.statusBarCoin);
        this.addTopMap(this.statusBarEndboss);

        if (this.statusBarEndboss.visible) {
            this.ctx.drawImage(this.endbossIcon, 495, 10, 60, 60);
        }

        this.ctx.translate(this.camera_x, 0);
        this.addTopMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addTopMap(o);
        });
    }

    addTopMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}

