<!-- <template>
     <div class="wrap" >
       <div class="box">
        <div class="col">
            <div class="element">
                <div class="mask">
                </div>
            </div>
        </div>
        <div class="col">
            <div class="element">
                <div class="mask"></div>
            </div>
        </div>
        <div class="col">
            <div class="element">
                <div class="mask"></div>
            </div>
        </div>
        <div class="col">
            <div class="element">
                <div class="mask"></div>
            </div>
        </div>
        <div class="col">
            <div class="element">
                <div class="mask"></div>
            </div>
        </div>
        <div class="col">
            <div class="element">
                <div class="mask"></div>
            </div>
        </div>
        <div class="col">
            <div class="element">
                <div class="mask"></div>
            </div>
        </div>
        <div class="col">
            <div class="element">
                <div class="mask"></div>
            </div>
        </div>
   
    </div>
    
    </div>
</template>

<script setup >
import { onMounted } from 'vue';
onMounted(() => {
  var elements = document.getElementsByClassName("element");
  document.addEventListener("mousemove", function (event) {
    // 获取鼠标位置
    var mouseX = event.pageX;
    var mouseY = event.pageY;

    // 遍历元素并输出距离鼠标的坐标
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
      var rect = element.getBoundingClientRect();

        var elementX = rect.left + window.scrollX;
        var elementY = rect.top + window.scrollY
        var distanceX = mouseX - elementX;
        var distanceY = mouseY - elementY;
        // 将距离值设置到每一个卡片元素上面
        element.style.setProperty('--x', distanceX + 'px');
        element.style.setProperty('--y', distanceY + 'px');
    }
});

})
</script>

<style lang="less"  scoped>
.wrap{
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
}

.col {
    width: calc((100% - 4 * 20px) / 4);
    height: 180px;
    padding: 10px;
}
.element {
    background: #172033;
    height: 100%;
    position: relative;
    border-radius: 10px;
}
.element::before {
        content: '';
        position: absolute;
        width: calc(100% + 3px);
        height: calc(100% + 3px);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        background: radial-gradient(200px circle at var(--x) var(--y),#00DC82 0,transparent 100%);;
    }
.element .mask {
    position: absolute;
    inset: 3px;
    z-index:1;
    background: #172033;
    border-radius: 10px;

}
</style> -->
<template>
  <div class="clearfix">
    <a-upload
      v-model:file-list="fileList"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      list-type="picture-card"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < 8">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script setup>
import { ref,onMounted } from 'vue';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const fileList = ref([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-3',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-4',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-xxx',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-5',
    name: 'image.png',
    status: 'error',
  },
]);
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
</script>
<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>