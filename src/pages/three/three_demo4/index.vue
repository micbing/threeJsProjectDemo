<template>
    <div style="position: absolute;right: 10px;top:10px;">
    <!-- <a class="gou" style="" href="https://www.bydauto.com.cn/news-id-2775.html">
      <img src="../../../assets/购买.png" alt="" width="24" style="vertical-align: middle;">
      <span>购买</span>
    </a>

    <a class="gou" style="margin-top:10px;" href="https://www.bydauto.com.cn/news-id-2775.html">
      <img src="../../../assets/试驾.png" alt="" width="24" style="vertical-align: middle;">
      <span>试驾</span>
    </a> -->

  </div>

  <div id="color" class="color_div">
    <div class="colorChoose" id="color1"><img src="../../../assets/绿.jpg"></div>
    <div class="colorChoose" id="color2"><img src="../../../assets/灰.jpg"></div>
    <div class="colorChoose" id="color3"><img src="../../../assets/红.jpg"></div>
    <div class="colorChoose" id="color4"><img src="../../../assets/黑.jpg"></div>
    <div class="colorChoose" id="color5"><img src="../../../assets/白.jpg"></div>
  </div>
  <div id="changeColor" style="position:absolute;top:0;left:0">
    <!-- <img src="../../../assets/变色.png" alt="" width="24" style="vertical-align: middle;">
    <span id="changeColorText">停止变色</span> -->
  </div>

  <div id="rotateAudio" style="position:absolute;top:500px;left:0;z-index: 99;">
    <div id="rotate">
      <img id="rotateimg" :src="computedRotateSrc" alt="" width="24" style="vertical-align: middle;">
    </div>
    <div id="audio" style="margin-top: 20px;">
      <img id="audioimg" :src="computedSoundSrc" alt="" width="24" style="vertical-align: middle;">
    </div>
    <div style="margin-top: 20px;">
      <img id="light" :src="computedLightSrc" alt="" width="24" style="vertical-align: middle;">
    </div>
  </div>
</template>

<script setup>
    import * as THREE from 'three';
    import { renderer } from './RenderLoop.js'
    import { colorTween } from './colorTween.js'
    import { scene } from '../../../../public/scene/index'
    import { backgroundAudio } from '../../../../public/scene/backgroundAudio.js'
import { openCarLight, closeCarLight } from '../../../../public/scene/openCarLight.js'
import { onMounted,computed ,ref,onUnmounted} from 'vue'
import { model } from '../../../../public/scene/model.js'//车模型
const light = ref(false);
const audio = ref(false)
const rotate = ref(false)
const computedRotateSrc = computed(() => {
    const url = new URL('/src/assets/旋转.png', import.meta.url).href
    const url2 = new URL('/src/assets/停止旋转.png', import.meta.url).href
    return rotate.value?url:url2
})
const computedSoundSrc = computed(() => {
    const url = new URL('/src/assets/打开声音.png', import.meta.url).href
    const url2 = new URL('/src/assets/关闭声音.png', import.meta.url).href
    return audio.value?url:url2
})
const computedLightSrc = computed(() => {
    const url = new URL('/src/assets/关车灯.png', import.meta.url).href
    const url2 = new URL('/src/assets/开车灯.png', import.meta.url).href
    return light.value?url:url2
})
onUnmounted(() => {
   backgroundAudio.pause();  
})       
onMounted(() => {
        
    
    //Three.js渲染结果Canvas画布插入到body元素中
    const divWrap=document.getElementById('app')
    divWrap.appendChild(renderer.domElement);


    function setColor(color) {
      model.traverse(function (object) {
        if (object.type === 'Mesh') {
          if (object.name.slice(0, 2) == "外壳") { //外壳颜色设置
            object.material.color.set(color);
          }
        }
      })
    }

    var colorArr = [0x023911, 0x222222, 0x6a030a, 0x000000, 0xffffff];
    colorArr.forEach(function (value, i) {
      var dom = document.getElementById('color' + (i + 1));
      // 单击按钮切换颜色
      dom.onclick = function () {
        setColor(value)
      }
    })

    var open = true;
    // 颜色变化动画开关
    document.getElementById('changeColor').onclick = function () {
      if (open) {
        colorTween.stop();//停止动画
        open = false;
        document.getElementById('changeColorText').innerHTML = '开始变色';
        setColor(0x023911);//动画停止，颜色回到最初的状态
      }else {
        colorTween.start();//开始动画
        open = true;
        document.getElementById('changeColorText').innerHTML = '停止变色';
      }
    }


    // 模型旋转动画
    var rotateAnimation = null;
    function loop() {
      rotateAnimation = requestAnimationFrame(loop);
      scene.rotateY(0.001);
    }
    loop();

    // var rotate = true;
    document.getElementById('rotate').onclick = function () {
      if (rotate.value) {
        cancelAnimationFrame(rotateAnimation);
        rotate.value = false;
        // document.getElementById('rotateimg').src = '../../../assets/停止旋转.png';
      } else {
        loop();
        rotate.value = true;
        // document.getElementById('rotateimg').src = '../../../assets/旋转.png';
      }
      
    }


    // 背景音乐开关
    document.getElementById('audio').onclick = function () {
      if (audio.value) {
        backgroundAudio.pause();
        audio.value = false;
        // document.getElementById('audioimg').src = '../../../assets/关闭声音.png';
      } else {
        backgroundAudio.play();
        audio.value = true;
        // document.getElementById('audioimg').src = '../../../assets/打开声音.png';
      }
    }

    // 大开前灯，调整灯光
    

    document.getElementById('light').onclick = function () {
      if (light.value) {
        closeCarLight(); 
        light.value = false;
      } else {
        openCarLight();
        light.value = true;
      }
    }
    })
</script>

<style scoped lang="less">
    body {
        margin: 0;
    }
    .maskLoading {
        background: #000;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 1111111;
        color: #fff;
    }
    .color_div{
        position:fixed;
        bottom:50px;
        left:50%;
        margin-left: -190px;
        display: flex;
        >div{
          width:50px;
          height:50px;  
          overflow: hidden;
          border-radius: 50%;
          margin-right:25px;
        }
    }
    .maskLoading .loading {
        width: 400px;
        height: 20px;
        border: 1px solid #fff;
        background: #000;
        overflow: hidden;
        border-radius: 10px;

    }

    .maskLoading .loading div {
        background: #fff;
        height: 20px;
        width: 0;
        transition-duration: 500ms;
        transition-timing-function: ease-in;
    }

    canvas {
        width: 100vw;
        height: 100vh;
        position:absolute;
        z-index:10;
        margin: auto;
    }

    .mask {
        color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .flex {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;

    }

    .flex div {
        width: 10px;
        height: 10px;
        margin: 5px;
        cursor: pointer;
    }
</style>
