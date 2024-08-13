<template>
  <div class="view_wrap">
    <div class="view_content" :style="{height:'400%'}" ref="divRef" >
     <div class="item" :style="{ background: getGb() }">
        <div class="square box wow slideInLeft" ></div>
     </div>
     <div class="item" :style="{background:getGb()}">
        <div class="circle box wow slideInLeft" ></div>
     </div>
     <div class="item" :style="{background:getGb()}">
        <div class="line box wow slideInLeft" ></div>
     </div>
     <div class="item" :style="{background:getGb()}">
        <div class="dotted box wow slideInLeft" ></div>
     </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ScrollReveal from 'scrollreveal'
import  WOW  from 'wow.js'
import { RandomColorGenerator } from 'random-color-creator'
const getGb = () => {
  return  RandomColorGenerator({ format: 'HEX' })
}
const items = ref<any>([])
const index = ref<number>(0)
const canScroll = ref<boolean>(true)
const divRef=ref()
onMounted(() => {
  //   var wow = new WOW({
  //     boxClass: "wow", // animated element css class (default is wow)
  //     animateClass: "animated", // animation css class (default is animated)
  //     offset: 0, // distance to the element when triggering the animation (default is 0)
  //     mobile: true, // trigger animations on mobile devices (default is true)
  //     live: true, // act on asynchronously loaded content (default is true)
  //     callback: function () {
  //       // the callback is fired every time an animation is started
  //       // the argument that is passed in is the DOM node being animated
  //     },
  //     scrollContainer: null, // optional scroll container selector, otherwise use window,
  //     resetAnimation: true, // reset animation on end (default is true)
  //   });
  // wow.init()
    ScrollReveal().reveal('.box', {
    reset: true,
    distance: '50px',
    origin: 'left',
    interval: 80,
    opacity: 1,
    rotate: {
      x: 20,
      z: 20
    },
    scale: 0.6
  })
   document.addEventListener('wheel',handleWheel,{ passive: false }) 
})
// const changePageIndex = (idx: number) => {
//   if (canScroll.value) {
//     return
//   }
//   canScroll.value=true
//   if (idx && canScroll.value) {
//        index.value=idx
//   }
//   setTimeout(() => {
//     canScroll.value = false
//   },5000)
// }
const scrollUp = () => {
  if (canScroll.value && index.value > 0) {
    index.value -= 1
     scrollToPage()
  } else if(index.value<=0) {
     index.value=0
  }
}
const scrollDown = () => {
  console.log('down')
    if (canScroll.value && index.value <3 ) {
    index.value += 1
     scrollToPage()
  } else if(index.value===3) {
     index.value=3
  }
}
const scrollToPage = () => {
  console.log('divRef',divRef)
  divRef.value.style.top = `-${index.value}00vh`
  canScroll.value = false
  setTimeout(() => {
    canScroll.value=true
  },500)
}
const handleWheel = (e: any) => {

  console.log(e.deltaY)
    if (e.deltaY > 0) {
        scrollDown()
  } else {
    scrollUp()
    }
  e.preventDefault();
    
}
// for (let i = 1; i <= 100; i++) {
//   items.value.push({
//     id: i,
//     bgColor: RandomColorGenerator({ format: 'HEX' })
//   })
// }

// onMounted(() => {
//   ScrollReveal().reveal('.box', {
//     reset: true,
//     distance: '50px',
//     origin: 'left',
//     interval: 80,
//     opacity: 1,
//     rotate: {
//       x: 20,
//       z: 20
//     },
//     scale: 0.6
//   })
// })
</script>

<style lang="less" scoped>
.view_wrap{
  width:100vw;
   position:relative;
   height:100vh;
  .item{
    height:100vh;
    width:100vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .view_content{
    width:100vw;
    height:100vh;
    position: absolute;
    transition: top .5s ease-in-out;
    left:0;
    top:0;
  }
  .box{
    display: block;
    background:#fff;
  }
  .square{
     width:200px;
     height:200px;
  }
  .circle{
    width:200px;
    height:200px;
    border-radius: 50%;
  }
  .line{
    width:200px;
    height:50px;
    border-radius: 10px;
  }
  .dotted{
    width:0;
    background:transparent;
    border-right: 60px solid transparent;
    border-left:60px solid transparent;
     border-top:100px solid transparent;
      border-bottom:100px solid #fff;
  }
}
</style>

