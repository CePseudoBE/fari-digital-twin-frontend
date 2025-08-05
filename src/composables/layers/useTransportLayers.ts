import * as Cesium from 'cesium';
import { useCesiumFeature } from '@/composables/useCesiumFeature';
import {
  fetchDeLijnStops,
  fetchSncbStations,
  fetchStibStops,
  parseDeLijnStops,
  parseSncbStations,
  parseStibStops,
} from '@/services/transport';
import type { CesiumEntityConfig, CesiumPointFeature } from '@/types/cesium';

// ============= STIB STOPS =============

export function useStibStops() {
  return useCesiumFeature({
    queryKey: ['transport', 'stib-stops'],
    fetchFn: fetchStibStops,
    parser: parseStibStops,
    layerId: 'stib-stops',
    entityConfigFn: (stop: CesiumPointFeature): CesiumEntityConfig => ({
      id: stop.id,
      position: Cesium.Cartesian3.fromDegrees(
        stop.position.longitude,
        stop.position.latitude,
        stop.position.altitude || 0
      ),
      point: {
        pixelSize: stop.style?.pixelSize || 8,
        color: Cesium.Color.fromCssColorString(stop.style?.color || '#1E40AF'),
        outlineColor: Cesium.Color.fromCssColorString(
          stop.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: stop.style?.outlineWidth || 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: stop.name || '',
        font: '12pt Arial',
        pixelOffset: new Cesium.Cartesian2(0, -30),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false, // Initially hidden, can be toggled
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>${stop.name}</h3>
          <p><strong>Stop ID:</strong> ${stop.properties?.stopId}</p>
          <p><strong>Routes:</strong> ${stop.properties?.routes?.join(', ') || 'N/A'}</p>
          <p><strong>Accessible:</strong> ${stop.properties?.accessibility ? 'Yes' : 'No'}</p>
          <p><strong>Source:</strong> STIB</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 30, // 30 minutes - transport stops don't change often
    refetchInterval: 1000 * 60 * 60, // Refresh every hour
  });
}

// ============= SNCB STATIONS =============

export function useSncbStations() {
  return useCesiumFeature({
    queryKey: ['transport', 'sncb-stations'],
    fetchFn: fetchSncbStations,
    parser: parseSncbStations,
    layerId: 'sncb-stations',
    entityConfigFn: (station: CesiumPointFeature): CesiumEntityConfig => ({
      id: station.id,
      position: Cesium.Cartesian3.fromDegrees(
        station.position.longitude,
        station.position.latitude,
        station.position.altitude || 0
      ),
      point: {
        pixelSize: station.style?.pixelSize || 10,
        color: Cesium.Color.fromCssColorString(
          station.style?.color || '#DC2626'
        ),
        outlineColor: Cesium.Color.fromCssColorString(
          station.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: station.style?.outlineWidth || 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: station.name || '',
        font: '14pt Arial',
        pixelOffset: new Cesium.Cartesian2(0, -35),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>${station.name}</h3>
          <p><strong>Station ID:</strong> ${station.properties?.stationId}</p>
          <p><strong>Type:</strong> ${station.properties?.stationType || 'N/A'}</p>
          <p><strong>Source:</strong> SNCB</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 60, // 1 hour - stations rarely change
    refetchInterval: 1000 * 60 * 60 * 6, // Refresh every 6 hours
  });
}

// ============= DE LIJN STOPS =============

export function useDeLijnStops() {
  return useCesiumFeature({
    queryKey: ['transport', 'delijn-stops'],
    fetchFn: fetchDeLijnStops,
    parser: parseDeLijnStops,
    layerId: 'delijn-stops',
    entityConfigFn: (stop: CesiumPointFeature): CesiumEntityConfig => ({
      id: stop.id,
      position: Cesium.Cartesian3.fromDegrees(
        stop.position.longitude,
        stop.position.latitude,
        stop.position.altitude || 0
      ),
      point: {
        pixelSize: stop.style?.pixelSize || 8,
        color: Cesium.Color.fromCssColorString(stop.style?.color || '#059669'),
        outlineColor: Cesium.Color.fromCssColorString(
          stop.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: stop.style?.outlineWidth || 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: stop.name || '',
        font: '12pt Arial',
        pixelOffset: new Cesium.Cartesian2(0, -30),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>${stop.name}</h3>
          <p><strong>Stop ID:</strong> ${stop.properties?.stopId}</p>
          <p><strong>Lines:</strong> ${stop.properties?.lines?.join(', ') || 'N/A'}</p>
          <p><strong>Source:</strong> De Lijn</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchInterval: 1000 * 60 * 60, // Refresh every hour
  });
}
