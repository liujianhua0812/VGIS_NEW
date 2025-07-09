
import {ArcRotateCamera, FreeCamera, Tools, Vector2, Vector3, Viewport} from "@babylonjs/core";
import "jimp/browser/lib/jimp";

class Histogram {

    constructor() {
        this.space = 256
        this.data = new Array(this.space)
        this.total = 0
        for(let i = 0; i < this.space; i++) {
            this.data[i] = new Array(this.space);
            for(let j = 0; j < this.space; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    update (g1, g2, offset) {
        this.data[g1][g2] += offset;
        this.total += offset;
    }

    entropy () {
        let sum = 0.;
        for(let i = 0; i < this.space; i++) {
            for(let j = 0; j < this.space; j++) {
                if (this.data[i][j] !== 0) {
                    let p = this.data[i][j] / this.total;
                    sum += -p * Math.log(p);
                }
            }
        }
        return sum;
    }
}

export class ParticleOptimization {

    static C1 = 0.1
    static C2 = 0.1
    static W_MAX = 0.9
    static W_MIN = 0.1

    static V_MAX = new Vector2(Math.PI * 2 / 10, Math.PI / 2 / 10)

    /**
     *
     * @type {[CameraAsParticle]}
     */
    particles = []

    constructor(scene, boundingBox, gridX, gridY, iter = 10) {
        this.scene = scene
        this.boundingBox = boundingBox
        this.gridX = gridX
        this.gridY = gridY
        this.engine = scene.getEngine()
        this.W = 0.9
        this.ITER_MAX = iter
    }

    /**
     *
     * @param gridX
     * @param gridY
     * @returns {Promise<*[CameraAsParticle]>}
     */
    async initialize () {
        let result = []
        let gridX = this.gridX, gridY = this.gridY
        let { max, min } = this.boundingBox
        this.scene.activeCameras.splice(0, 1)
        let center = Vector3.Center(min, max)
        let fov = 0.8;
        let radius = max.subtract(min).length() / 2
        for(let i = 0; i < gridY; i++) {
            for(let j = 0; j < gridX; j++) {
                let index = i * gridX + j
                let camera = new ArcRotateCamera(`particle-${i * gridX + j}`, 0, 0, radius, center, this.scene)
                let tan = Math.tan(fov / 2)
                let scaleRatio = Math.sqrt(1 + 1 / Math.pow(tan, 2))
                camera.radius = camera.radius * scaleRatio
                camera.inertia = 0
                this.scene.activeCameras.push(camera)
                let particle = new CameraAsParticle(camera, index, gridX, gridY, this)
                await particle.placeParticle()
                result.push(particle)
            }
        }
        this.particles = result
        return result
    }

    setBound (index) {
        let indexX = index % this.gridX
        let indexY = Math.floor(index / this.gridX)
        let { max, min } = this.boundingBox
        let fov = 0.8;
        let radius = max.subtract(min).length() / 2
        let tan = Math.tan(fov / 2)
        let scaleRatio = Math.sqrt(1 + 1 / Math.pow(tan, 2))
        let arcX = Math.PI * 2 / this.gridX, arcY = Math.PI / 2 / this.gridY
        this.bound = {
            minX: arcX * indexX,
            maxX: arcX * (indexX + 1),
            minY: arcY * indexY,
            maxY: arcY * (indexY + 1),
            minR: radius,
            maxR: radius * scaleRatio
        }
        this.V_MAX_R = (this.bound.maxR - this.bound.minR) / 10
    }

    async run () {
        let that = this
        await new Promise((resolve, reject) => {
            setTimeout(async () => {
                await that.getGBest()
                that.setBound(that.best.index)
                that.redistribute()
                for(let i = 0; i < that.ITER_MAX; i++) {
                    await that.iterate(i)
                }
                resolve()
            }, 1000)
        })
    }

    /**
     *
     * @returns {string}
     */
    getSnapshot () {
        let engine = this.scene.getEngine()
        let canvas = engine.getRenderingCanvas()
        // let a = document.createElement("a")
        // a.download = `Test.png`
        // a.target = '_self';
        // a.href = canvas.toDataURL("image/png")
        // document.body.appendChild(a)
        // a.click()
        // a.remove()
        return canvas.toDataURL("image/png")
    }

    async getGBest () {
        let snapshot = this.getSnapshot()
        let entropy = this.best ? this.best.entropy : Number.MIN_SAFE_INTEGER
        let index = -1
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i]
            let pEntropy = await particle.getEntropy(snapshot)
            if (pEntropy > entropy) {
                index = i
                entropy = pEntropy
            }
        }
        if (index !== -1) {
            this.best = {
                index,
                position: this.particles[index].getPosition(),
                entropy
            }
        }
    }

    redistribute () {
        let { maxX, minX, maxY, minY, minR, maxR } = this.bound
        for(let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i]
            particle.camera.alpha = minX + (maxX - minX) * Math.random()
            particle.camera.beta = minY + (maxY - minY) * Math.random()
            // particle.camera.radius = minR + (maxR - minR) * Math.random()
            let random = (Math.random() - 0.5) * 2
            particle.velocity = new Vector3(particle.velocity.x, particle.velocity.y, -this.V_MAX_R * random)
        }
    }

    updateW (iter) {
        this.W = ParticleOptimization.W_MAX - (ParticleOptimization.W_MAX - ParticleOptimization.W_MIN) * (iter / this.ITER_MAX)
    }

    move () {
        for(let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i]
            particle.updateSpeed()
            particle.move()
        }
    }

    async iterate (iter) {
        console.log(`iteration ${iter}`)
        await this.getGBest()
        this.updateW(iter)
        this.move()
    }

    async settle (name = "main") {
        await this.getGBest()
        let { max, min } = this.boundingBox
        let center = Vector3.Center(min, max)
        let camera = new FreeCamera(name, this.particles[this.best.index].camera.globalPosition, this.scene)
        camera.setTarget(center)
        camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true)
        for(let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i]
            particle.camera.dispose()
        }
        this.scene.activeCamera = camera
    }

}

export class CameraAsParticle {

    /**
     *
     * @param {ArcRotateCamera} camera
     * @param index
     * @param gridX
     * @param gridY
     * @param {ParticleOptimization} controller
     */
    constructor(camera, index, gridX, gridY, controller) {
        let seed = Math.random() / 5 + 0.8
        let randomX = (Math.random() - 0.5) * 2
        let randomY = (Math.random() - 0.5) * 2
        this.velocity =  ParticleOptimization.V_MAX.multiplyByFloats(seed / gridX * randomX, seed / gridY * randomY)
        this.camera = camera
        this.index = index
        this.gridX = gridX
        this.gridY = gridY
        this.indexX = index % gridX
        this.indexY = Math.floor(index / gridX)
        this.controller = controller
    }

    async placeParticle () {
        let index = this.index, gridX = this.gridX, gridY = this.gridY
        let arcX = Math.PI * 2 / gridX, arcY = Math.PI / 2 / gridY
        let indexX = this.indexX, indexY = this.indexY
        this.camera.alpha = arcX * indexX + arcX / 2
        this.camera.beta = arcY * indexY + arcY / 2
        this.camera.viewport = new Viewport(indexX / gridX, indexY / gridY, 1 / gridX, 1 / gridY)
    }

    getPosition () {
        return new Vector3(this.camera.alpha, this.camera.beta, this.camera.radius)
    }

    /**
     *
     * @param {string} snapshot
     * @param {Boolean} update
     * @returns {Promise<number>}
     */
    async getEntropy (snapshot, update = true) {
        let engine = this.camera.getScene().getEngine()
        let size = engine.getRenderingCanvasClientRect()
        // let image = await Tools.CreateScreenshotAsync(engine, this.camera, size)
        const buff = Buffer.from(snapshot.split(',')[1], 'base64');
        let image = await Jimp.read(buff);
        let viewPort = this.camera.viewport
        image = image
            .crop(viewPort.x * size.width, size.height - viewPort.y * size.height - viewPort.height * size.height, viewPort.width * size.width, viewPort.height * size.height)
        let gray = image.clone().greyscale()
        let blurred = image.clone().blur(1)
        let histogram = new Histogram()
        await new Promise((resolve, reject) => {
            gray.scan(0, 0, gray.bitmap.width, gray.bitmap.height, function (x, y, idx) {
                let valueR = this.bitmap.data[idx], valueB = blurred.bitmap.data[idx];
                histogram.update(valueR, valueB, 1);
                if (x === gray.bitmap.width - 1 && y === gray.bitmap.height - 1) {
                    resolve()
                }
            });
        })
        let result = histogram.entropy()
        if (update) {
            if (typeof this.bestEntropy !== 'number' || this.bestEntropy < result) {
                this.bestEntropy = result
                this.best = new Vector3(this.camera.alpha, this.camera.beta, this.camera.radius)
            }
        }
        return result
    }

    updateSpeed () {
        let position = new Vector3(this.camera.alpha, this.camera.beta, this.camera.radius)
        let sbest = this.best
        let gbest = this.controller.best.position
        let w = this.controller.W
        let cr1 = ParticleOptimization.C1 * Math.random()
        let cr2 = ParticleOptimization.C2 * Math.random()
        this.velocity = this.velocity.multiplyByFloats(w, w, w).add(sbest.subtract(position).multiplyByFloats(cr1, cr1, cr1)).add(gbest.subtract(position).multiplyByFloats(cr2, cr2, cr2))
    }

    move () {
        let position = new Vector3(this.camera.alpha, this.camera.beta, this.camera.radius).add(this.velocity)
        let { maxX, minX, maxY, minY, minR, maxR } = this.controller.bound
        if (position.x > maxX) {
            position.x = maxX
        }
        if (position.x < minX) {
            position.x = minX
        }
        if (position.y > maxY) {
            position.y = maxY
        }
        if (position.y < minY) {
            position.y = minY
        }
        if (position.z > maxR) {
            position.z = maxR
        }
        if (position.z < minR) {
            position.z = minR
        }
        console.log(position.z.toFixed(2), this.velocity.z.toFixed(2), this.camera.name)
        this.camera.alpha = position.x
        this.camera.beta = position.y
        this.camera.radius = position.z
    }

}