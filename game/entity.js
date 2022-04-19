class Entity {
    constructor(id) {
        this.id = id;
        this.mask = 0;
    }
    hasComponent(componentMask) {
        return hasFlag(this.mask, componentMask);
    }
    addComponent(componentMask) {
        this.mask = addFlag(this.mask, componentMask);
    }
    removeComponent(componentMask)  {
        this.mask = removeFlag(this.mask, componentMask);
    }
}

const entityFactory = {
    makeEmpty : function(componentPool) {
        return new Entity(componentPool.getNextId());
    },

    makeRect : function(componentPool, x, y, width, height, color) {
        const id = componentPool.getNextId();
        const entity = new Entity(id);
        entity.addComponent(Position.flag | Renderable.flag);
        const entityData = componentPool.getComponentData(id);
        entityData[Position.index].x = x;
        entityData[Position.index].y = y;
        entityData[Renderable.index].width = width;
        entityData[Renderable.index].height = height;
        entityData[Renderable.index].color = color;
        entityData[Renderable.index].type = "RECT";
        return entity;
    },

    makeCircle : function(componentPool, x, y, radius, color) {
        const id = componentPool.getNextId();
        const entity = new Entity(id);
        entity.addComponent(Position.flag | Renderable.flag);
        const entityData = componentPool.getComponentData(id);
        entityData[Position.index].x = x;
        entityData[Position.index].y = y;
        entityData[Renderable.index].width = radius;
        entityData[Renderable.index].height = radius;
        entityData[Renderable.index].color = color;
        entityData[Renderable.index].type = "CIRCLE";
        return entity;
    },

    makeMover : function(componentPool, x, y, width, height, color, vX, vY) {
        const entity = this.makeRect(componentPool, x, y, width, height, color);
        entity.addComponent(Velocity.flag);
        const entityData = componentPool.getComponentData(entity.id);
        entityData[Velocity.index].x = vX;
        entityData[Velocity.index].y = vY;
        return entity;
    },

    makeRectWithCollider : function(componentPool, x, y, width, height, color) {
        const entity = this.makeRect(componentPool, x, y, width, height, color);
        entity.addComponent(Collider.flag);
        const entityData = componentPool.getComponentData(entity.id);
        entityData[Collider.index].width = width;
        entityData[Collider.index].height = height;
        return entity;
    },

    makeRectWithHealth : function(
        componentPool,
        x,
        y,
        width,
        height,
        color,
        xOffset,
        yOffset,
        barWidth,
        barHeight,
        healthMax,
        healthBarColor
    ) {
        const entity = this.makeRectWithCollider(componentPool, x, y, width, height, color);
        entity.addComponent(Health.flag);
        entity.addComponent(HealthDisplay.flag);
        const entityData = componentPool.getComponentData(entity.id);
        entityData[Health.index].current = healthMax;
        entityData[Health.index].max = healthMax;
        entityData[HealthDisplay.index].color = healthBarColor
        entityData[HealthDisplay.index].xOffset = xOffset;
        entityData[HealthDisplay.index].yOffset = yOffset;
        entityData[HealthDisplay.index].width = barWidth;
        entityData[HealthDisplay.index].height =  barHeight;
        return entity;
    },

    makeAttack(componentPool, x, y, width, height, damage, multi) {
        const id = componentPool.getNextId();
        const entity = new Entity(id);
        const attackFlag = Position.flag | Collider.flag | Attack.flag;
        entity.addComponent(attackFlag);
        const entityData = componentPool.getComponentData(id);
        entityData[Position.index].x = x;
        entityData[Position.index].y = y;
        entityData[Collider.index].height = height;
        entityData[Collider.index].width = width;
        entityData[Attack.index].damage = damage;
        entityData[Attack.index].multi = multi;
        return entity;
    },

    makePlayer(componentPool, x, y, width, height, color, vX, vY) {
        const entity = this.makeMover(componentPool, x, y, width, height, color, vX, vY);
        entity.addComponent(Player.flag);
        return entity;
    },

    makeBullet(componentPool, x, y, width, height, damage, duration, xDir, yDir, speed, color) {
        const entity = this.makeRectWithCollider(componentPool, x, y, width, height, color);
        const bulletMask = Attack.flag | Lifetime.flag | Velocity.flag | Projectile.flag;
        entity.addComponent(bulletMask);
        const entityData = componentPool.getComponentData(entity.id);
        entityData[Attack.index].damage = damage;
        entityData[Lifetime.index].duration = duration;
        entityData[Projectile.index].x = xDir;
        entityData[Projectile.index].y = yDir;
        entityData[Projectile.index].speed = speed;
        entityData[Velocity.index].x = xDir * speed;
        entityData[Velocity.index].y = xDir * speed;
        return entity;
    }
} 