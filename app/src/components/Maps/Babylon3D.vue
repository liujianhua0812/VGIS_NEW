<template>
    <div class="full" style="position: relative;">
        <canvas ref="canvas" class="map-container"></canvas>
        <loading-indicator class="loading-indicator" v-show="loading" :message="loadingMessage"></loading-indicator>
    </div>
</template>

<script>

    import { ParticleOptimization } from "@/utils/ParticleOptimization";
    import LoadingIndicator from "@/components/Standard/LoadingIndicator.vue";
    import config from "@/config";
    import {
        Engine,
        Scene,
        SceneLoader,
        FreeCamera,
        Vector3,
        HemisphericLight,
        DirectionalLight,
        Plane,
        MeshBuilder,
        StandardMaterial,
        Color3,
        ShadowGenerator,
        Color4,
        GlowLayer,
        HighlightLayer,
        PointerEventTypes,
        ArcRotateCamera
    } from "@babylonjs/core";
    import "@babylonjs/loaders/glTF"

    export default {
        name: "Babylon3D",
        components: {
            LoadingIndicator
        },
        data () {
            return {
                loading: true,
                source: `${config.backend.host}models/`,
                loadingMessage: "场景加载中，请稍候……",
                hierarchy: [],
            }
        },
        methods: {
            getBestCameraPosition () {

            },
            selectNode (node) {
                let ids = node.id.split("-"), list = this.meshes, result = null
                for(let i = 0; i < ids.length; i++) {
                    let id = parseInt(ids[i])
                    result = list[id]
                    list = result.subMeshes || []
                }
                this.highlightSelectedMesh(this.meshes, result)
            },
            highlightSelectedMesh (meshes, exclude) {
                for(let i = 0; i < meshes.length; i++) {
                    let mesh = meshes[i]
                    if (mesh !== exclude) {
                        // mesh.visibility = 0.1
                        this.highlight.removeMesh(mesh)
                    } else {
                        mesh.visibility = 1
                        this.highlight.addMesh(mesh, Color3.FromHexString("#00ff13"))
                    }
                }
            },
            extractHierarchy (meshes = [], parentIds = []) {
                let result = []
                for(let i = 0; i < meshes.length; i++) {
                    let mesh = meshes[i]
                    let nodeId = parentIds.concat([i])
                    result.push({
                        id: nodeId.join("-"),
                        name: mesh.name || nodeId.join("-"),
                        label: mesh.name || nodeId.join("-"),
                        children: this.extractHierarchy(mesh.subMeshes, nodeId)
                    })
                }
                return result
            },
            pickMesh () {
                this.scene.pick(this.scene.pointerX, this.scene.pointerY, null, false, null, (p0, p1, p2, ray) => {
                //     let hit = this.scene.pickWithRay(ray);
                //     // console.log(hit)
                    console.log(2333)
                })
            },
            loadScene () {
                let that = this
                const canvas = this.$refs.canvas
                const engine = new Engine(canvas, true, {
                    preserveDrawingBuffer: true,
                    stencil: true
                });
                const scene = new Scene(engine);
                // scene.createDefaultVRExperience({ useMultiview: true });
                scene.clearColor = Color3.White()

                const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
                camera.setTarget(new Vector3(0, 0, 0))
                camera.attachControl(canvas, true);

                const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
                const highlight = new HighlightLayer("hl1", scene);
                highlight.innerGlow = true
                highlight.outerGlow = true

                engine.runRenderLoop(() => {
                    scene.render();
                });

                this.scene = scene
                this.engine = engine
                this.highlight = highlight

                SceneLoader.ImportMesh(null, this.source, "scene.gltf", scene, (meshes, particleSystems, skeletons) => {
                    that.meshes = meshes
                    that.hierarchy = that.extractHierarchy(meshes)
                    // that.getBestViewPoint()
                    that.loadEnvironment()
                    that.loadEvents()
                    that.loading = false
                })
            },
            async getBestViewPoint () {
                let scene = this.scene
                this.boundingBox = scene.getWorldExtends()
                let { min, max } = this.boundingBox
                let controller = await new ParticleOptimization(this.scene, this.boundingBox, 3, 3, 20)
                await controller.initialize()
                await controller.run()
                await controller.settle()
            },
            loadEnvironment () {
                let scene = this.scene
                let camera = this.scene.activeCamera
                this.boundingBox = scene.getWorldExtends()
                let { min, max } = this.boundingBox

                let center = Vector3.Center(min, max)
                let zoomScale = 0.8
                camera.position = new Vector3(
                    // max.x,
                    max.x + (max.x - min.x) * zoomScale,
                    // (max.x + min.x) / 2,
                    // max.y,
                    max.y + (max.y - min.y) * zoomScale,
                    // (max.y + min.y) / 2,
                    // max.z,
                    max.z + (max.z - min.z) * zoomScale,
                    // (max.z + min.z) / 2,
                )
                camera.setTarget(Vector3.Center(min, max));
                const ground = MeshBuilder.CreatePlane("ground", { size: Math.max(max.x - min.x, max.z - min.z) * 100 }, scene);
                let material = new StandardMaterial("box-material", scene);
                material.diffuseColor = Color3.FromHexString("#CCCCCC");
                ground.material = material;
                ground.position = new Vector3(0, min.y, 0)
                ground.rotate(new Vector3(1, 0, 0), Math.PI / 2)
                ground.receiveShadows = true
                ground.isPickable = false
                // let shadowGenerator = new ShadowGenerator(1024, light)
                // shadowGenerator.getShadowMap().renderList = shadowGenerator.getShadowMap().renderList.concat(scene.meshes);
                // scene.fogMode = Scene.FOGMODE_LINEAR

                let diameter = max.subtract(min).length()

                const boundingSphere = MeshBuilder.CreateSphere("boundingSphere", {
                    diameter: diameter * 5,
                    sideOrientation: 1
                })

                boundingSphere.isPickable = false
                boundingSphere.visibility = 0
                material = new StandardMaterial("sphere-material", scene);
                material.diffuseColor = Color3.White();
                boundingSphere.material = material;
                boundingSphere.position = center

                scene.collisionsEnabled = true
                ground.checkCollisions = true
                boundingSphere.checkCollisions = true
                camera.checkCollisions = true

                scene.fogColor = Color3.White();
                scene.fogDensity = 0.01;
                scene.fogStart = diameter / 2
                scene.fogEnd = diameter
            },
            loadEvents () {
                this.scene.onPointerPick = (event, pickInfo) => {
                    this.highlightSelectedMesh(this.meshes, pickInfo.pickedMesh)
                }
            },
            resizeScene () {
                if (this.engine) {
                    this.engine.resize()
                }
            },
            addEventListeners () {
                window.addEventListener("resize", this.resizeScene)
            },
            removeEventListeners () {
                window.removeEventListener("resize", this.resizeScene)
            }
        },
        mounted() {
            this.loadScene()
            this.addEventListeners()
        },
        beforeDestroy() {
            this.removeEventListeners()
        }
    }
</script>

<style scoped lang="scss">
    .map-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background: white;
    }

    .loading-indicator {
        position: absolute;
        z-index: 800;
        width: 100%;
        height: 100%;
    }
</style>