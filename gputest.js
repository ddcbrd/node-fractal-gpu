const { GPU } = require('gpu.js');
const PNG = require('fast-png')
const fs = require('fs')
const Range = require('./modules/range');
const { spawn, exec } = require('child_process');
const { exit } = require('process');
const { SingleBar, Presets } = require('cli-progress')

//GENERATION CONSTANTS
const width = 1920
const height = 1080
const maxIterations = 600
const boundary = 100

const rangeVal = 2
const xOff = 0
const yOff = 0
const sides = 1

const nImages = 30 * 2
const aspectRatio = width / height
const range = new Range(aspectRatio, rangeVal, sides, xOff, yOff);

const padLen = nImages.toString().length

let now = Date.now()

function complexDivide(num, den) {
    let opDen = den[0] * den[0] + den[1] * den[1];
    let re = (num[0] * den[0] + num[1] * den[1]) / opDen;
    let im = (num[1] * den[0] - num[0] * den[1]) / opDen;
    return [re, im]
}

function complexMult(z1, z2) {
    let re = (z1[0] * z2[0]) - (z1[1] * z2[1]);
    let im = (z1[0] * z2[1]) + (z2[0] * z1[1]);
    return [re, im]
}

function complexAdd(z1, z2) {
    let re = z1[0] + z2[0];
    let im = z1[1] + z2[1];
    return [re, im]
}
function complexSq(z) {
    let re = z[0] * z[0] - z[1] * z[1];
    let im = 2 * z[0] * z[1];
    return [re, im]
}
function complexAbs(z) {
    return Math.sqrt(z[0] * z[0] + z[1] * z[1]);
}

function complexArg(z) {
    let arg = Math.atan2(z[1], z[0]);
    if ((z[0] < 0 && z[1] >= 0) || (z[0] < 0 && z[1] < 0)) arg += Math.PI;
    else if (z[0] >= 0 && z[1] < 0) arg += Math.PI * 2;
    return arg;
}

function complexPow(z, n) {
    if (n === 0) return { re: 1, im: 0 };
    if (n === 1) return z;
    let w = z;
    for (let i = 1; i < n; i++) {
        let re = (z[0] * w[0]) - (z[1] * w[1]);
        let im = (z[0] * w[1]) + (w[0] * z[1]);
        w = [re, im]
    }
    return w;
}
function complexSqrt(z) {
    let r = Math.sqrt(z[0] * z[0] + z[1] * z[1]);
    let angle = Math.atan(z[1] / z[0]);
    if (Math.sign(z[0]) === -1) angle += Math.PI;

    let re = Math.sqrt(r) * Math.cos(angle / 2)
    let im = Math.sqrt(r) * Math.sin(angle / 2);
    return [re, im]
}
function complexExp(z) {
    let mult = Math.exp(z[0]);
    let re = mult * Math.cos(z[1]);
    let im = mult * Math.sin(z[1]);
    return [re, im]
}
function complexCos(z) {
    let re = Math.cos(z[0]) * Math.cosh(z[1]);
    let im = -Math.sin(z[0]) * Math.sinh(z[1]);
    return [re, im]
}

function complexFromAngle(angle) {
    let x = Math.cos(angle)
    let y = Math.sin(angle)
    return [x, y]
}
function complexSin(z) {
    let re = Math.sin(z[0]) * Math.cosh(z[1]);
    let im = -Math.cos(z[0]) * Math.sinh(z[1]);
    return [re, im]
}

const gpu = new GPU()
    .addFunction(complexAbs)
    .addFunction(complexAdd)
    .addFunction(complexSq)
    .addFunction(complexDivide)
    .addFunction(complexArg)
    .addNativeFunction('hsvtorgb', `
    vec3 hsvtorgb(float h, float s, float v){
        float c = s * v;
        float x = c * (1.0 - abs(mod((h / 60.0), 2.0) - 1.0));
        float m = v - c;
        vec3 color;
        if (0.0 <= h && h < 60.0)           color = vec3(c, x, 0.0);
        else if (60.0 <= h && h < 120.0)    color = vec3(x, c, 0.0);
        else if (120.0 <= h && h < 180.0)   color = vec3(0.0, c, x);
        else if (180.0 <= h && h < 240.0)   color = vec3(0.0, x, c);
        else if (240.0 <= h && h < 300.0)   color = vec3(x, 0.0, c);
        else if (300.0 <= h && h < 360.0)   color = vec3(c, 0.0, x);
        color.r = (color.r + m) * 65535.0;
        color.g = (color.g + m) * 65535.0;
        color.b = (color.b + m) * 65535.0;
        return color;
    }`)
// .addFunction(hsvtorgb)


const juliaSet = gpu.createKernel(function (xRangeStart, xRangeFinish, yRangeStart, yRangeFinish, c) {
    let index = Math.floor(this.thread.x / 3);
    let colorIndex = this.thread.x % 3;
    let x = index % this.constants.width;
    let y = Math.floor(index / this.constants.width);

    let a = ((xRangeFinish - xRangeStart) * x / (this.constants.width - 1)) + xRangeStart;
    let b = ((yRangeFinish - yRangeStart) * y / (this.constants.height - 1)) + yRangeStart;
    let z = [a, b];
    let i = 0;
    let maxit = this.constants.maxIt;
    for (let n = 0; n < maxit; n++) {
        z = complexAdd(complexSq(z), c);
        if (complexAbs(z) > this.constants.boundary) break;
        i++;
    }
    let h = complexArg(z) / (2 * Math.PI);
    let s = Math.sqrt(i / (this.constants.maxIt))
    return hsvtorgb(s * 360, h, 1)[colorIndex];
}, {
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

let progress = new SingleBar({}, Presets.shades_classic)
progress.start(nImages, 0)

for (let images = 0; images < nImages; images++) {
    range.recalc(xOff, yOff)
    // console.log(`Calculating ${maxIterations} iterations for ${width * height} pixels. Image ${images + 1}/${nImages}`)
    let c = complexFromAngle((images / nImages) * 2 * Math.PI)

    // let f = juliaSet.toString(range.x.min, range.x.max, range.y.min, range.y.max, c)
    // fs.writeFileSync('./f.txt', f);
    // break

    let output = juliaSet(range.x.min, range.x.max, range.y.min, range.y.max, c)
    // console.log('       Done Generating... Creating image')

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
    // console.log('       Image created');

    progress.update(images)
}
progress.stop()

console.log("Generating video...")

exec(`ffmpeg -i ./output/${now}/out%0${padLen}d.png -c:v libx264 -r 30 ./output/${now}/out-video.mp4`, (error, stdout, stderr) => {
    if (error) console.error(stderr, error)
    else {
        console.log(`Video generated: ./output/${now}/out-video.mp4`)
    }
})


// setTimeout(() => { }, 1000000)