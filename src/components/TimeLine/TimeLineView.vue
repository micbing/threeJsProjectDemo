<template>
      <div class="canvas_wrap" ref="canvasContainer">
                    <!-- {{ start }}--{{ scale }}--{{step}} -->
    <canvas
        :style="canvasStyle"
        v-bind="canvasAttr"
        ref="timeLine"
        @click="handleClick"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, reactive, toRefs ,toRef} from 'vue';
  import {drawTimeLine } from '../../utils/canvasUtils'
  const props = defineProps({
    start: { // 开始坐标
      type: Number,
      default: -20
    },
    step: { // 步进，与视频fps同步
      type: Number,
      default: 30
    },
    scale: { // 时间轴缩放比例
      type: Number,
      default: 0
    },
    focusPosition: { // 选中元素时在时间轴中高亮显示
      type: Object,
      default() {
        return {
          start: 0, // 起始帧数
          end: 0 // 结束帧数
        };
      }
    }
  });
    /**
   * 初始化 Canvas
   * */
  const timeLine = ref();
const canvasContainer = ref();
let canvasContext = {} 
const canvasConfigs = computed(() => ({
    bgColor: '#374151',//背景颜色
    ratio:  1,
    textSize: 12,//字号
    textScale: 0.83,//支持更小号字 10/12
    lineWidth: 1,//线宽
    textBaseline: 'middle',
    textAlign: 'center',
    longColor: '#E5E7EB',// 长线段颜色
    shortColor: '#9CA3AF',// 短线段颜色
     textColor: '#E5E7EB' , // 文字颜色
    subTextColor: '#9ca3f',// 小文字颜色
    focusColor:'#6d28d9' // 选中元素区间
}))
const canvasAttr = reactive({
    width: 0,
    height:0
})
const canvasStyle = computed(() => {
    return {
      width: `${canvasAttr.width / canvasConfigs.value.ratio}px`,
      height: `${canvasAttr.height / canvasConfigs.value.ratio}px`
    };
});
//重绘线条
function updateTimeLine() {
    // const { start, step, scale, focusPosition } = toRefs(props)
    // console.log(111111111)
    drawTimeLine(canvasContext,{...props},{...canvasAttr,...canvasConfigs.value})
}
//设置canvas上下文环境
function setCanvasContext() {
    canvasContext = timeLine.value.getContext('2d')
    canvasContext.lineWidth = canvasConfigs.value.lineWidth;
       canvasContext.textBaseline = canvasConfigs.value.textBaseline;
    canvasContext.textAlign = canvasConfigs.value.textAlign;
}  
//设置canvas宽高
function setCanvasRect() {
    const { width, height } = canvasContainer.value.getBoundingClientRect()
    canvasAttr.width = width * canvasConfigs.value.ratio;
    canvasAttr.height = height * canvasConfigs.value.ratio
    console.log('canvas宽高', width, height,canvasContainer.value.getBoundingClientRect())
    nextTick(() => {
        setCanvasContext()
        updateTimeLine()
    })
}
onMounted(() => {
    setCanvasRect()
})
  watch(canvasConfigs, updateTimeLine);
  watch(props, updateTimeLine);
  window.addEventListener('resize', setCanvasRect, false);
</script>

<style lang="less" scoped>
.canvas_wrap{
    position:sticky;
    top:0;
    width:100%;
    left:0;
    height:20px;
    text-align: center;
    line-height: 20px;
    z-index:20;
}
</style>