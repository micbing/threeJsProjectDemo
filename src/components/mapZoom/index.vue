<template>
    <div class="chart_wrap">
        <div><span>{{ currentInfo.nowCountryName }}</span><span>/{{ currentInfo.nowCityName }}</span></div>
        <div style="width: 800px;height:600px;" ref="canvasRef"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import sichuan from '../../lib/sichuan.json'
import * as echarts from 'echarts'
import { cityMap } from '../../lib/mapData'
import { colorSichuan } from '../../lib/mapData'
const canvasRef = ref()
const mapJosn = ref(sichuan)
const mapData = ref(colorSichuan)
const currentInfo = ref({
    nowCityName: '',
    nowCountryName: '四川'

})
const mapDeep = ref(0)
const registerType = ref('sc')
const mapInit = () => {
    let charts = echarts.init(canvasRef.value)
    echarts.registerMap(registerType.value, mapJosn.value)
    charts.setOption({
        tooltip: {
            trigger: "item",
            backgroundColor: '#fff',
            textStyle: {
                color: '#707780',
                fontSize: 12
            },
            padding: [8, 10],
        },
        geo: {
            show: true,
            map: 'sc',
            zoom: 1.2,
            itemStyle: {
                borderColor: '#000',
                borderWidth: 2,
            }
        },
        series: [
            {
                name: '地图',
                type: 'map',
                map: 'sc',
                data: mapData.value,
                zoom: 1.2,
                label: {
                    show: true,
                },
                emphasis: {
                    label: {
                        color: '#1677ffbf'
                    },
                    itemStyle: {
                        areaColor: '#b7eb8f',

                    }
                }
            }
        ]
    })
    charts.off('click')
    charts.on('click', function (params) {
        if (mapDeep.value === 0) {
            const [currentMapData, currentMapJson] = cityMap[params.name]
            mapData.value = currentMapData;
            mapJosn.value = currentMapJson
            currentInfo.value.nowCityName = params.name
            mapDeep.value = 1
        } else {
            mapData.value = colorSichuan;
            mapJosn.value = sichuan
            currentInfo.value.nowCityName = ''
            mapDeep.value = 0
        }
        mapInit()

    })
}
onMounted(() => {
    mapInit()
})
</script>

<style lang="less" scoped>
.chart_wrap {
    height: 100%;
    width: 100%;
    background: #e6f4ff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>