var canvas, context, keystate = {},
	KEY = {
	UP:38, DOWN:40, LEFT:37, RIGHT:39, SPACE:32,
	W:87, A:65, S:83, D:68, KEY1:49, KEY2:50,
	KEY3:51, KEY4:49 
};

function registerKeyboardInput(){
	document.addEventListener("keydown", function(e){
		keystate[e.keyCode] = true;
	});
	document.addEventListener("keyup", function(e){
		delete keystate[e.keyCode];
	});
}

function init(width, height){
	canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext('2d');
	document.body.appendChild(canvas);
	registerKeyboardInput();
}

var util = {
	distance: function(x0, y0, x1, y1){
		var dx = x1 - x0,
			dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},
	distanceSqre: function(x0, y0, x1, y1){
		var dx = x1 - x0,
			dy = y1 - y0;
		return (dx * dx + dy * dy);
	},
	in_range: function(val, min, max){
		return (val <= Math.max(min, max) && val >= Math.min(min, max));
	},
	scale_to_range : function(val, aMin, aMax, bMin, bMax){
		return (val / ((aMax-aMin) / (bMax - bMin))) + bMin;
	},
	deg_to_rad: function(value){
		return value * Math.PI / 180;
	},
	rad_to_deg: function(value){
		return value * 180 / Math.PI;
	},
	range_intersect: function(min0, max0, min1, max1){
		return Math.max(min0, max0) >= Math.min(min1, max1) &&
			   Math.min(min0, max0) <= Math.max(min1, max1);
	},
	point_aabb: function(x0, y0, x1, y1, width, height){
		return (util.in_range(x1, x2, x1+width) && util.in_range(y1, y2, y1 + height));
	},
	point_circle: function(x0, y0, x1, y1, radius){
		return util.distanceSqre(x0, y0, x1, y1) <= radius0*radius0;
	},
	circle_circle: function(x0, y0, radius0, x1, y1, radius1){
		return util.distanceSqre(x0, y0, x1, y1) <= radius0*radius0+radius1*radius1;
	},
	aabb_aabb: function(x0, y0, width0, height0, x1, y1, width1, height1){
		return util.range_intersect(x0, x0+width0, x1, x1+width1) &&
			   util.range_intersect(y0, y0+height0, y1, y1+height1);
	},
	randomRangeInt: function(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};