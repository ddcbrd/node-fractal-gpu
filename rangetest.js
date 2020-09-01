const Range = require('./modules/range')
let r = new Range(1, 1920, 1, 4, 0, 0)

for (let i = 0; i < 16; i++) {
    r.calcOffset(i);
    console.log(i, r.x, r.y);
}