class Range {
    constructor(ar, widthRange, sides, centerX, centerY) {
        this.aspectRatio = ar;
        this.sides = sides;
        this.widthRange = widthRange;  //this is half of the actual widthRange
        this.heightRange = widthRange / ar; //this is half of the actual heightRange
        this.centerX = centerX;
        this.centerY = centerY;
    }

    calcOffset(n) {
        if (this.sides === 1) return this.recalc(this.centerX, this.centerY);
        let x = (n % this.sides);
        let y = Math.floor(n / this.sides);
        if (this.sides % 2 === 0) {
            x += (x - this.sides / 2 < 0) ? -this.sides / 2 : - (this.sides / 2) + 1;
            y += (y - this.sides / 2 < 0) ? -this.sides / 2 : - (this.sides / 2) + 1;
            x = x * this.widthRange + Math.sign(x) * (Math.abs(x) - 1) * this.widthRange;
            y = y * this.heightRange + Math.sign(y) * (Math.abs(y) - 1) * this.heightRange;
        } else {
            x = Math.ceil(x - this.sides / 2);
            y = Math.ceil(y - this.sides / 2);
            x = (x * this.widthRange * 2);
            y = (y * this.heightRange * 2);
        }
        this.recalc(x, y);

    }

    recalc(xOff, yOff) {
        this.x = {
            min: -this.widthRange + this.centerX + xOff,
            max: this.widthRange + this.centerX + xOff
        }

        this.y = {
            min: -this.heightRange + this.centerY + yOff,
            max: this.heightRange + this.centerY + yOff
        }

    }

    offSet(x, y) {
        this.x.max += x
        this.x.min += x

        this.y.min += y
        this.y.max += y
    }
}

module.exports = Range;