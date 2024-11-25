<template>
    <div class="wrap">
        <div class="video_wrap">
            <video width="100%" height="480" controls>
                 <source src="/video/video_1.mp4" type="video/mp4">
                 您的浏览器不支持video标签
            </video>
        </div>
               <TimeLine     :start="startX"   :scale="trackScale" :step="defaultFps"/>
        <div class="content"   ref="trackList"  @scroll="handleScroll">
            <div  :style="{ width: `${trackStyle.width}px`,height:'100px'}">
         
             <!-- <div class="line_wrap" ref="lineRef">
           <div class="line"></div>
           </div>  -->
            <!-- <div class="text">00:01:42</div>  -->
           <!-- <div class="split_line" :style="{transform:`translateX(${currentLineMoveX}px)`}"> -->
            <!-- <div class='split_value'>
                00:00:13
            </div> -->
            <VideoFrame :preVal="preVal" :nextVal="nextVal" :offsetLeft="offsetLeft" :trackItem="trackItem"  :start="startX"   :scale="trackScale" :step="defaultFps"></VideoFrame>
           <!-- </div> -->
           </div>
        </div>
        <div class="footer">
  <div class="slider_wrap">
              <a-slider  v-model:value="value2" range :step="10" @change="onChange" />
            
        </div>
          <div class="mark_wrap">
                <QuestionCircleOutlined />
                 <div class="mark_pre">
                    <span class="title">标记前</span>
                    <div class="count_div">
                        <div @click="handlePreChange('delete')" class="icon"><MinusOutlined  style="font-size: 16px;"/></div>
                        <div class="val_content">+{{preVal  }}s</div>
                        <div @click="handlePreChange('add')" class="icon icon_right"><PlusOutlined style="font-size: 16px;"/></div>
                    </div>
                 </div>
                    <div class="mark_next">
                         <span class="title">标记后</span>
                    <div class="count_div">
                        <div @click="handleNextChange('delete')" class="icon"><MinusOutlined style="font-size: 16px;" /></div>
                        <div class="val_content">{{nextVal  }}s</div>
                        <div @click="handleNextChange('add')" class="icon icon_right"><PlusOutlined style="font-size: 16px;"/></div>
                    </div>
                    </div>
              </div>
        </div>
      
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, inject, watch } from 'vue'
import {QuestionCircleOutlined,MinusOutlined,PlusOutlined} from '@ant-design/icons-vue';
import {getGridPixel} from '../../utils/canvasUtils'
import TimeLine from '../../components/TimeLine/TimeLineView.vue'
import VideoFrame from '../../components/VideoFrame/VideoFrame.vue'
// const lineRef = ref('lineRef')
const value2 = ref([20, 50]);
const offsetLeft = ref()  
onMounted(() => {
    initEvent()
    const {left}=trackList.value?.getBoundingClientRect()
    offsetLeft.value=left
    // console.log('dwadwadwa', trackList.value?.getBoundingClientRect())
})
  const offsetLine = {
    left: 20, // 容器 margin, 为了显示拖拽手柄
    right: 0
  };

const preVal = ref(2);
const nextVal=ref(2)
  const playerConfig = reactive({
    frameCount: 712,
    playerWidth: 0,
    playerHeight: 0
  });
const defaultFps = ref(30); // 帧率
  const loading = ref(true);
  const waveFileUrl = ref('');
  const trackList = ref();
const trackScale = ref(60)//轨道放大比例
const startX = ref(0 - offsetLine.left); // 与容器padding对齐
      const startY = ref(0); // 左侧icons对齐
const totalTime=ref(60+42)
const currentLineMoveX = ref(0)
// const offsetContentLeft = computed(() => {
//     const info = trackList.value?.getBoundingClientRect()
//     console.log(123,info)
//     return info.width
// })
const trackItem = computed(() => {
    return {
    start: 0,
    end: 712,
    fps: 30,
    frameCount: 712,
    height: 720,
    offsetL: 0,
    offsetR:29,
    width: 1232,
    showWidth: `${getGridPixel(trackScale.value, 712)}px`,
    showLeft: `${getGridPixel(trackScale.value, 0)}px`,
    name: 'video_1',
    source:'/video/video_1.mp4',
    format: 'mp4',
    }
})
const onChange = (v) => {
    const [start, end] = v
    trackScale.value = Math.abs(end - start)
    console.log('sliderChange',  trackScale.value)
}
const handleScroll = (e) => {

    const { scrollLeft, scrollTop } = trackList.value;
        // console.log('e',e,scrollLeft, scrollTop)
    startX.value = scrollLeft - offsetLine.left;
    startY.value = scrollTop;
}
const handlePreChange = (type) => {
    if (type === 'delete') {
        preVal.value=preVal.value>0?  --preVal.value:0
    } else {
         preVal.value=preVal.value<100?  ++preVal.value:100
    }
}
const handleNextChange = (type) => {
       if (type === 'delete') {
        nextVal.value=nextVal.value>0?  --nextVal.value:0
    } else {
         nextVal.value=nextVal.value<100?  ++nextVal.value:100
    }
}
const initEvent = () => {
    // lineRef.value.addEventListener('mousemove', (e) => {
    //     currentLineMoveX.value=e.offsetX
    // })
}
    const trackStyle = computed(() => {
    return {
      width: getGridPixel(trackScale.value, playerConfig.frameCount) + offsetLine.right
    };
    });
const ffmpeg = inject('ffmpeg')
async function initVideo() {

    const { name, source, format, frameCount, width, height } = trackItem.value;
    if (name && source && ffmpeg.isLoaded.value) {
        const videoName = `${name}.${format}`;
      // 写文件
      await ffmpeg.writeFile(ffmpeg.pathConfig.resourcePath, videoName, source);
      // 分离音频
    //   await ffmpeg.splitAudio(name, format);
      // 视频抽帧
      await ffmpeg.genFrame(name, format, {
        w: width,
        h: height
      });
    //   await ffmpeg.genWave(name, frameCount);
    //   waveFileUrl.value = ffmpeg.getWavePng(name);
      loading.value = false;
    }
     }
    watch(() => {
    return trackItem.value.source && ffmpeg.isLoaded.value;
  }, initVideo, {

  });
</script>

<style lang="less" scoped>
.wrap{
    width:100%;
    height:100%;
    position:relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding:0 30px;
    .video_wrap{
        width:100%;
    }
    .ant-slider{
        height:16px;
    }
    // :deep(.ant-slider-rail){
    //     height:7px !important;
    // }
    // :deep(.ant-slider-track){
    //       height:7px !important;
    //      background: #C0DEFF;
    // }
    // :deep(.ant-slider-step){
    //      height:7px !important;
    // }
    // :deep(.ant-slider-handle){
    //      width:16px;
    //     height:16px;
    // }
    // :deep(.ant-slider-handle::after){
    //     width:16px;
    //     height:16px;
    //     box-shadow: none;
    // }
    //    :deep(.ant-slider-handle::before){
    //     width:16px;
    //     height:16px;
    // }
    .content{
       width:100%;
       cursor: pointer;
    //    display: flex;
    //    align-items: center;
       background:#313239;
       overflow-y: hidden;
       overflow-x: scroll;
       position: relative;
       min-height: 100px;
       left:0;
       padding:0 20px;
    }
    .footer{
               margin-top:20px;
        display: flex;
        width:100%;
        align-items: center;
        justify-content: space-between;
    }
    .mark_wrap{
        display: flex;
        align-items: center;
        .icon{
           border-radius: 6px 0 0 6px;
           width:24px;
           display: flex;
           align-items: center;
           cursor: pointer;
           justify-content: center;
           background: #D8D8D8;
        }
        .icon_right{
               border-radius: 0px 6px 6px 0px !important;
        }
        .count_div{
            display: flex;
        }
        .val_content{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3D3D3D;
            padding:0 8px;
            background:#fff;
                 font-size: 14px; 
               color: #3D3D3D;
        }
        .mark_pre,.mark_next{
            display: flex;
            align-items: center;
            span{
               font-size: 14px; 
               color: #3D3D3D;
      
            }
            .title{
                         margin-right:8px;
            }
        }
        .mark_pre{
            margin:0 37px 0 13px;
        }
    }
    .slider_wrap{
        align-self: flex-start;
 
        width: 249px;
        border-radius: 20px;
        background: #848484;
    }
    .line_wrap{
        flex:1;
        height:100%;
        display: flex;
        align-items: center;
    }
    .split_line{
        position:absolute;
        left:20px;
        width:2px;
        height:100%;
        background:#fff;
        .split_value{
            position:absolute;
            top:-10px;
            left:0;
            transform: translate(-50%,-100%);
            background:#1795ff;
            border-radius: 4px;
            color:#fff;
            padding:2px 4px;
        }
        .split_value::after{
            content:'';
            display: block;
            position:absolute;
            left:50%;
            bottom:0;
            width:0;
            transform: translate(-50%,15px);
            border-top:8px solid #1795ff;
            border-right: 8px solid transparent;
            border-left: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }
    }
    .line{
      flex:1;
      height: 80px;
      background-color: hsla(0, 0%, 100%, .5);
      border-radius: 2px;
    }
    .text{
        color:#fff;
        margin-left:10px;
    }
}
</style>