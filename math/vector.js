function length(x, y) {
    return Math.sqrt((x * x) + (y * y));
}

function normalize(x, y) {
    const len = length(x, y);  
    return len > 0 ? { x: x / len, y: y / len } : { x:0, y:0 };
}