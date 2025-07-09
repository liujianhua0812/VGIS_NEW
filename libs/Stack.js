
module.exports = class Stack {

    constructor() {
        this.clear()
    }

    push(item) {
        this.content[this.index++] = item
    }

    pop() {
        return this.content[--this.index]
    }

    top () {
        return this.content[this.index - 1]
    }

    size () {
        return this.index
    }

    clear () {
        this.content = []
        this.index = 0
    }

    isEmpty () {
        return this.index === 0
    }
}