<template>
    <div class="box" ref="divRef">
         
    </div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
const divRef=ref()
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

  axesHelper.setColors('red','green','blue')
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping=true
 renderer.setSize(divRef.value?.clientWidth, divRef.value?.clientHeight)
 divRef.value.appendChild(renderer.domElement)
 const geometry = new THREE.BoxGeometry(1, 1,1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
  const cube = new THREE.Mesh(geometry, material)
  camera.position.set(2,2,5)
  scene.add(cube)
  scene.add(axesHelper)
  camera.position.z = 5
  let gui = new GUI();
  // gui.add(eventObj, 'Fullscreen').name('全屏')
  // gui.add(eventObj, 'exitFullscreen').name('退出全屏')
  const folder = gui.addFolder('立方体位置')
  
  folder.add(cube.position, 'x').min(-5).max(5).step(1).name('立方体x位置')
  folder.add(cube.position, 'y').min(-5).max(5).step(1).name('立方体y位置')
  folder.add(cube.position, 'z').min(-5).max(5).step(1).name('立方体z位置')
  gui.add(cube.material, 'wireframe').name('线框模式')
  let colorParams = {
    cubeColor:'#ff0000'
  }
  gui.addColor(colorParams,'cubeColor').name('立方体颜色').onChange((val)=>cube.material.color.set(val))
  function animate() {
    controls.update()
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene,camera)
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
// onUnmounted(() => {
//   gui=null
// })
</script>

<style lang="less" scoped>
.box{
  width:100%;
  height:100%;
  background:#fff;
}
</style>