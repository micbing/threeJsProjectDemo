<template>
  <div class="box" ref="divRef">

  </div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import vertexShader from './vert.glsl'
// import fragmentShader from './frag.glsl'
const divRef = ref()
onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, divRef.value?.clientWidth / divRef.value?.clientHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  const axesHelper = new THREE.AxesHelper(5)
  const eventObj = {
    Fullscreen: function () {
      divRef.value.requestFullscreen()
    },
    exitFullscreen: function () {
      divRef.value.exitFullscreen()
    }
  }

  axesHelper.setColors('red', 'green', 'blue')
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  renderer.setSize(divRef.value?.clientWidth, divRef.value?.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio);
  divRef.value.appendChild(renderer.domElement)
  const geometry = new THREE.BoxGeometry(1, 1,100)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  camera.position.set(2, 2, 5)
  scene.add(cube)
  scene.add(axesHelper)
  camera.position.z = 1
  //scene.fog=new THREE.Fog(0x999999,0.1,20)
   scene.fog = new THREE.FogExp2(0x999999, 0.1)
  // scene.background = new THREE.Color(0x999999)
  function animate() {
    controls.update()
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', () => {
    //重置渲染器宽高比
    renderer.setSize(divRef.value?.clientWidth, divRef.value?.clientHeight)
    //重置相机宽高比
    camera.aspect = divRef.value?.clientWidth / divRef.value?.clientHeight
    //更新相机投影矩阵
    camera.updateProjectionMatrix()
  })

})
const handleClick = () => {
  divRef.value.requestFullscreen()
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>