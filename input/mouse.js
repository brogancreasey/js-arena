class MouseInput {
    constructor(dom) {
        this.registerEvents(dom);
    }
    registerEvents(dom) {
        dom.addEventListener("click",(e)=>this.handleClick(e));
    }
    handleClick(e) {
        this.click = true;
        this.x = e.offsetX;
        this.y = e.offsetY;
    }
}