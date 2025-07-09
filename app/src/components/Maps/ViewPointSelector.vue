<template>
  <div class="full" style="position: relative;">
    <canvas ref="canvas" class="map-container"></canvas>
    <el-button style="position: absolute; right: 20px; bottom: 60px;" size="mini" type="default" @click="clearModel">{{$t("action.reset")}}</el-button>
    <el-button style="position: absolute; right: 20px; bottom: 20px;" size="mini" type="primary" @click="confirmModelAndView">{{$t("action.confirm")}}</el-button>
  </div>
</template>

<script>

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

export default {
  name: "ViewPointSelector",
  props: {
    value: Object
  },
  data () {
    return {
      loading: true,
      selectedId: "",
      source: `${config.backend.host}models/`,
      loadingMessage: "",
      hierarchy: [],
    }
  },
  methods: {
    clearModel () {
      let camera = this.scene.activeCamera
      let { _x, _y, _z } = camera.position
      let { _x1, _y1, _z1 } = camera.rotation
      this.$emit("input", {
        modelId: "",
        pos: {
          x: _x,
          y: _y,
          z: _z
        },
        rot: {
          x: _x1,
          y: _y1,
          z: _z1
        }
      })
    },
    confirmModelAndView () {
      let camera = this.scene.activeCamera
      let pos = {
        x: camera.position._x,
        y: camera.position._y,
        z: camera.position._z
      }
      let rot = {
        x: camera.rotation._x,
        y: camera.rotation._y,
        z: camera.rotation._z
      }
      this.$emit("input", {
        modelId: this.selectedId,
        pos,
        rot
      })
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
    getSelectedId (meshes = [], item) {
      for(let i = 0; i < meshes.length; i++) {
        let mesh = meshes[i]
        if (mesh === item) {
          return `${i}`
        }
        else {
          let result = this.getSelectedId(mesh.subMeshes, item)
          if (result) {
            return `${i}-${result}`
          }
        }
      }
      return ""
    },
    loadScene () {
      let that = this
      const canvas = this.$refs.canvas
      const engine = new Engine(canvas, true, { stencil: true });
      const scene = new Scene(engine);
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

        if (this.value.modelId) {
          this.findSelected()
        }
        that.loadEnvironment()
        that.loadEvents()
      })

    },
    loadEnvironment () {
      let scene = this.scene
      let camera = this.scene.activeCamera
      let { min, max } = scene.getWorldExtends()
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
    loadEvents () {
      this.scene.onPointerPick = (event, pickInfo) => {
        this.selectedId = this.getSelectedId(this.meshes, pickInfo.pickedMesh)
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
  width: 100%;
  height: 100%;
  background: white;
}

.loading-indicator {
  position: absolute;
  z-index: 9999999;
  width: 100%;
  height: 100%;
}
</style>