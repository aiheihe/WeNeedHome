import { Ref, unref } from 'vue'
import { Map, MapboxOptions, Marker } from 'mapbox-gl'
import type { Feature, FeatureCollection } from 'geojson'
import { MapData, MapDataMarker } from '/#/index'

const houseData: Array<MapData> = window.mapDatas
const mapboxgl = window.mapboxgl
let lastMarker: Marker
const mapOptions = (dom): MapboxOptions => ({
    container: unref(dom),
    style: {
        version: 8,
        sources: {
            'gaode-shiliang': {
                type: 'raster',
                tiles: ['https://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'],
                tileSize: 256,
            },
        },
        layers: [
            {
                id: 'gaode-shiliang',
                type: 'raster',
                source: 'gaode-shiliang',
                layout: {
                    visibility: 'visible',
                },
            },
        ],
    },
    center: [113.62815535824052, 28.892015982028425],
    maxZoom: 18,
    pitch: 45,
    zoom: 5.2,
})
export default class MapBoxGlEngine {
  private markers: Array<MapDataMarker>

  private map: Map

  private updateData: Function

  constructor(dom: Ref<HTMLDivElement>, updateData) {
      this.map = new mapboxgl.Map(mapOptions(dom))
      this.markers = []
      this.updateData = updateData
      this.initMap()
  }

  initMap() {
      this.map.on('load', () => {
          this.addHouseDataMarker()
          this.updateData({
              markers: this.markers,
          })
      //   this.map.on('click', (e) => {})
      })
  }

  positioinMaker(row) {
      let marker = row.marker
      if (lastMarker && lastMarker.getPopup().isOpen()) {
          lastMarker.togglePopup()
      }
      marker.togglePopup()
      lastMarker = marker
      setTimeout(() => {
          this.map.flyTo({
              center: { lon: row.lng, lat: row.lat },
              zoom: 12,
              easing(t) {
                  return t
              },
          })
      }, 0)
  }

  /**
   * 添加楼栋marker位置
   */
  addHouseDataMarker() {
      const features: Array<Feature> = []
      houseData.forEach((item: MapData) => {
          const el = document.createElement('div')
          el.id = 'marker'
          // eslint-disable-next-line max-len
          const popup = new mapboxgl.Popup({ closeOnClick: true }).setLngLat([parseFloat(item.lng), parseFloat(item.lat)]).setHTML(item.name)
          //   let marker = new window.mapboxgl.Marker(el)
          let marker: Marker = new mapboxgl.Marker()
          .setLngLat([parseFloat(item.lng), parseFloat(item.lat)])
          .setPopup(popup)
          .addTo(this.map)
          this.markers.push({
              ...item,
              marker,
          })
          features.push({
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(item.lng), parseFloat(item.lat)],
              },
              properties: {
                  value: Math.random() * 9,
              },
          })
      })
      this.addHeatMap(features)
  }

  addHeatMap(features) {
      let heatPoints: FeatureCollection = {
          type: 'FeatureCollection',
          features,
      }

      this.map.addSource('heatmap', {
          type: 'geojson',
          data: heatPoints,
      })

      this.map.addLayer({
          id: 'heatmap',
          type: 'heatmap',
          source: 'heatmap',
          paint: {
              'heatmap-weight': 1,
              'heatmap-intensity': 2,
              'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(33,102,172,0)',
                  0.2,
                  'rgb(103,169,207)',
                  0.4,
                  'rgb(209,229,240)',
                  0.5,
                  'rgb(253,219,199)',
                  0.6,
                  'rgb(239,138,98)',
                  0.8,
                  'rgb(178,24,43)',
              ],
              'heatmap-radius': 50,
          },
      })
  }

  /**
   * 根据名称查询marker
   */
  searchMarker(value) {
      if (!value) {
          return this.markers
      }
      return this.markers.filter((item) => item.name.includes(value))
  }
}
