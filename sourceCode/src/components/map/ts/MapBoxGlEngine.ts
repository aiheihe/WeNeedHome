import { Ref, unref } from 'vue'
import { houseData } from '../../data'

export default class MapBoxGlEngine {
  private dom: Ref<HTMLDivElement>;

  private markers: Array<Object>;

  private map: Object;

  constructor(dom: Ref<HTMLDivElement>) {
      this.map = {}
      this.markers = []
      this.dom = dom
      this.initMap()
  }

  initMap() {
      this.map = new window.mapboxgl.Map({
          container: unref(this.dom),
          style: {
              version: 8,
              sources: {
                  'gaode-shiliang': {
                      type: 'raster',
                      tiles: [
                          'https://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
                      ],
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
      this.map.on('load', () => {
          this.addHouseDataMarker()
          this.map.on('click', (e) => {
          })
      })
  }

  /**
   * 添加楼栋marker位置
   */
  addHouseDataMarker() {
      const features = []
      houseData.forEach((item) => {
          const el = document.createElement('div')
          el.id = 'marker'
          const popup = new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat([item.lng, item.lat])
          .setHTML(item.address)
          //   let marker = new window.mapboxgl.Marker(el)
          let marker = new window.mapboxgl.Marker()
          .setLngLat([item.lng, item.lat])
          .setPopup(popup)
          .addTo(this.map)
          this.markers.push(marker)
          features.push({
              type: 'feature',
              geometry: {
                  type: 'Point',
                  coordinates: [item.lng, item.lat],
              },
              properties: {
                  value: Math.random() * 9,
              },
          })
      })
      this.addHeatMap(features)
  }

  addHeatMap(features) {
      let heatPoints = {
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
}
