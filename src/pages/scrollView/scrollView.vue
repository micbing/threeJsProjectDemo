<template>
    <div class="wrap">
        <div class="rev">哈哈哈哈哈第一屏</div>
         <div class="rev">耶耶耶耶耶第二屏</div>
          <div class="rev">嘻嘻嘻嘻嘻第三屏</div>
           <div class="rev">哦哦哦哦哦哦哦哦哦第四屏</div>
            <div class="rev">哇哇哇哇哇哇第五屏</div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import scrRev from '../../utils/index'
onMounted(() => {
    const list = document.querySelectorAll('.rev')
   scrRev(list)
})
</script>

<style lang="less" scoped>
.wrap{
    height:100%;
    width:100%;
    overflow: scroll;
    div{
        height:100%;
        width:100%;
        display: flex;
        align-items: center;
        font-size:24px;
        justify-content: center;
        // text-align: center;
    }
    div:first-child{
        background:rgba(255,0,0,.3)
    }
     div:nth-child(2){
        background:rgba(255,255,0,.3)
    }
     div:nth-child(3){
        background:rgba(255,255,255,.3)
    }
     div:nth-child(4){
        background:rgba(111,111,0,.3)
    }
     div:nth-child(5){
        background:rgba(134,231,132,.3)
    }
}
</style>