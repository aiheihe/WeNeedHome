import { Marker } from 'mapbox-gl'

export interface MapData {
  name: string
  month: string
  link: string
  lng: string
  lat: string
  geocode: string
}

export interface MapDataMarker extends MapData {
  name: string
  month: string
  link: string
  lng: string
  lat: string
  geocode: string
  marker: Marker
}

export interface EchartData {
  name: string
  children?: Array<EchartData>
  month?: string
  link?: string
}
