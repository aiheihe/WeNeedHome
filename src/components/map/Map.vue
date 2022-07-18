/* eslint-disable max-len */
<template>
    <div ref="mapRef" class="map-container"></div>

    <div class="table">
        <el-input
            v-model="inputName"
            class="input"
            :prefix-icon="Search"
            placeholder="输入省份/市名/小区名称查询"
            @input="inputChange"
        />
        <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            height="400"
            :row-class-name="tableRowClassName"
            highlight-current-row
            border
            @row-click="tableRowClick"
        >
            <el-table-column prop="name" label="小区名称" width="180" />
            <el-table-column prop="month" label="停贷月份" width="180">
                <template #default="scope">
                    <span v-if="scope.row.month">
                        {{ scope.row.month }}
                    </span>
                    <span v-else>暂无</span>
                    <!-- <img :src="scope.row.link" alt=""> -->
                </template>
            </el-table-column>
            <el-table-column prop="name" label="停贷通知书" width="180">
                <template #default="scope">
                    <a
                        v-if="scope.row.link"
                        :href="scope.row.link"
                        target="_blank"
                        style="color: #b2182b"
                    >点击查看</a>
                    <a v-else :href="scope.row.link">暂无</a>
                    <!-- <img :src="scope.row.link" alt=""> -->
                </template>
            </el-table-column>
        </el-table>

        <div v-if="showPhotos && poiInfo.photos" class="poi-infos">
            <div class="header">
                <span>{{ drawerTitle }}</span>
                <el-icon
                    color="#666666"
                    :size="24"
                    class="icon"
                    @click="showPhotos = false"
                >
                    <CircleClose />
                </el-icon>
            </div>
            <div class="poi-images">
                <img
                    v-for="item in poiInfo.photos"
                    :key="item.url"
                    :src="item.url"
                    :alt="item.title"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import MapBoxGlEngine from './ts/MapBoxGlEngine'
import { ref, Ref, onMounted } from 'vue'
import { Search, CircleClose } from '@element-plus/icons-vue'

import axios from 'axios'

// eslint-disable-next-line max-len
const poisApi = 'https://restapi.amap.com/v5/place/text?key=3516167bec22477cab50d7b15fc4df89&show_fields=photos&keywords='

let MBgl: MapBoxGlEngine
let inputName = ref('')
let tableData = ref([])
let currentName = ref('')
let showPhotos = ref(false)
let drawerTitle = ref('')
let poiInfo = ref({})
const mapRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
    MBgl = new MapBoxGlEngine(mapRef as Ref<HTMLDivElement>, (data) => {
        setTimeout(() => {
            tableData.value = data.markers
        }, 300)
    })
})
const inputChange = (value) => {
    let searchResult = MBgl.searchMarker(value)
    tableData.value = searchResult
}
const tableRowClassName = ({ row, rowIndex }) => {
    if (row.name === currentName.value) {
        return 'table-c-select-class-name'
    }
    return ''
}
const tableRowClick = (row) => {
    MBgl.positioinMaker(row)
    queryPois(row)
}
const queryPois = (row) => {
    axios.get(`${poisApi}${encodeURI(row.name)}`).then((res) => {
        let pois = res.data.pois
        if (!pois.length) return
        poiInfo.value = pois[0]
        showPhotos.value = true
        drawerTitle.value = row.name
    })
}
</script>

<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
.table {
  position: fixed;
  z-index: 999;
  bottom: 10px;
  left: 20px;
  width: 300px;
}
.input {
  width: 300px;
  margin-bottom: 10px;
}
.table-c-select-class-name {
  --el-table-tr-bg-color: #f0f9eb;
}
.poi-infos {
  border-radius: 10px;
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border: #85ceff 1px solid;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      cursor: pointer;
      &:hover {
        color: #85ceff;
      }
    }
  }
}
.poi-images {
  display: flex;
  img {
    margin: 5px;
    height: 230px;
  }
}
</style>
