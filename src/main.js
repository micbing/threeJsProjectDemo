import { createApp } from 'vue'
import './style.css'
import router from './router/index'
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import App from './App.vue'
import screenShort from "vue-web-screen-shot";
import STable from '@surely-vue/table';
import '@surely-vue/table/dist/index.less';
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import 'wow.js/css/libs/animate.css'
import scrollReveal from 'scrollreveal';
import installFFmpeg from './plugins/installFFmpeg';
window.sr = scrollReveal();

const app = createApp(App)
// app.config.globalProperties.$ElLoading = ElLoading.service({
//     text: '核心加载中...'
// });
 function useTable (app) {
          app.use(VXETable)
 }
app.use(router).use(screenShort, { enableWebRtc: false })
   .use(Antd)
    .use(STable)
   .use(useTable).use(installFFmpeg)
app.mount('#app')
