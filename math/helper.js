Math.degToRad = function(degrees) {
    return degrees *  this.PI / 180;
}

Math.radToDeg = function(radians) {
    return radians * 180 / this.PI;
}

Math.inRange = function(value, rangeMin, rangeMax) {
    return value >= this.min(rangeMin, rangeMax) && value <= this.max(rangeMin, rangeMax);
}

Math.rangeOverlap = function(aMin, aMax, bMin, bMax) {
    return this.max(aMin, aMax) >= this.min(bMin, bMax) && this.min(aMin, aMax) <= this.max(bMin, bMax);
}

Math.euclidDistanceSquare = function(aX, aY, bX, bY) {
    this.pow(aX - bX, 2) + this.pow(aY - bY, 2);
}

Math.euclidDistance = function(aX, aY, bX, bY) {
    return this.sqrt(this.euclidDistanceSquare(aX, aY, bX, bY));
}

Math.randomRangeInt = function(min, max) {
    return this.floor(this.random() * (max - min + 1)) + min;
}

Math.makeRange = function(start, end, step) {
    let result = [start];
    let next = start;
    while(next < end) {
        result.push(next += step);
    }
    return result;
}

function hasFlag(value, mask) {
    return (value & mask) === mask;
}


function addFlag(value, mask) {
    return value | mask;
}

function removeFlag(value, mask) {
    return value & ~mask;
}