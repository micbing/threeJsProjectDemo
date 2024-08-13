<template>
    <div class="wrap">
        <canvas ref='canvasRef' width="390" height="120"></canvas>
        <router-link to="/viewScroll">scrollview</router-link>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import carIcon from '../../assets/t.jpg'
onMounted(() => {
  requestAnimationFrame(animationFn)
})
const canvasRef = ref<HTMLCanvasElement>()
const indx = ref<number>(3)
const time = ref<number>(5)
const currentActivePoint = ref({
  x: 0,
  y:0
})
const currentTime=ref<number>(0)
let text = '第3遍(15:00-18:00)'
let stations = new Array(13).fill(null)

const cornerP = [
    { x: 20, y: 67.5, type: 'corner', showP: true },
    { x: 55, y: 47.5, type: 'corner', showP: false },
    { x: 337.5, y: 47.5, type: 'corner', showP: false },
    { x: 337.5, y: 112.5, type: 'corner', showP: false },
    { x: 55, y: 112.5, type: 'corner', showP: false },
    { x: 20, y: 92.5, type: 'corner', showP: true }
]

function getStationsPosition(indexNum:number): { num: string; status: number; x: number; y: number; type?: string}[] {
    const middleIndex = Math.floor(stations.length / 2);
    const { width, height } = canvasRef.value as HTMLCanvasElement;
    let centerPoint = { x: width - 20, y: height / 2 + 20 };
    let leftArr = stations.filter((v, _i) => _i < middleIndex)
    const leftWidth = (width - 40 - 35 - 32.5) / (leftArr.length - 1)
    const leftP = leftArr.map((v, i) => ({
        x: leftWidth * i + 55,
        y: height / 2 + 20 - 32.5,
        typeLeft:'leftP'
    }))
    const rightArr = stations.filter((v, _i) => _i > middleIndex);
    const rightWidth = (width - 40 - 35 - 32.5) / (rightArr.length - 1)
    const rightP = rightArr.map((v, i) => ({
        x: 370 - 32.5 - rightWidth * i,
      y: height / 2 + 20 + 32.5,
        typeRight:'rightP'
    }))
    return [
        cornerP[0],
        cornerP[1],
        ...leftP,
        cornerP[2],
        centerPoint,
        cornerP[3],
        ...rightP,
        cornerP[4],
        cornerP[5]].map((v, i) => ({
            ...v,
            num: String(i),
            status:i>indexNum?0:i>2?1:2
        }))
}
const drawBgLine=(points: ReturnType<typeof getStationsPosition>, color?: string)=> {
    const ctx = canvasRef.value?.getContext('2d') as unknown as CanvasRenderingContext2D;
  points.forEach((item, index) => {
        const next = points[index + 1]
        if (next) {
            if (next.y === item.y) {
                ctx.beginPath()
                ctx.moveTo(item.x, item.y)
                ctx.lineWidth = 4;
                ctx.strokeStyle = color ?? 'rgba(55,59,62,0.5)'
                ctx.lineTo(next.x, next.y)
                ctx.stroke()
            } else if (Math.abs(next.y - item.y) === 32.5) {
                ctx.beginPath()
              if (next.x < item.x) {
        
                    ctx.arc(next.x,item.y,32.5,(Math.PI/180)*0,(Math.PI/180)*90)
                } else {
                    ctx.arc(item.x,next.y,32.5,(Math.PI/180)*270,(Math.PI/180)*0)
                }
                ctx.lineWidth = 4;
              ctx.strokeStyle = color ?? 'rgba(55,59,62,0.5)'
                ctx.stroke()
            } else if (Math.abs(next.y - item.y) < 32.5) {
                ctx.beginPath()
                 if (next.x < item.x) {
            ctx.moveTo(item.x, item.y);
            ctx.quadraticCurveTo(next.x, item.y, next.x, next.y);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color ?? 'rgba(55, 59, 62, 0.5)';
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = color ?? 'rgba(55, 59, 62, 0.5)';
            ctx.arc(next.x, next.y, 4, 0, Math.PI * 2);
            ctx.fill();
                 } else {
            ctx.moveTo(item.x, item.y);
            ctx.quadraticCurveTo(item.x, next.y, next.x, next.y);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color ?? 'rgba(55, 59, 62, 0.5)';
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = color ?? 'rgba(55, 59, 62, 0.5)';

            ctx.arc(item.x, item.y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
            }
        }
    })
    
}
  const drawProgressBgLine=(points: ReturnType<typeof getStationsPosition>)=> {
    const ctx = canvasRef.value?.getContext(
      '2d',
    ) as unknown as CanvasRenderingContext2D;

     const index = points.findIndex((v) => v.status === 0);

    const newArr = points.slice(0, index);
    // const lastEl = points[index];
    // const curEl = points[index - 1];
    const firstEl = points[0];
    const lastEl=points[1];
    // console.log(lastEl, curEl);
    const speedX = (lastEl.x - firstEl.x) / 5;
    const speedY=(lastEl.y-firstEl.y)/5
    const diffDistanceX = speedX * currentTime.value;
    const diffDistanceY=speedY* currentTime.value;
    ctx.beginPath()
    ctx.moveTo(firstEl.x, firstEl.y)
    ctx.lineTo(firstEl.x + diffDistanceX, firstEl.y + diffDistanceY)
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(107, 255, 236, 1)';
    ctx.stroke();
    if (lastEl) {
      /**处于顶部的时候画出箭头 */
      if (lastEl.y === curEl.y) {
        if (lastEl.x > curEl.x) {
          const centerP = {
            x: indx.value + curEl.x,
            y: curEl.y,
          };
          const img = new Image();
          img.src = carIcon;
          img.onload = function () {
            ctx.drawImage(img, centerP.x - 12, centerP.y - 32, 19, 24);
          };

          ctx.beginPath();
          ctx.moveTo(curEl.x, curEl.y);
          ctx.lineTo(centerP.x, centerP.y);
          /**生成三角形标记 */
          ctx.lineTo(centerP.x, centerP.y - 2);
          ctx.lineTo(centerP.x + 3, centerP.y);
          ctx.lineTo(centerP.x, centerP.y + 2);
          ctx.lineTo(centerP.x, centerP.y);
          ctx.fillStyle = 'rgba(107, 255, 236, 1)';
          ctx.fill();

          ctx.lineWidth = 4;
          ctx.strokeStyle = 'rgba(107, 255, 236, 1)';
          ctx.stroke();
        }
        /** 其他条件暂时留空 */
      }
    }
     drawActiveBgLine(newArr, 'rgba(107, 255, 236, 1)');
  }
const drawActiveBgLine = (points: ReturnType<typeof getStationsPosition>, color?: string) => {
  const ctx = canvasRef.value?.getContext('2d') as unknown as CanvasRenderingContext2D;
  let index = 0;
  while (index < points.length-1) {
    let item = points[index]
    let next = points[index + 1]
    currentActivePoint.value = item;
    if (Math.abs(next.y - item.y)<32.5) {
        const speedX = (next.x - item.x) / time.value;
        const speedY = (next.y - item.y) / time.value
        ctx.beginPath()
        ctx.moveTo(item.x, item.y)
        ctx.quadraticCurveTo(item.x + speedX, item.y, item.x + speedX, item.y + speedY) 
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        if (item.x + speedX >= next.x && item.y + speedY >= next.y) {
           ctx.arc(next.x, next.y, 4, 0, Math.PI * 2);
           ctx.fill();
        }
    }
  }
  points.forEach((item, index) => {
    const next = points[index + 1]
    if (next) {
      if (Math.abs(next.y - item.y) < 32.5) {
        const speedX = (next.x - item.x) / time.value;
        const speedY = (next.y - item.y) / time.value
        ctx.beginPath()
        ctx.moveTo(item.x, item.y)
        ctx.quadraticCurveTo(item.x + speedX, item.y, item.x + speedX, item.y + speedY) 
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        if (item.x + speedX >= next.x && item.y + speedY >= next.y) {
           ctx.arc(next.x, next.y, 4, 0, Math.PI * 2);
           ctx.fill();
        }
      } else if (next.y === item.y) {
        const speedX = (next.x - item.x) / time.value;
          ctx.beginPath()
          ctx.moveTo(item.x, item.y)
      }
    }
  })  
}  
const animationFn = () => {

  if (indx.value < 13) {
    draw()
    requestAnimationFrame(animationFn)
    // indx.value += 0.05
   } 
}
  const draw=()=> {
    if (!canvasRef.value) {
      return;
    }
    const ctx = canvasRef.value?.getContext(
      '2d',
    ) as unknown as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvasRef.value?.width, canvasRef.value?.height);
    if (ctx) {
      /** 绘制当前遍数的文字 */
      ctx.font = '12px serif';

      ctx.fillStyle = '#fff';
      ctx.fillText(text, 10, canvasRef.value?.height / 2 + 24);
      const points = getStationsPosition(indx.value);
      ctx.clearRect(0,0, 390, 120); 
           /** 画出背景线 */
      drawBgLine(points);

      /** 画出当前进度 */
      drawProgressBgLine(points);
      points.forEach((item) => {
        if (item.type !== 'corner') {
          ctx.clearRect(item.x - 6, item.y - 6, 12, 12);
          ctx.beginPath();
          /** 生成标记点 */
          ctx.moveTo(item.x, item.y);

          ctx.fillStyle =
            item.status === 2
              ? 'rgba(255, 157, 31, 1)'
              : item.status === 1
              ? 'rgba(107, 255, 236, 1)'
              : 'rgba(55, 59, 62, 1)';
          ctx.arc(item.x, item.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(55, 59, 62, 1)';
          ctx.arc(item.x, item.y, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.closePath();

          ctx.fillStyle = '#fff';
          ctx.fillText(item.num, item.x - 4, item.y - 12);
        }
      });
    }
   
  }

</script>

<style lang="less" scoped>
.wrap{
  background:rgba(33, 53, 71,.8)
}
</style>