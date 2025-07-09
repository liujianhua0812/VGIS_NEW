<template>
  <div class="full" style="position: relative;">
    <canvas class="full" ref="map"></canvas>
    <div class="full" v-if="lock" style="background: transparent; position: absolute; left: 0; top: 0; z-index: 9999999;"></div>
  </div>
</template>

<script>

  import fontJSON from "@/assets/fonts/Alibaba Sans_Regular.json"
  import config from "@/config";
  import markerIcon from "@/assets/images/marker.png";
  import {
    Color3, Color4,
    Engine,
    FreeCamera,
    HemisphericLight,
    HighlightLayer, MeshBuilder,
    Scene,
    SceneLoader, StandardMaterial,
    Vector3
  } from "@babylonjs/core";
  import "@babylonjs/loaders/glTF"

  export default {
    name: "RouteViewer",
    props: {
      route: Object, // 路径对象，从接口获取
      mapName: String, // 地图名称
      simple: Boolean, // 是否是简单模式，true则不显示站点，只显示路线
      lock: Boolean // 是否锁定地图，true则禁止地图缩放平移
    },
    data() {
      return {
        map: '',
        layers: {},
        stops: [],
        source: `${config.backend.host}models/`,
      }
    },
    methods: {
      loadScene () {
        this.roamList = [] //清空数组
        this.newRoamName = this.$route.query.routeName;
        this.loadingMessage = this.$t("message.gis.loadingScene")
        let that = this
        const canvas = this.$refs.map
        const engine = new Engine(canvas, true, { stencil: true });
        const scene = new Scene(engine);
        scene.clearColor = Color3.White()

        let camera = new FreeCamera("camera1", new Vector3(0, 1, 0), scene);
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
          that.loadEnvironment()
          that.placeMarkers()
          that.loadingMessage = ""
        })
      },
      resetCamera () {
        let { min, max } = this.scene.getWorldExtends()
        let camera = this.scene.activeCamera
        let zoomScale = 0.8
        camera.position = new Vector3(
            max.x + (max.x - min.x) * zoomScale,
            // (max.x + min.x) / 2,
            max.y + (max.y - min.y) * zoomScale,
            // (max.y + min.y) / 2,
            max.z + (max.z - min.z) * zoomScale,
            // (max.z + min.z) / 2,
        )
        camera.setTarget(Vector3.Center(min, max));
      },
      loadEnvironment () {
        let scene = this.scene
        let camera = this.scene.activeCamera
        let { min, max } = scene.getWorldExtends()
        this.resetCamera()
        const ground = MeshBuilder.CreatePlane("ground", { size: 2000 }, scene);
        let material = new StandardMaterial("box-material", scene);
        material.diffuseColor = Color3.FromHexString("#CCCCCC");
        ground.material = material;
        ground.position = new Vector3(0, min.y, 0)
        ground.rotate(new Vector3(1, 0, 0), Math.PI / 2)
        ground.receiveShadows = true
        ground.isPickable = false
        // let shadowGenerator = new ShadowGenerator(1024, light)
        // shadowGenerator.getShadowMap().renderList = shadowGenerator.getShadowMap().renderList.concat(scene.meshes);
        scene.fogMode = Scene.FOGMODE_LINEAR

        let diameter = Math.max(
            max.x - min.x,
            max.y - min.y,
            max.z - min.z,
        ) * 5

        const boundingSphere = MeshBuilder.CreateSphere("boundingSphere", {
          diameter,
          sideOrientation: 1
        })
        boundingSphere.isPickable = false
        boundingSphere.visibility = 0
        material = new StandardMaterial("sphere-material", scene);
        material.diffuseColor = Color3.White();
        boundingSphere.material = material;
        boundingSphere.position = new Vector3(
            (max.x + min.x) / 2,
            (max.y + min.y) / 2,
            (max.z + min.z) / 2,
        )

        scene.collisionsEnabled = true
        ground.checkCollisions = true
        boundingSphere.checkCollisions = true
        camera.checkCollisions = true

        scene.fogColor = Color3.White();
        scene.fogDensity = 0.01;
        scene.fogStart = diameter / 2
        scene.fogEnd = diameter
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
      },
      placeMarkers() {
        let stops = this.route.stops
        const options = {
          points: stops.map(item => new Vector3(item.pos.x, item.pos.y, item.pos.z)),
          colors: stops.map((item, index) => Color4.FromHexString(`#FF0000FF`)),
          updatable: false
        }
        let material = new StandardMaterial("marker-material", this.scene);
        material.diffuseColor = Color3.FromHexString("#FF0000");
        let lines = MeshBuilder.CreateLines("routes", options, this.scene)
        lines.color = Color3.FromHexString("#FF0000");
        for(let i = 0; i < stops.length; i++) {
          let stop = stops[i]
          let marker = MeshBuilder.CreateSphere(stop.name, {
            diameter: 1
          }, this.scene)
          marker.position = new Vector3(stop.pos.x, stop.pos.y, stop.pos.z)
          marker.material = material
        }
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

<style scoped>

</style>
