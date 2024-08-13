<template>
  <div>
    <!-- 正常区域的框 -->
    <div class="vxe-table--cell-area" ref="cellarea">
      <span class="vxe-table--cell-main-area"></span>
      <span class="vxe-table--cell-active-area"></span>
    </div>
    <!-- 左侧fixed区域的框 -->
    <div class="vxe-table--cell-area" ref="leftfixedcellarea">
      <span class="vxe-table--cell-main-area"></span>
      <span class="vxe-table--cell-active-area"></span>
    </div>
    <!-- 右侧fixed区域的框 -->
    <div class="vxe-table--cell-area" ref="rightfixedcellarea">
      <span class="vxe-table--cell-main-area"></span>
      <span class="vxe-table--cell-active-area"></span>
    </div>

    <vxe-table :menu-config="menuConfig" ref='xGrid' v-bind="options" height="500px"
      @menu-click="contextMenuClickEvent">
      <slot></slot>

    </vxe-table>
  </div>
</template>
 
<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick,defineProps,computed } from 'vue'
import { VxeTablePropTypes, VxeTableEvents, VXETable } from 'vxe-table'
import XEClipboard from 'xe-clipboard'
let gridOptions = reactive<any>({
  //列配置 (使用列拖拽功能,必须配置useKey为true)
  columnConfig: { resizable: false, useKey: true },
  //边框
  border: "full",
  //斑马纹
  stripe: true,
  //列信息
  columns: [//列总宽度为1500
    { width: 100, field: "id", title: "#", align: "left", fixed: 'left' },
    { width: 250, field: "name", title: "姓名123", align: "left", fixed: 'left' },
    { width: 400, field: "age", title: "年龄", align: "left" },
    { width: 400, field: "sex", title: "性别", align: "left" },
    { width: 100, field: "job", title: "岗位", align: "left", fixed: 'right' },
    { width: 100, field: "address", title: "地址", align: "left", fixed: 'right' }
  ],
  //数据
  data: [
    { id: 1, name: "张三", age: 30, sex: "男", job: "前端", address: "中国xxxxxxxxxx" },
    { id: 2, name: "李四", age: 30, sex: "男", job: "后端", address: "中国xxxxxxxxxx" },
    { id: 3, name: "王五", age: 30, sex: "女", job: "运维", address: "中国xxxxxxxxxx" },
    { id: 4, name: "赵六", age: 30, sex: "男", job: "美工", address: "中国xxxxxxxxxx" },
    { id: 5, name: "老八", age: 30, sex: "男", job: "项目经理", address: "中国xxxxxxxxxx" },
    { id: 6, name: "桀桀", age: 30, sex: "女", job: "售后", address: "中国xxxxxxxxxx" },
    { id: 7, name: "张三", age: 30, sex: "男", job: "前端", address: "中国xxxxxxxxxx" },
    { id: 8, name: "李四", age: 30, sex: "男", job: "后端", address: "中国xxxxxxxxxx" },
    { id: 9, name: "王五", age: 30, sex: "女", job: "运维", address: "中国xxxxxxxxxx" },
    { id: 10, name: "赵六", age: 30, sex: "男", job: "美工", address: "中国xxxxxxxxxx" },
    { id: 11, name: "老八", age: 30, sex: "男", job: "项目经理", address: "中国xxxxxxxxxx" },
    { id: 12, name: "桀桀", age: 30, sex: "女", job: "售后", address: "中国xxxxxxxxxx" },
    { id: 13, name: "张三", age: 30, sex: "男", job: "前端", address: "中国xxxxxxxxxx" },
    { id: 14, name: "李四", age: 30, sex: "男", job: "后端", address: "中国xxxxxxxxxx" },
    { id: 15, name: "王五", age: 30, sex: "女", job: "运维", address: "中国xxxxxxxxxx" },
    { id: 16, name: "赵六", age: 30, sex: "男", job: "美工", address: "中国xxxxxxxxxx" },
    { id: 17, name: "老八", age: 30, sex: "男", job: "项目经理", address: "中国xxxxxxxxxx" },
    { id: 18, name: "桀桀", age: 30, sex: "女", job: "售后", address: "中国xxxxxxxxxx" },
    { id: 19, name: "张三", age: 30, sex: "男", job: "前端", address: "中国xxxxxxxxxx" },
    { id: 20, name: "李四", age: 30, sex: "男", job: "后端", address: "中国xxxxxxxxxx" },
    { id: 21, name: "王五", age: 30, sex: "女", job: "运维", address: "中国xxxxxxxxxx" },
    { id: 22, name: "赵六", age: 30, sex: "男", job: "美工", address: "中国xxxxxxxxxx" },
    { id: 23, name: "老八", age: 30, sex: "男", job: "项目经理", address: "中国xxxxxxxxxx" },
    { id: 24, name: "桀桀", age: 30, sex: "女", job: "售后", address: "中国xxxxxxxxxx" },
  ],
  //这里一定要指定true，否则rowConfig的height没用
  showOverflow: true,
  //行配置,这里的行高一定需要指定
  rowConfig: { isCurrent: false, height: 35, isHover: true },

  editConfig: { trigger: 'click', mode: 'cell' }
})
const props = defineProps({
  tableOptions: {
    type: Object,
    default:()=>({})
  }
})
const options = computed(() => {
  return {
    ...gridOptions,
    ...props.tableOptions
  }
})
const menuConfig = reactive<VxeTablePropTypes.MenuConfig>({
  className: 'menu_class',
  body: {
    options: [
      [
        { code: 'copy', name: '复制 Ctrl+C', disabled: false },
        { code: 'reload', name: '粘贴 Ctrl+V', disabled: false },
        // { code: 'insertAt', name: '插入', disabled: false },
        // { code: 'remove', name: '删除', disabled: false },
        // { code: 'save', name: '保存', prefixIcon: 'vxe-icon-save', disabled: false }
      ]
    ]
  },
  visibleMethod({ options, column }) {
    const [rowData, columnData] = toolbarButtonClickEvent({ code: 'getcellselctdata' })
    return rowData.length > 1 || columnData.length > 1 ? false : true
  }
})
//#region 以下是鼠标选中功能


//鼠标滑动选中
let isSelecting = ref(false) // 是否正在进行选择操作,默认为false
let selectionStart = reactive({ rowIndex: -1, cellIndex: -1 }) // 选择操作起始单元格位置
let selectionEnd = reactive({ rowIndex: -1, cellIndex: -1 }) // 选择操作结束单元格位置
const handleChange = e => {
  console.log(e)
}
onMounted(() => {
  // addListener()
  // window.addEventListener('click', mouseClick)
  // window.addEventListener('mousedown', mouseDown)
  // window.addEventListener('mouseup', mouseUp)
  // window.addEventListener('mousemove',mouseMove)
})
const mouseDown = () => {
  console.log('鼠标按下')
}
const mouseUp = () => {
  console.log('鼠标抬起')
}
const mouseMove = () => {
  console.log('鼠标移动')
}
const mouseClick = () => {
    console.log('鼠标点击')
}
//获取页面ref节点
//获取vxetable表格节点
let xGrid = ref()
let cellarea = ref()
let leftfixedcellarea = ref()
let rightfixedcellarea = ref()

//返回table的ref名称
const getTablexGrid = () => {
  return xGrid.value
}
//右键菜单点击事件
const contextMenuClickEvent: VxeTableEvents.MenuClick = ({ menu, row, column }) => {
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

//添加事件
const addListener = () => {
  //添加多选列
  nextTick(() => {
    window.addEventListener("mousedown", tableOutDestroyAreaBox)//给window添加鼠标按下事件,判断是否在表格外,是销毁
    window.addEventListener("mouseup", tbodymouseup)//给window添加鼠标松开事件
    let tbody = document.querySelector(".vxe-table--main-wrapper table tbody") as HTMLElement//获取tbody区域

    if (tbody) {
      tbody.addEventListener("mousedown", tbodymousedown)//给表格中的tbody添加鼠标按下事件
      tbody.addEventListener("mousemove", tbodymousemove)//给表格中的tbody添加鼠标移动事件
      tbody.addEventListener("mouseout", throttle(tbodymouseout, 50))//给表格中的tbody添加鼠标移出事件
      tbody.addEventListener("click", tableCellClick)//添加左键单击事件
      tbody.oncontextmenu = tableCellMenuClick//添加右键菜单事件
    }

    let bodyWrapper = document.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper")//获取正常区域的body
    if (bodyWrapper) {
      //注意这里的ref名称，这里是非fixed区域的框的名称
      bodyWrapper.appendChild(cellarea.value)//添加范围框元素
    }
    setTimeout(() => {
      //#region 左侧固定列
      let leftfixedtbody = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-left-wrapper .vxe-table--body-wrapper table tbody") as HTMLElement//获取fixedtbody区域

      if (leftfixedtbody) {
        leftfixedtbody.addEventListener("mousedown", tbodymousedown)//给表格中的leftfixedtbody添加鼠标按下事件
        leftfixedtbody.addEventListener("mousemove", tbodymousemove)//给表格中的leftfixedtbody添加鼠标移动事件
        leftfixedtbody.addEventListener("mouseout", throttle(tbodymouseout, 50))//给表格中的leftfixedtbody添加鼠标移出事件
        leftfixedtbody.addEventListener("click", tableCellClick)//添加单击事件
        leftfixedtbody.oncontextmenu = tableCellMenuClick//添加右键菜单事件
      }

      let leftFixedBodyWrapper = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-left-wrapper .vxe-table--body-wrapper")
      if (leftFixedBodyWrapper) {
        //注意这里的ref名称，这里是fixed区域的框的名称
        leftFixedBodyWrapper.appendChild(leftfixedcellarea.value)
      }
      //#endregion

      //#region 右侧固定列
      let rightfixedtbody = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-right-wrapper .vxe-table--body-wrapper table tbody") as any//获取fixedtbody区域

      if (rightfixedtbody) {
        rightfixedtbody.addEventListener("mousedown", tbodymousedown)//xGrid$el给表格中的rightfixedtbody添加鼠标按下事件
        rightfixedtbody.addEventListener("mousemove", tbodymousemove)//给表格中的rightfixedtbody添加鼠标移动事件
        rightfixedtbody.addEventListener("mouseout", throttle(tbodymouseout, 50))//给表格中的rightfixedtbody添加鼠标移出事件
        rightfixedtbody.addEventListener("click", tableCellClick)//添加单击事件
        rightfixedtbody.oncontextmenu = tableCellMenuClick//添加右键菜单事件
      }

      let rightFixedBodyWrapper = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-right-wrapper .vxe-table--body-wrapper")
      if (rightFixedBodyWrapper) {
        //注意这里的ref名称，这里是fixed区域的框的名称
        rightFixedBodyWrapper.appendChild(rightfixedcellarea.value)
      }
      //#endregion

    }, 100)

  })
}

//鼠标按下事件
const tbodymousedown = (event: MouseEvent) => {
  event.stopPropagation()//阻止冒泡
  getTablexGrid().closeMenu()//手动关闭右键菜单
  //左键0,中键1,右键2
  if (event.button === 0) {//左键按下
    // 记录选择操作起始位置
    selectionStart = getCellPosition(event.target)//设置选择操作起始单元格位置

    isSelecting.value = true//标记为正在选择操作
  }
}


//鼠标移动事件
//todo 这里要节流操作,只在结束时触发一次
const tbodymousemove = (event: MouseEvent) => {
  if (event.button === 0) {//左键移动
    if (!isSelecting.value) return//如果当前非正在选择操作,直接退出
    //记录选择操作结束位置
    selectionEnd = getCellPosition(event.target)
    if (selectionEnd.cellIndex !== selectionStart.cellIndex) return

    //设置样式,并显示范围框
    setselectedCellArea()

  }
  event.preventDefault()
}

//鼠标按键结束事件,添加在了window中
const tbodymouseup = (event: MouseEvent) => {
  if (event.button === 0) {//左键松开
    isSelecting.value = false//标记为停止选择操作
  }
}

let outevent = ref()//移动事件,不保存,循环定时器内无法监听到新的事件

//鼠标移出表格事件,只在移动的时候会触发,暂停移动不触发
const tbodymouseout = (event: MouseEvent) => {
  outevent.value = event//保存移动事件

  if (isSelecting.value) {//如果正在执行选中操作
    const timer = setInterval(() => {//开启循环定时器
      if (isSelecting.value) {//判断当前是否正在选择
        //获取表格元素
        var table = document.querySelector(".vxe-table--body-wrapper table") as any//获取非固定列(和固定列)的table元素
        if (outevent.value.clientX > table.parentElement.getBoundingClientRect().right - 30) {//判断鼠标x轴是否超出表格右侧,向右滚动
          var maxScrollPosition = table.parentElement.scrollWidth - table.parentElement.clientWidth//获取滚动条最大位置
          if (table.parentElement.scrollLeft < maxScrollPosition) {//如果没到滚动条最大位置,执行滚动
            table.parentElement.scrollLeft += 10//执行水平滚动条向右滚动
          }
        } else if (outevent.value.clientX < table.parentElement.getBoundingClientRect().left + 30) {//判断鼠标x轴是否超出表格左侧,向左滚动
          if (table.parentElement.scrollLeft > 0) {//如果没到滚动条最大位置,执行滚动
            //鼠标移出表格，滚动水平滚动条
            table.parentElement.scrollLeft -= 10//执行水平滚动条向右滚动
          }
        }


      } else {
        clearInterval(timer)//清除循环定时器
      }
    }, 200)//这里设置滑动速度

  }

}

//节流函数,todo//改为全局
const throttle = (fn: Function, delay: number) => {
  const canRun = ref(true)
  return (...args: any[]) => {
    if (!canRun.value) return
    canRun.value = false
    setTimeout(() => {
      fn(...args)
      canRun.value = true
    }, delay)
  }
}

// 获取单元格位置(rowIndex, cellIndex)
const getCellPosition = (cell: any) => {


  while (cell.tagName !== 'TD') {//将cell指向TD元素
    cell = cell.parentElement
  }

  let visibleColumn = getTablexGrid().getTableColumn().visibleColumn//获取处理条件之后的全量表头列

  const cellIndex = visibleColumn.findIndex((col: { id: any; }) => {//返回colid相等的visibleColumn全量表头列的索引
    return col.id == cell.getAttribute("colid")
  })

  let visibleData = getTablexGrid().getTableData().visibleData//获取处理条件之后的全量表体数据
  const rowIndex = visibleData.findIndex((row: { _X_ROW_KEY: any; }) => {//返回rowid相等的visibleData全量表体数据
    return row._X_ROW_KEY == cell.parentElement.getAttribute("rowid")//返回rowid相等的visibleData全量表体数据的索引
  })
  return { rowIndex, cellIndex }

}

//设置框打开
const setselectedCellArea = () => {

  var activeElement = document.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-active-area")//正常区域选中边框激活的元素(仅是边框)
  var mainElement = document.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-main-area")//正常区域选中边框内整个范围的元素

  var leftFixedActiveElement = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-left-wrapper .vxe-table--body-wrapper .vxe-table--cell-active-area")//左侧固定列选中边框激活的元素(仅是边框)
  var leftFixedMainElement = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-left-wrapper .vxe-table--body-wrapper .vxe-table--cell-main-area")//左侧固定列选中边框内整个范围的元素

  var rightFixedActiveElement = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-right-wrapper .vxe-table--body-wrapper .vxe-table--cell-active-area")//右侧固定列选中边框激活的元素(仅是边框)
  var rightFixedMainElement = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-right-wrapper .vxe-table--body-wrapper .vxe-table--cell-main-area")//右侧固定列选中边框内整个范围的元素


  var elements = [activeElement, mainElement, leftFixedActiveElement, leftFixedMainElement, rightFixedActiveElement, rightFixedMainElement]
  let area = getAreaBoxPosition()
  if (area) {
    var { width, height, left, top, right } = area
  } else {
    return
  }
  elements.forEach((element: any, index) => {
    if (element) {//设置显示范围框的内部元素的样式
      element.style.width = `${width}px`
      element.style.height = `${height}px`
      element.style.top = `${top}px`
      element.style.display = "block"
      if (index <= elements.length - 1 - 2) {//如果不是rightFixedActiveElement或rightFixedMainElement
        element.style.left = `${left}px`
      } else {
        element.style.right = `${right}px`
      }
    }
  })

  //显示范围框
  openAreaBox()
}
//根据开始位置和结束位置的索引计算框的width,height,left,top(左侧固定列和正常区域和右侧固定列使用)
const getAreaBoxPosition = () => {
  let startRowIndex = selectionStart.rowIndex//获取选中起始行索引
  let endRowIndex = selectionEnd.rowIndex//获取选中结束行索引
  let startColumnIndex = selectionStart.cellIndex//获取选中起始列索引
  let endColumnIndex = selectionEnd.cellIndex//获取选中结束列索引
  let visibleColumn = getTablexGrid().getTableColumn().visibleColumn//获取处理条件之后的全量表头列
  let visibleData = getTablexGrid().getTableData().visibleData//获取处理条件之后的全量表体数据
  if (startColumnIndex < 0 || endColumnIndex < 0 || startRowIndex < 0 || endRowIndex < 0) return
  var maxColumnIndex = visibleColumn.length - 1//最大列索引
  var maxRowIndex = visibleData.length - 1//最大行索引
  if (endColumnIndex > maxColumnIndex) {//到最后一列,指向最后一列
    endColumnIndex = maxColumnIndex
  }
  if (endRowIndex > maxRowIndex) {//到最后一行,指向最后一行
    endRowIndex = maxRowIndex
  }
  let width = 0, height = 0, left = 0, top = 0, right = 0

  visibleColumn.forEach((col: { renderWidth: number; }, index: number) => {
    if (startColumnIndex <= endColumnIndex) {//开始列索引小于结束列索引,即从左往右选择
      if (index < startColumnIndex) {
        left += col.renderWidth//距离表格整体左侧边框距离 
      }
      if (index > endColumnIndex) {//数据索引大于结束列,这里获取距离后面数据的宽度
        right += col.renderWidth//距离表格整体右侧边框距离,加上当前列
      }
      if (startColumnIndex <= index && index <= endColumnIndex) {//开始列索引大于数据索引 和 结束列索引小于数据索引,这里获取选中区域的宽度
        width += col.renderWidth//选中区域的宽度
      }
    } else {//从右往左选择
      if (index < endColumnIndex) {
        left += col.renderWidth//距离表格整体左侧边框距离 
      }
      if (index > startColumnIndex) {//数据索引大于开始列,这里获取距离后面数据的宽度
        right += col.renderWidth//距离表格整体右侧边框距离,加上当前列
      }
      if (startColumnIndex >= index && index >= endColumnIndex) {//开始列索引大于数据索引 和 结束列索引小于数据索引,这里获取选中区域的宽度
        width += col.renderWidth//选中区域的宽度
      }
    }

  })
  if (startRowIndex <= endRowIndex) {//开始行索引小于结束行索引,即从上往下选择
    height = (endRowIndex - startRowIndex + 1) * gridOptions.rowConfig!.height!//选中区域的高度
    top = startRowIndex * gridOptions.rowConfig!.height!//距离表格整体顶部边框距离
  } else {
    height = (startRowIndex - endRowIndex + 1) * gridOptions.rowConfig!.height!//选中区域的高度
    top = endRowIndex * gridOptions.rowConfig!.height!//距离表格整体顶部边框距离
  }



  return { width, height, left, top, right }

}

//显示范围框
const openAreaBox = () => {
  var element = xGrid.value.$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-area")
  const elementChildSpanOne = xGrid.value.$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-area .vxe-table--cell-main-area")
  const elementChildSpanTwo = xGrid.value.$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-area .vxe-table--cell-active-area")
  if (element) {
    element.style.display = "block"
    if (selectionStart.cellIndex === selectionEnd.cellIndex && selectionStart.rowIndex === selectionEnd.rowIndex) {
      elementChildSpanOne.style.background = 'rgba(255,255,255,0.1)'
      elementChildSpanTwo.style.border = '2px solid  #6782CD'
    } else {
      elementChildSpanOne.style.background = 'rgba(103, 130, 205, 0.1)'
      elementChildSpanTwo.style.border = '2px solid  #6782CD'
    }
  }
  element = xGrid.value.$el.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-left-wrapper .vxe-table--body-wrapper .vxe-table--cell-area")
  if (element) {
    element.style.display = "block"
  }
  element = xGrid.value.$el.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-right-wrapper .vxe-table--body-wrapper .vxe-table--cell-area")
  if (element) {
    element.style.display = "block"
  }
}

//表格外销毁范围框
const tableOutDestroyAreaBox = (event: MouseEvent) => {
  var element = document.querySelector(".vxe-table--render-wrapper")
  if (element) {
    if (event.clientX < element.getBoundingClientRect().left || event.clientX > element.getBoundingClientRect().right
      || event.clientY > element.getBoundingClientRect().top || event.clientY < element.getBoundingClientRect().bottom
    ) {
      destroyAreaBox()
    }
  }


}

//销毁范围框
const destroyAreaBox = () => {
  var element = document.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-area") as any
  if (element) {
    element.style.display = "none"
  }
  element = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-left-wrapper .vxe-table--body-wrapper .vxe-table--cell-area")
  if (element) {
    element.style.display = "none"
  }
  element = document.querySelector(".vxe-table--fixed-wrapper .vxe-table--fixed-right-wrapper .vxe-table--body-wrapper .vxe-table--cell-area")
  if (element) {
    element.style.display = "none"
  }
}

//表格单元格点击事件
const tableCellClick = (e: MouseEvent) => {

  if (!isSelecting.value) {//非选中状态
    try {
      selectionStart = getCellPosition(e.target)//获取单元格位置
      selectionEnd = selectionStart//结束位置也是自己
      //设置样式
      setselectedCellArea()
    } catch (error) {

    }

  }
}

//表格右键点击事件
const tableCellMenuClick = (e: MouseEvent) => {

  if (!isSelecting.value) {//非选中状态
    let currentCellPosition = getCellPosition(e.target)//获取单元格位置
    var horizontalFlag//是否在范围框的水平判断标记
    var verticalFlag//是否在范围框的垂直判断标记
    if (selectionStart.cellIndex <= selectionEnd.cellIndex) {//如果是从左往右选取
      horizontalFlag = selectionStart.cellIndex <= currentCellPosition.cellIndex && currentCellPosition.cellIndex <= selectionEnd.cellIndex
    } else {//从右往左选取
      horizontalFlag = selectionEnd.cellIndex <= currentCellPosition.cellIndex && currentCellPosition.cellIndex <= selectionStart.cellIndex
    }
    if (selectionStart.rowIndex <= selectionEnd.rowIndex) {//如果是从上往下选取
      verticalFlag = selectionStart.rowIndex <= currentCellPosition.rowIndex && currentCellPosition.rowIndex <= selectionEnd.rowIndex
    } else {//从下往上选取
      verticalFlag = selectionEnd.rowIndex <= currentCellPosition.rowIndex && currentCellPosition.rowIndex <= selectionStart.rowIndex
    }
    if (horizontalFlag && verticalFlag) { //判断如果不在选中区域内,触发表格左键单击事件,更新截取单元格,否则如果在正常触发右键菜单

    } else {
      selectionStart = getCellPosition(e.target)//获取单元格位置
      selectionEnd = selectionStart//结束位置也是自己
      //设置样式
      setselectedCellArea()
    }

  }

}

const toolbarButtonClickEvent = ({ code }: { code: any }) => {
  let selectRows, selectCols;
  switch (code) {
    case "getcellselctdata":
      //   console.log("是否正在进行滑动选中操作：", isSelecting.value)
      //   //左上角坐标
      //   console.log("单元格起始位置：索引:", selectionStart)
      //   //右下角坐标
      //   console.log("单元格结束位置：索引:", selectionEnd)

      //这里需要是visibleData
      let tableData = getTablexGrid().getTableData().visibleData//获取处理条件之后的全量表体数据
      let rowStart = selectionStart.rowIndex//获取选中起始行索引
      let rowEnd = selectionEnd.rowIndex//获取选中结束行索引
      selectRows = tableData.filter((col, index: number) => {//col参数不能改否则会获取不到数据
        //这里修改从右下往左上拖动的数据显示
        if (rowStart <= rowEnd) {
          return rowStart <= index && rowEnd >= index
        } else {
          return rowStart >= index && rowEnd <= index
        }
      })
      //   console.log("鼠标选中行:", JSON.stringify(selectRows))

      //这里需要是visibleColumn
      let colStart = selectionStart.cellIndex//获取选中起始列索引
      let colEnd = selectionEnd.cellIndex//获取选中结束列索引
      let tableColumn = getTablexGrid().getTableColumn().visibleColumn//获取处理条件之后的全量表头列
      selectCols = tableColumn.filter((col, index: number) => {//col参数不能改否则会获取不到数据
        //这里修改从右下往左上拖动的数据显示
        if (colStart <= colEnd) {
          return colStart <= index && colEnd >= index
        } else {
          return colStart >= index && colEnd <= index
        }

      })
      break
  }
  return [selectRows, selectCols]
}
//#endregion
</script>
 
<style lang="less" scoped>
.vxe-grid {
  //禁用浏览器默认选中
  -webkit-user-select: none;
  /* Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
}

:deep(.ant-select-selector) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}
</style>