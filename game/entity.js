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
        const entity = this.makeRect(componentPool, x, y, width, height, color);
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
    }
}