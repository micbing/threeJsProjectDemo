<template>
    <div class="box" ref="divRef">

    </div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
const divRef = ref()
onMounted(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, divRef.value?.clientWidth / divRef.value?.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper(5)
    controls.enableDamping = true
    renderer.setSize(divRef.value?.clientWidth, divRef.value?.clientHeight)
    divRef.value.appendChild(renderer.domElement)
    const loader = new GLTFLoader()
    loader.load('/model/Duck/Duck.gltf', function (gltf) {
        console.log(gltf)
        let duckMesh = gltf.scene.getObjectByName("LOD3spShape")
        let duckGeometry = duckMesh.geometry
        duckGeometry.computeBoundingBox()
        let duckBox = duckGeometry.boundingBox
        console.log('duckBox', duckBox)
        console.log('duckMesh', duckMesh)
        duckMesh.updateWorldMatrix(true, true)
        duckBox.applyMatrix4(duckMesh.matrixWorld)
        let boxHelper = new THREE.Box3Helper(duckBox, 0x00ffff)
        scene.add(boxHelper)
        scene.add(gltf.scene);
    })
    scene.add(axesHelper)
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('/model/duck.hdr', (envMap) => {
        envMap.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = envMap
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