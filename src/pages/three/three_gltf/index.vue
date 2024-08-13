<template>
    <div class="box" ref="divRef">

    </div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
const divRef = ref()
onMounted(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, divRef.value?.clientWidth / divRef.value?.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    renderer.setSize(divRef.value?.clientWidth, divRef.value?.clientHeight)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
    const cube = new THREE.Mesh(geometry, material)
    divRef.value.appendChild(renderer.domElement)
    scene.add(cube)
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('/model/duck2.glb', function (gltf) {
        console.log(gltf)
        scene.add(gltf.scene);
    })
    scene.background = new THREE.Color(0x999999)
    camera.position.set(2, 2, 5)
    // camera.position.z = 5
    camera.lookAt(10, 10, 10)
    function animate() {
        controls.update()
        requestAnimationFrame(animate)
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
</script>

<style lang="less" scoped>
.box {
    width: 100%;
    height: 100%;
    background: #fff;
}
</style>