

module.exports = {
    complex(re, im) {
        return [re, im];
    },

    divide(num, den) {
        let opDen = den[0] * den[0] + den[1] * den[1];
        let re = (num[0] * den[0] + num[1] * den[1]) / opDen;
        let im = (num[1] * den[0] - num[0] * den[1]) / opDen;
        return [re, im]
    },
    mult(z1, z2) {
        let re = (z1[0] * z2[0]) - (z1[1] * z2[1]);
        let im = (z1[0] * z2[1]) + (z2[0] * z1[1]);
        return [re, im]
    },
    add(z1, z2) {
        let re = z1[0] + z2[0];
        let im = z1[1] + z2[1];
        return [re, im]
    },
    sq(z) {
        let re = z[0] * z[0] - z[1] * z[1];
        let im = 2 * z[0] * z[1];
        return [re, im]
    },
    abs(z) {
        return Math.sqrt(z[0] * z[0] + z[1] * z[1]);
    },
    pow(z, n) {
        if (n === 0) return { re: 1, im: 0 };
        if (n === 1) return z;
        let w = z;
        for (let i = 1; i < n; i++) {
            w = this.mult(z, w);
        }
        return w;
    },
    sqrt(z) {
        let r = Math.sqrt(z[0] * z[0] + z[1] * z[1]);
        let angle = Math.atan(z[1] / z[0]);
        if (Math.sign(z[0]) === -1) angle += Math.PI;

        let re = Math.sqrt(r) * Math.cos(angle / 2)
        let im = Math.sqrt(r) * Math.sin(angle / 2);
        return [re, im]
    },
    exp(z) {
        let mult = Math.exp(z[0]);
        let re = mult * Math.cos(z[1]);
        let im = mult * Math.sin(z[1]);
        return [re, im]
    },
    cos(z) {
        let re = Math.cos(z[0]) * Math.cosh(z[1]);
        let im = -Math.sin(z[0]) * Math.sinh(z[1]);
        return [re, im]
    },
    sin(z) {
        let re = Math.sin(z[0]) * Math.cosh(z[1]);
        let im = -Math.cos(z[0]) * Math.sinh(z[1]);
        return [re, im]
    }
}