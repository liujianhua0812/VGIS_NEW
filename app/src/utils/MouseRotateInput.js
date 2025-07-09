import {KeyboardEventTypes, PointerEventTypes, Vector3} from "@babylonjs/core";

export default class MouseRotateInput {

    camera = null
    initialRotation = ""
    lastPosition = []
    Y_FACTOR = 0.01
    X_FACTOR = 0.01
    SPEED_FACTOR = 1

    constructor() {

    }
    getClassName() {
        return "MouseRotateInput"
    }

    getSimpleName() {
        return "mouse"
    }

    attachControl(noPreventDefault) {
        let scene = this.camera.getScene()
        this.initialRotation = this.camera.rotation
        this.camera.speed = this.SPEED_FACTOR
        scene.onKeyboardObservable.add(this.onKeyPressed.bind(this))
        scene.onPointerObservable.add(this.onMouseMove.bind(this))
    }

    onKeyPressed (kbInfo) {
        let camera = this.camera
        if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
            switch (kbInfo.event.key) {
                case "Shift":
                    camera.speed = this.SPEED_FACTOR * 3
                    break
            }
        }
        else {
            switch (kbInfo.event.key) {
                case "Shift":
                    camera.speed = this.SPEED_FACTOR
                    break
            }
        }
    }

    onMouseMove (ptInfo) {
        let center = [ window.innerWidth / 2, window.innerHeight / 2]
        let pointer = [ ptInfo.event.screenX, ptInfo.event.screenY ]
        let camera = this.camera
        let scene = camera.getScene()
        switch (ptInfo.type) {
            case PointerEventTypes.POINTERMOVE:
                let deltaX = (pointer[0] - center[0]) / center[0]
                let deltaY = (pointer[1] - center[1]) / center[1]
                let result = new Vector3(deltaY * Math.PI / 2, deltaX * Math.PI * 2, 0)
                camera.rotation = this.initialRotation.add(result)
                break;
        }
    }

    detachControl() {
        let scene = this.camera.getScene()
        scene.onPointerObservable.remove(this.onMouseMove)
        scene.onKeyboardObservable.remove(this.onKeyPressed)
    }

    checkInputs() {

    }

}