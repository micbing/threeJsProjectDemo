<template>
    <div class="box" ref="divRef">

    </div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const divRef = ref()
onMounted(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, divRef.value?.clientWidth / divRef.value?.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper(5)
    controls.enableDamping = true
    renderer.setSize(divRef.value?.clientWidth, divRef.value?.clientHeight)
    const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffcc00 }))
    const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ffcc }))
    const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00cc00 }))
    divRef.value.appendChild(renderer.domElement)
    sphere1.position.x = -3
    sphere3.position.x = 3
    scene.add(sphere1)
    scene.add(sphere2)
    scene.add(sphere3)
    scene.add(axesHelper)
    camera.position.set(2, 2, 5)
    camera.position.z = 8
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
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    divRef.value.addEventListener('click', e => {
        pointer.x = (e.offsetX / divRef.value.offsetWidth) * 2 - 1;
        pointer.y = -((e.offsetY / divRef.value.offsetHeight) * 2 - 1)
        raycaster.setFromCamera(pointer, camera)
        const intersect = raycaster.intersectObjects([sphere1, sphere2, sphere3])
        if (intersect.length > 0) {
            if (intersect[0].object.isSelect) {
                intersect[0].object.material.color.set(intersect[0].object.originColor);
                intersect[0].object.isSelect = false
                return
            }
            intersect[0].object.isSelect = true
            intersect[0].object.originColor = intersect[0].object.material.color.getHex()
            intersect[0].object.material.color.set(0xff0000);

        }
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