module.exports = function (h, s, v) {
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

    color.r = (color.r + m) * 65535;
    color.g = (color.g + m) * 65535;
    color.b = (color.b + m) * 65535;

    return color;
}