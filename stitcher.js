const { argv } = require('yargs');
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

let x = 1920 * 2;
let y = 1080 * 2;

let canvas = createCanvas(x, y);
let ctx = canvas.getContext('2d');


loadImage(`./output/${argv.folder}/out0.png`)
    .then(img => {
        ctx.drawImage(img, 0, 0)
        return loadImage(`./output/${argv.folder}/out1.png`)
    })
    .then(img => {
        ctx.drawImage(img, x / 2, 0)
        console.log(img);
        return loadImage(`./output/${argv.folder}/out2.png`)
    })
    .then(img => {
        console.log(img);
        ctx.drawImage(img, x / 2, y / 2)
        return loadImage(`./output/${argv.folder}/out3.png`)
    })
    .then(img => {
        ctx.drawImage(img, 0, y / 2)
        let out = fs.createWriteStream(`./output/${argv.folder}/out-stitched.png`);
        canvas.createPNGStream().pipe(out);
    })
    .catch(console.error);