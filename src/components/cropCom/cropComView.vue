<template>
    <div class="content">
        <!-- <screen-short v-if="screenshotStatus"
                     @destroy-component="destroyComponent"
                     @get-image-data="getImg"
  >    </screen-short> -->
        <div :style="style" ref="divRef" class="img_wrap">
            <img src="../../assets//vue.svg">
            <canvas width="400" height="600" v-show="isShot" ref="canvasRef"></canvas>
        </div>
        {{ `startMoveX:${moveParams.startMoveX}` }} {{ `startMoveY:${moveParams.startMoveY}` }}
        <button @click="handleShot">裁剪</button>
        {{ `startX:${startParams.startX}` }} {{ `startY:${startParams.startY}` }}
        <div> {{ `cutBoxOptions:${cutBoxOptions.leftX}` }} {{ `cutBoxOptions:${cutBoxOptions.leftY}` }}</div>
        <div> {{ `boxParams:${boxParams.startBoxX}` }} {{ `boxParams:${boxParams.startBoxY}` }}</div>
        <div>{{  dropBoxAray[1] }}</div>  
        <div class="a1">
            <div class="a2">
                <div class="select">多好哇的好哇</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dBase from './DefPromise.js'
const isShot = ref(false)
const canvasRef = ref()
const divRef = ref()
const screenshotStatus = ref(false)
const dropBoxAray = ref([])//保存裁剪框8个点得信息以及整个裁剪框位置尺寸信息
const currentOperationBoxItem = ref()//当前正在操作得裁剪矿信息
const boxParams = ref({//
    startBoxX: 0,
    startBoxY: 0,
    width: 0,
    height: 0
})
const currentCtx = ref()
const screenTarget = ref()
const startParams = ref({
    startX: 0,
    startY: 0
})
const cutBoxOptions = ref({
    leftX: 0,
    leftY: 0
})
const moveParams = ref({ //移动参数
    startMoveX: 0,
    startMoveY: 0
})
const cropParams = ref({
    isShowCrop: false,
    isCropDragging: false,
    isCropBoxDragging: false,
    isCutBoxMoving: false,//裁剪框移动状态
})
const mouseX = ref()
const style = ref({})
const mouseY = ref()
const initW = 400;
const initH = 600
const boxSize = 8
let ctx = null;

const drawMasking = () => {
    ctx.clearRect(0, 0, initW, initH)
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,.6)"
    ctx.fillRect(0, 0, initW, initH)
    ctx.restore()
}
const destroyComponent = function (status) {
    screenshotStatus.value = status;
}
// 获取裁剪区域图片信息
const getImg = function (base64) {
    console.log("截图组件传递的图片信息", base64);
}
const createDropBox = (width, height) => {
    // const { startX, startY } = startParams.value
    const { startBoxX: startX, startBoxY: startY } = boxParams.value
    const result = []
    result[0] = {
        x: startX - boxSize / 2,
        y: startY - boxSize / 2,
        width: boxSize,
        height: boxSize,
        index: 1
    }
    result[1] = {
        x: startX - boxSize / 2 + width / 2,
        y: startY - boxSize / 2,
        width: boxSize,
        height: boxSize,
        index: 2
    }
    result[2] = {
        x: startX - boxSize / 2 + width,
        y: startY - boxSize / 2,
        width: boxSize,
        height: boxSize,
        index: 3
    }
    result[3] = {
        x: startX - boxSize / 2,
        y: startY - boxSize / 2 + height / 2,
        width: boxSize,
        height: boxSize,
        index: 4
    }
    result[4] = {
        x: startX - boxSize / 2 + width,
        y: startY - boxSize / 2 + height / 2,
        width: boxSize,
        height: boxSize,
        index: 4
    }
    result[5] = {
        x: startX - boxSize / 2,
        y: startY - boxSize / 2 + height,
        width: boxSize,
        height: boxSize,
        index: 3
    }
    result[6] = {
        x: startX - boxSize / 2 + width / 2,
        y: startY - boxSize / 2 + height,
        width: boxSize,
        height: boxSize,
        index: 2
    }
    result[7] = {
        x: startX - boxSize / 2 + width,
        width: boxSize,
        height: boxSize,
        y: startY - boxSize / 2 + height,
        index: 1
    }
    result[8] = {
        x: startX,
        y: startY,
        width,
        height,
        index: 5
    }
    return result
}
const generatorBox = (mouseX, mouseY, width, height) => {
    ctx.clearRect(0, 0, initW, initH)
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,.6)"
    ctx.fillRect(0, 0, initW, initH)
    ctx.globalCompositeOperation = 'source-atop'
    ctx.clearRect(mouseX, mouseY, width, height)
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#2cabff'
    // console.log('position', mouseX - boxSize / 2, mouseY - boxSize / 2, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2, mouseY - boxSize / 2, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2 + width / 2, mouseY - boxSize / 2, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2 + width, mouseY - boxSize / 2, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2, mouseY - boxSize / 2 + height / 2, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2, mouseY - boxSize / 2 + height, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2 + width, mouseY - boxSize / 2 + height / 2, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2 + width, mouseY - boxSize / 2 + height, boxSize, boxSize)
    ctx.fillRect(mouseX - boxSize / 2 + width / 2, mouseY - boxSize / 2 + height, boxSize, boxSize)
    ctx.restore()
}
//操作裁剪框
const operationDropBox = (currentX, currentY) => {
    if (dropBoxAray.value.length) {
        ctx.fillStyle = '#2cabff'
        let flag = false
        for (let i = 0; i < dropBoxAray.value.length; i++) {
            ctx.beginPath();
            ctx.rect(
                dropBoxAray.value[i].x,
                dropBoxAray.value[i].y,
                dropBoxAray.value[i].width,
                dropBoxAray.value[i].height
            );
            if (ctx.isPointInPath(currentX, currentY)) {
                // console.log(111111, dropBoxAray.value[i].index, dropBoxAray.value)
                currentOperationBoxItem.value = dropBoxAray.value[i]
                flag = true
                switch (dropBoxAray.value[i].index) {
                    case 1:
                        style.value = {
                            cursor: 'nwse-resize'
                        }
                        break;
                    case 2:
                        style.value = {
                            cursor: 'ns-resize'
                        }
                        break;
                    case 3:
                        style.value = {
                            cursor: 'nesw-resize'
                        }
                        break;
                    case 4:
                        style.value = {
                            cursor: 'ew-resize'
                        }
                        break;
                    case 5:
                        style.value = {
                            cursor: 'move'
                        }
                        break;

                    default:
                        style.value = {
                            cursor: 'move'
                        }
                }
            }
            ctx.closePath();
            if (!flag) {
                style.value = {
                    cursor: 'default'
                }
                currentOperationBoxItem.value = null
            }
        }

        if (currentOperationBoxItem.value && currentOperationBoxItem.value.index === 5 && cropParams.value.isCutBoxMoving) {
            const { width, height } = boxParams.value
            const { leftX, leftY } = cutBoxOptions.value
            const { startMoveX, startMoveY } = moveParams.value
            const diffX = currentX - startMoveX
            const diffY = currentY - startMoveY
            let moveX = diffX, moveY = diffY
            boxParams.value.startBoxX = leftX + moveX
            boxParams.value.startBoxY = leftY + moveY
            console.log('movedrag', moveX, moveY, diffX, diffY)
            dropBoxAray.value = createDropBox(width,height)
            generatorBox(leftX + moveX, leftY + moveY, width, height)
            

        }
    }
}
const mouseDownEvent = (e) => {
    const { offsetX, offsetY } = e

    if (currentOperationBoxItem.value) {
        cropParams.value.isCutBoxMoving = true
        cropParams.value.isCropDragging = false
        moveParams.value.startMoveX = offsetX
        moveParams.value.startMoveY = offsetY

    } else {
        //记录裁剪框初始位置
        startParams.value.startX = offsetX;
        startParams.value.startY = offsetY
        boxParams.value.startBoxX = offsetX;
        cropParams.value.isCropDragging = true
        boxParams.value.startBoxY = offsetY

    }
}
const mouseMoveEvent = e => {
    console.log('e',e.offsetX,e.offsetY)
    const { isCropDragging, isCutBoxMoving } = cropParams.value
    const { startX, startY } = startParams.value
    const { offsetX, offsetY } = e
    const tempWidth = offsetX - startX;
    const tempHeight = offsetY - startY
    operationDropBox(offsetX, offsetY)
    if (!isCropDragging || isCutBoxMoving) return
    generatorBox(startX, startY, tempWidth, tempHeight)

}

//鼠标抬起
const mouseUpEvent = e => {
    const { isCropDragging, isCutBoxMoving } = cropParams.value
    const { startX, startY } = startParams.value
    const { offsetX, offsetY } = e
    const tempWidth = offsetX - startX;
    const tempHeight = offsetY - startY
    if (isCropDragging) {
        cutBoxOptions.value.leftX = startX
        cutBoxOptions.value.leftY = startY
        //记录裁剪框初始位置
        boxParams.value.width = tempWidth
        boxParams.value.height = tempHeight
        dropBoxAray.value = createDropBox(tempWidth, tempHeight)
    } else if (isCutBoxMoving) {
        cutBoxOptions.value.leftX = boxParams.value.startBoxX
        cutBoxOptions.value.leftY = boxParams.value.startBoxY
 
    }
    cropParams.value.isCropDragging = false
    cropParams.value.isCutBoxMoving = false
}

onMounted(() => {
    let canvas = canvasRef.value
    ctx = canvas.getContext('2d')
    canvas.addEventListener('mousedown', mouseDownEvent)
    canvas.addEventListener('mousemove', mouseMoveEvent)
    canvas.addEventListener('mouseup', mouseUpEvent)
    const db = new dBase()
    db.getItem()
})
const handleShot = () => {
    isShot.value = true
    mouseX.value = 100
    mouseY.value = 150
    drawMasking()
}
</script>

<style lang="less" scoped>
.a1:has(.select) {
    padding: 30px;
}

.content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

}

.img_wrap {
    width: 400px;
    height: 600px;
    position: relative;
    border: 1px solid #000;

    img {
        width: 100%;
        height: 100%;
    }

    canvas {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    }
}
</style>