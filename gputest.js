const { GPU } = require('gpu.js');
const PNG = require('fast-png')
const fs = require('fs')
const Range = require('./modules/range');
const { spawn, exec } = require('child_process');

//GENERATION CONSTANTS
const width = 1920
const height = 1080
const maxIterations = 600
const boundary = 16

const rangeVal = 2
const xOff = 0
const yOff = 0
const sides = 1

const nImages = 1
const aspectRatio = width / height
const range = new Range(aspectRatio, rangeVal, sides, xOff, yOff);

const padLen = nImages.toString().length

let now = Date.now()

function cdivide(num, den) {
    let opDen = den[0] * den[0] + den[1] * den[1];
    let re = (num[0] * den[0] + num[1] * den[1]) / opDen;
    let im = (num[1] * den[0] - num[0] * den[1]) / opDen;
    return [re, im]
}
function mult(z1, z2) {
    let re = (z1[0] * z2[0]) - (z1[1] * z2[1]);
    let im = (z1[0] * z2[1]) + (z2[0] * z1[1]);
    return [re, im]
}
function cadd(z1, z2) {
    let re = z1[0] + z2[0];
    let im = z1[1] + z2[1];
    return [re, im]
}
function csq(z) {
    let re = z[0] * z[0] - z[1] * z[1];
    let im = 2 * z[0] * z[1];
    return [re, im]
}
function cabs(z) {
    return Math.sqrt(z[0] * z[0] + z[1] * z[1]);
}
function pow(z, n) {
    if (n === 0) return { re: 1, im: 0 };
    if (n === 1) return z;
    let w = z;
    for (let i = 1; i < n; i++) {
        w = this.mult(z, w);
    }
    return w;
}
function sqrt(z) {
    let r = Math.sqrt(z[0] * z[0] + z[1] * z[1]);
    let angle = Math.atan(z[1] / z[0]);
    if (Math.sign(z[0]) === -1) angle += Math.PI;

    let re = Math.sqrt(r) * Math.cos(angle / 2)
    let im = Math.sqrt(r) * Math.sin(angle / 2);
    return [re, im]
}
function exp(z) {
    let mult = Math.exp(z[0]);
    let re = mult * Math.cos(z[1]);
    let im = mult * Math.sin(z[1]);
    return [re, im]
}
function cos(z) {
    let re = Math.cos(z[0]) * Math.cosh(z[1]);
    let im = -Math.sin(z[0]) * Math.sinh(z[1]);
    return [re, im]
}
function sin(z) {
    let re = Math.sin(z[0]) * Math.cosh(z[1]);
    let im = -Math.cos(z[0]) * Math.sinh(z[1]);
    return [re, im]
}

function fractal(xRangeStart, xRangeFinish, yRangeStart, yRangeFinish, cre, cim) {
    let index = Math.floor(this.thread.x / 3);
    let colorIndex = this.thread.x % 3;
    let x = Math.floor(index % this.constants.width);
    let y = Math.floor(index / this.constants.width);

    let a = ((xRangeFinish - xRangeStart) * x / (this.constants.width - 1)) + xRangeStart;
    let b = ((yRangeFinish - yRangeStart) * y / (this.constants.height - 1)) + yRangeStart;

    let c = [cre, cim];
    let z = [a, b];
    let i = 0;
    let maxit = this.constants.maxIt;
    for (let n = 0; n < maxit; n++) {
        z = cadd(csq(z), c);
        if (cabs(z) > this.constants.boundary) break;
        i++;
    }
    let h = ((1 - Math.sqrt(i / (this.constants.maxIt + 1))) * 360);

    return hsvtorgb(h, 1, 1)[colorIndex];
}

const gpu = new GPU()
    .addFunction(cabs)
    .addFunction(cadd)
    .addFunction(csq)
    .addFunction(cdivide)
    .addNativeFunction('hsvtorgb', `
    vec3 hsvtorgb(float h, float s, float v){
        float c = s * v;
        float x = c * (1.0 - abs(mod((h / 60.0), 2.0) - 1.0));
        float m = v - c;
        vec3 color;
        if (0.0 <= h && h < 60.0)           color = vec3(c + m,     x + m,      0.0 + m);
        else if (60.0 <= h && h < 120.0)    color = vec3(x + m,     c + m,      0.0 + m);
        else if (120.0 <= h && h < 180.0)   color = vec3(0.0 + m,   c + m,      x + m);
        else if (180.0 <= h && h < 240.0)   color = vec3(0.0 + m,   x + m,      c + m);
        else if (240.0 <= h && h < 300.0)   color = vec3(x + m,     0.0 + m,    c + m);
        else if (300.0 <= h && h < 360.0)   color = vec3(c + m,     0.0 + m,    x + m);
        color.r = (color.r + m) * 65535.0;
        color.g = (color.g + m) * 65535.0;
        color.b = (color.b + m) * 65535.0;
        return color;
    }`)
// .addFunction(hsvtorgb)


const kernel = gpu.createKernel(fractal, {
    constants: {
        maxIt: maxIterations,
        width: width,
        height: height,
        boundary: boundary
    },
    output: [width * height * 3]
})
    .setLoopMaxIterations(maxIterations);

fs.mkdirSync(`./output/${now}`);

for (let images = 0; images < nImages; images++) {
    range.recalc(xOff, yOff)
    console.log(`Calculating ${maxIterations} iterations for ${width * height} pixels. Image ${images + 1}/${nImages}`)
    let cre = images / nImages
    let cim = 1 - cre
    // let f = kernel.toString(range.x.min, range.x.max, range.y.min, range.y.max, cre, cim)
    // fs.writeFileSync('./f.txt', f);
    // break
    let output = kernel(range.x.min, range.x.max, range.y.min, range.y.max, cre, cim)
    console.log('Done Generating... Creating image')

    let pngObj = {
        width: width,
        height: height,
        data: output,
        depth: 16,
        channels: 3
    }
    let encodedArr = PNG.encode(pngObj);

    let imageNumber = images.toString().padStart(padLen, '0')
    fs.writeFileSync(`./output/${now}/out${imageNumber}.png`, encodedArr);
    console.log('Image created');
}

console.log("Generating video...")

exec(`ffmpeg -i ./output/${now}/out%0${padLen}d.png -c:v libx264 -r 30 ./output/${now}/out-video.mp4`, (error, stdout, stderr) => {
    if (error) console.error(stderr, error)
    else {
        console.log(`Video generated: ./output/${now}/out-video.mp4`)
    }
})


// setTimeout(() => { }, 1000000)