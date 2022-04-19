class KeyboardInput {
    constructor(dom) {
        this.keyState = {};
        this.registerEvents(dom);
    }
    registerEvents(dom) {
        dom.addEventListener('keyup', (e) => this.handleKeyUp(e));
        dom.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    handleKeyUp(e) {
        delete this.keyState[e.code];
    }
    handleKeyDown(e) {
        this.keyState[e.code] = true;
    }
}