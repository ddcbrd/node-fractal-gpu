const math = require('./modules/complex-math');

let iterations = 4 * 1920 * 1080 * 500;

let z = {
    re: 4,
    im: 10
}

let start = Date.now();

// let arr = []

for (let i = 0; i < iterations; i++) {
    math.sq(z);
}

let finish = Date.now();

let delta = finish - start;
let perOp = delta / iterations;

console.log(`Finished in ${delta}ms. (${perOp}ms / operation)`);
// console.log(arr)