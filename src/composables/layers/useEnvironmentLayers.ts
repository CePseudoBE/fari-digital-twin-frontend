import * as Cesium from 'cesium';
import { useCesiumFeature } from '@/composables/useCesiumFeature';
import {
  fetchAirQualityStations,
  fetchCommunitySensors,
  parseAirQualityStations,
  parseCommunitySensors,
} from '@/services/environment';
import type { CesiumEntityConfig, CesiumPointFeature } from '@/types/cesium';

// ============= AIR QUALITY STATIONS =============

export function useAirQualityStations() {
  return useCesiumFeature({
    queryKey: ['environment', 'air-quality'],
    fetchFn: fetchAirQualityStations,
    parser: parseAirQualityStations,
    layerId: 'air-quality',
    entityConfigFn: (station: CesiumPointFeature): CesiumEntityConfig => ({
      id: station.id,
      position: Cesium.Cartesian3.fromDegrees(
        station.position.longitude,
        station.position.latitude,
        station.position.altitude || 0
      ),
      point: {
        pixelSize: station.style?.pixelSize || 8,
        color: Cesium.Color.fromCssColorString(
          station.style?.color || '#10B981'
        ),
        outlineColor: Cesium.Color.fromCssColorString(
          station.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: station.style?.outlineWidth || 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: station.properties?.airQualityIndex
          ? `AQI: ${station.properties.airQualityIndex}`
          : '',
        font: '10pt Arial',
        pixelOffset: new Cesium.Cartesian2(0, -25),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false, // Initially hidden
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>${station.name}</h3>
          <p><strong>Air Quality Index:</strong> ${station.properties?.airQualityIndex || 'N/A'}</p>
          <p><strong>PM2.5:</strong> ${station.properties?.pm25 || 'N/A'} μg/m³</p>
          <p><strong>PM10:</strong> ${station.properties?.pm10 || 'N/A'} μg/m³</p>
          <p><strong>NO2:</strong> ${station.properties?.no2 || 'N/A'} μg/m³</p>
          <p><strong>O3:</strong> ${station.properties?.o3 || 'N/A'} μg/m³</p>
          <p><strong>SO2:</strong> ${station.properties?.so2 || 'N/A'} μg/m³</p>
          <p><strong>Last Updated:</strong> ${station.properties?.lastUpdated || 'N/A'}</p>
          <p><strong>Source:</strong> Air Quality Network</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 30, // 30 minutes - air quality data updates regularly
    refetchInterval: 1000 * 60 * 60, // Refresh every hour
  });
}

// ============= COMMUNITY SENSORS =============

export function useCommunitySensors() {
  return useCesiumFeature({
    queryKey: ['environment', 'community-sensors'],
    fetchFn: fetchCommunitySensors,
    parser: parseCommunitySensors,
    layerId: 'community-sensors',
    entityConfigFn: (sensor: CesiumPointFeature): CesiumEntityConfig => ({
      id: sensor.id,
      position: Cesium.Cartesian3.fromDegrees(
        sensor.position.longitude,
        sensor.position.latitude,
        sensor.position.altitude || 0
      ),
      point: {
        pixelSize: sensor.style?.pixelSize || 6,
        color: Cesium.Color.fromCssColorString(
          sensor.style?.color || '#06B6D4'
        ),
        outlineColor: Cesium.Color.fromCssColorString(
          sensor.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: sensor.style?.outlineWidth || 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: sensor.properties?.temperature
          ? `${sensor.properties.temperature}°C`
          : '',
        font: '9pt Arial',
        pixelOffset: new Cesium.Cartesian2(0, -20),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false, // Initially hidden
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>${sensor.name}</h3>
          <p><strong>Sensor Type:</strong> ${sensor.properties?.sensorType || 'N/A'}</p>
          <p><strong>Temperature:</strong> ${sensor.properties?.temperature || 'N/A'}°C</p>
          <p><strong>Humidity:</strong> ${sensor.properties?.humidity || 'N/A'}%</p>
          <p><strong>Pressure:</strong> ${sensor.properties?.pressure || 'N/A'} Pa</p>
          <p><strong>Status:</strong> ${sensor.properties?.status || 'Unknown'}</p>
          <p><strong>Last Reading:</strong> ${sensor.properties?.lastReading || 'N/A'}</p>
          <p><strong>Source:</strong> Community Sensors</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 15, // 15 minutes - sensor data updates frequently
    refetchInterval: 1000 * 60 * 20, // Refresh every 20 minutes
  });
}
