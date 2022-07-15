<template>
    <div id="chartRef" class="chart"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { Ref, ref, onMounted } from 'vue'
import HouseData from './countData'

let currentTitle = ''
let chart = null
let xAsixData = []
let valueData = []
HouseData.forEach((item) => {
    xAsixData.push(item.title)
    valueData.push({
        value: item.count,
        groupId: item.title,
    })
})
let options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
        formatter(params) {
            if (currentTitle) {
                let data = HouseData.find((item) => item.title === currentTitle)
                if (!data) return
                let data1 = data.children.find((item) => item.title === params[0].name)
                if (!data1) return

                let str = params[0].name + '：</br> '
                data1.children.forEach((item) => {
                    str += `${item}</br> `
                })
                return str
            }
            let data = HouseData.find((item) => item.title === params[0].name)
            if (!data) return
            let str = params[0].name + '：</br> '
            data.children.forEach((item) => {
                str += `${item.title}：${item.children.length} </br> `
            })
            return str
        },
    },
    xAxis: {
        data: [],
        axisLabel: { interval: 0, rotate: 30 },
    },
    toolbox: {
        show: true,
        feature: {
            restore: {},
        },
    },
    yAxis: {
        axisLabel: {
            formatter(value) {
                return '{' + value + '| }\n{value|' + value + '}'
            },
            margin: 20,
            rich: {
                value: {
                    lineHeight: 30,
                    align: 'center',
                },
            },
        },
    },
    dataGroupId: '',
    animationDurationUpdate: 500,
    series: {
        type: 'bar',
        id: 'sales',
        barMaxWidth: 50,
        label: {
            position: 'top',
            show: true,
        },
        data: [],
        universalTransition: {
            enabled: true,
            divideShape: 'clone',
        },
    },
}
onMounted(() => {
    chart = echarts.init(document.getElementById('chartRef'))
    options.xAxis.data = xAsixData
    options.series.data = valueData
    chart.setOption(options)
    chart.on('click', (event) => {
        let data = HouseData.find((item) => item.title === event.name)
        if (!data) return
        currentTitle = event.name
        xAsixData = []
        valueData = []
        data.children.forEach((item) => {
            xAsixData.push(item.title)
            valueData.push({
                value: item.children.length,
                groupId: item.title,
            })
        })
        options.xAxis.data = xAsixData
        options.series.data = valueData
        chart.setOption(options)
    })

    chart.on('restore', {}, (params) => {
        currentTitle = ''
    })
})
</script>

<style lang="less" scoped>
.chart {
  width: 600px;
  height: 300px;
  border: #85CEFF 1px solid;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  position: fixed !important;
  bottom: 10px;
  right: 10px;
}
</style>
