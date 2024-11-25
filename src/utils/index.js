import scrollReveal from 'scrollreveal';

const sr = scrollReveal();

// 动画默认配置
const config = {
  // 动画的时长
  duration: 800,

  // 延迟时间
  delay: 100,

  // 动画开始的位置，'bottom', 'left', 'top', 'right'
  origin: 'bottom',

  // 回滚的时是否再次触发动画
  reset: true,

  // 延时执行方式（always（一直延时执行），once（只延时执行一次），onload（只在加载时延时执行））
  useDelay: 'always',

  // 在移动端是否使用动画
  mobile: true,
  // 初始距离视图的位置，单位：%，rem等，例：50% 10px 1rem
  distance: '30px',

  // 初始透明度 -> 0-1
  opacity: 0,

  // 执行速度 线性函数啥的
  //  例：cubic-bezier(0.5, 0, 0, 1)|ease-in-out|ease-in|ease
  easing: 'ease-in-out',

  // 旋转的xyz参数 酷炫的样式主要修改此参数
  rotate: { x: 0, y: 0, z: 0 },

  // 执行方式（缩放）-> 0-1
  scale: 0.9,
};

const scrRev = (el, srConfig = config) => {
  sr.reveal(el, srConfig);
};
// 导出
export default scrRev;