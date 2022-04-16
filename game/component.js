let componentIndex = 0;

class Position {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

class Renderable {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.width = 0;
        this.height = 0;
        this.color = '';
        this.shape = '';
    }
}

class Velocity {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

class Collider {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.width;
        this.height;
        this.isColliding = false;
        this.other = [];
    }
}

class Health {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.current = 0;
        this.max = 0;
    }
}

class HealthDisplay {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.color = '';
        this.xOffset = 0;
        this.yOffset = 0;
        this.width = 0;
        this.height = 0;
    }
}

class Dead {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
}

class Lifetime {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.duration = 0;
    }
}

class Attack {
    static flag = 1 << componentIndex;
    static index = componentIndex++;
    constructor() {
        this.damage = 0;
        this.multi = false;
    }
}

const componentFactory = {
    components: componentIndex,

    makeComponentSet : function(){
        return [
            new Position(),
            new Renderable(),
            new Velocity(),
            new Collider(),
            new Health(),
            new HealthDisplay(),
            new Dead(),
            new Lifetime()
        ];
    }
}