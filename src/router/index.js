import { createRouter, createWebHistory } from "vue-router";

import backgroundCom from '../components/backgroundCom/backgroundView.vue'
import cropCom from '../components/cropCom/cropComView.vue'
import mapZoom from '../components/mapZoom/index.vue'
import sTable from '../components/sTableCom/index.vue'
import Layout from '../Layout/layoutView.vue'
import canvasPaintView from '../components/canvasPoint/canvasPointView.vue'
import viewScroll from '../components/viewScroll/viewScrollIndex.vue'
import canvasView from '../pages/canvas/canvasView.vue'


import photoShotView from '../pages/photoShot/photoShotView.vue'
const routes = [
    {
        path: '/',
        component: Layout,
        redirect:'/canvas',
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
                path: '/canvas',
                name:'canvas',
                component:canvasView
            },
              {
                path: '/photoshot',
                name:'photoshot',
                component:photoShotView
            },
            //    {
            //     path: '/scroll',
            //     name:'scroll',
            //     component:scrollView
            // }
             
        ]
    }
    // , {
    //     path: '/viewScroll',
    //     component:viewScroll
    // },
    // {
    //    path: '/three-demo1',
    //    name: 'three-demo1',
    //    component:threeDemo1
    // },
    // {
    //    path: '/three-demo2',
    //    name: 'three-demo2',
    //    component:threeDemo2
    // },
    //  {
    //    path: '/three-demo3',
    //    name: 'three-demo3',
    //    component:threeDemo3
    // },
    //  {
    //    path: '/three-demo4',
    //    name: 'three-demo4',
    //    component:threeDemo4
    // }
]
export default createRouter({
    history: createWebHistory(),
    routes
})