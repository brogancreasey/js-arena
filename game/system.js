function getEntitiesWithComponents(scene, mask) {
    return scene.filter(e => e.hasComponent(mask));
}


function render(context, scene, componentPool) {
    context.fillStyle = "#FFF";
    context.fillRect(0,0,500,500);
    const renderMask = Position.flag | Renderable.flag;
    for(const e of getEntitiesWithComponents(scene, renderMask)) {
        const data = componentPool.getComponentData(e.id);
        const position = data[Position.index]
        const renderable = data[Renderable.index];
        if(renderable.type === 'RECT'){
            context.fillStyle = renderable.color;
            context.fillRect(
                position.x,
                position.y,
                renderable.width,
                renderable.height
            );
        } else if (renderable.type === 'CIRCLE') {
            context.fillCircle(position.x, position.y, renderable.width, renderable.color);
        }
    }
}

function move(scene, componentPool) {
    const moveMask = Position.flag | Velocity.flag;
    for(const e of getEntitiesWithComponents(scene, moveMask)) {
        const data = componentPool.getComponentData(e.id);
        const position = data[Position.index];
        const velocity = data[Velocity.index];
        position.x += velocity.x;
        position.y += velocity.y;
        velocity.x = 0;
        velocity.y = 0;
    }
}

function collide(scene, componentPool) {
    const colliderMask = Position.flag | Collider.flag;
    const entities = getEntitiesWithComponents(scene, colliderMask);
    for(const e of entities) {
        const data = componentPool.getComponentData(e.id);
        data[Collider.index].other.splice(0, data[Collider.index].other.length);
        const aabbA = {
            minX: data[Position.index].x,
            minY: data[Position.index].y,
            maxX: data[Position.index].x + data[Collider.index].width,
            maxY: data[Position.index].y + data[Collider.index].height
        };
        for(const other of entities) {
            if(other.id != e.id) {
                const otherData = componentPool.getComponentData(other.id);
                const aabbB = {
                    minX: otherData[Position.index].x,
                    minY: otherData[Position.index].y,
                    maxX: otherData[Position.index].x + otherData[Collider.index].width,
                    maxY: otherData[Position.index].y + otherData[Collider.index].height
                };
                if(aabbAABB(aabbA, aabbB)){
                    data[Collider.index].other.push(other.id);
                }
            }
        }
        data[Collider.index].isColliding = (data[Collider.index].other.length > 0);
    }
}

function health(scene, componentPool) {
    const entities = getEntitiesWithComponents(scene, Health.flag);
    for(const e of entities) {
        const data = componentPool.getComponentData(e.id);
        if(data[Health.index].current <= 0) {
            e.addComponent(Dead.flag);
        }
    }
}


function healthDisplay(context, scene, componentPool) {
    const healthDisplayMask = Position.flag | Health.flag | HealthDisplay.flag;
    const entities = getEntitiesWithComponents(scene, healthDisplayMask);
    for(const e of entities) {
        const data = componentPool.getComponentData(e.id);
        const position = data[Position.index];
        const health = data[Health.index];
        const healthDisplay = data[HealthDisplay.index];
        const healthPercent = health.current / health.max;
        context.fillStyle = healthDisplay.color;
        context.fillRect(
            position.x + healthDisplay.xOffset,
            position.y + healthDisplay.yOffset,
            healthDisplay.width * healthPercent, 
            healthDisplay.height
        );
    }
}

function lifetime(scene, componentPool) {
    const entities = getEntitiesWithComponents(scene, Lifetime.flag);
    for(e of entities) {
        const data = componentPool.getComponentData(e.id);
        data[Lifetime.index].duration -=1;
        if(data[Lifetime.index].duration <= 0){
            e.addComponent(Dead.flag);
        }
    }
}

function death(scene, componentPool) {
    const entities = getEntitiesWithComponents(scene, Dead.flag);
    for(const e of entities){
        componentPool.releaseId(entities.id);
        const sceneIndex = scene.findIndex(el => el.id === e.id);
        scene.splice(sceneIndex, 1);
    }
}

function attack(scene, componentPool) {
    const attackMask = Collider.flag | Attack.flag;
    const entities = getEntitiesWithComponents(scene, attackMask);
    for(const e of entities) {
        const data = componentPool.getComponentData(e.id);
        if(data[Collider.index].isColliding) {
            for(other of data[Collider.index].other) {
                if(scene.find((el)=>el.id === other).hasComponent(Health.flag)) {
                    console.log("Hit!");
                    const otherData = componentPool.getComponentData(other);
                    const currentHealth = otherData[Health.index].current;
                    const damage = data[Attack.index].damage;
                    const health = (currentHealth - damage > 0) ? currentHealth - damage : 0;
                    otherData[Health.index].current = health;
                    if(!data[Attack.index].multi) break;
                }
            }
            e.addComponent(Dead.flag);
        }
    }
}

function player(keyState, mouseState, scene, componentPool, entityFactor) {
    const playerMask = Velocity.flag | Player.flag;
    const entities = getEntitiesWithComponents(scene, playerMask);
    for(const e of entities) {
        const data = componentPool.getComponentData(e.id);
        let x = 0;
        let y = 0;
        if(keyState["KeyW"]) {
            y -= 1;
        }
        if(keyState["KeyS"]) {
            y += 1;
        }
        if(keyState["KeyA"]) {
            x -= 1;
        }
        if(keyState["KeyD"]) {
            x += 1;
        }
        const normalized = normalize(x, y);
        data[Velocity.index].x = normalized.x;
        data[Velocity.index].y = normalized.y;
        if(mouseState.click) {
            const pos = data[Position.index];
            const dirX = mouseState.x - pos.x;
            const dirY = mouseState.y - pos.y;
            const dir = normalize(dirX, dirY);
            scene.push(
                entityFactory.makeBullet(
                    pool, 
                    data[Position.index].x, 
                    data[Position.index].y,
                    5, 5, 10, 150, dir.x, dir.y, 1, "#F1E322"));
            mouseState.click = false;
        }
    }
}

function projectile(scene, componentPool) {
    const projectileMask = Projectile.flag | Velocity.flag;
    const entities = getEntitiesWithComponents(scene, projectileMask);
    for(const e of entities) {
        const data = componentPool.getComponentData(e.id);
        const projectile = data[Projectile.index];
        data[Velocity.index].x = projectile.x * projectile.speed;
        data[Velocity.index].y = projectile.y * projectile.speed;
    }
}