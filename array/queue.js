class Queue {
    constructor(data) {
        this.data = [];
        if(data)
            this.data.push(...data);
    }
    add(elem) {
        this.data.push(elem);
    }
    next() {
        return this.data.shift();
    }
    length () {
        return this.data.length;
    }
}