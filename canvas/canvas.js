CanvasRenderingContext2D.prototype.fillCircle = function(x, y, radius, color) {
    this.fillStyle = color;
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fill();
}