const { argv } = require('yargs');
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

let x = argv.sides * argv.width;
let y = argv.sides * argv.height;
let nImages = argv.sides * argv.sides;
let canvas = createCanvas(x, y);
let ctx = canvas.getContext('2d');

let getCoord = function (n) {
    let cx = (n % argv.sides) * x / argv.sides;;
    let cy = Math.floor(n / argv.sides) * y / argv.sides;
    return { x: cx, y: cy }
}

let promises = [];

for (let i = 0; i < argv.sides * argv.sides; i++) {
    promises.push(loadImage(`./output/${argv.folder}/out${i}.png`));
}

Promise.all(promises)
    .then(res => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
            let coord = getCoord(i);
            ctx.drawImage(res[i], coord.x, coord.y)
        }
    }).then(() => {
        let out = fs.createWriteStream(`./output/${argv.folder}/out-stitched.png`);
        canvas.createPNGStream().pipe(out);

        console.log('Done Merging.')
    })

    // loadImage(`./output/${argv.folder}/out0.png`)
    //     .then(img => {
    //         ctx.drawImage(img, 0, 0)
    //         return loadImage(`./output/${argv.folder}/out1.png`)
    //     })
    //     .then(img => {
    //         ctx.drawImage(img, x / 2, 0)
    //         console.log(img);
    //         return loadImage(`./output/${argv.folder}/out2.png`)
    //     })
    //     .then(img => {
    //         console.log(img);
    //         ctx.drawImage(img, x / 2, y / 2)
    //         return loadImage(`./output/${argv.folder}/out3.png`)
    //     })
    //     .then(img => {
    //         ctx.drawImage(img, 0, y / 2)
    //         let out = fs.createWriteStream(`./output/${argv.folder}/out-stitched.png`);
    //         canvas.createPNGStream().pipe(out);
    //     })
    .catch(console.error);