
// 根据缩放比调整 step
const getStep = (scale,frameStep)  => {
    return scale > 60 ? frameStep : 10;
};
/**
 *  时间格式化
 * */
export function formatTime(time) {
    let second = Math.ceil(time / 1000);
    const s = second % 60;
    second = Math.floor(second / 60);
    const m = second % 60;
    second = Math.floor(second / 60);
    const h = second % 60;
    return {
        s,
        m,
        h,
        str: `${h === 0 ? '' : `${h < 10 ? '0' : ''}${h}:`}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
    };
}
// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale) => {
    const scaleNum = new Map([
        // 切换比例：最小单位为帧
        [100, 80],
        [90, 50],
        [80, 20],
        [70, 10],
        // 切换比例：最小单位为秒
        [60, 80],
        [50, 40],
        [40, 20],
        [30, 10],
        // 切换比例：最小单位为6秒 一大格为 1分钟
        [20, 40],
        [10, 25],
        [0, 10]
    ]);
    return scaleNum.get(scale) || 100;
};
export const getCoverWidth = (scale,second) => {
        const scaleWidth = new Map([
        // 切换比例：最小单位为帧
        [100, 80*second],
        [90, 50*second],
        [80, 20*second*30],
        [70, 10*second*30],
        // 切换比例：最小单位为秒
        [60, 80*second],
        [50, 40*second],
        [40, 20*second],
        [30, 10*second],
        // 切换比例：最小单位为6秒 一大格为 1分钟
        [20, 40*second/6],
        [10, 25*second/6], 
        [0, 10*second/6]
        ]);
    return scaleWidth.get(scale);
}

const getShortText = (count, step, scale) => {
    const index = count % step;
    let text = '';
    if (scale < 70) { // 一个单元格为 1 秒钟
        return '';
    } else { // 一个单元格为 1 帧
        text = scale > 80 ? (index === 0 ? '' : `${index < 10 ? '0' : ''}${index}f`) : '';
    }
    return text;
};
// 转换时间格式
export const getLongText = (count, scale) => {
    let time = count; // 一个大单元格为 1 秒
    if (scale < 30) { // 一个单元格为 1 分钟
        time *= 60;
    } else if (scale < 70) { // 一个大单元格为 10 秒
        time *= 10;
    }
    return formatTime(time * 1000).str;
};
const lineWidth = 0.5; // 线条宽度
/**
 * 时间轴画线
 * */
export const drawTimeLine = (context,userConfigs,canvasConfigs) => {
    const { start, scale, step:frameStep, focusPosition } = userConfigs
    const { ratio, bgColor, width, height, textColor, subTextColor, textSize, textScale, focusColor, longColor, shortColor } = canvasConfigs;
    const step = getStep(scale, frameStep)
    //初始化画布
    context.scale(ratio, ratio)
    context.clearRect(0, 0, width, height)
    //1.时间轴底色
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height)
    //计算网格
    const gridSizeS = getGridSize(scale)//匹配当前缩放下每小格宽度
    const gridSizeB = gridSizeS * step//根据步进与小格宽度计算每大格宽度
    console.log('gridSizeS',gridSizeS,gridSizeB)
    const startValueS = Math.floor(start / gridSizeS) * gridSizeS// 小格绘制起点的刻度(start 向下取 gridSizeS 的整数倍)
    const startValueB = Math.floor(start / gridSizeB) * gridSizeB//// 大格绘制起点的刻度(start 向下取 gridSizeB 的整数倍)
    
    const offsetXS = (startValueS - start); // 小格起点刻度距离原点(start)的px距离
    const offsetXB = (startValueB - start); // 大格起点刻度距离原点(start)的px距离
    const endValue = start + Math.ceil(width)// 终点刻度(略超出标尺宽度即可)
    
    
    // 4. 初始化刻度和文字画笔
    context.beginPath(); // 一定要记得开关路径
    context.fillStyle = textColor;
    context.strokeStyle = longColor;
      /**
     * 5. 长间隔和文字
     * 长间隔和短间隔需分开两次绘制，才可以完成不同颜色的设置；
     * 分开放到两个for循环是为了节省性能，因为如果放到一个for循环的话，每次循环都会重新绘制操作dom
     *
     * */
    for (let value = startValueB, count = 0; value < endValue; value += gridSizeB, count++){
        const x = offsetXB + count * gridSizeB + lineWidth;
        context.moveTo(x, 0,)
        context.save()
        //文字绘制在刻度稍微靠右下一点，所以移动以下中心轴
        context.translate(x, height * 0.4)
        //    context.scale(textScale / ratio, textScale / ratio);
        // console.log('value',value,value / gridSizeB)
        const text = getLongText(value / gridSizeB, scale)
        const textPositionX = text.length  * textScale * ratio//文字长度的一半
        const textPositionY = ((textSize / ratio * textScale / ratio) /2); // 文字高度的一半
        context.fillText(text, textPositionX, textPositionY)
        context.restore()
        context.lineTo(x,height*10/16/ratio)
    }
    context.stroke()
    context.closePath()

    // 6. 短间隔和文字 只在特殊放大倍数下显示文字
     context.beginPath();
    context.fillStyle = subTextColor;
    context.strokeStyle = shortColor;
    for (let value = startValueS, count = 0; value < endValue; value += gridSizeS, count++){

        const x = offsetXS + count * gridSizeS + lineWidth;
        context.moveTo(x, 0)
        const text = getShortText(value / gridSizeS, step, scale)
        if (text) {
            context.save()
            context.translate(x, height * 0.4)
            // context.scale(textScale / ratio, textScale / ratio);
                  const textPositionX = text.length  * textScale * ratio; // 文字长度的一半
            const textPositionY = ((textSize / ratio * textScale / ratio) / 2); // 文字高度的一半
                  context.fillText(text, textPositionX, textPositionY);
            context.restore();
        }
        if (value % gridSizeB !== 0) {
            context.lineTo(x,height/3/ratio)
        }
    }
    context.stroke()
    context.closePath()

}


// 获取当前scale下的单元格像素
export const getGridPixel = (scale, frameCount) => {
    let gridPixel = getGridSize(scale);
    let trackWidth = gridPixel * frameCount;
    // console.log('trackWidth',trackWidth) 
    if (scale < 70) { // 1秒一格
        trackWidth = trackWidth / 30;
    }
    if (scale < 30) { // 6秒一格
        trackWidth = trackWidth / 6;
    }
            // console.log('trackWidthtrackWidth', trackWidth);
    return trackWidth;
};

// 获取选中点的帧坐标
export const getSelectFrame = (offsetX, scale, frameStep) => {

    const size = getGridSize(scale);
        console.log('-----------------', scale,size);
    if (scale < 70) { // 一个单元格为 1 秒
        offsetX *= frameStep;
    }
    if (scale < 30) { // 一个单元格为 6 秒
        offsetX *= 6;
    }
    console.log('Math.floor(offsetX / size) + (scale < 70 ? 0 : 1)', offsetX, size, scale, Math.floor(offsetX / size) + (scale < 70 ? 0 : 1));
    return Math.floor(offsetX / size) + (scale < 70 ? 0 : 1);
};

