<template>
  <div ref="mapRef" class="map-container"></div>
</template>

<script lang="ts" setup>
import MapBoxGlEngine from './ts/MapBoxGlEngine'
import { ref, Ref, onMounted } from 'vue'

const mapRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  const MBgl: MapBoxGlEngine = new MapBoxGlEngine(mapRef as Ref<HTMLDivElement>)
  console.log(mapRef, MBgl)
})
</script>

<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
