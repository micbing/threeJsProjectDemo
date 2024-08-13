<template>
    <div>
        <a-button >获取ref</a-button>
        <sTable @contextMenuClickEvent="contextMenuClickEvent" :table-options="tableOptions">
            <vxe-column :edit-render="{}" v-for="(item, index) in tableOptions.columns" :key="item.field" :field="item.field"
                :title="item.title" :width="item.width">
                <template #default="{ row }">
                    <span>{{ row[item.field] }}</span>
                </template>
                <template #edit="{ row }">
                    <a-form  :model="row" :ref="(el)=>setRef(el,index)">
                        <a-form-item v-if="item.field==='name'" :rules="[{ required: true, message: '请输入姓名' }]" :name="item.field">
                            <a-input @change="()=>getRef(index)" v-model:value="row[item.field]"></a-input>
                        </a-form-item>
                        <a-form-item v-else-if="item.field==='age'" :rules="[{ required: true, message: '请选择年龄' }]" :name="item.field">
                            <a-select :getPopupContainer="triggerNode => triggerNode.parentNode"
                               style="width:100%" v-model:value="row[item.field]"
                                placeholder="默认尺寸">
                                <a-select-option v-for="num in 15" :key="num" :value="num"
                                    :label="`${num}`"></a-select-option>
                            </a-select>
                        </a-form-item>

                    </a-form>


                </template>
            </vxe-column>
        </sTable>
    </div>
</template>

<script setup>
import sTable from './sTableView.vue'
import { ref } from 'vue'
const refMap=ref(new Map())
const setRef = (el,index) => {
    if (el&&!refMap.value.has(`formRef${index}`)) {
        refMap.value[`formRef${index}`]=el
    }
}
const getRef = (index) => {
    console.log(111,refMap.value[`formRef${index}`])
}
const validRules = ref({
    name: [{
        trigger: 'change',
        validator({ cellValue }) {
            console.log('cellval', cellValue)
            return new Promise((resolve, reject) => {
                if (cellValue && cellValue.length < 3) {
                    reject(new Error('输入长度小于3'))
                } else {
                    resolve(true)
                }
            })
        }
    }]
})
const tableOptions = {
    columns: [
        { width: 100, field: "id", title: "#", align: "left", fixed: 'left' },
        { width: 250, field: "name", title: "姓名", align: "left", fixed: 'left' },
        { width: 400, field: "age", title: "年龄", align: "left" },
        { width: 400, field: "sex", title: "性别", align: "left" },
        { width: 100, field: "job", title: "岗位", align: "left", fixed: 'right' },
        { width: 100, field: "address", title: "地址", align: "left", fixed: 'right' }
    ],
    data:new Array(1000).fill().map((item,index)=>( { id: index, name: "张三"+index, age: 30+index, sex: "男"+index, job: "前端"+index, address: "中国xxxxxxxxxx" })) ,
    scrollY:{enabled:true,gt:100},
    // editRules:validRules.value,
    menuConfig: {
        className: 'menu_class',
        body: {
            options: [
                [
                    { code: 'copy', name: '复制 Ctrl+C', disabled: false },
                    { code: 'reload', name: '粘贴 Ctrl+V', disabled: false },
                ]
            ]
        },
        visibleMethod({ options, column }) {
            // const [rowData, columnData] = toolbarButtonClickEvent({ code: 'getcellselctdata' })
            // return rowData.length > 1 || columnData.length > 1 ? false : true
            return true
        }
    }
}
//右键菜单点击事件
const contextMenuClickEvent = ({ menu, row, column }) => {
    console.log(111, menu, row, column)
    const $table = xGrid.value
    if ($table) {
        switch (menu.code) {
            case 'copy':
                if (XEClipboard.copy(row[column.field])) {
                    VXETable.modal.message({ content: '已复制到剪贴板！', status: 'success' })
                }
                break
            case 'reload':
                break
        }
    }
}
</script>

<style scoped></style>