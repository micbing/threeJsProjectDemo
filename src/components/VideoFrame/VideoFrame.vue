<template>
    <div class="container"  >
        <div class="canvas_wrap" :style="itemClass" ref="frameContainer"> 
     <div v-for="item in markList" class="mark_item" :style="{left:`${item.left}px`,background:item.color}">
        <div class="item_bottom" :style="{background:item.color}">
          
        </div>
          <div class="pre_div" :style="{width:`${item.preWidth}px`,left:`${-item.preWidth}px`,background:item.color}"></div>
            <div class="next_div" :style="{width:`${item.nextWidth}px`,right:`${-item.nextWidth}px`,background:item.color}"></div>
     </div>
    <canvas
        v-bind="canvasAttr"
        ref="canvas"
        @click="handleClick"
    />
        </div>

    </div>
</template>

<script setup>
import { ref, toRefs, onMounted, computed, nextTick, watch, reactive, inject } from 'vue';
  import {getSelectFrame,getCoverWidth,getGridPixel} from '../../utils/canvasUtils'
const ffmpeg = inject('ffmpeg');
    const props = defineProps({
    trackItem: {
      type: Object,
      default() {
        return {
          showWidth: '0px',
          showLeft: '0px'
        };
      }
        },
        preVal: {
            type: Number,
            default:0,
        },
        nextVal: {
            type: Number,
            default:0
        },
        offsetLeft: {
            type: Number,
            default:0
        },
        start: {
            type: Number,
      default:0  
        },
        scale: {
            type: Number,
        default:60
        },
        step: {
            type: Number,
        default:30
    },
    type: {
      type: String,
      default: 'video'
    },
    drawState: {
      type: Boolean,
      default: true
    }
    });
const itemClass = computed(() => {
    return {
        width: props.trackItem.showWidth,
        left: props.trackItem.showLeft,
        height:'100%'
    }
  })
  /**
   * 初始化 Canvas
   * */
const frameContainer = ref();
  const markList=ref([])
const canvas = ref();
let canvasContext = {}
     const canvasAttr = reactive({
    width: 0,
    height: 0
  });
  const drawSize = reactive({
    width: 0,
    height: 0,
    frameCount: 0,
    maxFrame: 1
  });
    /**
   * @param imageBitmap 图像数据
   * @param start 开始位置
   * @param margin 图像间距
   * */
  function drawBitmap(imageBitmap, drawIndex = 0, margin = 0) {
    const { width: containerWidth } = canvasAttr;
    const { width, height, maxFrame } = drawSize;
      const { width: imageW, height: imageH } = props.trackItem;
    if (drawIndex === maxFrame - 1) { // 最后一张顶头渲染
      canvasContext.drawImage(imageBitmap, 0, 0, imageW, imageH, containerWidth - width, 0, width, height);
    } else {
      canvasContext.drawImage(imageBitmap, 0, 0, imageW, imageH, drawIndex * (width + margin), 0, width, height);
    }
  }
   // 绘制图像
  function drawImage() {
      if (props.trackItem.name && props.drawState && ffmpeg.isLoaded.value) {
      const { width: containerWidth, height: containerHeight } = canvasAttr;
      const { maxFrame, width, frameCount } = drawSize;
      const frameStep = Math.max(maxFrame - 1, 1); // 帧间距数，最小为1帧
      const renderSpace = Math.max(Math.floor(frameCount / frameStep), 1); // 间隔多少帧渲染一次
      let overFrame = Math.floor(frameCount - 1 - renderSpace * frameStep); // 不能整除时溢出帧数
      let offset = Math.max(containerWidth - Math.floor(maxFrame * width), 0); // 不够撑满canvas宽度的情况
      let marginSpace = Math.max(Math.round((offset / frameStep)), 0); // 帧数不够填满容器时的间距
      let frameIndex = props.trackItem.offsetL + 1; // 开始下标
      try {

      for (let i = 0; i < maxFrame; i++) {
          const blobFrame = ffmpeg.getFrame(props.trackItem.name, frameIndex);
        ((index, margin) => {
          createImageBitmap(blobFrame).then(imageBitmap => {
            drawBitmap(imageBitmap, index, margin);
          });
        })(i, marginSpace);
        frameIndex = Math.min(frameIndex + renderSpace, frameCount);
        if (overFrame > 0) {
          frameIndex += 1;
          overFrame--;
        }
      }
              
      } catch (error) {
        console.log('error',error)
      }
    }
  }
  // 设置 canvas 上下文环境
  function setCanvasContext() {
    canvasContext = canvas.value.getContext('2d');
  }
function handleClick(event) {
    const offset = event.clientX-props.offsetLeft;
    const frameIndex = getSelectFrame(props.start + offset, props.scale, props.step);
    const preWidth = getCoverWidth(props.scale, props.preVal)
    const nextWidth=getCoverWidth(props.scale,props.nextVal)
    const markInfo = {
        left: props.start + offset,
        bottom: 0,
        frameIndex: frameIndex,
        preWidth,
        nextWidth,
        color:'green'//`rgb(${Math.floor(Math.random(0,255))},${Math.floor(Math.random(0,255))},${Math.floor(Math.random(0,255))})`
    }
    markList.value.push(markInfo)
}
const drawMarks = () => {
    markList.value = markList.value.map((item) => {
        const left = getGridPixel(props.scale, item.frameIndex) 
            const preWidth = getCoverWidth(props.scale, props.preVal)
    const nextWidth=getCoverWidth(props.scale,props.nextVal)
        console.log('leftleft',preWidth,nextWidth)
        return {
            ...item,
            preWidth,
            nextWidth,
            left
         }
    })
  }
  // 设置 canvas 大小
  function setCanvasRect() {
      const { start, end, width: frameW, height: frameH } = props.trackItem;
    const showFrameCount = end - start;
    const { width, height } = frameContainer.value.getBoundingClientRect();
    canvasAttr.width = width;
    canvasAttr.height = height;
    const scaleW = Math.ceil(frameW / (frameH / height));
    drawSize.height = height;
    drawSize.width = scaleW;
    drawSize.frameCount = showFrameCount;
    drawSize.maxFrame = Math.min(Math.ceil(width / scaleW), showFrameCount);
      drawImage();
     drawMarks()
  }
  onMounted(() => {
      setCanvasContext();
    //   setTimeout(() => {
    //     setCanvasRect()
    // },3000)
  });
  watch(props, () => {
    nextTick(setCanvasRect);
  }, { immediate: true, flush: 'post' });
</script>

<style lang="less" scoped>
.container{
    position:absolute;
    width:100%;
    height:100px;
    left:0;
    top:0px;
    padding-left:20px;
    .canvas_wrap{
        position:relative;
    }
    .mark_item{
        position:absolute;
        top:0;
        height:100%;
        width:4px;
        .item_bottom{
            position: absolute;
            bottom: -16px;
            left:-3px;
            width: 10px;
            height: 16px;
  
        }
        .pre_div,.next_div{
            position:absolute;
            top:0;
            opacity: .6;
            height:100%;
            }
    }
}
</style>