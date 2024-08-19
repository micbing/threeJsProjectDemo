<template>
  <div class="layout_wrap">
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="logo" />
        <a-menu @select="handleSelect" v-model:selectedKeys="selectedKeys" theme="dark" :items="items" mode="inline">
          <!-- <a-menu-item key="background">
          <user-outlined />
          <span>背景特效</span>
        </a-menu-item> -->
          <!-- <a-menu-item key="three">
          <user-outlined />
          <span>three.js</span>
        </a-menu-item> -->
          <!-- <a-menu-item key="cropCom">
          <video-camera-outlined />
          <span>截屏插件</span>
        </a-menu-item>
        <a-menu-item key="mapZoom">
          <upload-outlined />
          <span>地图下钻</span>
        </a-menu-item>
           <a-menu-item key="sTable">
             <user-outlined />
          <span>sTable</span>
        </a-menu-item>
           <a-menu-item key="canvasPoint">
             <user-outlined />
          <span>canvasRef</span>
        </a-menu-item> -->
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="header_class" style="background: #fff; padding: 0">
          <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        </a-layout-header>
        <a-layout-content :style="{ margin: '24px 16px', padding: '0px', background: '#fff', minHeight: '280px' }">
          <RouterView></RouterView>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, h } from 'vue';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';

const selectedKeys = ref(['three']);
const collapsed = ref(false);
const router = useRouter()
const route = useRoute()
const items = ref([
  {
    key: 't',
    icon: () => h(AppstoreOutlined),
    label: 'web3D相关',
    title: 'web3D相关',
    children: [
      {
        key: 'three',
        label: '3D基础场景模型',
        title: '3D基础场景模型'
      },
      {
        key: 'three-fog',
        label: '3D中的雾',
        title: '3D中的雾'
      },
      {
        key: 'three-gltf',
        label: '加载3D模型',
        title: '加载3D模型'
      },
      // {
      //   key: 'tween',
      //   label: '3D中常用得动画库',
      //   title: '3D中常用得动画库'
      // },
      {
        key: 'three-ray',
        label: '3D的光线投射-物体交互',
        title: '3D的光线投射-物体交互'
      },
      {
        key: 'three-duck',
        label: '3D可达鸭',
        title: '3D可达鸭'
      },
       {
        key: 'three-demo1',
        label: '水上房屋',
        title: '水上房屋'
      },
      {
        key: 'three-demo2',
        label: 'vr全景看房',
        title: 'vr全景看房'
      },
      {
        key: 'three-demo3',
        label: '3d地球',
        title: '3d地球'
      },
      {
        key: 'three-demo4',
        label: '3d汽车模型',
        title: '3d汽车模型'
      },
    ]
  },
  {
    key: 'canvas',
    icon: () => h(VideoCameraOutlined),
    label: 'canvas相关',
    title: 'canvas相关',
    children: [
      {
        key: 'canvas',
        label: '调用设备摄像头',
        title: '调用设备摄像头'
      }
    ]
  }
])
const handleSelect = (item) => {
  router.push('/' + item.key)
}
// onMounted(() => {
//   let domArr = document.querySelectorAll('.surely-table div')
//   for (let i = 0; i < domArr.length; i++) {
//     let node = domArr.item(i) as HTMLElement
//     if (['Unlicensed Product'].includes(node.innerText)) {
//       node.remove()
//     }
//     if (['Powered by Surely Vue'].includes(node.innerText)) {
//       node.style.opacity = '0'
//     }
//   }
// })
watch(() => route, (val) => {
  console.log(val)
})
</script>
<style lang="less">
.layout_wrap {
  height: 100%;
  width: 100%;

  section {
    height: 100vh
  }
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

.header_class {
  display: flex;
  align-items: center;
  padding-left: 30px !important;
}
</style>
