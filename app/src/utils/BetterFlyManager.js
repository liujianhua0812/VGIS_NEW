
import {Animation, CubicEase, EasingFunction} from "@babylonjs/core";

class FlyManager {

  STATUS_STOPPED = "stopped"
  STATUS_ROAMING = "roaming"
  STATUS_PAUSED = "paused"
  STOP_STATUS_STOPPED = "stopped"
  STOP_STATUS_ROAMING = "roaming"
  STOP_STATUS_WAITING = "waiting"

  FRAME_PER_SECOND = 32

  constructor(scene, config = {
    turnTime: 3,
    pauseTime: 5,
    playRate: 1,
    loop: false
  }, vnode) {
    this.scene = scene
    this.vnode = vnode
    this.config = config
    this.status = this.STATUS_STOPPED
    this.stopStatus = this.STOP_STATUS_STOPPED
    this.currentStopIndex = 0
    this.currentTime = 0
    this.cachedTime = 0
    this.timeoutId = ""
    this.stops = []
    this.eventHandler = {}
  }

  __getCameraPosition () {
    let camera = this.scene.activeCamera
    return {
      pos: {
        x: camera.position._x,
        y: camera.position._y,
        z: camera.position._z,
      },
      rot: {
        x: camera.rotation._x,
        y: camera.rotation._y,
        z: camera.rotation._z,
      }
    }
  }

  __toggleCameraAbility(enable = true) {
    let camera = this.scene.activeCamera
    if (enable) {
      camera.attachControl(this.scene.getEngine().getRenderingCanvas(), false)
    }
    else {
      camera.detachControl()
    }
  }

  addEventListener (event, handler) {
    if (!this.eventHandler[event]) {
      this.eventHandler[event] = []
    }
    this.eventHandler[event].push(handler)
  }

  __fireEvent(event, args = []) {
    if (this.eventHandler[event]) {
      for(let i = 0; i < this.eventHandler[event].length; i++){
        this.eventHandler[event][i](...args)
      }
    }
  }

  loadRoute (route) {
    this.config = route.config
    this.stops = route.stops
  }

  saveRoute () {
    return JSON.stringify({
      config: this.config,
      stops: this.stops
    })
  }

  saveStop (index = -1, data = {}, updateLocation = false) {
    if (index === -1) {
      let viewPoint = this.__getCameraPosition()
      this.stops = this.stops.concat([{
        id: this.stops.length,
        pos: viewPoint.pos,
        rot: viewPoint.rot,
        turnTime: this.config.turnTime,
        pauseTime: this.config.pauseTime,
        hasRelation: false,
        checked: false,
        equipName: '',
        equipTag: '',
        cacheName: '',
        editing: false,
        name: this.vnode.$t('label.roaming.stopName', { index: this.stops.length + 1 })
      }])
    }
    else {
      this.stops[index] = Object.assign(this.stops[index], data)
      if (updateLocation) {
        let viewPoint = this.__getCameraPosition()
        console.log(viewPoint, "override")
        this.stops[index] = Object.assign(this.stops[index], {
          pos: viewPoint.pos,
          rot: viewPoint.rot,
        })
      }
    }
    return this.stops
  }

  deleteStop (index) {
    if (index instanceof Array) {
      let indexMap = index.reduce((result, i) => {
        result[i] = true
        return result
      }, {})
      this.stops = this.stops.filter((stop, index) => !indexMap[index])
    }
    else if (this.stops[index]) {
      this.stops.splice(index, 1)
    }
    return this.stops
  }

  __createAnimation({ property, from, to }) {
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

    const animation = Animation.CreateAnimation(
        property,
        Animation.ANIMATIONTYPE_FLOAT,
        this.FRAME_PER_SECOND,
        ease
    );
    animation.setKeys([
      {
        frame: 0,
        value: from,
      },
      {
        frame: 100,
        value: to,
      },
    ]);

    return animation;
  }

  moveCamera(duration, position, rotation) {
    const camera = this.scene.activeCamera;
    const SPEED_RATIO = duration ? (100 / this.FRAME_PER_SECOND / duration) : 1;
    const LOOP_MODE = false;
    const FROM_FRAME = 0;
    const TO_FRAME = 100;

    camera.animations = [
      this.__createAnimation({
        property: "position._x",
        from: camera.position._x,
        to: position.x,
      }),
      this.__createAnimation({
        property: "position._y",
        from: camera.position._y,
        to: position.y,
      }),
      this.__createAnimation({
        property: "position._z",
        from: camera.position._z,
        to: position.z,
      }),
      this.__createAnimation({
        property: "rotation._x",
        from: camera.rotation._x,
        to: rotation.x,
      }),
      this.__createAnimation({
        property: "rotation._y",
        from: camera.rotation._y,
        to: rotation.y,
      }),
      this.__createAnimation({
        property: "rotation._z",
        from: camera.rotation._z,
        to: rotation.z,
      }),
    ];

    this.scene.beginAnimation(camera, FROM_FRAME, TO_FRAME, LOOP_MODE, SPEED_RATIO);
  }

  flyTo (index, duration = 1) {
    let stop = this.stops[index]
    if (stop) {
      this.moveCamera(duration, stop.pos, stop.rot)
    }
  }

  inspect (index) {
    clearTimeout(this.timeoutId)
    let stop = this.stops[index]
    if (stop) {
      if (this.status !== this.STATUS_STOPPED) {
        this.moveCamera(1, stop.pos, stop.rot)
        this.currentStopIndex = index
        this.__fireEvent("stopArrived", [index])
        if (this.status === this.STATUS_ROAMING) {
          this.waitAt(index)
        }
      }
    }
  }

  stopCamera () {
    this.scene.activeCamera.inertia = 0
  }

  roamTo(index, timeLeft) {
    let that = this
    let curr = this.stops[index]
    that.__fireEvent("leavingStop", [index])
    this.stopStatus = this.STOP_STATUS_ROAMING
    let duration = (timeLeft || curr.turnTime) / this.config.playRate
    if (!timeLeft) {
      this.currentTime = new Date()
    }
    this.timeoutId = setTimeout(() => {
      that.currentStopIndex = index
      that.__fireEvent("stopArrived", [index])
      that.waitAt(index)
    }, duration * 1000)
    this.flyTo(index, duration)
  }

  waitAt (index, timeLeft) {
    let that = this
    let curr = this.stops[index]
    this.stopStatus = this.STOP_STATUS_WAITING
    let duration = (timeLeft || curr.pauseTime) / this.config.playRate
    if (!timeLeft) {
      this.currentTime = new Date()
    }
    if (index !== this.stops.length - 1 || this.config.loop) {
      this.timeoutId = setTimeout(() => {
        that.roamTo((index + 1) % this.stops.length)
      }, duration * 1000)
    }
    else {
      this.timeoutId = setTimeout(() => {
        that.quit()
      }, duration * 1000)
    }
  }

  start () {
    this.__toggleCameraAbility(false)
    this.currentStopIndex = 0
    this.roamTo(0)
    return this.status = this.STATUS_ROAMING
  }

  pause () {
    clearTimeout(this.timeoutId)
    this.stopCamera()
    return this.status = this.STATUS_PAUSED
  }

  resume () {
    if (this.stopStatus === this.STOP_STATUS_WAITING) {
      this.waitAt(this.currentStopIndex)
    }
    else {
      this.roamTo(this.currentStopIndex)
    }
    return this.status = this.STATUS_ROAMING
  }

  quit () {
    clearTimeout(this.timeoutId)
    this.stopCamera()
    this.__toggleCameraAbility(true)
    this.__fireEvent("quit")
    return this.status = this.STATUS_STOPPED
  }

  destroy () {
    this.eventHandler = {}
    this.quit()
  }
}

export default FlyManager
