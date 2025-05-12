class DrawableObjects {
    x = 120;
    y = 180;
    img;
    height = 150;
    width = 100;
    currentImage = 0;
    imageCache = {};

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    drawFrame(ctx) {
        if (this.canDrawFrame()) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    canDrawFrame() {
        return this instanceof Character ||
            this instanceof Chicken ||
            this instanceof Bottle ||
            this instanceof Coin ||
            this instanceof ThrowableObject;
    }
}