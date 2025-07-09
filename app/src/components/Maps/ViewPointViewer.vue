<template>
  <div class="full" style="position: relative;">
    <canvas ref="canvas" class="map-container" v-show="!loadingMessage"></canvas>
    <loading-indicator v-if="loadingMessage" :message="loadingMessage"></loading-indicator>
    <el-button v-if="!locked" style="position: absolute; top: 20px; right: 20px;" type="primary" size="small" @click="resetCamera">{{$t("action.reset")}}</el-button>
  </div>
</template>

<script>

import LoadingIndicator from "@/components/Standard/LoadingIndicator.vue";
import config from "@/config";
import {
  Engine,
  Scene,
  SceneLoader,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder, StandardMaterial, Color3, HighlightLayer
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"
import {getHierarchy} from "@/assets/js/api/data";

export default {
  name: "ViewPointViewer",
  props: {
    tag: String,
    value: Object,
    locked: Boolean
  },
  components: {
    LoadingIndicator
  },
  data () {
    return {
      loading: true,
      source: `${config.backend.host}models/`,
      loadingMessage: "",
      hierarchy: []
    }
  },
  methods: {
    getHierarchy () {
      getHierarchy().then(result => {
        this.hierarchy = result.data
      })
    },
    resetCamera () {
      let { min, max } = this.scene.getWorldExtends()
      let camera = this.scene.activeCamera
      let zoomScale = 0.8
      if (this.value.pos) {
        camera.position = new Vector3(this.value.pos.x, this.value.pos.y, this.value.pos.z)
        camera.rotation = new Vector3(this.value.rot.x, this.value.rot.y, this.value.rot.z)
      }
      else {
        camera.position = new Vector3(
            max.x + (max.x - min.x) * zoomScale,
            // (max.x + min.x) / 2,
            max.y + (max.y - min.y) * zoomScale,
            // (max.y + min.y) / 2,
            max.z + (max.z - min.z) * zoomScale,
            // (max.z + min.z) / 2,
        )
        camera.setTarget(Vector3.Center(min, max));
      }
    },
    findSelected () {
      let ids = this.value.modelId.split("-")
      let list = this.meshes, result = null
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
          // mesh.visibility = 0.3
          this.highlight.removeMesh(mesh)
        } else {
          mesh.visibility = 1
          this.highlight.addMesh(mesh, Color3.FromHexString("#00ff13"))
        }
      }
    },
    loadScene () {
      this.loadingMessage = this.$t("message.gis.loadingScene")
      let that = this
      const canvas = this.$refs.canvas
      const engine = new Engine(canvas, true, { stencil: true });
      const scene = new Scene(engine);
      scene.clearColor = Color3.White()

      let camera = new FreeCamera("camera1", new Vector3(this.value.pos.x, this.value.pos.y, this.value.pos.z), scene);
      camera.setTarget(new Vector3(0, 0, 0))
      if (!this.locked) {
        camera.attachControl(canvas, true);
      }

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
        console.log(that.value.modelId)
        if (that.value.modelId) {
          that.findSelected()
        }
        that.loadEnvironment()
        that.loadingMessage = ""
      })

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
  left: 0;
  top: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.71);
}

.loading-indicator {
  position: absolute;
  z-index: 9999999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>