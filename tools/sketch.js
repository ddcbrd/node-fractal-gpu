let img;

const rangeVal = 2;
const xOff = -1;
const yOff = 0;
const sides = 3;

let x, y, newXr, range;

let AR;

function preload() {
    img = loadImage('../output/1598997253371/out-stitched.png')
}

function setup() {
    createCanvas(img.width, img.height);
    AR = width / height;
    range = rangeVal * sides;
    newXr = range * 0.1;
}

function draw() {
    background(img);
    line(0, height / 2, width, height / 2)
    line(width / 2, 0, width / 2, height);
    noFill();
    rectMode(CENTER);

    let rectSide = map(newXr, 0, range, 0, width);
    x = map(mouseX, 0, width, -range, range) + xOff;
    y = map(mouseY, 0, height, -range / AR, range / AR) + yOff;
    line(mouseX, mouseY, width / 2, height / 2);
    rect(mouseX, mouseY, rectSide, rectSide / AR);
}

function mouseClicked() {
    console.log(`const rangeVal = ${newXr};`, `const xOff = ${x};`, `const yOff = ${y};`)
}

function mouseWheel(event) {
    event.preventDefault();
    let inc = newXr * event.delta / 10000;
    newXr += inc;

}