class ComponentPool {
    constructor(size, componentFactory) {
        this.componentQueue = new Queue(Math.makeRange(0, size, 1));
        this.components = [];
        this.componentOffset = componentFactory.components;
        for(let i = 0; i < size; i++) {
            this.components.push(...componentFactory.makeComponentSet());
        }
    }
    
    getNextId() {
        return this.componentQueue.next();
    }

    releaseId(id) {
        this.componentQueue.add(id);
    }

    getComponentData(id) {
        const start = id * this.componentOffset;
        const end = id * this.componentOffset + this.componentOffset - 1;
        const componentRange = Math.makeRange(start, end, 1);       
        let components = [];
        for(const cIndex of componentRange) {
            components.push(this.components[cIndex]);
        }
        return components;
    }
}