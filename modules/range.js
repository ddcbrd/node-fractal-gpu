class Range {
    constructor(ar, xr) {
        this.aspectRatio = ar;
        this.recalc(xr)
    }

    recalc(xr) {
        this.x = {
            min: -xr,
            max: xr
        }

        this.y = {
            min: -(xr / this.aspectRatio),
            max: (xr / this.aspectRatio)
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