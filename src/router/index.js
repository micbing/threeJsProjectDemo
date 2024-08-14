import { createRouter, createWebHistory } from "vue-router";

import backgroundCom from '../components/backgroundCom/backgroundView.vue'
import cropCom from '../components/cropCom/cropComView.vue'
import mapZoom from '../components/mapZoom/index.vue'
import sTable from '../components/sTableCom/index.vue'
import Layout from '../Layout/layoutView.vue'
import canvasPaintView from '../components/canvasPoint/canvasPointView.vue'
import viewScroll from '../components/viewScroll/viewScrollIndex.vue'
import threeView from '../pages/three/index.vue'
import canvasView from '../pages/canvas/canvasView.vue'
import threeFog from '../pages/three/three_fog/index.vue'
import threeGltf from '../pages/three/three_gltf/index.vue'
import threeRay from '../pages/three/three_ray/index.vue'
import threeDuck from '../pages/three/three_duck/index.vue'
import threeTween from '../pages/three/three_tween/index.vue'
import threeDemo1 from '../pages/three/three_demo1/index.vue'
import threeDemo2 from '../pages/three/three_demo2/index.vue'
import threeDemo3 from '../pages/three/three_demo3/index.vue'
import threeDemo4 from '../pages/three/three_demo4/index.vue'
const routes = [
    {
        path: '/',
        component: Layout,
        redirect:'/three',
        children: [
            {
                path: '/background',
                name:'background',
                component:backgroundCom
            },
            {
                path: '/cropCom',
                 name:'cropCom',
                component:cropCom
            },
            {
                path: '/tween',
                 name:'Tween',
                component:threeTween
            },
            {
                path: '/mapZoom',
                name:'mapZoom',
                component:mapZoom
            },
            {
                path: '/sTable', 
                name:'sTable',
                component:sTable
            },
            {
                path: '/canvasPoint',
                name:'canvasPoint',
                component:canvasPaintView
            },
            {
                path: '/three',
                name:'three',
                component: threeView,
            },
            {
                path: '/three-fog',
                name: 'three-fog',
                component:threeFog
            },
             {
                path: '/three-gltf',
                name: 'three-gltf',
                component:threeGltf
            },
               {
                path: '/canvas',
                name:'canvas',
                component:canvasView
            }, {
                 path: '/three-ray',
                name: 'three-ray',
                component:threeRay 
            },
               {
                 path: '/three-duck',
                name: 'three-duck',
                component:threeDuck 
            },
             
        ]
    }
    , {
        path: '/viewScroll',
        component:viewScroll
    },
    {
       path: '/three-demo1',
       name: 'three-demo1',
       component:threeDemo1
    },
    {
       path: '/three-demo2',
       name: 'three-demo2',
       component:threeDemo2
    },
     {
       path: '/three-demo3',
       name: 'three-demo3',
       component:threeDemo3
    },
     {
       path: '/three-demo4',
       name: 'three-demo4',
       component:threeDemo4
    }
]
export default createRouter({
    history: createWebHistory(),
    routes
})