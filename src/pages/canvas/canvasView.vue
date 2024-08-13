<template>
    <div class="wrap">
       <!-- <canvas id="canvas" ref="canvasRef" width="400px" height="260px"></canvas>
       <div>
       <a-button @click="handleStart">开始动画</a-button>
       <a-button style="margin:0 20px" @click="handleStop">暂停动画</a-button>
        <a-button @click="handleReset">重置动画</a-button> -->
    
       <!-- </div> -->
    <div>
        <div>
         <a-button>拍摄的图片</a-button>
        <div class="img_class">
             <img v-if="imgSrc" :src="imgSrc"/>
        </div>
       </div>
    <div>
    <a-button @click="handleFace">启动人脸识别</a-button>
    <a-button style="margin-left:20px" @click="handleClick">拍摄</a-button>
    <div class="video_wrap">
        <video ref="videoRef" id="video" style="width: 600px;height:600px" class="mb10"></video>
   
          </div>
    </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
 const canvasRef = ref<HTMLCanvasElement>()
const context = ref<any>()
const currentAngle = ref<number>(Math.PI)
const second = ref<number>(3)
const startTime = ref<number>(0)
const endTime = ref<number>(0)
const temporary=ref<number>(0)
const isStop = ref<boolean>(false)
const videoRef=ref()
const isAnimation = ref<boolean>(false)
const imgSrc = ref<string>('')
// const canvasRef=ref()
let CWidth = 800, CHeight = 600;
onMounted(() => {
    // getCtx()
    // startTime.value=new Date().getTime()
    //  drawCircle()
    //  animation()
})
const getCtx = () => {
    const ctx=canvasRef.value as HTMLCanvasElement
    context.value= ctx.getContext('2d')
}
const handleStart = () => {
    startTime.value = new Date().getTime()
    animation()
}
const handleStop = () => {
    isStop.value=!isStop.value
}
const handleReset = () => {
    let ctx = context.value;
    isStop.value = false
    currentAngle.value = Math.PI
    ctx.clearRect(0, 0, canvasRef.value?.width, canvasRef.value?.height)
    drawCircle()
}
const handleFace =async () => {
    let navigator = window.navigator.mediaDevices;
let devices = await navigator.enumerateDevices();
    console.log(devices)
    navigator.getUserMedia({
        video: {
            width: 500,
        height:500,
    }
    }).then((stream) => {
        videoRef.value.srcObject = stream;
         videoRef.value.onloadedmetadata = function (e) {
            videoRef.value.play();
          };
    }).catch(err => {
    console.log(err)
})
}
const update = (file) => {
     let param = new FormData(); //创建form对象
      param.append("file", file, file.name); //通过append向form对象添加数据
    console.log(param)
}
const dataURLtoFile = (dataurl,filename) => {
       var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let fileList = new File([u8arr], filename, { type: mime });
      update(fileList); //图片上传
      return new File([u8arr], filename, { type: mime });

}
const createCanvas = (canvas,w,h) => {
    const ratio =4// window.devicePixelRatio || 1;
     canvas.width = w*ratio;
    canvas.height = h * ratio;
       canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d") as any;
    ctx.scale(ratio, ratio)
   return canvas
}
  function getPixelRatio(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }
const handleClick = () => {
     const canvas = document.createElement("canvas");
    // const canvas=createCanvas(newCanvas,200,200)
    // const ratio = window.devicePixelRatio || 1;
    //   const canvas=canvasRef.value as any
      canvas.width =CWidth;
      canvas.height =CHeight;
    let ctx = canvas.getContext("2d") as any;
    let ratio = getPixelRatio(ctx);
      console.log(11111,CWidth * ratio,CHeight * ratio)
      ctx.drawImage(videoRef.value,-CWidth * ((ratio - 1) / 2), -CHeight * ((ratio - 1) / 2),CWidth * ratio, CHeight * ratio);
      let image = new Image();
      let myImage = canvas.toDataURL("image/png");
    image.src = canvas.toDataURL("image/png");
      imgSrc.value= canvas.toDataURL("image/png")
      dataURLtoFile(myImage, "signature.png");
      return image;
}
const drawCircle = () => {
    let ctx = context.value;
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.arc(100, 100, 50, 0, Math.PI,true)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(100, 100, 60, 0,Math.PI,true)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(45, 100, 5, 0,Math.PI)
    // ctx.moveTo(40, 100)
    // ctx.lineTo(50, 100)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(155, 100, 5, 0,Math.PI)
    ctx.stroke()
    ctx.closePath()
    // ctx.fill()

}
const drawProgress = () => {
    let ctx = context.value;
    ctx.beginPath()
    ctx.arc(100,100,55,Math.PI,currentAngle.value)
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke()
}
const animation = () => {

    isAnimation.value=true
    endTime.value = isStop.value ? temporary.value : new Date().getTime()
    temporary.value=endTime.value
    let ctx = context.value;
    ctx.clearRect(0, 0, canvasRef.value?.width,canvasRef.value?.height)

    const speed =Math.PI / second.value;
    const descTime = endTime.value - startTime.value
    
    currentAngle.value =(descTime/1000) * speed +Math.PI
    // console.log(111, speed,descTime,  currentAngle.value )
    drawCircle()
    drawProgress()
    if (descTime <= second.value*1000&&!isStop.value) {
        currentAngle.value += (descTime / 1000) * speed
        console.log(111,descTime)
        requestAnimationFrame(animation)
    } else {
        isAnimation.value=false
    }

    
}
</script>

<style lang="less" scoped>
.wrap{
    width: 100%;
    height:100%;
 
    >div{
    display: flex;
    padding-top:20px;
    align-items: center;
    justify-content: center;
    }
    .img_class{
        width:600px;
         margin-top:30px;
        height:600px;
        margin-right:30px;
        border: 1px solid #999;
        img{
            height:100%;
            width: 100%;;
        }
    }
}
.video_wrap{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top:30px;
    video{
        border:1px solid #999;
    }
}

</style>