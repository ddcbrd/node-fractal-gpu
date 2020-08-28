const PNG = require('fast-png');
const math = require('mathjs');
const Stream = require('stream').Duplex;
const fs = require('fs')

let stream = new Stream();

const width = 1920 * 2;
const height = 1080 * 2;
const maxIterations = 500;
const boundary = 16;

const rangeVal = 0.0002267605051886997;
const xOff = 1.359419290265534;
const yOff = -0.5132787013916992;
//1.21875 -0.4166666666666665 0.5084414655163397

let pngArr = [];

let HSVtoRGB = function (h, s, v) {
    let c = s * v;
    let x = c * (1 - Math.abs(
        ((h / 60) % 2) - 1
    ));
    let m = v - c;

    let color = {}

    if (0 <= h && h < 60) color = { r: c, g: x, b: 0 };
    else if (60 <= h && h < 120) color = { r: x, g: c, b: 0 };
    else if (120 <= h && h < 180) color = { r: 0, g: c, b: x };
    else if (180 <= h && h < 240) color = { r: 0, g: x, b: c };
    else if (240 <= h && h < 300) color = { r: x, g: 0, b: c };
    else if (300 <= h && h < 360) color = { r: c, g: 0, b: x };

    color.r = (color.r + m) * 255;
    color.g = (color.g + m) * 255;
    color.b = (color.b + m) * 255;

    return color;
}

class Range {
    constructor(xr) {
        this.aspectRatio = width / height;
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

    scale(factor) {
        this.x.min *= factor;
        this.x.max *= factor;
        this.y.min *= factor;
        this.y.max *= factor;
    }
}

const range = new Range(rangeVal)
range.offSet(xOff, yOff)

let map = function (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

let genColor = function (n) {
    let iteration = ((n / maxIterations) * 359);
    let s = 1 - (n / maxIterations);
    let color = HSVtoRGB(iteration, s, 1);
    pngArr.push(color.r)
    pngArr.push(color.g)
    pngArr.push(color.b)
}

let pixels = width * height;

console.log(`Calculating ${maxIterations} iterations for ${pixels} pixels `)

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

        let a = map(x, 0, width, range.x.min, range.x.max);
        let b = map(y, 0, height, range.y.min, range.y.max);

        let c = math.complex(a, b);
        let z = math.complex(1, 1);
        let i = 0;

        for (; i < maxIterations; i++) {
            let dPower = math.add(z.pow(2), z);
            let nPower = math.sqrt(c.pow(3));
            let power = math.divide(dPower, nPower);
            z = math.pow(math.e, power);
            if (math.abs(z) > boundary) break;
        }

        genColor(i);

        console.log((x + y * height) / pixels);
        // let gs = map(i, 0, maxIterations, 0, 1);
        // pngArr.push(Math.sqrt(gs) * 255);
    }
}

console.log('Done Generating... Creating the image');

let pngObj = {
    width: width,
    height: height,
    data: pngArr,
    channels: 3
}

let encodedArr = PNG.encode(pngObj);

stream.push(encodedArr);
stream.push(null);

let out = fs.createWriteStream('out.png');

stream.pipe(out)
    .on('finish', () => {
        console.log('Image created');
    })
    .on('error', (err) => console.error(err));